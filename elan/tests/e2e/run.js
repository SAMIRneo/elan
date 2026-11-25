/* Tests navigateur Élan — Playwright, viewport téléphone 380x800.
   Lancement : node tests/e2e/run.js
   Utilise Edge (canal msedge) ; aucune dépendance à installer dans le projet. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

let pw;
try { pw = require('playwright'); }
catch { pw = require('C:/Users/samir/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright'); }
const { chromium } = pw;

const ROOT = path.resolve(__dirname, '../..');
const ART = path.join(__dirname, 'artifacts');
fs.mkdirSync(ART, { recursive: true });

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.md': 'text/plain' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.join(ROOT, url === '/' ? 'index.html' : url.replace(/^\//, ''));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
});

const results = [];
let browser, base;

async function scenario(name, fn) {
  const ctx = await browser.newContext({ viewport: { width: 380, height: 800 }, deviceScaleFactor: 1, serviceWorkers: 'block', locale: 'fr-FR' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const rec = { name, checks: [], errors, screenshots: [] };
  const check = async (label, fn2) => {
    try { const detail = await fn2(); rec.checks.push({ label, ok: true, detail }); }
    catch (e) { rec.checks.push({ label, ok: false, detail: String(e.message) }); }
  };
  const shot = async file => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1400); /* laisse le toast se retirer */
    const p = path.join(ART, file);
    await page.screenshot({ path: p, fullPage: true });
    rec.screenshots.push(file);
  };
  try {
    await fn({ page, ctx, check, shot });
    await check('aucune erreur console', () => assert.strictEqual(errors.length, 0, errors.join(' | ')));
    const overflow = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      win: window.innerWidth,
      wide: [...document.querySelectorAll('body *')].filter(el => {
        const r = el.getBoundingClientRect();
        if (!(r.width > 0 && r.right > window.innerWidth + 1)) return false;
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const ox = getComputedStyle(p).overflowX;
          if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return false;
        }
        return true;
      }).slice(0, 6).map(el => el.tagName + '.' + String(el.className).slice(0, 40) + ' :: ' + el.outerHTML.slice(0, 100))
    }));
    await check('aucun débordement horizontal', () => assert.ok(overflow.doc <= overflow.win + 1 && overflow.wide.length === 0, JSON.stringify(overflow)));
  } catch (e) {
    rec.checks.push({ label: 'scénario', ok: false, detail: String(e.stack || e.message) });
  }
  results.push(rec);
  await ctx.close();
}

