import { getScores, addScore, GAMES } from '../../../lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clean(name) {
  const s = String(name || 'AAA')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 3);
  return s || 'AAA';
}

// GET /api/scores?game=phish  ->  { game, scores:[{n,s,t}] }
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game');
  if (!GAMES.includes(game)) {
    return Response.json({ error: 'unknown game' }, { status: 400 });
  }
  const scores = await getScores(game);
  return Response.json(
    { game, scores },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

// POST /api/scores  { game, name, score }  ->  { game, scores }
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return Response.json({ error: 'bad json' }, { status: 400 });
  }
  const game = body.game;
  if (!GAMES.includes(game)) {
    return Response.json({ error: 'unknown game' }, { status: 400 });
  }
  const name = clean(body.name);
  let score = parseInt(body.score, 10);
  if (!Number.isFinite(score)) score = 0;
  score = Math.max(0, Math.min(100000, score));
  const scores = await addScore(game, name, score);
  return Response.json(
    { game, scores },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
