"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function MessageThreadContent() {
  const params = useParams<{ threadId: string }>();
  const threadId = params?.threadId;
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const { data: thread, isLoading: threadLoading } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("threads")
        .select(
          `
          *,
          listings(title, id),
          buyer:profiles!threads_buyer_id_fkey(name),
          seller:profiles!threads_seller_id_fkey(name)
        `,
        )
        .eq("id", threadId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!threadId && !!user,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:profiles(name, avatar_url)
        `,
        )
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!threadId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (body: string) => {
      const { error } = await supabase.from("messages").insert({
        thread_id: threadId!,
        sender_id: user!.id,
        body,
      });

      if (error) throw error;

      await supabase.from("threads").update({ last_message_at: new Date().toISOString() }).eq("id", threadId!);
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", threadId] });
      queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
    },
    onError: () => {
      toast({
        title: "Fel",
        description: "Kunde inte skicka meddelandet",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message.trim());
  };

  useEffect(() => {
    if (!threadId) return;

    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messages", threadId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, queryClient]);

  if (threadLoading || messagesLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </>
    );
  }

  if (!thread) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 pb-20 md:pb-8 text-center">
          <p className="text-muted-foreground">Konversation hittades inte</p>
          <Button onClick={() => router.push("/meddelanden")} className="mt-4">
            Tillbaka till meddelanden
          </Button>
        </div>
      </>
    );
  }

  const otherParticipant = thread.buyer_id === user?.id ? thread.seller : thread.buyer;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-4xl">
        <Button variant="ghost" onClick={() => router.push("/meddelanden")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>

        <Card className="p-6 mb-6">
          <h1 className="text-xl font-semibold mb-2">{thread.listings?.title}</h1>
          <p className="text-muted-foreground">Konversation med {otherParticipant?.name}</p>
        </Card>

        <Card className="p-6 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
          {messages && messages.length === 0 ? (
            <p className="text-center text-muted-foreground">Inga meddelanden ännu. Starta konversationen!</p>
          ) : (
            <div className="space-y-4">
              {messages?.map((msg) => {
                const isOwn = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.created_at!).toLocaleString("sv-SE", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Skriv ditt meddelande..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[60px]"
            />
            <Button onClick={handleSendMessage} disabled={!message.trim() || sendMessageMutation.isPending} size="icon" className="self-end">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default function MessageThreadPage() {
  return (
    <ProtectedRoute>
      <MessageThreadContent />
    </ProtectedRoute>
  );
}
