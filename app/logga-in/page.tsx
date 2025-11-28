"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(loginEmail, loginPassword);

    if (!error) {
      const redirect = searchParams.get("redirect") || "/";
      router.replace(redirect);
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp({
      email: signupEmail,
      password: signupPassword,
      firstName: signupFirstName,
      lastName: signupLastName,
      phone: signupPhone,
    });

    if (!error) {
      const redirect = searchParams.get("redirect") || "/";
      router.replace(redirect);
    }

    setLoading(false);
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2">Marknadsplatsen</h1>
          </Link>
          <p className="text-white/90">Logga in eller skapa ett konto för att fortsätta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Välkommen</CardTitle>
            <CardDescription>Logga in med ditt konto eller skapa ett nytt</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Logga in</TabsTrigger>
                <TabsTrigger value="signup">Skapa konto</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="din@email.se"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Lösenord</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loggar in...
                      </>
                    ) : (
                      "Logga in"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="signup-first-name">Förnamn</Label>
                      <Input
                        id="signup-first-name"
                        type="text"
                        placeholder="Ex. Anna"
                        value={signupFirstName}
                        onChange={(e) => setSignupFirstName(e.target.value)}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-last-name">Efternamn</Label>
                      <Input
                        id="signup-last-name"
                        type="text"
                        placeholder="Ex. Svensson"
                        value={signupLastName}
                        onChange={(e) => setSignupLastName(e.target.value)}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signup-phone">Telefonnummer</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="070-123 45 67"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="din@email.se"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Lösenord</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Minst 6 tecken</p>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Skapar konto...
                      </>
                    ) : (
                      "Skapa konto"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}