const DATA = key => `JSON.parse(localStorage.getItem('el-v1:${key}'))`;
async function seed(page, id, extra) {
  await page.goto(base);
  await page.evaluate(({ id, extra }) => {
    localStorage.clear();
    localStorage.setItem('sg-accounts', JSON.stringify([{ id, nom: 'Test' }]));
    localStorage.setItem('sg-current', id);
    if (extra) localStorage.setItem('el-v1:' + id, JSON.stringify(extra));
  }, { id, extra: extra || null });
  await page.reload();
  await page.waitForSelector('#view');
}
async function goNav(page, view) { await page.locator(`#nav [data-go="${view}"]`).click(); }
async function addExo(page, query, name) {
  await page.locator('[data-act="wadd"]').click();
  await page.locator('#ex-search').fill(query);
  const items = page.locator('[data-act="pick-exo"]');
  if (name) await items.filter({ hasText: name }).first().click();
  else await items.first().click();
}

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}/index.html`;
  browser = await chromium.launch({ channel: 'msedge', headless: true });

  /* 1 — Migration v4 → v5, une seule fois, avec sauvegarde */
  await scenario('1. Migration des anciennes données', async ({ page, check, shot }) => {
    const old = {
      v: 4, created: '2026-11-01',
      profile: { prenom: 'Sam', sexe: 'homme', age: 30, taille: 180, poids: 80, objectif: 'Progresser', rythme: { muscu: 3, cardio: 2 }, photo: '', photos: [] },
      activities: [{ id: 'old1', date: '2026-11-20', type: 'muscu', program: 'Pull', exos: [{ id: 'tirage-lat', nom: 'Tirage latéral', kg: '40', reps: '12', series: '3', note: '' }], duree: 45, avis: 0, note: '', mids: [], rids: [] }],
      measurements: [{ id: 'm1', date: '2026-11-20', sport: 'muscu', exo: 'Tirage latéral', mesure: 'kg', valeur: 40 }],
      records: [], weights: [], customExos: [], programs: [], moods: {}, challenges: {}, gemLog: [], gems: 0
    };
    await seed(page, 'mig', old);
    const state = await page.evaluate(() => ({
      backup: localStorage.getItem('el-v4-backup:mig'),
      d: JSON.parse(localStorage.getItem('el-v1:mig'))
    }));
    await check('sauvegarde v4 conservée avant conversion', () => { assert.ok(state.backup); assert.strictEqual(JSON.parse(state.backup).v, 4); });
    await check('données passées en v5 avec trace de migration', () => { assert.strictEqual(state.d.v, 5); assert.strictEqual(state.d.mig.from, 4); });
    await check('ancien exo converti en une seule série, sans perte', () => {
      const e = state.d.activities[0].exos[0];
      assert.deepStrictEqual(e.sets, [{ kg: '40', reps: '12' }]);
      assert.strictEqual(e.series, '3');
    });
    await goNav(page, 'muscu');
    await page.locator('[data-sub="muscu"][data-v="hist"]').click();
    const hist = await page.locator('#view').innerText();
    await check('historique : « 12 × 40 kg »', () => assert.ok(hist.includes('12 × 40 kg'), hist.slice(0, 400)));
    const backup1 = state.backup;
    await page.reload();
    const backup2 = await page.evaluate(() => localStorage.getItem('el-v4-backup:mig'));
    await check('migration exécutée une seule fois', () => assert.strictEqual(backup2, backup1));
    await shot('01-migration.png');
  });

  /* 2 — Bibliothèque complète : recherche, filtre, ajout en séance */
  await scenario('2. Bibliothèque — recherche, filtre, ajout', async ({ page, check, shot }) => {
    await seed(page, 'lib');
    await page.locator('[data-act="more"]').click();
    await page.locator('#sheet [data-go="exos"]').click();
    await page.locator('#ex-cat-search').fill('Tirage horizontal');
    let names = await page.locator('#exo-catalog-list .nm').allInnerTexts();
    await check('« Tirage horizontal » présent', () => assert.ok(names.some(n => n.includes('Tirage horizontal (poulie basse)')), names.join(' / ')));
    await page.locator('#ex-cat-search').fill('traction');
    names = await page.locator('#exo-catalog-list .nm').allInnerTexts();
    await check('« traction » présent', () => assert.ok(names.some(n => n.includes('Tractions (pronation)')), names.join(' / ')));
    await page.locator('#ex-cat-search').fill('');
    await page.locator('[data-act="exgrp"][data-v="Pectoraux"]').click();
    const grp = await page.locator('#exo-catalog-list .tiny.muted').allInnerTexts();
    await check('filtre Pectoraux : uniquement ce groupe', () => assert.ok(grp.length && grp.every(g => g === 'Pectoraux'), grp.join(' / ')));
    await shot('02-bibliotheque.png');
    await goNav(page, 'muscu');
    await page.locator('[data-act="wreset"]').click();
    await addExo(page, 'Tirage horizontal', 'Tirage horizontal (poulie basse)');
    await addExo(page, 'traction', 'Tractions (pronation)');
    const names2 = await page.locator('.exo-head .nm').allInnerTexts();
    await check('les deux exercices s’ajoutent à la séance', () => {
      assert.ok(names2.some(n => n.includes('Tirage horizontal')));
      assert.ok(names2.some(n => n.includes('Tractions (pronation)')));
    });
    await shot('02-seance-ajout.png');
  });

  /* 3 — Exercice personnalisé créé puis réutilisé */
  await scenario('3. Exercice personnalisé', async ({ page, check, shot }) => {
    await seed(page, 'perso');
    await page.locator('[data-act="more"]').click();
    await page.locator('#sheet [data-go="exos"]').click();
    await page.locator('[data-act="exnew"]').click();
    await page.locator('#xe-nom').fill('Traction assistée élastique');
    await page.locator('#xe-grp').fill('Dos');
    await page.locator('[data-act="saveExo"]').click();
    await page.locator('[data-sub="excat"][data-v="custom"]').click();
    const custom = await page.locator('#exo-catalog-list').innerText();
    await check('exercice perso enregistré', () => assert.ok(custom.includes('Traction assistée élastique') && custom.includes('Dos'), custom));
    await shot('03-exo-perso.png');
    await goNav(page, 'muscu');
    await page.locator('[data-act="wreset"]').click();
    await addExo(page, 'Traction assistée', 'Traction assistée élastique');
    const inSession = await page.locator('.exo-head .nm').allInnerTexts();
    await check('exercice perso présent dans la séance', () => assert.ok(inSession.some(n => n.includes('Traction assistée élastique'))));
    await page.reload();
    await goNav(page, 'muscu');
    await page.locator('[data-act="wreset"]').click();
    await addExo(page, 'Traction assistée', 'Traction assistée élastique');
    const reused = await page.locator('.exo-head .nm').allInnerTexts();
    await check('exercice perso réutilisé après rechargement', () => assert.ok(reused.some(n => n.includes('Traction assistée élastique'))));
    await shot('03-reutilisation.png');
  });

  /* 4 — 3 séries, modification, suppression, puis stats/historique/reload */
  await scenario('4. Séries multiples + stats + persistance', async ({ page, check, shot }) => {
    await seed(page, 'sets');
    await page.evaluate(() => {
      const key = 'el-v1:sets', d = JSON.parse(localStorage.getItem(key));
      d.activities.push({ id: 'prior', date: '2026-11-20', type: 'muscu', program: 'Pull', exos: [{ id: 'tirage-lat', nom: 'Tirage vertical (prise large)', sets: [{ kg: '30', reps: '8' }], note: '' }], duree: 30, avis: 0, note: '', mids: ['pm1'], rids: [] });
      d.measurements.push({ id: 'pm1', date: '2026-11-20', sport: 'muscu', exo: 'Tirage vertical (prise large)', mesure: 'kg', valeur: 30 });
      d.measurements.push({ id: 'pm2', date: '2026-11-20', sport: 'muscu', exo: 'Tirage vertical (prise large)', mesure: 'répétitions', valeur: 8 });
      localStorage.setItem(key, JSON.stringify(d));
    });
    await page.reload();
    await goNav(page, 'muscu');
    await page.locator('[data-act="wreset"]').click();
    await addExo(page, 'Tirage vertical', 'Tirage vertical (prise large)');
    const kg = i => page.locator(`[data-wset="0"][data-s="${i}"][data-k="kg"]`);
    const reps = i => page.locator(`[data-wset="0"][data-s="${i}"][data-k="reps"]`);
    await kg(0).fill('45'); await reps(0).fill('10');
    await page.locator('[data-act="wsetadd"]').first().click();
    let pre = await kg(1).inputValue(); let preR = await reps(1).inputValue();
    await check('pré-remplissage 45 / 10', () => { assert.strictEqual(pre, '45'); assert.strictEqual(preR, '10'); });
    await kg(1).fill('55'); await reps(1).fill('10');
    await page.locator('[data-act="wsetadd"]').first().click();
    pre = await kg(2).inputValue(); preR = await reps(2).inputValue();
    await check('pré-remplissage 55 / 10', () => { assert.strictEqual(pre, '55'); assert.strictEqual(preR, '10'); });
    await kg(2).fill('59'); await reps(2).fill('6');
    await check('3 séries saisies', async () => assert.strictEqual(await page.locator('.set-num').count(), 3));
    await shot('04-tirage-3-series.png');
    /* modification puis suppression */
    await kg(1).fill('56'); await reps(1).fill('8');
    await page.locator('[data-act="wsetdel"][data-s="2"]').click();
    await check('série supprimée : 2 séries restantes', async () => assert.strictEqual(await page.locator('.set-num').count(), 2));
    const remain = await Promise.all([kg(0).inputValue(), reps(0).inputValue(), kg(1).inputValue(), reps(1).inputValue()]);
    await check('modification conservée (45×10, 56×8)', () => assert.deepStrictEqual(remain, ['45', '10', '56', '8']));
    await shot('04-apres-modification.png');
    await page.locator('#w-duree').fill('45');
    await page.locator('[data-act="wsave"]').click();
    const d = await page.evaluate(() => JSON.parse(localStorage.getItem('el-v1:sets')));
    const last = d.activities[d.activities.length - 1];
    await check('séance sauvegardée avec ses séries', () => assert.deepStrictEqual(last.exos[0].sets, [{ kg: '45', reps: '10' }, { kg: '56', reps: '8' }]));
    await check('streak pris en compte', () => assert.ok(d.streak.best >= 1));
    await check('records toutes séries (2 kg + 1 reps)', () => assert.strictEqual(d.records.length, 3));
    await check('badges volume + records débloqués', () => { assert.ok(d.badges.includes('muscu-v1')); assert.ok(d.badges.includes('muscu-r1')); });
    await goNav(page, 'muscu');
    await page.locator('[data-sub="muscu"][data-v="hist"]').click();
    const hist = await page.locator('#view').innerText();
    await check('historique affiche « 10 × 45 kg · 8 × 56 kg »', () => assert.ok(hist.includes('10 × 45 kg · 8 × 56 kg'), hist.slice(0, 500)));
    await shot('04-historique.png');
    await goNav(page, 'progres');
    const stats = await page.locator('#view').innerText();
    await check('volume total = 1138 kg (toutes séries)', () => assert.ok(stats.includes('1 138') || stats.includes('1138'), stats.slice(0, 400)));
    await check('poids max 59 non retenu (série supprimée), max = 56', () => assert.ok(stats.includes('56'), stats.slice(0, 400)));
    await shot('05-progres-stats.png');
    const before = await page.evaluate(() => localStorage.getItem('el-v1:sets'));
    await page.reload();
    const after = await page.evaluate(() => localStorage.getItem('el-v1:sets'));
    await check('rechargement : données conservées (séries, mesures, records, badges)', () => {
      const a = JSON.parse(before), b = JSON.parse(after);
      assert.strictEqual(b.v, 5);
      assert.deepStrictEqual(b.activities.map(x => (x.exos || []).map(e => e.sets)), a.activities.map(x => (x.exos || []).map(e => e.sets)));
      assert.deepStrictEqual(b.measurements.map(m => [m.exo, m.mesure, m.valeur]), a.measurements.map(m => [m.exo, m.mesure, m.valeur]));
      assert.deepStrictEqual(b.records.map(r => [r.exo, r.mesure, r.valeur]), a.records.map(r => [r.exo, r.mesure, r.valeur]));
      assert.deepStrictEqual(b.badges, a.badges);
      assert.deepStrictEqual(b.streak, a.streak);
    });
    await shot('06-apres-reload.png');
  });

  /* 5 — Poids décimaux français (ex. 22,5) */
  await scenario('5. Poids décimal 22,5', async ({ page, check, shot }) => {
    await seed(page, 'dec');
    await goNav(page, 'muscu');
    await page.locator('[data-act="wprog"][data-id="libre"]').click();
    await addExo(page, 'Développé couché (barre)', 'Développé couché (barre)');
    await page.locator('[data-wset="0"][data-s="0"][data-k="kg"]').fill('22,5');
    await page.locator('[data-wset="0"][data-s="0"][data-k="reps"]').fill('12');
    await page.locator('[data-act="wsave"]').click();
    const d = await page.evaluate(() => JSON.parse(localStorage.getItem('el-v1:dec')));
    await check('22,5 kg enregistré comme 22.5', () => assert.strictEqual(d.measurements.find(m => m.mesure === 'kg').valeur, 22.5));
    await check('volume = 22,5 × 12 = 270 kg', async () => assert.strictEqual(await page.evaluate(() => volumeKg()), 270));
    await shot('07-decimales.png');
  });

  for (const r of results) {
    console.log('\n=== ' + r.name + ' ===');
    r.checks.forEach(c => console.log((c.ok ? '  OK   ' : '  FAIL ') + c.label + (c.ok ? '' : ' :: ' + c.detail)));
    if (r.screenshots.length) console.log('  captures : ' + r.screenshots.join(', '));
  }
  const failed = results.flatMap(r => r.checks).filter(c => !c.ok);
  console.log(`\nTOTAL : ${results.flatMap(r => r.checks).length - failed.length}/${results.flatMap(r => r.checks).length} OK`);
  await browser.close();
  server.close();
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error(e); server.close(); process.exit(1); });
