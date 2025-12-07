// components/ChatSheet.tsx
"use client";

import { useState } from "react";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatSheet({
  productId,
  productName,
  onClose,
}: {
  productId: string;
  productName: string;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
  if (!input.trim()) return;

  const userMsg: Msg = { role: "user", content: input };

  // Add user message immediately to UI
  setMessages(prev => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    // Include new message in history BEFORE sending
    const historyToSend = [...messages, userMsg];

    const res = await fetch("/api/products/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        message: userMsg.content,
        history: historyToSend,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("API error:", data);
      return;
    }

    // Add assistant message to UI
    const assistantMsg: Msg = { role: "assistant", content: data.answer };
    setMessages(prev => [...prev, assistantMsg]);

  } catch (err) {
    console.error("Send error:", err);
  } finally {
    setLoading(false);
  }
};
    

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">{productName}</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] p-2 rounded-md ${
              m.role === "user"
                ? "bg-blue-100 ml-auto"
                : "bg-gray-200 mr-auto"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask something..."
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}