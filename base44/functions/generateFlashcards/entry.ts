import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const moduleId = body.module_id;
    if (!moduleId) return Response.json({ error: 'module_id saknas' }, { status: 400 });

    const modules = await base44.asServiceRole.entities.Module.filter({ id: moduleId });
    const module = modules[0];
    if (!module) return Response.json({ error: 'Modulen hittades inte' }, { status: 404 });

    const content = [module.content_summary, module.description].filter(Boolean).join('\n\n');
    if (!content) return Response.json({ error: 'Inget innehåll att generera ifrån' }, { status: 400 });

    const prompt = `Du är en pedagogisk expert som skapar studiekort (flashcards) för juridisk e-learning för kliniker.
Baserat på följande kursinnehåll, skapa 10 pedagogiska flashcards med en fråga och ett svar.

Regler:
- Fokusera på de viktigaste juridiska punkterna: lagar, föreskrifter, skyldigheter och praktiska regler.
- Frågan ska vara kort och tydlig (t.ex. "I vilken lag regleras journalföring?").
- Svaret ska vara koncist och korrekt (t.ex. "Patientdatalagen").
- Skriv på svenska.

Kursinnehåll:
${content}`;

    const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          flashcards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                answer: { type: "string" }
              },
              required: ["question", "answer"]
            }
          }
        },
        required: ["flashcards"]
      }
    });

    const flashcards = (llmResponse as any).flashcards || [];
    if (flashcards.length === 0) {
      return Response.json({ error: 'Kunde inte generera flashcards' }, { status: 500 });
    }

    // Replace existing flashcards for this module
    const existing = await base44.asServiceRole.entities.Flashcard.filter({ module_id: moduleId });
    if (existing.length > 0) {
      await base44.asServiceRole.entities.Flashcard.deleteMany({ module_id: moduleId });
    }

    const created = await base44.asServiceRole.entities.Flashcard.bulkCreate(
      flashcards.map((fc: any, i: number) => ({
        module_id: moduleId,
        question: fc.question,
        answer: fc.answer,
        order: i + 1
      }))
    );

    return Response.json({ created: created.length, flashcards: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}