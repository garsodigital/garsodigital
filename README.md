# Garso Digital

Site institucional em React, TypeScript e Vite. Não requer backend, banco de dados, cadastro ou credenciais para funcionar.

## Desenvolvimento

Use Node.js 24 e npm. Na pasta do projeto:

```sh
npm ci
npm run dev
```

O servidor de desenvolvimento usa a porta 5173. Para gerar a versão de produção:

```sh
npm run build
npm run preview -- --port 4173
```

O build executa a verificação de tipos antes de gerar `dist/`. O projeto usa caminhos a partir da raiz e deve ser publicado na raiz de um domínio ou subdomínio.

## Testes

Depois do build, execute os testes de navegação e interação em Chromium, em tamanhos de desktop e celular:

```sh
npx playwright install chromium
npm test
```

No ambiente em nuvem, o Chromium já está disponível no sistema:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

Os testes verificam mensagens e número de todos os links de WhatsApp, abertura de uma nova aba com destino interceptado (sem enviar mensagens), menu mobile, Escape, navegação interna e ausência de rolagem horizontal. Para o fundo, verificam reprodução, mudanças nos pixels durante a rolagem, loop, pausa, poster, retomada após bloqueio de autoplay, alternativa MP4 e ativação manual com movimento reduzido. A emulação mobile usa Chromium; não substitui uma validação em aparelhos iOS e Android reais.

## Atualizar informações

- `src/config/whatsapp.ts`: número comercial e mensagens por serviço. Todos os pontos de contato usam `WhatsAppLink`, que aplica a função `getWhatsAppLink`, `target="_blank"` e `rel="noopener noreferrer"`. O envio é confirmado pelo visitante no WhatsApp.
- `src/config/site.ts`: etapas, preços, benefícios, Instagram, materiais de portfólio, logo e caminhos do vídeo/poster.
- `src/components/`: cabeçalho, fundo, identidade e link reutilizável de WhatsApp.
- `src/App.tsx`: composição das seções.
- `src/styles.css`: estilos responsivos e animações, sem dependência de uma biblioteca de movimento.

## Materiais oficiais pendentes

O vídeo enviado pelo usuário foi preparado em dois formatos: `public/media/garso-background.webm` (VP9, cerca de 527 KB) e `public/media/garso-background.mp4` (H.264, cerca de 954 KB, com faststart). Ambos têm 1280 × 720, 24 fps, 8 segundos e nenhuma faixa de áudio. O navegador escolhe um formato compatível. O poster é um quadro extraído do próprio vídeo. O original foi preservado nos anexos do ambiente, fora do site.

O fundo é fixo, compartilhado por todas as seções e recortado pelo conteúdo principal. O rodapé tem fundo sólido e efeito de revelação no desktop. No celular, o rodapé permanece no fluxo normal para evitar problemas com altura e navegação. O vídeo pausa em aba oculta e pode ser pausado pelo visitante. Se o navegador bloquear o autoplay, o vídeo permanece disponível com poster, e a reprodução é tentada novamente após uma interação. O botão “Reproduzir fundo”, no canto inferior esquerdo, permite iniciar ou tentar novamente sem ser encoberto pelo selo da Netlify. Com `prefers-reduced-motion: reduce`, o vídeo só é carregado se o visitante optar explicitamente por reproduzi-lo; as animações de interface continuam desativadas.

Ainda é necessário fornecer:

1. **Logo original**: colocar o arquivo em `public/media/` e definir `site.logo`. Até lá, o nome da agência aparece em texto, sem criar um símbolo substituto.
2. **Portfólio aprovado**: adicionar miniaturas em `public/media/` e entradas em `projects`. Não foram inventados clientes ou resultados. A seção exibe uma mensagem de portfólio em preparação.

Uma referência visual de página foi fornecida posteriormente e orientou os tons de azul, bordas dos cards, ícones e botões arredondados. O hero centralizado e os textos seguem o briefing escrito. A captura de referência não foi usada como imagem estática do site nem como substituto do arquivo original do logotipo.

Exemplo de entrada de portfólio, substituindo os campos pelos dados reais antes de publicar:

```ts
{
  name: 'Nome aprovado do projeto',
  description: 'Descrição aprovada do trabalho.',
  image: '/media/miniatura-aprovada.webp',
  imageAlt: 'Descrição objetiva da imagem',
  demo: true, // false somente quando for um trabalho real
  // url: 'URL real do projeto' — omitir quando não existir
}
```

## Publicação

### Netlify

O arquivo `netlify.toml` já define Node.js 24, build e pasta de publicação. Para publicação contínua, conecte `garsodigital/garsodigital` na Netlify, selecione a branch `main` e use a configuração detectada. A Netlify fará um novo build a cada atualização dessa branch.

Para publicar a versão pronta sem integrar o GitHub, entre em sua conta em https://app.netlify.com/drop e arraste a pasta `dist/` (ou o ZIP de publicação fornecido, conforme a opção de upload disponível). O arquivo `index.html` deve ficar na raiz do upload. O ZIP de código-fonte serve para desenvolvimento; não é o pacote de publicação.

Para permitir publicação direta pela API neste ambiente, configure `NETLIFY_AUTH_TOKEN` com segurança nas configurações de segredos, com destino `api.netlify.com`. Nunca cole o token no chat nem o inclua em arquivos versionados. Sem essa autenticação, o agente consegue gerar e testar os arquivos, mas não criar um site em sua conta.

### Outras hospedagens

O resultado é um site estático. Em uma hospedagem que integra com GitHub (por exemplo, Vercel, Netlify ou Cloudflare Pages), selecione este repositório e configure:

- Instalação: `npm ci`
- Build: `npm run build`
- Diretório de saída: `dist`
- Node.js: `24`

Também é possível enviar o conteúdo de `dist/` para uma hospedagem estática com HTTPS. Não é necessário configurar funções de servidor ou banco de dados. Confira os materiais oficiais pendentes antes da publicação comercial. Depois de obter o domínio definitivo, configure a URL canônica e uma imagem Open Graph aprovada no `index.html`.

Enviar o código ao GitHub não publica a hospedagem por si só: conecte o repositório à Netlify ou faça o upload do build. Mantenha o código-fonte e o lockfile versionados; não versione `node_modules/`, `dist/` nem resultados de testes.
