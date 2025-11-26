import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function SafeTradingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Trygg handel</h1>
          <p className="text-muted-foreground text-lg">Handla säkert på Marknadsplatsen med våra råd och tips</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Gör så här för en trygg affär
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "Använd meddelandefunktionen",
                text: "Kommunicera alltid via Marknadsplatsens meddelandesystem. Då har du bevis på vad som avtalats.",
              },
              {
                title: "Möts upp och betala kontant",
                text: "Det säkraste är att träffas på en offentlig plats och betala kontant när du får varan.",
              },
              {
                title: "Kontrollera varan",
                text: "Inspektera alltid varan innan du betalar. Se till att den stämmer med beskrivningen.",
              },
              {
                title: "Var försiktig med förskottsbetalning",
                text: "Betala aldrig i förskott till okända personer. Använd säkra betalningsmetoder vid frakt.",
              },
            ].map((item, index) => (
              <div key={item.title} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-8 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Undvik detta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                title: "Misstänkta erbjudanden",
                text: "Om priset verkar för bra för att vara sant, är det ofta det.",
              },
              {
                title: "Betalning utanför plattformen",
                text: "Använd aldrig externa betaltjänster som någon skickar länkar till.",
              },
              {
                title: "Pressande meddelanden",
                text: "Bedragare försöker ofta skapa stress och tidspress.",
              },
              {
                title: "Oklara kontaktuppgifter",
                text: "Var försiktig med säljare som inte vill ge korrekta uppgifter.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>{item.title}:</strong> {item.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upptäckt bedrägeri eller problem?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Om du har blivit utsatt för bedrägeri eller upplever problem med en transaktion:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Rapportera annonsen eller användaren direkt via plattformen</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Kontakta vår support med all relevant information</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Vid allvarliga brott, kontakta Polisen</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
