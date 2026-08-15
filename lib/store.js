// Leaderboard storage with graceful degradation:
//  • If Vercel KV / Upstash Redis env vars are present  -> shared, persistent board (recommended)
//  • Otherwise                                          -> in-memory board (works instantly, but
//                                                          resets on redeploy / per serverless instance)
// The game client ALSO keeps a localStorage copy, so a score is never lost on the device.

const GAMES = ['phish', 'soc', 'breach'];
const MAX = 10;

// ---- in-memory fallback (module scope) ----
const mem = { phish: [], soc: [], breach: [] };

function sortTrim(list) {
  return list
    .filter((e) => e && typeof e.s === 'number')
    .sort((a, b) => b.s - a.s)
    .slice(0, MAX);
}

function hasKV() {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
      process.env.UPSTASH_REDIS_REST_URL
  );
}

async function kvClient() {
  if (!hasKV()) return null;
  try {
    const mod = await import('@vercel/kv');
    return mod.kv;
  } catch (e) {
    return null;
  }
}

export async function getScores(game) {
  if (!GAMES.includes(game)) return [];
  const kv = await kvClient();
  if (kv) {
    try {
      const board = await kv.get('board:' + game);
      if (Array.isArray(board)) return sortTrim(board);
      return [];
    } catch (e) {
      // fall through to memory
    }
  }
  return sortTrim(mem[game] || []);
}

export async function addScore(game, name, score) {
  if (!GAMES.includes(game)) return [];
  const entry = { n: name, s: score, t: Date.now() };
  const kv = await kvClient();
  if (kv) {
    try {
      const current = (await kv.get('board:' + game)) || [];
      const board = sortTrim(current.concat(entry));
      await kv.set('board:' + game, board);
      return board;
    } catch (e) {
      // fall through to memory
    }
  }
  mem[game] = sortTrim((mem[game] || []).concat(entry));
  return mem[game];
}

export { GAMES };
