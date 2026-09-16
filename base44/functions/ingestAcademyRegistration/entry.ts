import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const serviceUrl = secrets.get("SERVICE_APP_URL");
    const apiKey = secrets.get("SERVICE_API_KEY");

    if (!serviceUrl || !apiKey) {
      return Response.json({ error: "SERVICE_APP_URL eller SERVICE_API_KEY saknas" }, { status: 500 });
    }

    const payload = {
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      clinic: body.clinic,
      address: body.address,
      city: body.city,
      equipment_type: body.equipment_type,
      message: body.message,
    };

    const response = await fetch(`${serviceUrl}/functions/createProspect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (body.registration_id) {
        await base44.asServiceRole.entities.AcademyRegistration.update(body.registration_id, {
          forwarded: false,
          forward_error: `HTTP ${response.status}: ${errorText}`,
        });
      }
      return Response.json({ error: errorText }, { status: 502 });
    }

    if (body.registration_id) {
      await base44.asServiceRole.entities.AcademyRegistration.update(body.registration_id, {
        forwarded: true,
        forwarded_at: new Date().toISOString(),
        forward_error: null,
      });
    }

    return Response.json({ ok: true, forwarded: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}