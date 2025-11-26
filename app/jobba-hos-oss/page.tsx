import Link from "next/link";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Heart, TrendingUp, Users } from "lucide-react";

const benefits = [
  "Flexibla arbetstider och möjlighet till distansarbete",
  "Konkurrensmässig lön och bonusprogram",
  "Friskvårdsbidrag och hälsoförsäkring",
  "Kontinuerlig kompetensutveckling",
  "Moderna lokaler i centralt läge",
  "Roliga teamaktiviteter och events",
];

const openPositions = [
  {
    title: "Frontend-utvecklare",
    department: "Tech",
    location: "Stockholm / Remote",
    type: "Heltid",
  },
  {
    title: "Customer Success Manager",
    department: "Support",
    location: "Stockholm",
    type: "Heltid",
  },
  {
    title: "UX/UI Designer",
    department: "Design",
    location: "Stockholm / Remote",
    type: "Heltid",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Jobba hos oss</h1>
          <p className="text-muted-foreground text-lg">Bli en del av teamet som bygger Sveriges modernaste marknadsplats</p>
        </div>

        <div className="mb-12">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Varför Marknadsplatsen?</h2>
              <p className="text-lg opacity-90">
                Hos oss får du möjlighet att påverka hur människor handlar och konsumerar. Vi är ett snabbväxande företag
                med passion för innovation, hållbarhet och att skapa värde för våra användare. Tillsammans bygger vi
                framtidens marknadsplats.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: TrendingUp,
              title: "Snabb tillväxt",
              text: "Vi växer snabbt och söker talanger som vill vara med på resan mot att bli Sveriges största marknadsplats.",
            },
            {
              icon: Users,
              title: "Starkt team",
              text: "Ett dedikerat team av erfarna och passionerade individer som stöttar varandra.",
            },
            {
              icon: Heart,
              title: "Meningsfull påverkan",
              text: "Ditt arbete bidrar till en mer hållbar framtid genom att göra begagnathandel enklare.",
            },
            {
              icon: Briefcase,
              title: "Bra förmåner",
              text: "Vi erbjuder konkurrenskraftiga villkor och förmåner som gör skillnad i vardagen.",
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

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Vad vi erbjuder</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-6">Lediga tjänster</h2>
          <div className="space-y-4">
            {openPositions.map((position) => (
              <Card key={position.title}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {position.department}
                        </span>
                        <span>📍 {position.location}</span>
                        <span>⏰ {position.type}</span>
                      </div>
                    </div>
                    <Button asChild className="bg-gradient-primary hover:opacity-90 flex-shrink-0">
                      <Link href="/kontakt">Ansök nu</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Hittade du ingen passande tjänst?</h3>
              <p className="text-muted-foreground mb-4">
                Vi tar alltid emot spontanansökningar från duktiga personer som vill vara med på vår resa.
              </p>
              <Button asChild variant="outline">
                <Link href="/kontakt">Skicka spontanansökan</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
