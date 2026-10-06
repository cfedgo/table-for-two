import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import vm from 'node:vm';

const dist = new URL('../dist/', import.meta.url);

test('website references resolve under a GitHub Pages repository path', async () => {
  const html = await readFile(new URL('index.html', dist), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('manifest.webmanifest', dist), 'utf8'));
  const base = 'https://example.github.io/table-for-two/';
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  references.push(...manifest.icons.map(icon => icon.src), manifest.start_url, manifest.scope);
  for (const ref of references) {
    const url = new URL(ref, base);
    assert.ok(url.href.startsWith(base), `Must stay inside repository path: ${ref}`);
    const filename = ref === './' ? 'index.html' : ref;
    assert.ok((await stat(new URL(filename, dist))).isFile(), `Missing asset: ${filename}`);
  }
});

test('offline cache serves a repository URL and preserves other apps on the same origin', async () => {
  const source = await readFile(new URL('sw.js', dist), 'utf8');
  const listeners = {};
  const entries = new Map();
  const pending = [];
  const removed = [];
  let offline = false;
  let activeCache;
  const scope = 'https://example.github.io/table-for-two/';
  const prefix = 'table-for-two-' + encodeURIComponent('/table-for-two/') + '-';
  const otherApp = 'table-for-two-' + encodeURIComponent('/another-game/') + '-v1';
  vm.runInNewContext(source, {
    URL, Request,
    self: {
      registration: { scope },
      clients: { claim: async () => {} },
      addEventListener: (type, callback) => listeners[type] = callback,
    },
    caches: {
      open: async name => {
        activeCache = name;
        return { put: async (key, value) => entries.set(key, value), match: async key => entries.get(key) };
      },
      keys: async () => [activeCache, prefix + 'old-version', otherApp],
      delete: async name => removed.push(name),
    },
    fetch: async request => {
      if (offline) throw Error('Network unavailable');
      const url = typeof request === 'string' ? request : request.url;
      assert.ok(url.startsWith(scope));
      return { ok: true, redirected: false, url };
    },
  });
  const event = { waitUntil: promise => pending.push(promise) };
  listeners.install(event);
  await Promise.all(pending);
  for (const asset of entries.keys()) {
    const relative = asset.slice(scope.length) || 'index.html';
    assert.ok((await stat(new URL(relative, dist))).isFile());
  }
  listeners.activate(event);
  await Promise.all(pending);
  assert.deepEqual(removed, [prefix + 'old-version']);
  offline = true;
  let response;
  listeners.fetch({ request: { method: 'GET', url: scope }, respondWith: promise => response = promise });
  assert.equal((await response).url, scope);
  response = undefined;
  listeners.fetch({ request: { method: 'GET', url: 'https://example.github.io/another-game/' }, respondWith: promise => response = promise });
  assert.equal(response, undefined);
});
