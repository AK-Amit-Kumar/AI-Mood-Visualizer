# Day 5 : Polish, Deployment, and Live URL

**Project :** AI Mood Visualizer
**Date :** Day 5 of 5
**Status : COMPLETE**

---

## Live URL

**https://ai-mood-visualizer.vercel.app**

---

## Output

![day5-output](aimoodvisualizer-day5.gif)

---

## What Was Built

- FogExp2 added to Three.js scene for exponential depth effect
- OrbitControls autoRotate enabled for slow automatic camera orbit
- CSS opacity transition added to mood label for smooth fade between mood names
- setTimeout used to synchronize text change with fade out duration
- Vercel account connected to GitHub repository
- GEMINI_API_KEY added as environment variable in Vercel project settings
- Production deployment triggered via empty git commit and push
- Full pipeline tested and confirmed working on live URL

---

## Final Project Structure

```
ai-mood-visualizer/
  api/
    analyze.js          (Vercel serverless function : Gemini API proxy)
  src/
    main.js             (Three.js, particles, animation, mood system, API fetch)
    style.css           (CSS reset, canvas, UI overlay, transitions)
  index.html            (entry point, textarea, button, status, mood label)
  .env                  (GEMINI_API_KEY : gitignored, local only)
  .vercel               (Vercel project config : gitignored)
  package.json
  .gitignore
  notes/                (day-01 through day-05 revision notes)
```

---

## What Changed Today

**src/main.js** : Three additions. First, `scene.fog = new THREE.FogExp2(0x000000, 0.08)` added right after scene creation for depth fog. Second, `controls.autoRotate = true` and `controls.autoRotateSpeed = 0.5` added after OrbitControls setup for automatic camera orbit. Third, the `moodLabel.textContent` line in `applyMood()` replaced with a fade sequence : set opacity to 0, wait 400ms via setTimeout, update text, set opacity to 1.

**src/style.css** : `transition: opacity 0.4s ease` added to `#moodLabel` to enable the CSS fade animation.

---

## Core Concepts

**FogExp2** : Exponential fog that gets denser with distance. Color matches background so distant particles fade invisibly rather than showing a colored haze. Density 0.08 is subtle. More natural looking than linear `THREE.Fog` for particle clouds.

**autoRotate** : OrbitControls property that orbits the camera automatically each frame. Requires `controls.update()` in the animate loop which was already there. User drag overrides it temporarily.

**CSS opacity transition with setTimeout** : Setting opacity to 0 triggers the CSS fade out. setTimeout waits for it to complete before changing the text and setting opacity back to 1. The timeout duration must match the CSS transition duration exactly.

**Vercel deployment** : GitHub push triggers automatic build and deployment. Static files served from global CDN. Serverless function deployed with GEMINI_API_KEY injected from Vercel environment variables at runtime. Free Hobby plan with no time limit.

---

## How Vercel Deployment Works

```
git push to main branch
  --> Vercel detects new commit via GitHub webhook
  --> Vercel pulls latest code
  --> vite build runs : produces dist/ folder
  --> dist/ deployed to global CDN as static files
  --> api/analyze.js deployed as serverless function
  --> GEMINI_API_KEY injected from Vercel environment vault
  --> Live URL serves static files and routes /api/analyze to function
```

---

## Deployment Steps Reference

| Step | Action                                                                  |
| ---- | ----------------------------------------------------------------------- |
| 1    | Vercel CLI installed : `npm install -g vercel`                          |
| 2    | `vercel dev` used locally for full pipeline testing                     |
| 3    | GitHub repo connected in Vercel project Settings : Git                  |
| 4    | GEMINI_API_KEY added in Vercel project Settings : Environment Variables |
| 5    | Empty commit pushed to trigger first production deployment              |
| 6    | Live URL tested and confirmed working end to end                        |

---

## Commands Reference

```bash
# Run locally with serverless functions
vercel dev

# Trigger deployment (any push to main works)
git add .
git commit -m "Day 5: polish and deployment"
git push

# Trigger deployment with no code changes
git commit --allow-empty -m "Trigger Vercel deployment"
git push
```

---

## 5 Day Project Summary

| Day   | What Was Built                                                                  |
| ----- | ------------------------------------------------------------------------------- |
| Day 1 | Vite setup, Three.js scene, camera, renderer, 2000 round particles, render loop |
| Day 2 | Floating animation, OrbitControls, performance.now() timer, needsUpdate         |
| Day 3 | 6 mood presets, lerp transitions, currentState and targetState, UI dropdown     |
| Day 4 | Gemini API via Vercel serverless function, full AI pipeline, loading state      |
| Day 5 | FogExp2, autoRotate, CSS transitions, Vercel deployment, live URL               |

---

**Project complete. Live at https://ai-mood-visualizer.vercel.app**
