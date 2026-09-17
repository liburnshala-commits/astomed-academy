import React from "react";
import { X } from "lucide-react";

export default function PrivacyPolicyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-heading text-lg font-semibold text-foreground">Integritetspolicy</h2>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 text-sm font-body text-foreground/80 leading-relaxed space-y-4">
          <p className="text-xs text-muted-foreground">Senast uppdaterad: 17 mars 2026</p>

          <p>
            Astomed AB driver denna webbplats, inklusive all relaterad information, allt innehåll, alla funktioner, verktyg, produkter och tjänster för att ge dig som kund en anpassad shoppingupplevelse ("Tjänsterna"). Serviceastomed.se drivs av Base44.com och Loopia.se, vilket gör det möjligt för oss att tillhandahålla tjänsterna till dig. Denna integritetspolicy beskriver hur vi samlar in, använder och avslöjar dina personuppgifter när du besöker, använder eller gör ett köp eller annan transaktion med hjälp av tjänsterna eller på annat sätt kommunicerar med oss.
          </p>
          <p>
            Läs denna integritetspolicy noggrant. Genom att använda och få tillgång till någon av tjänsterna bekräftar du att du har läst denna integritetspolicy och förstår hur dina uppgifter samlas in, används och lämnas ut enligt beskrivningen i denna integritetspolicy.
          </p>

          <h3 className="font-heading font-semibold text-foreground mt-2">Personuppgifter som vi samlar in eller behandlar</h3>
          <p>
            När vi använder termen "personuppgifter" avser vi information som identifierar eller rimligen kan kopplas till dig eller någon annan person. Vi kan samla in eller behandla följande kategorier av personuppgifter:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kontaktuppgifter inklusive namn, adress, faktureringsadress, leveransadress, telefonnummer och e-postadress.</li>
            <li>Finansiell information inklusive kreditkortsnummer, betalkortsnummer och finansiella kontonummer.</li>
            <li>Kontoinformation inklusive användarnamn, lösenord, säkerhetsfrågor, preferenser och inställningar.</li>
            <li>Transaktionsinformation inklusive de artiklar du tittar på, lägger i varukorgen eller köper.</li>
            <li>Kommunikation med oss inklusive den information du lämnar i din kommunikation med oss.</li>
            <li>Enhetsinformation inklusive information om din enhet, webbläsare eller nätverksanslutning och din IP-adress.</li>
            <li>Användningsinformation inklusive information om din interaktion med tjänsterna.</li>
          </ul>

          <h3 className="font-heading font-semibold text-foreground mt-2">Hur vi använder dina personuppgifter</h3>
          <p>
            Vi kan använda personuppgifter för följande ändamål: tillhandahålla, anpassa och förbättra tjänsterna; marknadsföring och annonsering; säkerhet och förebyggande av bedrägerier; kommunikation med dig; samt juridiska orsaker.
          </p>

          <h3 className="font-heading font-semibold text-foreground mt-2">Hur vi lämnar ut personuppgifter</h3>
          <p>
            Vi kan lämna ut dina personuppgifter till Shopify, tjänsteleverantörer, affärs- och marknadsföringspartner, dotterbolag, samt i samband med affärstransaktioner eller för att uppfylla lagliga skyldigheter.
          </p>

          <h3 className="font-heading font-semibold text-foreground mt-2">Säkerhet och lagring av dina uppgifter</h3>
          <p>
            Vi kan inte garantera "perfekt säkerhet". Hur länge vi lagrar dina personuppgifter beror på olika faktorer, till exempel om vi behöver uppgifterna för att upprätthålla ditt konto, tillhandahålla tjänster eller uppfylla lagliga skyldigheter.
          </p>

          <h3 className="font-heading font-semibold text-foreground mt-2">Dina rättigheter och valmöjligheter</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Rätt till åtkomst/information</li>
            <li>Rätt att radera</li>
            <li>Rätt till rättelse</li>
            <li>Rätt till överförbarhet</li>
            <li>Rätt att välja bort försäljning eller delning för riktad reklam</li>
          </ul>

          <h3 className="font-heading font-semibold text-foreground mt-2">Kontakt</h3>
          <p>
            Om du har några frågor om våra sekretessrutiner eller denna integritetspolicy, vänligen kontakta oss:
          </p>
          <p>
            Astomed Service<br />
            kontakt@astomed.se<br />
            (+46) 08-410 77 900<br />
            Jägerhorns väg 5, 141 75 Kungens kurva, Sverige
          </p>
        </div>
        <div className="px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="w-full h-10 bg-primary text-primary-foreground font-body font-medium text-sm rounded-md hover:bg-primary/90 transition-colors"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}