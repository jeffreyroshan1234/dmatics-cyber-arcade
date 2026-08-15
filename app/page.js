// The arcade UI (all three games, music, review) is a self-contained, offline-capable
// document in /public/game.html. We mount it full-bleed. Because it is served over
// http(s) and same-origin with the API routes below, its leaderboard auto-syncs to
// the shared server board via /api/scores. Opened as a local file it falls back to
// on-device localStorage — so the exact same file works online AND offline at the booth.
export default function Page() {
  return (
    <iframe
      src="/game.html"
      title="DMATICS Cyber Arcade"
      allow="autoplay; fullscreen"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
        background: '#0a0713',
      }}
    />
  );
}
