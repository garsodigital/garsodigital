import { test, expect } from '@playwright/test';

const messages = {
  contact: 'Olá! Tudo bem? 👋 Conheci a Garso Digital pelo site e gostaria de conversar com vocês!',
  quote: 'Olá! Gostei do trabalho da Garso Digital e gostaria de solicitar um orçamento para meu projeto. Podemos conversar?',
  basicSite: 'Olá! 👋 Vi o Site Básico de R$ 247,90 no site da Garso Digital e tenho interesse em contratar. Gostaria de saber como podemos começar!',
  expertSite: 'Olá! 💙 Conheci o Site Expert da Garso Digital e gostaria de receber um orçamento personalizado para minha empresa. Podemos conversar sobre minha ideia?',
  posts: 'Olá! Tenho interesse na criação de posts personalizados para meu negócio. Gostaria de saber mais sobre o serviço da Garso Digital!',
  reels: 'Olá! Tenho interesse no serviço de Reels da Garso Digital. Podemos conversar sobre meu projeto?',
};

test('all WhatsApp links preserve the official number and exact service messages', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('a[href^="https://wa.me/"]').evaluateAll(elements => elements.map(element => ({
    href: (element as HTMLAnchorElement).href,
    target: element.getAttribute('target'),
    rel: element.getAttribute('rel'),
    text: element.textContent,
  })));
  expect(links.length).toBe(13);
  for (const link of links) {
    const url = new URL(link.href);
    expect(url.origin + url.pathname).toBe('https://wa.me/5544999402880');
    expect(Object.values(messages)).toContain(url.searchParams.get('text'));
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
  }
  const expected = ['basicSite', 'expertSite'] as const;
  for (let index = 0; index < expected.length; index++) {
    const href = await page.locator('.plan-card').nth(index).locator('a').getAttribute('href');
    expect(new URL(href!).searchParams.get('text')).toBe(messages[expected[index]]);
  }
  for (const [index, key] of (['posts', 'reels'] as const).entries()) {
    const href = await page.locator('.extra-card').nth(index).locator('a').getAttribute('href');
    expect(new URL(href!).searchParams.get('text')).toBe(messages[key]);
  }
  const href = await page.locator('.portfolio-note a').getAttribute('href');
  expect(new URL(href!).searchParams.get('text')).toBe(messages.quote);
  for (const link of links.filter(link => /Fale conosco|Conversar pelo WhatsApp/.test(link.text ?? ''))) {
    expect(new URL(link.href).searchParams.get('text')).toBe(messages.contact);
  }
  // Intercept the external destination: verify opening, without sending a message.
  await page.context().route('https://wa.me/**', route => route.fulfill({ status: 200, body: 'WhatsApp destination checked' }));
  await page.locator('.plan-card').first().scrollIntoViewIfNeeded();
  const popupPromise = page.waitForEvent('popup');
  await page.locator('.plan-card').first().getByRole('link').click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(new URL(popup.url()).searchParams.get('text')).toBe(messages.basicSite);
  await popup.close();
});

