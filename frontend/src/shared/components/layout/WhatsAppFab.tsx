import { MessageCircle } from "lucide-react";
import { Button } from "@/core/components/ui/button";

const WHATSAPP_URL = "https://wa.me/923001234567";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50"
      aria-label="Chat on WhatsApp about fabrics and sizes"
    >
      <Button
        size="icon"
        className="size-14 rounded-full bg-emerald-600 shadow-lg hover:bg-emerald-700"
      >
        <MessageCircle className="size-7" aria-hidden />
      </Button>
    </a>
  );
}
