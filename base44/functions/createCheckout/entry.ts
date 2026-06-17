import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const { module_id, success_url, cancel_url, bundle, bundle_price } = await req.json();

    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

    const origin = req.headers.get("origin") || "https://app.base44.com";

    // --- Bundle checkout ---
    if (bundle) {
      const price = bundle_price || 1995;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "sek",
              unit_amount: Math.round(price * 100),
              product_data: {
                name: "Grundkursen – Legitimation och yrkesansvar (alla moduler)",
                description: "Tillgång till samtliga moduler, PDF-resurser och certifikat",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          base44_app_id: Deno.env.get("BASE44_APP_ID"),
          bundle: "true",
        },
        success_url: success_url || `${origin}/?payment=bundle_success`,
        cancel_url: cancel_url || `${origin}/`,
      });
      return Response.json({ checkout_url: session.url, session_id: session.id });
    }

    // --- Single module checkout ---
    // Require authenticated user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Du måste vara inloggad för att köpa en modul." }, { status: 401 });
    }

    const modules = await base44.asServiceRole.entities.Module.filter({ id: module_id });
    const module = modules[0];

    if (!module) {
      return Response.json({ error: "Modulen hittades inte" }, { status: 404 });
    }

    if (module.status !== "published") {
      return Response.json({ error: "Modulen är inte tillgänglig för köp" }, { status: 400 });
    }

    if (!module.price) {
      return Response.json({ error: "Inget pris satt för denna modul" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: "sek",
            unit_amount: Math.round(module.price * 100),
            product_data: {
              name: `Modul ${module.module_number}: ${module.title}`,
              description: module.description || undefined,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        module_id: module_id,
        user_id: user.id,
        buyer_email: user.email || "",
        buyer_name: user.full_name || "",
      },
      success_url: success_url || `${origin}/modul/${module_id}?payment=success`,
      cancel_url: cancel_url || `${origin}/modul/${module_id}`,
    });

    return Response.json({ checkout_url: session.url, session_id: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});