test('navigation, responsive layout and footer work without browser errors', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bem-vindo à');
  if (testInfo.project.name === 'mobile') {
    const toggle = page.locator('#menu-toggle');
    await expect(toggle).toHaveAccessibleName('Abrir menu');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName('Fechar menu');
    await page.getByRole('navigation').getByRole('link', { name: 'Serviços', exact: true }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page).toHaveURL(/#servicos$/);
    await toggle.click();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  } else {
    await page.getByRole('navigation').getByRole('link', { name: 'Serviços', exact: true }).click();
    await expect(page).toHaveURL(/#servicos$/);
  }
  await expect(page.locator('.plan-card')).toHaveCount(2);
  await expect(page.locator('.plan-card').first()).toContainText('R$ 247,90');
  await expect(page.locator('.expert-card')).toContainText('Sob orçamento');
  await expect(page.locator('.expert-card')).not.toContainText('R$');
  for (const section of ['inicio', 'processo', 'servicos', 'projetos', 'contato']) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(page.locator('footer')).toBeVisible();
  expect(await page.locator('footer').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(8, 11, 18)');
  await expect(page.locator('.portfolio-note')).toContainText('Estamos preparando a seleção');
  for (const anchor of await page.locator('a[href^="#"]').all()) {
    const id = (await anchor.getAttribute('href'))!.slice(1);
    expect(await page.locator(`[id="${id}"]`).count()).toBe(1);
  }
  expect(errors).toEqual([]);
});

test('video plays, pauses and has an available static poster', async ({ page, request }) => {
  await page.goto('/');
  const video = page.locator('video');
  await expect(video).toHaveAttribute('autoplay', '');
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(2);
  expect(await video.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
  expect(await video.evaluate((element: HTMLVideoElement) => element.defaultMuted)).toBe(true);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  const frames = await video.evaluate((element: HTMLVideoElement) => element.getVideoPlaybackQuality().totalVideoFrames);
  await page.locator('#servicos').scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.getVideoPlaybackQuality().totalVideoFrames)).toBeGreaterThan(frames + 3);
  // Check painted pixels too: advancing time alone would miss a frozen compositor.
  const clip = { x: 10, y: 120, width: 120, height: 160 };
  const firstFrame = await page.screenshot({ clip });
  const renderedFrames = await video.evaluate((element: HTMLVideoElement) => element.getVideoPlaybackQuality().totalVideoFrames);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.getVideoPlaybackQuality().totalVideoFrames)).toBeGreaterThan(renderedFrames + 12);
  expect((await page.screenshot({ clip })).equals(firstFrame)).toBe(false);
  await video.evaluate((element: HTMLVideoElement) => { element.currentTime = element.duration - 0.15; });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeLessThan(1);
  await page.getByRole('button', { name: 'Pausar fundo animado' }).click();
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.getByRole('button', { name: 'Reproduzir fundo animado' }).click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  const poster = await request.get('/media/garso-poster.jpg');
  expect(poster.ok()).toBe(true);
  expect(poster.headers()['content-type']).toContain('image/jpeg');
});

test('reduced motion skips video download and keeps all content accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const mediaRequests: string[] = [];
  page.on('request', request => { if (/\.(mp4|webm)$/.test(request.url())) mediaRequests.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('video source')).toHaveCount(0);
  await expect(page.locator('video')).toHaveAttribute('preload', 'none');
  await expect(page.locator('.reveal-pending')).toHaveCount(0);
  for (const heading of await page.locator('h2').all()) await expect(heading).toBeVisible();
  expect(mediaRequests).toEqual([]);
  await page.getByRole('button', { name: 'Reproduzir fundo animado' }).click();
  await expect.poll(() => page.locator('video').evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: 'Pausar fundo animado' })).toBeVisible();
});

test('autoplay denial keeps the video available and a click starts it', async ({ page }) => {
  await page.addInitScript(() => {
    const originalPlay = HTMLMediaElement.prototype.play;
    let userInteracted = false;
    window.addEventListener('pointerdown', () => { userInteracted = true; }, { capture: true });
    HTMLMediaElement.prototype.play = function () {
      if (!userInteracted) {
        this.autoplay = false;
        this.pause();
        return Promise.reject(new DOMException('Autoplay blocked by browser policy', 'NotAllowedError'));
      }
      return originalPlay.call(this);
    };
  });
  await page.goto('/');
  await expect(page.locator('video')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Reproduzir fundo animado' })).toBeVisible();
  await page.getByRole('button', { name: 'Reproduzir fundo animado' }).click();
  await expect.poll(() => page.locator('video').evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: 'Pausar fundo animado' })).toBeVisible();
});

test('an ordinary page interaction retries blocked autoplay', async ({ page }) => {
  await page.addInitScript(() => {
    const originalPlay = HTMLMediaElement.prototype.play;
    let userInteracted = false;
    window.addEventListener('pointerdown', () => { userInteracted = true; }, { capture: true });
    HTMLMediaElement.prototype.play = function () {
      if (!userInteracted) {
        this.autoplay = false;
        this.pause();
        return Promise.reject(new DOMException('Autoplay blocked by browser policy', 'NotAllowedError'));
      }
      return originalPlay.call(this);
    };
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Reproduzir fundo animado' })).toBeVisible();
  await page.getByRole('heading', { level: 1 }).click();
  await expect.poll(() => page.locator('video').evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
});

test('MP4 plays if the browser cannot load the WebM source', async ({ page }) => {
  await page.route('**/media/garso-background.webm', route => route.fulfill({ status: 404, body: 'Not found' }));
  await page.goto('/');
  const video = page.locator('video');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((element: HTMLVideoElement) => element.currentSrc)).toMatch(/\.mp4$/);
});
