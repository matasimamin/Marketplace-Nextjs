import Link from "next/link";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, ShieldCheck, Package, CreditCard, User } from "lucide-react";

const categories = [
  {
    title: "Trygg handel",
    description: "Lär dig hur du handlar säkert på Marknadsplatsen",
    icon: ShieldCheck,
    link: "/trygg-handel",
  },
  {
    title: "Köpa & sälja",
    description: "Guide för att lägga upp annonser och genomföra köp",
    icon: Package,
    link: "/hjalp/kopa-salja",
  },
  {
    title: "Konto & inställningar",
    description: "Hantera ditt konto och personliga uppgifter",
    icon: User,
    link: "/hjalp/konto",
  },
  {
    title: "Betalning & leverans",
    description: "Information om betalningsmetoder och frakt",
    icon: CreditCard,
    link: "/hjalp/betalning",
  },
  {
    title: "Meddelanden",
    description: "Kommunicera med köpare och säljare",
    icon: MessageSquare,
    link: "/hjalp/meddelanden",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hjälpcenter</h1>
          <p className="text-muted-foreground text-lg mb-8">Hur kan vi hjälpa dig idag?</p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input placeholder="Sök efter hjälp..." className="pl-12 h-14 text-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.title} href={category.link}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vanliga frågor</CardTitle>
            <CardDescription>De mest ställda frågorna och svaren</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/vanliga-fragor" className="block p-4 rounded-lg hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-1">Hur lägger jag upp en annons?</h3>
              <p className="text-sm text-muted-foreground">
                Logga in, klicka på "Lägg upp annons" och fyll i formuläret med information om din vara.
              </p>
            </Link>
            <Link href="/vanliga-fragor" className="block p-4 rounded-lg hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-1">Hur kontaktar jag en säljare?</h3>
              <p className="text-sm text-muted-foreground">
                Klicka på "Skicka meddelande" på annonsen för att starta en konversation.
              </p>
            </Link>
            <Link href="/vanliga-fragor" className="block p-4 rounded-lg hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-1">Vad gör jag om något går fel?</h3>
              <p className="text-sm text-muted-foreground">
                Kontakta vår support via kontaktformuläret så hjälper vi dig.
              </p>
            </Link>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Hittade du inte vad du sökte?</p>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-gradient-primary text-primary-foreground hover:opacity-90 h-10 px-6"
          >
            Kontakta oss
          </Link>
        </div>
      </div>
    </div>
  );
}
