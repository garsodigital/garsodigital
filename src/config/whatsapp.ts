export const WHATSAPP_NUMBER = "5544999402880";

export const WHATSAPP_MESSAGES = {
  contact: "Olá! Tudo bem? 👋 Conheci a Garso Digital pelo site e gostaria de conversar com vocês!",
  quote: "Olá! Gostei do trabalho da Garso Digital e gostaria de solicitar um orçamento para meu projeto. Podemos conversar?",
  basicSite: "Olá! 👋 Vi o Site Básico de R$ 247,90 no site da Garso Digital e tenho interesse em contratar. Gostaria de saber como podemos começar!",
  expertSite: "Olá! 💙 Conheci o Site Expert da Garso Digital e gostaria de receber um orçamento personalizado para minha empresa. Podemos conversar sobre minha ideia?",
  posts: "Olá! Tenho interesse na criação de posts personalizados para meu negócio. Gostaria de saber mais sobre o serviço da Garso Digital!",
  reels: "Olá! Tenho interesse no serviço de Reels da Garso Digital. Podemos conversar sobre meu projeto?",
} as const;

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Spread these attributes onto a contact anchor. The visitor confirms sending in WhatsApp. */
export function getWhatsAppLinkProps(message: string) {
  return {
    href: getWhatsAppLink(message),
    target: "_blank",
    rel: "noopener noreferrer",
  } as const;
}
