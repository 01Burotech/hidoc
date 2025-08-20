"use client";
import { useState } from "react";

export default function PrescriptionChat({ threadId }: { threadId: string }) {
  const [messages, setMessages] = useState<{sender:string, body:string}[]>([]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input) return;
    setMessages([...messages, { sender: "Pharmacie", body: input }]);
    setInput("");
  };

  return (
    <div className="border p-2 rounded">
      <h3 className="font-bold mb-2">Chat ordonnance</h3>
      <div className="max-h-40 overflow-y-auto mb-2">
        {messages.map((m,i)=>(
          <div key={i}><strong>{m.sender}:</strong> {m.body}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-1 border rounded"/>
        <button onClick={send} className="px-2 bg-green-600 text-white rounded">Envoyer</button>
      </div>
    </div>
  );
}
