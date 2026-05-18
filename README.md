# AI Mood Visualizer

> Type how you feel. Watch the universe respond.

<img width="1893" height="887" alt="compressed-gif-aimood-gif" src="https://github.com/user-attachments/assets/6b1f110d-56db-43a8-96ba-63b41542cf08" />

## Live Demo

**[ai-mood-visualizer.vercel.app](https://ai-mood-visualizer.vercel.app)**


## What It Does

You type how you are feeling into a text box. The Gemini AI analyzes the emotion and returns a mood label and an intensity score. A Three.js particle system then smoothly transitions its color, speed, spread, and size to visually represent that emotion in real time.

Six moods are supported : **happy**, **sad**, **angry**, **calm**, **anxious**, and **excited**. Each has a distinct visual signature. A strongly expressed emotion produces a more dramatic visual response than a mildly expressed one, because the AI returns an intensity score between 0 and 1 that scales the effect.


## Preview

| Mood | Color | Feel |
|---|---|---|
| Calm | Teal | Slow, gentle drift |
| Happy | Gold | Medium speed, wide spread |
| Sad | Blue | Very slow, tight cluster |
| Angry | Red | Fast, wide, large particles |
| Anxious | Coral | Fast, jittery |
| Excited | Purple | Very fast, wide spread |


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + Vanilla JavaScript |
| 3D Rendering | Three.js |
| AI | Google Gemini 2.5 Flash API |
| Backend | Vercel Serverless Functions |
| Deployment | Vercel |


## How It Works

```
User types text
  --> Browser sends text to /api/analyze (Vercel serverless function)
  --> Serverless function calls Gemini API with API key from server environment
  --> Gemini returns { mood: "happy", intensity: 0.8 }
  --> Browser receives mood and intensity
  --> Mood preset looked up : color, speed, spread, size
  --> Values scaled by intensity : stronger emotion = more dramatic effect
  --> currentState lerps toward targetState over ~60 frames
  --> Three.js particle system smoothly transitions
```

The API key never touches the browser. It lives only in Vercel's secure environment and is injected into the serverless function at runtime.


## Architecture

```
ai-mood-visualizer/
  api/
    analyze.js       Vercel serverless function : Gemini API proxy
  src/
    main.js          Three.js scene, particles, animation, mood system
    style.css        UI overlay and transitions
  index.html         Entry point
  .env               GEMINI_API_KEY (local only, gitignored)
```


## Key Technical Concepts

**BufferGeometry and Float32Array** : 2000 particle positions stored in a flat typed array for efficient GPU upload. All positions updated every frame via `geometry.attributes.position.needsUpdate = true`.

**Linear Interpolation (Lerp)** : Two state objects, `currentState` and `targetState`, drive smooth transitions. Every frame, `currentState` moves 5% closer to `targetState` using the formula `current = current + (target - current) * 0.05`.

**Intensity Scaling** : Preset values scaled by `(0.5 + intensity * 0.5)` so even a weakly expressed emotion produces a visible effect at 50% of the full preset.

**Serverless API Proxy** : The browser never calls Gemini directly. The Vercel serverless function acts as a secure middleman, adding the API key server-side.

**performance.now() Timer** : Used instead of the deprecated `THREE.Clock` for reliable elapsed time tracking across all frame rates.


## Running Locally

**Prerequisites :** Node.js v18 or higher, a Gemini API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)

```bash
# Clone the repository
git clone https://github.com/AK-Amit-Kumar/AI-Mood-Visualizer.git
cd AI-Mood-Visualizer

# Install dependencies
npm install

# Install Vercel CLI
npm install -g vercel

# Create .env file
echo "GEMINI_API_KEY=your_key_here" > .env

# Start the development server (runs frontend + serverless functions together)
vercel dev
```

Open `http://localhost:3000`


## What I Learned Building This

This project was built specifically to learn Three.js from scratch over 5 days. Every line of code was written with the goal of understanding the why, not just the what.

Concepts covered :

- Three.js core : Scene, PerspectiveCamera, WebGLRenderer
- BufferGeometry and typed arrays for GPU-efficient particle systems
- The requestAnimationFrame render loop
- Linear interpolation for smooth visual transitions
- OrbitControls with damping and auto-rotation
- FogExp2 for depth effects
- Prompting an AI model to return structured JSON
- Securing API keys with a serverless proxy
- Deploying a Vite project to Vercel with environment variables


## Built By

**Amit Kumar**
[GitHub](https://github.com/AK-Amit-Kumar)


*Built in 5 days. Every line explained.*
