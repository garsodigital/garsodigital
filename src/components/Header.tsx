import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navigation } from '../config/site';
import { Brand } from './Brand';
import { WhatsAppLink } from './WhatsAppLink';

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    const resize = () => { if (window.innerWidth >= 1000) setOpen(false); };
    window.addEventListener('keydown', close);
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
  }, []);
  return <header className="site-header">
    <div className="container header-inner">
      <Brand />
      <nav id="primary-navigation" aria-label="Navegação principal" className={`navigation ${open ? 'is-open' : ''}`}>
        {navigation.map(item => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
      </nav>
      <div className="header-actions"><WhatsAppLink className="button button-small button-outline">Fale conosco</WhatsAppLink>
        <button id="menu-toggle" className="menu-toggle" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </div>
  </header>;
}
