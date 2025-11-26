import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Användarvillkor</h1>
          <p className="text-muted-foreground">Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 prose prose-sm max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. Allmänt</h2>
            <p>
              Välkommen till Marknadsplatsen! Dessa användarvillkor (&quot;Villkor&quot;) reglerar din användning av vår webbplats och
              tjänster. Genom att använda Marknadsplatsen godkänner du dessa villkor.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Konto och registrering</h2>
            <p>För att använda vissa funktioner måste du skapa ett konto. Du ansvarar för att:</p>
            <ul>
              <li>Tillhandahålla korrekt och uppdaterad information</li>
              <li>Hålla dina inloggningsuppgifter säkra</li>
              <li>Omedelbart meddela oss om obehörig användning av ditt konto</li>
              <li>Vara minst 18 år eller ha vårdnadshavares tillstånd</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Annonser och innehåll</h2>
            <p>När du lägger upp annonser på Marknadsplatsen förbinder du dig att:</p>
            <ul>
              <li>Endast publicera lagliga varor och tjänster</li>
              <li>Ange korrekt information om det du säljer</li>
              <li>Ha rätt att sälja den vara eller tjänst du annonserar</li>
              <li>Inte publicera stötande, olagligt eller vilseledande innehåll</li>
              <li>Respektera andras upphovsrätt och immateriella rättigheter</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Förbjudna varor</h2>
            <p>Följande får INTE säljas på Marknadsplatsen:</p>
            <ul>
              <li>Stulna eller förfalskade varor</li>
              <li>Vapen, droger eller andra olagliga produkter</li>
              <li>Alkohol och tobak</li>
              <li>Läkemedel</li>
              <li>Djur (levande)</li>
              <li>Tjänster av sexuell karaktär</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Transaktioner</h2>
            <p>Marknadsplatsen är en förmedlingstjänst. Vi är inte part i transaktioner mellan köpare och säljare. Du ansvarar själv för att:</p>
            <ul>
              <li>Kommunicera och komma överens med motparten</li>
              <li>Genomföra betalning på ett säkert sätt</li>
              <li>Hantera leverans eller upphämtning</li>
              <li>Lösa eventuella tvister med motparten</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Avgifter</h2>
            <p>
              Grundfunktionerna på Marknadsplatsen är gratis. Vi erbjuder premiumtjänster mot betalning, såsom framhävda annonser. Aktuella
              priser finns på webbplatsen.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Immaterialrätt</h2>
            <p>
              Allt innehåll på Marknadsplatsen, inklusive design, logotyper och programvara, ägs av oss eller våra licensgivare och
              skyddas av upphovsrätt och varumärkesrätt.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Ansvarsbegränsning</h2>
            <p>Marknadsplatsen tillhandahålls &quot;som den är&quot;. Vi ansvarar inte för:</p>
            <ul>
              <li>Kvaliteten eller riktigheten av annonser</li>
              <li>Uppfyllelse av transaktioner mellan användare</li>
              <li>Förluster eller skador till följd av användning av tjänsten</li>
              <li>Tekniska störningar eller avbrott i tjänsten</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Avstängning</h2>
            <p>
              Vi förbehåller oss rätten att när som helst, utan förvarning, stänga av eller radera konton som bryter mot dessa villkor eller
              används på ett olämpligt sätt.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Ändringar av villkor</h2>
            <p>
              Vi kan när som helst uppdatera dessa villkor. Väsentliga ändringar meddelas via e-post eller på webbplatsen. Fortsatt
              användning efter ändringar innebär att du accepterar de nya villkoren.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Tillämplig lag</h2>
            <p>
              Dessa villkor regleras av svensk lag. Tvister ska i första hand lösas genom förhandling, annars avgörs de av svensk domstol.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Kontakt</h2>
            <p>Har du frågor om dessa villkor? Kontakta oss på support@marknadsplatsen.se</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
