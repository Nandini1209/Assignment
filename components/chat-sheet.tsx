"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

type Msg = { id: string; role: "user" | "assistant"; content: string; created_at?: string };

export default function ChatSheet() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // optional: prefill with a greeting
  useEffect(() => {
    setMessages([
      { id: "m-welcome", role: "assistant", content: "Hi — ask me anything about the selected product or lending in general!" },
    ]);
  }, []);

  useEffect(() => {
    // scroll to bottom on new message
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, open]);

  async function handleSend(productId?: string) {
    if (!text.trim()) return;
    const userMessage: Msg = { id: `u-${Date.now()}`, role: "user", content: text.trim(), created_at: new Date().toISOString() };
    setMessages((s) => [...s, userMessage]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, productId }),
      });

      const json = await res.json();

      // server returns { reply: string }
      const assistant: Msg = { id: `a-${Date.now()}`, role: "assistant", content: json.reply ?? "Sorry, I couldn't answer that right now." };
      setMessages((s) => [...s, assistant]);
    } catch (err) {
      setMessages((s) => [
        ...s,
        { id: `a-err-${Date.now()}`, role: "assistant", content: "Network error — could not reach the AI service." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 bg-blue-600 text-white">Chat AI</Button>
      </SheetTrigger>

      
        <SheetHeader>
          <SheetTitle>LoanMate Assistant</SheetTitle>
          <p className="text-sm text-muted-foreground">Ask questions about loans or a specific product.</p>
        </SheetHeader>

        <div className="mt-4 flex-1 overflow-hidden flex flex-col h-[70vh]">
          <div ref={messagesRef} className="flex-1 overflow-auto px-2 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 p-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <Avatar>
                    <div className="h-8 w-8 rounded-full bg-gray-200 grid place-items-center text-sm">AI</div>
                  </Avatar>
                )}
                <div className={`max-w-[80%] p-3 rounded-lg ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-black"}`}>
                  {m.content}
                </div>
                {m.role === "user" && (
                  <Avatar>
                    <div className="h-8 w-8 rounded-full bg-blue-600 grid place-items-center text-sm text-white">You</div>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your question..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <Button onClick={() => handleSend()} disabled={loading}>
                {loading ? "..." : "Send"}
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Tip: ask about APR, docs required, or "Is prepayment allowed?"</div>
          </div>
        </div>

        <SheetFooter />
    
    </Sheet>
  );
}
