import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const academyUrl = secrets.get("ACADEMY_APP_URL");
    const apiKey = secrets.get("ACADEMY_API_KEY");

    if (!academyUrl || !apiKey) {
      return Response.json({ error: "ACADEMY_APP_URL eller ACADEMY_API_KEY saknas" }, { status: 500 });
    }

    const payload = {
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      clinic: body.clinic,
      course_interest: body.course_interest,
      message: body.message,
    };

    const response = await fetch(`${academyUrl}/functions/ingestAcademyRegistration`, {
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