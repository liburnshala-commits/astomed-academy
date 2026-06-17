import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const today = new Date();
    const in30 = new Date(today); in30.setDate(today.getDate() + 30);
    const in60 = new Date(today); in60.setDate(today.getDate() + 60);

    const fmt = (d) => d.toISOString().split('T')[0];
    const toDate = (s) => s ? new Date(s) : null;

    const [equipment, certifications, documents, audits] = await Promise.all([
      base44.asServiceRole.entities.Equipment.list(),
      base44.asServiceRole.entities.StaffCertification.list(),
      base44.asServiceRole.entities.ComplianceDocument.list(),
      base44.asServiceRole.entities.AuditLog.list(),
    ]);

    const warnings = [];

    // Equipment service overdue or within 30 days
    for (const eq of equipment) {
      if (!eq.next_service_date) continue;
      const d = toDate(eq.next_service_date);
      if (d <= in30) {
        const overdue = d < today;
        warnings.push(`🔧 Utrustning: "${eq.name}" — service ${overdue ? 'FÖRFALLEN' : `om ${Math.ceil((d - today) / 86400000)} dagar`} (${eq.next_service_date})`);
      }
    }

    // Certifications expiring within 60 days
    for (const cert of certifications) {
      if (!cert.expiry_date) continue;
      const d = toDate(cert.expiry_date);
      if (d <= in60) {
        const overdue = d < today;
        warnings.push(`🎓 Certifikat: "${cert.staff_name} – ${cert.certification_name}" — ${overdue ? 'UTGÅNGET' : `löper ut om ${Math.ceil((d - today) / 86400000)} dagar`} (${cert.expiry_date})`);
      }
    }

    // Documents expiring within 30 days
    for (const doc of documents) {
      if (!doc.valid_until) continue;
      const d = toDate(doc.valid_until);
      if (d <= in30) {
        const overdue = d < today;
        warnings.push(`📄 Dokument: "${doc.title}" — ${overdue ? 'UTGÅNGET' : `giltigt till ${doc.valid_until}`}`);
      }
    }

    // Audit actions overdue
    for (const audit of audits) {
      if (!audit.action_required || audit.status === 'completed' || !audit.action_deadline) continue;
      const d = toDate(audit.action_deadline);
      if (d < today) {
        warnings.push(`⚠️ Revision: "${audit.scope}" — åtgärdsdeadline FÖRFALLEN (${audit.action_deadline})`);
      }
    }

    if (warnings.length === 0) {
      console.log('No compliance warnings today.');
      return Response.json({ sent: false, message: 'Inga varningar att skicka' });
    }

    const users = await base44.asServiceRole.entities.User.list();
    const admins = users.filter((u) => u.role === 'admin' && u.email);

    const subject = `⚠️ Compliance-påminnelse – ${warnings.length} punkt${warnings.length > 1 ? 'er' : ''} kräver uppmärksamhet`;
    const body = `Hej,\n\nFöljande compliance-punkter kräver din uppmärksamhet:\n\n${warnings.map((w) => `• ${w}`).join('\n')}\n\nLogga in på din Compliance-dashboard för att åtgärda dessa.\n\n// Astomed Academy`;

    for (const admin of admins) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: admin.email,
        subject,
        body,
        from_name: 'Astomed Compliance',
      });
      console.log(`Sent reminder to ${admin.email}`);
    }

    return Response.json({ sent: true, warnings_count: warnings.length, recipients: admins.length });
  } catch (error) {
    console.error('complianceReminders error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});