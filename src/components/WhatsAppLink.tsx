import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { getWhatsAppLinkProps, WHATSAPP_MESSAGES } from '../config/whatsapp';

export function WhatsAppLink({ message = 'contact', children, className = 'button button-primary' }: {
  message?: keyof typeof WHATSAPP_MESSAGES; children: ReactNode; className?: string;
}) {
  return <a {...getWhatsAppLinkProps(WHATSAPP_MESSAGES[message])} className={className}>
    {children}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (abre o WhatsApp em nova aba)</span>
  </a>;
}
