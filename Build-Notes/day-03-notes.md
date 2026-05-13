# Day 3 : Mood Presets, Lerp Transitions, and UI Dropdown

**Project :** AI Mood Visualizer
**Date :** Day 3 of 5

---

## Output

![day3 output](aimoodvisualizer-day3.gif)

## What Was Built

- 6 mood presets defined : happy, sad, angry, calm, anxious, excited
- Each preset holds a target color (THREE.Color), speed, spread, and size
- currentState object drives the live particle system values every frame
- targetState object holds the destination values for the selected mood
- Lerp applied every frame : currentState smoothly catches up to targetState
- THREE.Color.lerp() used for smooth RGB color transitions
- Manual lerp formula applied for speed, spread, and size
- material.color and material.size updated reactively each frame
- material.needsUpdate = true bug diagnosed and removed
- UI dropdown added to index.html with all 6 mood options
- CSS overlay styles added for dropdown positioning above the canvas
- Event listener on dropdown copies selected preset into targetState

---

## Updated Project Structure

```
ai-mood-visualizer/
  src/
    main.js        (scene, particles, animation, mood presets, lerp, event listener)
    style.css      (CSS reset, canvas styling, UI overlay)
  index.html       (entry point, mood dropdown)
  package.json
  package-lock.json
  node_modules/    (gitignored)
  .gitignore
```

---

## What Changed Across Files

**index.html** : A `div#ui` container was added containing a `select#moodSelect` dropdown with 6 options. Each option's value attribute matches the exact key name in the moodPresets object in main.js.

**style.css** : Two new blocks added. `#ui` is positioned fixed at the top center of the viewport using `left: 50%` and `transform: translateX(-50%)` with `z-index: 10` to sit above the canvas. `#moodSelect` gets a semi-transparent dark background, white text, and rounded corners to stay readable against any particle color.

**main.js** : Three major additions. First, the `moodPresets` object defines 6 named presets each with a `THREE.Color`, speed, spread, and size. Second, `currentState` and `targetState` objects are created both initialized to calm. The animate loop now lerps currentState toward targetState every frame and applies the live values to the material and particle position calculations. Third, a change event listener on the dropdown reads the selected mood value, looks up the matching preset, and copies it into targetState.

---

## Core Concepts

**Linear Interpolation (Lerp)** : Moves a value toward a target by a fixed percentage each frame. Formula : `current = current + (target - current) * speed`. At 0.05 speed, 5% of the remaining gap closes every frame. Movement is fast at first and slows as it approaches the target, creating natural easing.

**Two State Objects** : Lerp requires a starting point and a destination. currentState is where the system is now. targetState is where it needs to go. When a mood is selected, only targetState changes. currentState smoothly follows.

**THREE.Color.lerp()** : THREE.Color stores color as r, g, b floats between 0 and 1. The built-in lerp method interpolates all three channels simultaneously toward a target color each frame.

**material.needsUpdate** : Only for structural material changes like enabling transparency or adding a texture map. Setting it every frame forces a full GPU shader recompile which is expensive and prevents reactive property updates like color from working correctly.

---

## Complete Flow

```
Page loads --> currentState and targetState both set to calm preset
  --> animate loop starts : lerp runs but both states are equal so no change
  --> User selects a mood from dropdown
  --> change event fires
  --> moodSelect.value read : e.g. "happy"
  --> moodPresets["happy"] looked up
  --> targetState.color, speed, spread, size updated with preset values
  --> Next frame : currentState detects difference from targetState
  --> currentState.color.lerp(targetState.color, 0.05) runs
  --> currentState.speed, spread, size lerp toward targets
  --> material.color and material.size updated from currentState
  --> Particle positions use currentState.speed and currentState.spread
  --> This repeats every frame until currentState matches targetState
```

---

## Mood Preset Reference

| Mood    | Color          | Speed | Spread | Size |
| ------- | -------------- | ----- | ------ | ---- |
| Calm    | Teal #00c9a7   | 0.6   | 0.20   | 0.03 |
| Happy   | Gold #ffd700   | 2.0   | 0.40   | 0.06 |
| Sad     | Blue #4a90d9   | 0.4   | 0.15   | 0.03 |
| Angry   | Red #ff2200    | 4.0   | 0.60   | 0.08 |
| Anxious | Coral #ff6b6b  | 3.0   | 0.35   | 0.05 |
| Excited | Purple #bf5fff | 3.5   | 0.50   | 0.06 |

---

## Errors Encountered

### Error : Colors not changing when switching moods

**Message :** No error in console. All moods showed white particles regardless of selection.

**WHY :** `material.needsUpdate = true` was set inside the animate loop. This forces a full GPU shader recompile every frame, which overwrites color changes before they can render. It effectively resets the material state 60 times per second.

**Fix :** Removed `material.needsUpdate = true` from the animate loop. `material.color` and `material.size` are reactive properties that update the GPU automatically without a recompile.

**Key lesson :** `material.needsUpdate = true` is for structural changes only. Never set it every frame for value changes.

---

## Commands Reference

```bash
# Start dev server
npm run dev

# Commit Day 3
git add .
git commit -m "Day 3: mood presets, lerp transitions, UI dropdown"
git push
```

---

## Day 4 Preview

- Set up a Vercel serverless function in /api to proxy Claude API calls securely
- Build textarea and submit button UI
- Write fetch call from browser to the serverless function
- Craft Claude API prompt returning structured JSON with mood and intensity
- Parse JSON response and trigger the correct mood preset transition
- Use intensity value to scale spread and speed
- Handle loading states and errors in the UI
