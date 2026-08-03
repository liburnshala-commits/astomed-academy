import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { generateAndSendCertificate } from '../../shared/certificate.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Triggered by the QuizResult entity automation: { event, data }
    const body = await req.json();
    const quiz_result_id = body?.event?.entity_id || body?.data?.id || body?.quiz_result_id;
    if (!quiz_result_id) {
      return Response.json({ error: 'Missing quiz_result_id' }, { status: 400 });
    }

    const result = await generateAndSendCertificate(base44.asServiceRole, quiz_result_id, null);
    return Response.json(result);
  } catch (error) {
    console.error('issueCertificate error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});