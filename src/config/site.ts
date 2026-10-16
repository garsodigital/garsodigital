export const site = {
  name: 'Garso Digital',
  instagram: 'https://www.instagram.com/garsodigital/',
  instagramHandle: '@garsodigital',
  copyrightYear: 2026,
  // Add the supplied original logo to public/media and set its path here.
  logo: null as string | null,
  backgroundVideo: '/media/garso-background.mp4',
  backgroundPoster: '/media/garso-poster.jpg',
};

export const navigation = [
  { label: 'Início', href: '#inicio' },
  { label: 'Como trabalhamos', href: '#processo' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
];

export const processSteps = [
  { title: 'Analisamos seu negócio', description: 'Entendemos sua marca, seus produtos, serviços e objetivos para identificar a melhor direção para o projeto.' },
  { title: 'Planejamos a estrutura', description: 'Organizamos o conteúdo, as informações e os elementos essenciais para criar uma experiência clara e intuitiva.' },
  { title: 'Criamos o design', description: 'Desenvolvemos uma identidade visual para o site, alinhada com a personalidade e as necessidades do negócio.' },
  { title: 'Desenvolvemos e ajustamos', description: 'Transformamos o planejamento em um site funcional, responsivo e preparado para diferentes dispositivos.' },
  { title: 'Revisamos e entregamos', description: 'Apresentamos o resultado, realizamos os ajustes combinados e preparamos a entrega final.' },
];

export const plans = [
  {
    id: 'basicSite', badge: 'IDEAL PARA COMEÇAR', name: 'Site Básico',
    description: 'Uma presença digital profissional, moderna e objetiva para o seu negócio.',
    features: ['Design moderno e responsivo.', 'Apresentação de produtos ou serviços.', 'Informações essenciais do negócio.', 'Botão de contato pelo WhatsApp.', 'Visual adaptado para celular e computador.'],
    price: 'R$ 247,90', priceCaption: 'Seu primeiro passo no digital.', cta: 'Quero meu Site Básico',
  },
  {
    id: 'expertSite', badge: 'MAIS COMPLETO', name: 'Site Expert',
    description: 'Uma experiência digital mais personalizada para negócios que querem se destacar.',
    features: ['Design exclusivo e mais elaborado.', 'Animações e elementos interativos.', 'Mais seções e possibilidades de personalização.', 'Funcionalidades definidas conforme o projeto.', 'Experiência responsiva e visual premium.'],
    price: 'Sob orçamento', priceCaption: 'Um projeto com a sua personalidade.', cta: 'Solicitar orçamento',
  },
] as const;

export type Project = { name: string; description: string; image: string; imageAlt: string; demo: boolean; url?: string };
// Publish only approved portfolio assets. Mark fictitious work with demo: true.
export const projects: Project[] = [];
