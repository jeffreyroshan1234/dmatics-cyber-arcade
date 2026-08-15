# DMATICS Cyber Arcade 🕹️

Three 60-second cybersecurity games for the **DMATICS IT Solutions** booth at **GISEC 2026**:

- **Phish Hunter** — spot the phishing email (SOC / awareness)
- **Alert Rush** — triage a live SOC alert queue (SOC)
- **Breach Point** — find the weakest link a pentester would hit (Pentesting)

Full arcade feel (CRT scanlines, neon, chiptune music, confetti), a **shared online leaderboard**, and a per-round **answer review** that explains *why* each answer was right/wrong **and what to do about it**. Fully responsive — phones, Android tablets, touchscreens, laptops and big screens.

---

## Deploy to Vercel from GitHub (5 minutes)

### 1. Put this project on GitHub
```bash
cd gisec-arcade
git init
git add .
git commit -m "DMATICS Cyber Arcade"
git branch -M main
git remote add origin https://github.com/<your-username>/dmatics-cyber-arcade.git
git push -u origin main
```

### 2. Import into Vercel
1. Go to **vercel.com → Add New… → Project**.
2. Pick the GitHub repo you just pushed.
3. Framework preset is auto-detected as **Next.js** — leave everything default.
4. Click **Deploy**. Done — you get a live URL like `dmatics-cyber-arcade.vercel.app`.

The app runs immediately. Out of the box the leaderboard uses in-memory storage (works, but resets on redeploy). To make it a **permanent, shared** leaderboard, add a database in one click:

### 3. (Recommended) Turn on the persistent shared leaderboard
1. In your Vercel project → **Storage** tab → **Create Database** → choose **KV** (Upstash Redis, has a free tier).
2. Connect it to this project. Vercel auto-injects the env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`).
3. **Redeploy** (Deployments → ⋯ → Redeploy). That's it — scores now persist and are shared across **every device** hitting the site.

No code changes needed: the app detects the KV env vars and uses them automatically (`lib/store.js`).

---

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
```
`npm run build && npm start` for a production build. Local dev uses the in-memory leaderboard unless you set the KV env vars in a `.env.local`.

---

## How it works

| Path | What it is |
|------|-----------|
| `app/page.js` | Mounts the arcade full-screen |
| `public/game.html` | The entire arcade (all 3 games, music, review) — self-contained & offline-capable |
| `app/api/scores/route.js` | Leaderboard API — `GET /api/scores?game=phish`, `POST /api/scores` |
| `lib/store.js` | Storage: Vercel KV if configured, else in-memory. Client also keeps a localStorage copy |

The game auto-syncs to the shared board when served over http(s), and falls back to on-device localStorage when opened as a plain file — so the **same `public/game.html`** doubles as an offline kiosk file if you ever need one (AirDrop it to a tablet, "Add to Home Screen").

---

## Booth kiosk tips
- Open the Vercel URL on the tablet → browser share → **Add to Home Screen** → launch fullscreen.
- **Guided Access** (iPad: Settings → Accessibility) or **Screen Pinning** (Android) locks visitors into the arcade.
- Set the display to never sleep, brightness up.
- The in-app **♪ Music** and **🔊 SFX** chips (top-right) toggle audio; **◄ ARCADE** returns to the menu from any game.

---

*Built for DMATICS IT Solutions LLC · SOC · NOC · Pentesting · GISEC 2026*
