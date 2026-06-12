import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quiz_result_id } = await req.json();

    // Fetch the quiz result
    const results = await base44.entities.QuizResult.filter({ id: quiz_result_id });
    const result = results[0];
    if (!result) {
      return Response.json({ error: 'Quiz result not found' }, { status: 404 });
    }
    if (!result.passed) {
      return Response.json({ error: 'Quiz not passed' }, { status: 400 });
    }

    // Fetch module info
    const modules = await base44.entities.Module.filter({ id: result.module_id });
    const module = modules[0];
    if (!module) {
      return Response.json({ error: 'Module not found' }, { status: 404 });
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const W = 297;
    const H = 210;

    // ── Background ──────────────────────────────────────────
    // Deep navy background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, W, H, 'F');

    // Subtle inner border frame
    doc.setDrawColor(100, 170, 200);
    doc.setLineWidth(0.4);
    doc.roundedRect(8, 8, W - 16, H - 16, 3, 3, 'S');

    doc.setDrawColor(60, 120, 160);
    doc.setLineWidth(0.2);
    doc.roundedRect(11, 11, W - 22, H - 22, 2, 2, 'S');

    // Top decorative bar
    doc.setFillColor(30, 144, 180);
    doc.rect(0, 0, W, 4, 'F');
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 3, W, 1, 'F');

    // Bottom decorative bar
    doc.setFillColor(30, 144, 180);
    doc.rect(0, H - 4, W, 4, 'F');

    // ── Header logo area ─────────────────────────────────────
    // Left: ASTOMED wordmark
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 144, 180);
    doc.text('ASTOMED', 20, 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(120, 160, 190);
    doc.text('ACADEMY', 20, 27);

    // Right: MEDLAW wordmark
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 144, 180);
    doc.text('MEDLAW', W - 20, 22, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(120, 160, 190);
    doc.text('SWEDEN', W - 20, 27, { align: 'right' });

    // Center thin divider line under header
    doc.setDrawColor(30, 144, 180);
    doc.setLineWidth(0.3);
    doc.line(20, 31, W - 20, 31);

    // ── Certificate title ────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 144, 180);
    const titleText = 'UTBILDNINGSINTYG';
    doc.text(titleText, W / 2, 44, { align: 'center' });

    // Small decorative dots beside title
    const titleW = doc.getTextWidth(titleText);
    doc.setFillColor(30, 144, 180);
    doc.circle(W / 2 - titleW / 2 - 5, 43.5, 0.8, 'F');
    doc.circle(W / 2 + titleW / 2 + 5, 43.5, 0.8, 'F');

    // ── Body text ────────────────────────────────────────────
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 210, 230);
    doc.text('Detta intygar att', W / 2, 56, { align: 'center' });

    // Recipient name
    const recipientName = result.user_name || user.full_name || 'Deltagare';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(recipientName, W / 2, 70, { align: 'center' });

    // Underline under name
    const nameW = doc.getTextWidth(recipientName);
    doc.setDrawColor(30, 144, 180);
    doc.setLineWidth(0.4);
    doc.line(W / 2 - nameW / 2, 73, W / 2 + nameW / 2, 73);

    // Completion text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 210, 230);
    doc.text('har genomfört och godkänts i kursen', W / 2, 83, { align: 'center' });

    // Module title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    const moduleTitle = `Modul ${module.module_number}: ${module.title}`;
    doc.text(moduleTitle, W / 2, 95, { align: 'center' });

    // Score badge
    const score = Math.round(result.score);
    doc.setFillColor(30, 144, 180);
    doc.roundedRect(W / 2 - 22, 100, 44, 12, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`Resultat: ${score}%`, W / 2, 108, { align: 'center' });

    // ── Date & ID ─────────────────────────────────────────────
    const completedDate = result.completed_at
      ? new Date(result.completed_at).toLocaleDateString('sv-SE')
      : new Date().toLocaleDateString('sv-SE');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 160, 190);
    doc.text(`Intyg utfärdat: ${completedDate}`, W / 2, 120, { align: 'center' });
    doc.text(`Intygs-ID: ${quiz_result_id.slice(0, 16).toUpperCase()}`, W / 2, 125, { align: 'center' });

    // ── Divider ───────────────────────────────────────────────
    doc.setDrawColor(40, 80, 110);
    doc.setLineWidth(0.2);
    doc.line(20, 132, W - 20, 132);

    // ── Signature blocks ──────────────────────────────────────
    // Left: Astomed
    doc.setFillColor(20, 35, 55);
    doc.roundedRect(28, 138, 72, 40, 2, 2, 'F');
    doc.setDrawColor(30, 100, 140);
    doc.setLineWidth(0.2);
    doc.roundedRect(28, 138, 72, 40, 2, 2, 'S');

    // Astomed "stamp" circle
    doc.setDrawColor(30, 144, 180);
    doc.setLineWidth(0.5);
    doc.circle(64, 153, 8, 'S');
    doc.setDrawColor(30, 144, 180);
    doc.setLineWidth(0.2);
    doc.circle(64, 153, 6.5, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.setTextColor(30, 144, 180);
    doc.text('ASTOMED', 64, 151.5, { align: 'center' });
    doc.text('ACADEMY', 64, 155.5, { align: 'center' });

    doc.setDrawColor(30, 100, 140);
    doc.setLineWidth(0.3);
    doc.line(36, 169, 92, 169);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(200, 220, 235);
    doc.text('Astomed Academy', 64, 174, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(100, 140, 170);
    doc.text('Nordens ledande klinikpartner', 64, 178, { align: 'center' });

    // Right: Medlaw
    doc.setFillColor(20, 35, 55);
    doc.roundedRect(W - 100, 138, 72, 40, 2, 2, 'F');
    doc.setDrawColor(30, 100, 140);
    doc.setLineWidth(0.2);
    doc.roundedRect(W - 100, 138, 72, 40, 2, 2, 'S');

    // Medlaw "stamp" circle
    doc.setDrawColor(30, 144, 180);
    doc.setLineWidth(0.5);
    doc.circle(W - 64, 153, 8, 'S');
    doc.setLineWidth(0.2);
    doc.circle(W - 64, 153, 6.5, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.setTextColor(30, 144, 180);
    doc.text('MEDLAW', W - 64, 151.5, { align: 'center' });
    doc.text('SWEDEN', W - 64, 155.5, { align: 'center' });

    doc.setDrawColor(30, 100, 140);
    doc.setLineWidth(0.3);
    doc.line(W - 92, 169, W - 36, 169);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(200, 220, 235);
    doc.text('Medlaw Sweden', W - 64, 174, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(100, 140, 170);
    doc.text('Expertis inom medicinsk rätt', W - 64, 178, { align: 'center' });

    // Center seal
    doc.setFillColor(20, 35, 55);
    doc.circle(W / 2, 158, 14, 'F');
    doc.setDrawColor(30, 144, 180);
    doc.setLineWidth(0.6);
    doc.circle(W / 2, 158, 14, 'S');
    doc.setLineWidth(0.2);
    doc.circle(W / 2, 158, 11.5, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(30, 144, 180);
    doc.text('GODKÄND', W / 2, 156, { align: 'center' });
    doc.setFontSize(5);
    doc.setTextColor(120, 160, 190);
    doc.text('MEDICINSK RÄTT', W / 2, 161, { align: 'center' });
    doc.text(completedDate, W / 2, 165, { align: 'center' });

    // ── Footer ────────────────────────────────────────────────
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(60, 100, 130);
    doc.text('Astomed Academy · astomed.se · Samarbete med Medlaw Sweden', W / 2, H - 10, { align: 'center' });

    // ── Generate PDF bytes ────────────────────────────────────
    const pdfBytes = doc.output('arraybuffer');
    const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));

    // Convert base64 to Blob-compatible for upload
    const uploadResp = await base44.asServiceRole.integrations.Core.UploadFile({
      file: base64,
    });

    const certificate_url = uploadResp.file_url;

    // Save certificate_url on the quiz result
    await base44.asServiceRole.entities.QuizResult.update(quiz_result_id, { certificate_url });

    return Response.json({ certificate_url });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});