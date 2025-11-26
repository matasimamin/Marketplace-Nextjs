"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tack för ditt meddelande! Vi återkommer så snart som möjligt.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kontakta oss</h1>
          <p className="text-muted-foreground text-lg">
            Vi finns här för att hjälpa dig. Skicka ett meddelande så återkommer vi inom 24 timmar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, title: "E-post", text: "support@marknadsplatsen.se" },
            { icon: MessageSquare, title: "Chatt", text: "Vardagar 09:00-17:00" },
            { icon: HelpCircle, title: "Hjälpcenter", text: "Svar på vanliga frågor" },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skicka ett meddelande</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Namn *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ditt namn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-post *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="din@email.se"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Ämne *</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Vad gäller ditt meddelande?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Meddelande *</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Beskriv ditt ärende..."
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                Skicka meddelande
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
