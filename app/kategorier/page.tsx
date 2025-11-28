import { Header } from "@/components/Header";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Alla kategorier</h1>
          <p className="text-muted-foreground">
            Välj en kategori för att hitta vad du söker
          </p>
        </div>

        <CategoryGrid />
      </main>
    </div>
  );
}
