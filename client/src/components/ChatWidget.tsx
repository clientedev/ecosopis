import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";
import { AnimatePresence, motion } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "init", role: "bot", content: "Hi! I'm your Ecosopis skin assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const { mutate: sendMessage, isPending } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    sendMessage(userMsg.content, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: "bot", 
          content: data.response 
        }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: "bot", 
          content: "Sorry, I'm having trouble connecting right now. Please try again later." 
        }]);
      }
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 sm:w-96 bg-background border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "500px", maxHeight: "80vh" }}
          >
            <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-bold">Eco Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-primary/80 rounded-full p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-white border border-border shadow-sm text-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isPending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border shadow-sm rounded-2xl rounded-bl-none px-4 py-2 text-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about skincare..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`h-14 w-14 rounded-full shadow-lg transition-transform duration-300 ${isOpen ? 'rotate-90' : 'hover:scale-110'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>
    </div>
  );
}
