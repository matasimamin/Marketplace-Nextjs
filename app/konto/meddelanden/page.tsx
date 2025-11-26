"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function MessagesContent() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: threads, isLoading } = useQuery({
    queryKey: ["threads", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("threads")
        .select(
          `
          *,
          listings (title),
          profiles!threads_buyer_id_fkey (name),
          profiles!threads_seller_id_fkey (name)
        `,
        )
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meddelanden</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[100px]" />
            ))}
          </div>
        ) : threads && threads.length > 0 ? (
          <div className="space-y-4">
            {threads.map((thread: any) => (
              <Card
                key={thread.id}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => router.push(`/meddelanden/${thread.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {thread.listings?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {thread.buyer_id === user?.id ? `Konversation med säljare` : `Konversation med köpare`}
                  </p>
                  {thread.last_message_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Senaste meddelande: {new Date(thread.last_message_at).toLocaleString("sv-SE")}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Du har inga meddelanden än</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}
