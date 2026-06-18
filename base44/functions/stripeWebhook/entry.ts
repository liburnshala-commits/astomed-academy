import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { module_id, user_id, buyer_name, buyer_email, bundle } = session.metadata || {};
      const base44 = createClientFromRequest(req);

      if (bundle === "true") {
        // Bundle purchase: create a Purchase record for every published module
        const allModules = await base44.asServiceRole.entities.Module.filter({ status: "published" });
        const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
        const perModuleAmount = allModules.length > 0 ? Math.round(totalAmount / allModules.length) : totalAmount;

        for (const mod of allModules) {
          await base44.asServiceRole.entities.Purchase.create({
            module_id: mod.id,
            user_id: user_id || "",
            buyer_email: buyer_email || session.customer_email || "",
            buyer_name: buyer_name || "",
            amount: perModuleAmount,
            status: "completed",
            stripe_session_id: session.id,
          });
        }
        console.log(`Bundle purchase: created ${allModules.length} purchases, session=${session.id}`);

        // Send notification email to Astomed
        const buyerEmail = buyer_email || session.customer_email || "okänd";
        const buyerName = buyer_name || "okänt namn";
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: "liburn@astomed.se",
          subject: `Nytt köp – Grundkursen: ${buyerName}`,
          body: `En ny kund har köpt Grundkursen.\n\nNamn: ${buyerName}\nE-post: ${buyerEmail}\nBelopp: ${session.amount_total ? session.amount_total / 100 : 0} kr\nStripe session: ${session.id}\n\nKomma ihåg att bjuda in kunden via admin-panelen om de inte redan har ett konto.`,
        });
      } else if (module_id) {
        // Single module purchase
        await base44.asServiceRole.entities.Purchase.create({
          module_id,
          user_id: user_id || "",
          buyer_email: buyer_email || session.customer_email || "",
          buyer_name: buyer_name || "",
          amount: session.amount_total ? session.amount_total / 100 : 0,
          status: "completed",
          stripe_session_id: session.id,
        });
        console.log(`Purchase created: module=${module_id}, user=${user_id}, email=${buyer_email}`);

        // Send notification email to Astomed
        const buyerEmailSingle = buyer_email || session.customer_email || "okänd";
        const buyerNameSingle = buyer_name || "okänt namn";
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: "liburn@astomed.se",
          subject: `Nytt köp – Modul: ${buyerNameSingle}`,
          body: `En ny kund har köpt en modul.\n\nNamn: ${buyerNameSingle}\nE-post: ${buyerEmailSingle}\nModul ID: ${module_id}\nBelopp: ${session.amount_total ? session.amount_total / 100 : 0} kr\nStripe session: ${session.id}`,
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});