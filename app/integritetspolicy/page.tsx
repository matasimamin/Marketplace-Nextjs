import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Integritetspolicy</h1>
          <p className="text-muted-foreground">Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 prose prose-sm max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. Inledning</h2>
            <p>
              Marknadsplatsen (&quot;vi&quot;, &quot;oss&quot;, &quot;vår&quot;) värnar om din integritet och är engagerade i att skydda dina
              personuppgifter. Denna integritetspolicy beskriver hur vi samlar in, använder och skyddar dina uppgifter i enlighet med GDPR.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Personuppgiftsansvarig</h2>
            <p>Marknadsplatsen AB är personuppgiftsansvarig för behandlingen av dina personuppgifter.</p>
            <p>
              <strong>Kontaktuppgifter:</strong>
              <br />
              E-post: privacy@marknadsplatsen.se
              <br />
              Adress: [Adress]
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Vilka uppgifter samlar vi in?</h2>
            <p>Vi samlar in följande typer av personuppgifter:</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Uppgifter du ger oss</h3>
            <ul>
              <li>
                <strong>Kontouppgifter:</strong> Namn, e-postadress, telefonnummer, lösenord
              </li>
              <li>
                <strong>Profiluppgifter:</strong> Profilbild, användarnamn, biografisk information
              </li>
              <li>
                <strong>Annonsinnehåll:</strong> Text, bilder, pris, plats och kategorier
              </li>
              <li>
                <strong>Kommunikation:</strong> Meddelanden du skickar till andra användare
              </li>
              <li>
                <strong>Betalningsinformation:</strong> För premiumtjänster (hanteras av vår betalleverantör)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Automatiskt insamlade uppgifter</h3>
            <ul>
              <li>
                <strong>Tekniska uppgifter:</strong> IP-adress, webbläsartyp, enhet, operativsystem
              </li>
              <li>
                <strong>Användningsdata:</strong> Sidvisningar, klick, sökningar, tid på sajten
              </li>
              <li>
                <strong>Cookies:</strong> Se vår cookiepolicy för mer information
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Hur använder vi dina uppgifter?</h2>
            <p>Vi använder dina personuppgifter för att:</p>
            <ul>
              <li>Tillhandahålla och förbättra våra tjänster</li>
              <li>Hantera ditt konto och autentisering</li>
              <li>Möjliggöra kommunikation mellan användare</li>
              <li>Bearbeta betalningar för premiumtjänster</li>
              <li>Skicka viktiga meddelanden om tjänsten</li>
              <li>Förhindra bedrägeri och missbruk</li>
              <li>Förbättra säkerheten på plattformen</li>
              <li>Analysera användning och förbättra användarupplevelsen</li>
              <li>Uppfylla rättsliga skyldigheter</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Rättslig grund för behandling</h2>
            <p>Vi behandlar dina personuppgifter baserat på:</p>
            <ul>
              <li>
                <strong>Fullgörande av avtalet:</strong> För att tillhandahålla tjänsten du registrerat dig för
              </li>
              <li>
                <strong>Berättigat intresse:</strong> För att förbättra tjänsten och förhindra missbruk
              </li>
              <li>
                <strong>Samtycke:</strong> För marknadsföring och vissa valfria funktioner
              </li>
              <li>
                <strong>Rättslig förpliktelse:</strong> När vi är skyldiga enligt lag
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Delning av uppgifter</h2>
            <p>Vi delar dina uppgifter med:</p>
            <ul>
              <li>
                <strong>Andra användare:</strong> Din profil och annonser är publika
              </li>
              <li>
                <strong>Tjänsteleverantörer:</strong> Som hjälper oss tillhandahålla tjänsten (hosting, betalning, analys)
              </li>
              <li>
                <strong>Myndigheter:</strong> När vi är skyldiga enligt lag
              </li>
            </ul>
            <p>Vi säljer aldrig dina personuppgifter till tredje part för marknadsföringsändamål.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Internationell överföring</h2>
            <p>
              Dina uppgifter lagras primärt inom EU/EES. Om uppgifter överförs utanför EU/EES säkerställer vi lämpliga
              skyddsåtgärder i enlighet med GDPR.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Hur länge sparar vi dina uppgifter?</h2>
            <ul>
              <li>
                <strong>Kontouppgifter:</strong> Så länge ditt konto är aktivt
              </li>
              <li>
                <strong>Annonser:</strong> Tills de raderas eller ditt konto avslutas
              </li>
              <li>
                <strong>Meddelanden:</strong> Tills de raderas eller ditt konto avslutas
              </li>
              <li>
                <strong>Betalningsdata:</strong> Enligt bokföringslagen (minst 7 år)
              </li>
              <li>
                <strong>Loggar och säkerhetsdata:</strong> Upp till 12 månader
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Dina rättigheter</h2>
            <p>Du har rätt att:</p>
            <ul>
              <li>
                <strong>Få tillgång:</strong> Begära en kopia av dina uppgifter
              </li>
              <li>
                <strong>Rätta:</strong> Korrigera felaktiga uppgifter
              </li>
              <li>
                <strong>Radera:</strong> Begära radering av dina uppgifter
              </li>
              <li>
                <strong>Begränsa:</strong> Begränsa behandlingen av dina uppgifter
              </li>
              <li>
                <strong>Invända:</strong> Motsätta dig viss behandling
              </li>
              <li>
                <strong>Dataportabilitet:</strong> Få dina uppgifter i ett strukturerat format
              </li>
              <li>
                <strong>Återkalla samtycke:</strong> När behandling baseras på samtycke
              </li>
            </ul>
            <p>För att utöva dina rättigheter, kontakta oss på privacy@marknadsplatsen.se</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Säkerhet</h2>
            <p>
              Vi vidtar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda dina personuppgifter mot obehörig åtkomst,
              förlust eller förstörelse. Detta inkluderar:
            </p>
            <ul>
              <li>Kryptering av känsliga uppgifter</li>
              <li>Säker autentisering och åtkomstkontroll</li>
              <li>Regelbundna säkerhetsuppdateringar</li>
              <li>Begränsad åtkomst till personuppgifter</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Barn</h2>
            <p>Våra tjänster är inte avsedda för personer under 18 år. Vi samlar inte medvetet in personuppgifter från barn.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Ändringar av policyn</h2>
            <p>
              Vi kan uppdatera denna integritetspolicy. Väsentliga ändringar meddelas via e-post eller på webbplatsen. Fortsatt användning
              efter ändringar innebär att du accepterar den nya policyn.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Kontakt och klagomål</h2>
            <p>Om du har frågor om vår integritetspolicy eller vill utöva dina rättigheter, kontakta oss på:</p>
            <p>E-post: privacy@marknadsplatsen.se</p>
            <p>
              Du har också rätt att lämna in ett klagomål till Integritetskyddsmyndigheten (IMY) om du anser att vi behandlar dina
              personuppgifter felaktigt.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
