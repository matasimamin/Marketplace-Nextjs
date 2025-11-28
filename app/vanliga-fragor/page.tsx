import { Header } from "@/components/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Vanliga frågor</h1>
          <p className="text-muted-foreground text-lg">
            Svar på de mest frekventa frågorna om Marknadsplatsen
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Komma igång</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Hur skapar jag ett konto?</AccordionTrigger>
                  <AccordionContent>
                    Klicka på &quot;Logga in&quot; i menyn och välj sedan
                    &quot;Skapa konto&quot;. Fyll i dina uppgifter och bekräfta
                    din e-postadress. Det är helt gratis att skapa ett konto på
                    Marknadsplatsen.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Kostar det något att använda Marknadsplatsen?
                  </AccordionTrigger>
                  <AccordionContent>
                    Det är helt gratis att skapa konto, bläddra bland annonser
                    och lägga upp vanliga annonser.
                    {/* Vi erbjuder
                    premiumtjänster som att framhäva din annons eller lyfta den, vilket kostar en mindre avgift. */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sälja</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Hur lägger jag upp en annons?
                  </AccordionTrigger>
                  <AccordionContent>
                    Klicka på &quot;Lägg upp annons&quot; i menyn eller
                    navigeringen. Fyll i information om din vara, lägg till
                    bilder och välj kategori. När du är klar klickar du på
                    &quot;Publicera&quot;. Din annons syns direkt för andra
                    användare.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Hur många bilder kan jag lägga till?
                  </AccordionTrigger>
                  <AccordionContent>
                    Du kan lägga till upp till 8 bilder per annons. Vi
                    rekommenderar att använda tydliga bilder från olika vinklar
                    för att ge köpare en bra uppfattning om varan.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Kan jag redigera min annons efter publicering?
                  </AccordionTrigger>
                  <AccordionContent>
                    Ja, gå till &quot;Konto&quot; → &quot;Dina annonser&quot;
                    och klicka på annonsen du vill redigera. Du kan när som
                    helst uppdatera text, bilder och pris.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Köpa</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    Hur kontaktar jag en säljare?
                  </AccordionTrigger>
                  <AccordionContent>
                    Klicka på &quot;Skicka meddelande&quot; på annonssidan. Du
                    måste vara inloggad för att skicka meddelanden. Alla
                    konversationer sparas i &quot;Meddelanden&quot; så du enkelt
                    kan följa upp.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    Hur betalar jag för en vara?
                  </AccordionTrigger>
                  <AccordionContent>
                    Betalningsmetoden bestämmer du och säljaren själva. Vi
                    rekommenderar kontant betalning vid upphämtning eller säkra
                    betalningstjänster som Swish. Betala aldrig i förskott till
                    okända personer.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                  <AccordionTrigger>
                    Kan jag spara annonser jag gillar?
                  </AccordionTrigger>
                  <AccordionContent>
                    Ja, klicka på hjärtikonen på en annons för att spara den i
                    dina favoriter. Du hittar alla sparade annonser under
                    &quot;Konto&quot; → &quot;Favoriter&quot;.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Säkerhet</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-9">
                  <AccordionTrigger>
                    Hur vet jag att en säljare är pålitlig?
                  </AccordionTrigger>
                  <AccordionContent>
                    Läs säljarens profil och tidigare annonser. Använd
                    meddelandefunktionen för att ställa frågor. Möts helst upp
                    på en offentlig plats och inspektera varan innan betalning.
                    Läs mer i vår guide om trygg handel.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-10">
                  <AccordionTrigger>
                    Vad gör jag om jag misstänker bedrägeri?
                  </AccordionTrigger>
                  <AccordionContent>
                    Rapportera omedelbart annonsen eller användaren genom att
                    klicka på &quot;Rapportera&quot; på annonssidan eller i
                    meddelandetråden. Vårt team granskar alla rapporter. Vid
                    allvarliga fall, kontakta även Polisen.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-11">
                  <AccordionTrigger>
                    Hur skyddar Marknadsplatsen mina personuppgifter?
                  </AccordionTrigger>
                  <AccordionContent>
                    Vi tar din integritet på största allvar. Din e-postadress
                    visas aldrig publikt. Läs vår integritetspolicy för
                    fullständig information om hur vi hanterar dina uppgifter.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
