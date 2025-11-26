import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Marknadsplatsen
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Sveriges moderna köp- och säljplattform för begagnade varor.
            </p>
          </div>

          {/* Hjälp & Support */}
          <div>
            <h3 className="font-semibold mb-4">Hjälp & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hjalpcenter" className="text-muted-foreground hover:text-primary transition-colors">
                  Hjälpcenter
                </Link>
              </li>
              <li>
                <Link href="/trygg-handel" className="text-muted-foreground hover:text-primary transition-colors">
                  Trygg handel
                </Link>
              </li>
              <li>
                <Link href="/vanliga-fragor" className="text-muted-foreground hover:text-primary transition-colors">
                  Vanliga frågor
                </Link>
              </li>
            </ul>
          </div>

          {/* Om oss */}
          <div>
            <h3 className="font-semibold mb-4">Om oss</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/om-oss" className="text-muted-foreground hover:text-primary transition-colors">
                  Om Marknadsplatsen
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-muted-foreground hover:text-primary transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/jobba-hos-oss" className="text-muted-foreground hover:text-primary transition-colors">
                  Jobba hos oss
                </Link>
              </li>
            </ul>
          </div>

          {/* Villkor */}
          <div>
            <h3 className="font-semibold mb-4">Villkor</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/anvandarvillkor" className="text-muted-foreground hover:text-primary transition-colors">
                  Användarvillkor
                </Link>
              </li>
              <li>
                <Link href="/integritetspolicy" className="text-muted-foreground hover:text-primary transition-colors">
                  Integritetspolicy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Marknadsplatsen. Alla rättigheter förbehållna.</p>
            <div className="flex gap-6">
              <Link href="/anvandarvillkor" className="hover:text-primary transition-colors">
                Villkor
              </Link>
              <Link href="/integritetspolicy" className="hover:text-primary transition-colors">
                Integritet
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
