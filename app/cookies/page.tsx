import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Cookiepolicy</h1>
          <p className="text-muted-foreground">Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 prose prose-sm max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. Vad är cookies?</h2>
            <p>
              Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De hjälper webbplatsen att komma ihåg dina
              preferenser och förbättra din användarupplevelse. Cookies innehåller inte personligt identifierbar information om du inte
              medvetet lämnar sådan.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Hur använder vi cookies?</h2>
            <p>Marknadsplatsen använder cookies för att förbättra din upplevelse av vår webbplats och våra tjänster.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Typer av cookies vi använder</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Nödvändiga cookies</h3>
            <p>Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. Utan dem kan vissa funktioner inte tillhandahållas.</p>
            <ul>
              <li>
                <strong>Autentisering:</strong> Håller dig inloggad mellan sidvisningar
              </li>
              <li>
                <strong>Säkerhet:</strong> Skyddar mot CSRF-attacker och andra säkerhetshot
              </li>
              <li>
                <strong>Session:</strong> Behåller din session aktiv under ditt besök
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Funktionella cookies</h3>
            <p>Dessa cookies hjälper oss att komma ihåg dina val och preferenser för att ge dig en bättre upplevelse.</p>
            <ul>
              <li>
                <strong>Språkinställningar:</strong> Kommer ihåg ditt valda språk
              </li>
              <li>
                <strong>Visningsinställningar:</strong> Sparar layoutpreferenser (grid/list)
              </li>
              <li>
                <strong>Sökinställningar:</strong> Behåller dina filterval
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Prestandacookies</h3>
            <p>Dessa cookies samlar in information om hur besökare använder webbplatsen för att hjälpa oss förbättra den.</p>
            <ul>
              <li>
                <strong>Analys:</strong> Mäter sidvisningar, klick och användarflöden
              </li>
              <li>
                <strong>Felrapportering:</strong> Identifierar tekniska problem
              </li>
              <li>
                <strong>Prestanda:</strong> Mäter laddningstider och optimerar prestanda
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.4 Marknadsföringscookies</h3>
            <p>Dessa cookies används för att visa relevant reklam och mäta effektiviteten av kampanjer.</p>
            <ul>
              <li>
                <strong>Annonsering:</strong> Visar relevanta annonser baserat på ditt intresse
              </li>
              <li>
                <strong>Remarketing:</strong> Påminner dig om produkter du visat intresse för
              </li>
              <li>
                <strong>Konverteringsmätning:</strong> Mäter effektiviteten av våra kampanjer
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Tredjepartscookies</h2>
            <p>Vi använder följande tredjepartstjänster som kan sätta cookies:</p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> För webbanalys och statistik
              </li>
              <li>
                <strong>Stripe:</strong> För säker betalningshantering
              </li>
              <li>
                <strong>Cloudflare:</strong> För säkerhet och prestanda
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Hur länge sparas cookies?</h2>
            <ul>
              <li>
                <strong>Sessionscookies:</strong> Raderas när du stänger webbläsaren
              </li>
              <li>
                <strong>Bestående cookies:</strong> Sparas i 30 dagar till 2 år beroende på typ
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Hantera cookies</h2>
            <p>Du kan när som helst ändra dina cookieinställningar.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.1 I webbläsaren</h3>
            <p>De flesta webbläsare låter dig hantera cookies genom inställningarna. Du kan:</p>
            <ul>
              <li>Blockera alla cookies</li>
              <li>Endast tillåta cookies från besökta webbplatser</li>
              <li>Radera alla cookies när du stänger webbläsaren</li>
              <li>Radera specifika cookies</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Länkar till cookieinställningar</h3>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                  Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/sv/kb/cookies" target="_blank" rel="noopener noreferrer">
                  Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/sv-se/windows/microsoft-edge" target="_blank" rel="noopener noreferrer">
                  Edge
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.3 På vår webbplats</h3>
            <p>Du kan när som helst ändra dina cookieinställningar genom att klicka på &quot;Cookieinställningar&quot; i sidfoten.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Konsekvenser av att blockera cookies</h2>
            <p>Om du blockerar vissa cookies kan det påverka funktionaliteten på webbplatsen:</p>
            <ul>
              <li>Du kan behöva logga in oftare</li>
              <li>Vissa inställningar sparas inte</li>
              <li>Vissa funktioner kan vara begränsade</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Uppdateringar av cookiepolicyn</h2>
            <p>Vi kan uppdatera denna cookiepolicy för att återspegla ändringar i vår användning av cookies.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Kontakta oss</h2>
            <p>Om du har frågor om vår användning av cookies, kontakta oss på privacy@marknadsplatsen.se</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
