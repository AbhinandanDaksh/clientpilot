const { chromium } = require('D:/office/tool/server/node_modules/playwright-core');
const path = require('path');
const os = require('os');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    for (const route of ['lead-hunter', 'agent-activity']) {
      for (const width of [320, 375, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`http://localhost:3000/${route}`, { waitUntil: 'networkidle' });
        const result = await page.evaluate(() => ({
          viewport: innerWidth,
          document: document.documentElement.scrollWidth,
          cards: [...document.querySelectorAll('main ul[aria-label]')].filter(el => el.getBoundingClientRect().height > 0).map(el => el.getAttribute('aria-label')),
          overflow: [...document.querySelectorAll('main *')].filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.right > innerWidth + 1 && !el.closest('dialog') && !el.closest('table');
          }).slice(0, 6).map(el => ({ tag: el.tagName, class: el.className })),
        }));
        console.log(JSON.stringify({ route, width, ...result }));
        if (result.document > width + 1) throw Error(`${route} overflows at ${width}px`);
        if (width === 375) await page.screenshot({ path: path.join(os.tmpdir(), `${route}-mobile.png`), fullPage: true });
      }
    }
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('http://localhost:3000/lead-hunter', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await page.getByLabel('Location', { exact: true }).selectOption('Modinagar');
    await page.getByRole('button', { name: 'View details for Bloom Dental Studio', exact: true }).click();
    await page.getByRole('button', { name: 'Close lead details' }).click();
    await page.getByRole('combobox', { name: 'Lead status', exact: true }).first().selectOption('Contacted');
    await page.getByRole('searchbox', { name: 'Search leads' }).fill('does not exist');
    await page.getByText('No leads match your search.', { exact: false }).waitFor();
    await page.goto('http://localhost:3000/agent-activity', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Preview run', exact: true }).first().click();
    await page.getByRole('button', { name: 'Pause Lead Hunter', exact: true }).click();
    if (!await page.getByRole('button', { name: 'Preview run', exact: true }).first().isDisabled()) throw Error('Pause failed');
    await page.getByRole('button', { name: 'View details', exact: true }).first().click();
    await page.getByRole('button', { name: 'Close run details' }).click();
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await page.getByRole('searchbox', { name: 'Search activity' }).fill('does not exist');
    await page.getByText('No runs match these filters.', { exact: true }).waitFor();
    console.log('Mobile interactions passed for both pages.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
