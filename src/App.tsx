import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Check, Code2, Compass, Instagram, Layers3, MessageCircle, Monitor, MousePointer2, Palette, Play, ScanLine } from 'lucide-react';
import { site, navigation, processSteps, plans, projects } from './config/site';
import { Header } from './components/Header';
import { Background } from './components/Background';
import { Brand } from './components/Brand';
import { WhatsAppLink } from './components/WhatsAppLink';
import { useReveal } from './components/Reveal';

function Hero() {
  return <section id="inicio" className="hero container" aria-labelledby="hero-title">
    <div className="hero-content">
      <span className="eyebrow hero-label"><span className="status-dot" /> AGÊNCIA DIGITAL</span>
      <h1 id="hero-title"><span className="welcome">Bem-vindo à</span><span className="hero-garso">Garso<span className="title-period">.</span></span></h1>
      <p className="hero-subtitle">Sites profissionais para destacar<br className="desktop-break" /> o seu negócio no digital.</p>
      <p className="hero-description">Design moderno, presença marcante e soluções<br className="desktop-break" /> pensadas para o seu negócio.</p>
      <div className="hero-buttons"><a href="#servicos" className="button button-primary">Conheça nossos serviços<ArrowUpRight size={18} aria-hidden="true" /></a><WhatsAppLink className="button button-glass">Fale conosco</WhatsAppLink></div>
    </div>
    <div className="hero-bottom"><a href="#processo" className="scroll-cue"><span className="scroll-icon"><ArrowDown size={16} aria-hidden="true" /></span> Role para descobrir</a><span className="hero-note">Design com propósito. <span>Presença com personalidade.</span></span></div>
  </section>;
}

function Process() {
  const icons = [Compass, Layers3, Palette, Code2, Check];
  return <section id="processo" className="section container" aria-labelledby="process-title">
    <div className="section-heading split-heading" data-reveal><div><span className="eyebrow"><span className="section-index">01 /</span> COMO TRABALHAMOS</span><h2 id="process-title">Da sua ideia<br />ao seu <span className="muted-title">novo site.</span></h2></div><p>Conheça o processo que transforma sua ideia em uma presença digital profissional.</p></div>
    <div className="process-grid">{processSteps.map((step, index) => {
      const Icon = icons[index];
      return <article key={step.title} className="glass process-card" data-reveal style={{ transitionDelay: `${index * 100}ms` }}>
        <div className="process-card-top"><span className="step-number">0{index + 1}</span><span className="process-icon"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></span></div>
        <h3>{step.title}</h3><p>{step.description}</p>
      </article>;
    })}</div>
    <p className="section-footnote"><span className="small-line" /> Cuidado em cada etapa. Do primeiro contato à entrega.</p>
  </section>;
}

