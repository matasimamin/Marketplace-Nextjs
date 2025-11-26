import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Om Marknadsplatsen</h1>
          <p className="text-muted-foreground text-lg">Sveriges moderna köp- och säljplattform</p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            Marknadsplatsen är en modern plattform där privatpersoner och företag enkelt kan köpa och sälja varor och
            tjänster. Vi tror på en hållbar framtid där vi delar, återanvänder och ger produkter ett andra liv.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: Target,
              title: "Vårt mål",
              text: "Att skapa den mest användarvänliga och säkra marknadsplatsen i Sverige där alla kan handla med förtroende.",
            },
            {
              icon: Users,
              title: "Vår community",
              text: "Tusentals användare över hela Sverige använder dagligen Marknadsplatsen för att köpa och sälja.",
            },
            {
              icon: ShieldCheck,
              title: "Trygghet först",
              text: "Vi arbetar aktivt för att skapa en säker miljö med verktyg för rapportering och moderering.",
            },
            {
              icon: Heart,
              title: "Hållbarhet",
              text: "Genom att köpa begagnat minskar vi konsumtion och bidrar till en mer hållbar framtid.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Vår vision</h2>
            <p className="text-lg opacity-90">
              Vi ser en framtid där det är lika naturligt att köpa begagnat som nytt. Där varje produkt får möjlighet
              till ett långt liv och där handel mellan människor sker med respekt och tillit. Marknadsplatsen ska vara
              verktyget som gör detta möjligt.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
