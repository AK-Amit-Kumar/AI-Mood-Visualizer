# Day 4 : Gemini API Integration, Serverless Function, and Full AI Pipeline

**Project :** AI Mood Visualizer
**Date :** Day 4 of 5

---

## Output

![day4 output](aimoodvisualizer-day4.gif)

---

## What Was Built

- Vercel CLI installed and project linked via `vercel dev`
- `api/analyze.js` serverless function written to proxy Gemini API calls securely
- `GEMINI_API_KEY` stored in `.env` file, never exposed to the browser
- `.env`, `.env.local`, and `.vercel` added to `.gitignore`
- `vercel dev` running on `localhost:3000` serving both frontend and serverless function
- `index.html` updated with textarea, submit button, status text, and mood label elements
- `style.css` updated with full UI overlay styles positioned at bottom center of viewport
- `applyMood(mood, intensity)` function written to map AI response to targetState
- `analyzeMood()` async function written to call `/api/analyze` and handle response
- Submit button and Enter key both trigger mood analysis
- Loading state disables button during API call to prevent duplicate requests
- `finally` block guarantees button re-enables regardless of success or failure
- UTF-16 encoding bug on `api/analyze.js` diagnosed and fixed
- `gemini-2.0-flash` 429 quota error resolved by switching to `gemini-2.5-flash`
- `maxOutputTokens` increased to 1024 to prevent response truncation
- Markdown code fence stripping added for robust JSON parsing

---

## Updated Project Structure

```
ai-mood-visualizer/
  api/
    analyze.js        (Vercel serverless function : proxies Gemini API)
  src/
    main.js           (Three.js scene, particles, mood system, API fetch)
    style.css         (CSS reset, canvas, UI overlay)
  index.html          (entry point, textarea, button, status, mood label)
  .env                (GEMINI_API_KEY : gitignored, never committed)
  .vercel             (Vercel project config : gitignored)
  package.json
  .gitignore
```

---

## What Changed Across Files

**api/analyze.js (new file)** : Vercel serverless function that acts as a secure proxy between the browser and Gemini. Receives the user text via POST request body, calls Gemini with the API key from `process.env`, strips any markdown code fences from the response, parses the JSON, normalizes the mood string with `toLowerCase().trim()`, and returns `{ mood, intensity }` to the browser. Uses `temperature: 0` for deterministic output and `maxOutputTokens: 1024` to prevent truncation.

**index.html** : Added `textarea#moodInput` for text input, `button#submitBtn` for triggering analysis, `p#statusText` for showing loading and result messages, and `p#moodLabel` for displaying the detected mood name in uppercase.

**style.css** : Added `#ui` positioned fixed at bottom center using `left: 50%` and `transform: translateX(-50%)`. Added styles for textarea, button with hover and disabled states, status text in muted white, and mood label in large bold uppercase.

**main.js** : Removed the old dropdown event listener. Added `applyMood(mood, intensity)` which looks up the matching preset, scales speed and spread by `(0.5 + intensity * 0.5)`, copies values into `targetState`, and updates the mood label. Added `analyzeMood()` async function that reads the textarea, calls `/api/analyze`, calls `applyMood()` on success, and handles errors. Button click and Enter key both trigger `analyzeMood()`.

---

## Core Concepts

**Serverless Functions and API Key Security** : A serverless function is backend code that runs on demand. Vercel creates an API route for every file in `/api`. The browser sends text to the function with no API key. The function adds the key from server-side environment variables, calls Gemini, and returns only the result. The key never appears in any file the browser downloads.

**Request Proxy Pattern** : Browser sends to your function, function adds the secret and calls the real API, function returns only what the browser needs. Standard pattern for protecting third-party API keys in frontend apps.

**Intensity Scaling** : Gemini returns intensity between 0 and 1. Multiplying preset values by `(0.5 + intensity * 0.5)` maps this onto 50% to 100% of the preset. Even weakly expressed emotions produce a visible effect.

**Loading State with finally** : Button is disabled before the API call and re-enabled in the `finally` block. `finally` always runs after `try` or `catch`, guaranteeing the button is never permanently stuck disabled even if an unexpected error occurs.

**Robust JSON Parsing** : AI models sometimes add markdown code fences or preamble text around responses. Stripping these with `.replace()` before `JSON.parse()` makes the integration robust. A separate inner `try/catch` for `JSON.parse()` gives a clear parse error message distinct from network errors.

---

## Complete Flow

```
User types text and clicks Analyze My Mood
  --> analyzeMood() fires
  --> submitBtn.disabled = true : statusText = 'Analyzing...'
  --> fetch POST to /api/analyze with { text } as JSON body
  --> Vercel routes request to api/analyze.js
  --> Function reads text from request.body
  --> Function calls Gemini API with GEMINI_API_KEY from process.env
  --> Gemini returns JSON with mood and intensity
  --> Function strips markdown fences, parses JSON, normalizes mood
  --> Function returns { mood, intensity } to browser
  --> applyMood(data.mood, data.intensity) called
  --> targetState updated with scaled preset values
  --> Animate loop lerps currentState toward targetState over ~60 frames
  --> Particles transition color, speed, spread smoothly
  --> finally block : submitBtn.disabled = false
```

---

## Gemini Model Reference

| Model            | Status       | Notes                                                |
| ---------------- | ------------ | ---------------------------------------------------- |
| gemini-2.5-flash | Working      | Used in this project. Free tier available.           |
| gemini-2.0-flash | Failed : 429 | Limit 0 on free tier as of 2026. Requires paid plan. |

---

## Errors Encountered

### Error 1 : Invalid or unexpected token in api/analyze.js

**WHY :** Windows `echo` command created the file with UTF-16 LE encoding. Node.js expects UTF-8. The BOM marker at the start of a UTF-16 file is read as invalid syntax.

**Fix :** Clicked UTF-16 LE in VS Code status bar. Selected Save with Encoding. Selected UTF-8.

**Key lesson :** Always check file encoding in VS Code bottom right when Node.js reports token errors on a file that looks syntactically correct.

---

### Error 2 : 429 quota exceeded on gemini-2.0-flash

**WHY :** `gemini-2.0-flash` has a free tier limit of 0 requests as of 2026. Requires a paid plan.

**Fix :** Changed model string to `gemini-2.5-flash` in the API URL.

**Key lesson :** 429 does not mean your code is wrong. It means the account plan does not support that model. Check https://ai.google.dev/gemini-api/docs/models for current model availability.

---

### Error 3 : Gemini returned invalid JSON : response truncated

**WHY :** `maxOutputTokens` was too low for `gemini-2.5-flash` which uses a different tokenizer. The response was cut off mid-JSON before the closing brace.

**Fix :** Increased `maxOutputTokens` to 1024. Added `.replace()` calls to strip markdown code fences that Gemini sometimes adds despite being instructed not to.

**Key lesson :** Different model versions use different tokenizers. Always set `maxOutputTokens` generously for JSON responses. 1024 is safe for any structured output under a paragraph in length.

---

## Commands Reference

```bash
# Run local dev server with serverless functions
vercel dev

# Commit Day 4
git add .
git commit -m "Day 4: Gemini API integration, serverless function, full AI pipeline"
git push
```

---

## Day 5 Preview

- Set up Vercel account and deploy project to a live URL
- Add `GEMINI_API_KEY` as environment variable in Vercel project settings
- Polish the UI : fog in Three.js scene, auto-rotate camera, CSS transitions
- Test full pipeline on the live deployed URL
- Write and post the LinkedIn announcement