function Services() {
  return <section id="servicos" className="section container" aria-labelledby="services-title">
    <div className="section-heading centered" data-reveal><span className="eyebrow"><span className="section-index">02 /</span> NOSSOS SERVIÇOS</span><h2 id="services-title">Dois tipos de sites.<br /><span className="muted-title">Um mesmo objetivo.</span></h2><p>Soluções pensadas para destacar sua marca no ambiente digital.</p></div>
    <div className="plans-grid">{plans.map(plan => <article key={plan.id} className={`glass plan-card ${plan.id === 'expertSite' ? 'expert-card' : ''}`} data-reveal>
      <div className="plan-top"><span className="eyebrow">{plan.badge}</span><span className="plan-symbol">{plan.id === 'expertSite' ? <ScanLine size={25} aria-hidden="true" /> : <Monitor size={25} aria-hidden="true" />}</span></div>
      <h3>{plan.name}</h3><p className="plan-description">{plan.description}</p>
      <ul className="feature-list">{plan.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" /><span>{feature}</span></li>)}</ul>
      <div className="plan-price"><strong>{plan.price}</strong><span>{plan.priceCaption}</span></div>
      <WhatsAppLink message={plan.id} className={`button ${plan.id === 'expertSite' ? 'button-primary' : 'button-glass'}`}>{plan.cta}</WhatsAppLink>
    </article>)}</div>
    <div className="complementary-intro" data-reveal><span className="eyebrow">ALÉM DO SEU SITE</span><h3>Sua marca também merece<br />se destacar nas redes.</h3></div>
    <div className="extras-grid">
      <article className="glass extra-card" data-reveal><div className="extra-icon"><Layers3 size={25} strokeWidth={1.4} aria-hidden="true" /></div><div><h4>Posts personalizados</h4><p>Artes profissionais e personalizadas para fortalecer a presença visual das marcas nas redes sociais.</p><WhatsAppLink message="posts" className="text-link">Vamos criar seus posts</WhatsAppLink></div></article>
      <article className="glass extra-card" data-reveal><div className="extra-icon"><Play size={25} strokeWidth={1.4} aria-hidden="true" /></div><div><h4>Reels personalizados</h4><p>Conteúdo audiovisual pensado para apresentar produtos, serviços e novidades de maneira atraente.</p><WhatsAppLink message="reels" className="text-link">Vamos conversar sobre Reels</WhatsAppLink></div></article>
    </div>
  </section>;
}

function Projects() {
  return <section id="projetos" className="section container projects-section" aria-labelledby="projects-title">
    <div className="section-heading split-heading" data-reveal><div><span className="eyebrow"><span className="section-index">03 /</span> NOSSOS PROJETOS</span><h2 id="projects-title">Projetos que representam<br /><span className="muted-title">nosso trabalho.</span></h2></div><ArrowDownRight className="heading-arrow" size={54} strokeWidth={1} aria-hidden="true" /></div>
    {projects.length > 0 ? <div className="project-grid">{projects.map(project => <article className="glass project-card" key={project.name} data-reveal>
      <img src={project.image} alt={project.imageAlt} loading="lazy" width="800" height="500" />
      <div className="project-info">{project.demo && <span className="eyebrow">PROJETO DEMONSTRATIVO</span>}<h3>{project.name}</h3><p>{project.description}</p>{project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">Visualizar projeto<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>}</div>
    </article>)}</div> : <div className="glass portfolio-note" data-reveal><span className="portfolio-icon"><MousePointer2 size={29} strokeWidth={1.2} aria-hidden="true" /></span><div><span className="eyebrow">EM BREVE, POR AQUI</span><h3>Um espaço para nossas criações.</h3><p>Estamos preparando a seleção de projetos para esta página.<br />Enquanto isso, vamos conversar sobre o seu?</p></div><WhatsAppLink message="quote" className="button button-glass">Solicitar orçamento</WhatsAppLink></div>}
  </section>;
}

function Contact() {
  return <section id="contato" className="section contact-section container" aria-labelledby="contact-title">
    <div data-reveal><span className="eyebrow"><span className="section-index">04 /</span> VAMOS CONVERSAR</span><h2 id="contact-title">Seu próximo projeto<br /><span className="contact-highlight">começa aqui.<ArrowUpRight aria-hidden="true" /></span></h2><p>Conte sua ideia para a Garso e vamos encontrar<br className="desktop-break" /> a melhor solução para o seu negócio.</p><WhatsAppLink>Conversar pelo WhatsApp</WhatsAppLink><a className="instagram-link" href={site.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={17} aria-hidden="true" />{site.instagramHandle}<span className="sr-only"> (abre em nova aba)</span></a></div>
    <div className="contact-caption"><MessageCircle size={14} aria-hidden="true" /> Uma boa conversa é o começo de tudo.</div>
  </section>;
}

function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-main"><div className="footer-brand"><Brand /><p>Design moderno.<br />Presença marcante.<br />Soluções para o seu negócio.</p></div><div className="footer-column"><h2>Explore</h2>{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div className="footer-column"><h2>O que fazemos</h2><WhatsAppLink message="basicSite" className="footer-link">Site Básico</WhatsAppLink><WhatsAppLink message="expertSite" className="footer-link">Site Expert</WhatsAppLink><WhatsAppLink message="posts" className="footer-link">Posts personalizados</WhatsAppLink><WhatsAppLink message="reels" className="footer-link">Reels personalizados</WhatsAppLink></div><div className="footer-column"><h2>Vamos nos conectar</h2><WhatsAppLink className="footer-link">Fale conosco</WhatsAppLink><a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a><span className="footer-location">Feito para ir além.</span></div></div><div className="footer-bottom"><span>© {site.copyrightYear} Garso Digital. Todos os direitos reservados.</span><a href="#inicio">De volta ao início<ArrowRight className="back-to-top" size={15} aria-hidden="true" /></a></div></div></footer>;
}

export function App() {
  useReveal();
  return <><a className="skip-link" href="#inicio">Pular para o conteúdo</a><main id="conteudo" className="main-shell"><Background /><Header /><Hero /><Process /><Services /><Projects /><Contact /></main><Footer /></>;
}
