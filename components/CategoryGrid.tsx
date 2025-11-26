import Link from "next/link";
import { Card } from "@/components/ui/card";

const categories = [
  { name: "Fordon", slug: "fordon", icon: "🚗", color: "bg-blue-50 hover:bg-blue-100" },
  { name: "Elektronik", slug: "elektronik", icon: "📱", color: "bg-purple-50 hover:bg-purple-100" },
  { name: "Hem & Trädgård", slug: "hem-tradgard", icon: "🏠", color: "bg-green-50 hover:bg-green-100" },
  { name: "Kläder", slug: "klader-accessoarer", icon: "👕", color: "bg-pink-50 hover:bg-pink-100" },
  { name: "Sport & Fritid", slug: "sport-fritid", icon: "⚽", color: "bg-orange-50 hover:bg-orange-100" },
  { name: "Barn & Baby", slug: "barn-baby", icon: "👶", color: "bg-yellow-50 hover:bg-yellow-100" },
  { name: "Bostad", slug: "bostad", icon: "🏘️", color: "bg-teal-50 hover:bg-teal-100" },
  { name: "Jobb", slug: "jobb", icon: "💼", color: "bg-indigo-50 hover:bg-indigo-100" },
];

export const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {categories.map((category) => (
        <Link key={category.slug} href={`/kategori/${category.slug}`}>
          <Card className={`${category.color} border-0 p-6 text-center cursor-pointer transition-all hover:shadow-md`}>
            <div className="text-4xl mb-2">{category.icon}</div>
            <div className="text-sm font-medium text-foreground">{category.name}</div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
