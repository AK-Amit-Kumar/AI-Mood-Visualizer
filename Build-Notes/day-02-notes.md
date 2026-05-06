# Day 2 : Floating Animation, OrbitControls, and Delta Time

**Project :** AI Mood Visualizer
**Date :** Day 2 of 5

---

## Output

![day2-output](aimoodvisualizer-day2.gif)

---

## What Was Built

- Floating animation added using Math.sin and Math.cos wave offsets per particle
- originalPositions array added to store each particle's starting position
- Unique phase offset per particle creates organic independent movement
- OrbitControls integrated for mouse-controlled camera rotation, zoom, and pan
- Damping added to OrbitControls for smooth inertia effect
- Elapsed time tracked using performance.now() replacing deprecated THREE.Clock
- geometry.attributes.position.needsUpdate = true set every frame to re-upload GPU data

---

## Updated Project Structure

```
ai-mood-visualizer/
  src/
    main.js        (scene, camera, renderer, particles, animation, OrbitControls)
    style.css      (CSS reset)
  index.html       (entry point)
  package.json
  package-lock.json
  node_modules/    (gitignored)
  .gitignore
```

---

## What Changed in main.js

Two new imports were added at the top : OrbitControls from `three/examples/jsm` and no additional packages were needed for the timer since we used `performance.now()` directly.

The particle setup now uses two arrays instead of one. `positions` holds the current frame coordinates and gets modified every frame. `originalPositions` holds the starting coordinates and never changes. Each frame, the animation loop calculates a new position for every particle as its original position plus a sine or cosine wave offset. The wave input is elapsed time plus a unique per-particle phase so each particle sits at a different point in the wave cycle and moves independently.

OrbitControls is created after the renderer and attached to the canvas element. Damping is enabled with a factor of 0.05 and `controls.update()` is called every frame inside the animation loop.

The elapsed time tracker uses `performance.now()` which is a native browser API returning milliseconds since page load. Subtracting a stored `startTime` and dividing by 1000 gives elapsed seconds. This replaces THREE.Clock which was deprecated in the current Three.js version.

---

## Core Concepts

**Animation in Three.js** : There is no separate animation engine. Animation is simply changing a value before each render call. The render loop runs 60 times per second. Changing particle positions before each call creates the illusion of motion.

**Delta Time** : requestAnimationFrame does not guarantee a fixed frame rate. Multiplying movement by delta time ensures particles travel the same distance per second on all machines regardless of frame rate.

**Math.sin and Math.cos** : Produce values that oscillate smoothly between -1 and 1. Passing elapsed time makes the wave move forward. A unique offset per particle shifts each one to a different wave phase. Multiplying by 0.3 caps the maximum drift distance.

**needsUpdate** : Three.js caches BufferGeometry data on the GPU. After modifying the positions array in JavaScript, setting `geometry.attributes.position.needsUpdate = true` forces Three.js to re-upload the data before the next frame. Without this the GPU uses stale cached data and particles appear frozen.

**OrbitControls** : A Three.js addon that attaches mouse listeners to the canvas for camera control. Must be updated every frame when damping is enabled.

**performance.now()** : Browser built-in returning high-precision milliseconds since page load. Used as a drop-in replacement for THREE.Clock with no imports needed.

---

## Complete Flow

```
Page loads --> startTime = performance.now()
  --> animate() called once
  --> Each frame -->
      elapsedTime = (performance.now() - startTime) / 1000
      For each of 2000 particles -->
        offset = index * 0.5 (unique per particle)
        positions[x] = originalPositions[x] + Math.sin(elapsedTime + offset) * 0.3
        positions[y] = originalPositions[y] + Math.cos(elapsedTime + offset) * 0.3
        positions[z] = originalPositions[z] + Math.sin(elapsedTime + offset * 0.5) * 0.3
      geometry.attributes.position.needsUpdate = true
      controls.update()
      renderer.render(scene, camera)
  --> requestAnimationFrame schedules next frame
```

---

## Errors Encountered

### Error 1 : THREE.Clock deprecated : particles not moving

**Message :** `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.`

**WHY :** THREE.Clock is deprecated in the latest Three.js. Calling getDelta() and getElapsedTime() in the same frame conflicts because they share an internal timer. getDelta() resets the timer making getElapsedTime() return near-zero. Math.sin(~0) produces almost no offset so particles appear frozen.

**Fix :** Replaced THREE.Clock with `performance.now()`. Stored startTime at app start. Each frame: `elapsedTime = (performance.now() - startTime) / 1000`.

**Key lesson :** Never call both getDelta() and getElapsedTime() on the same clock instance in the same frame. Use performance.now() for a simpler and more reliable alternative.

---

### Error 2 : Failed to resolve three/addons/misc/Timer.js

**Message :** `Failed to resolve import "three/addons/misc/Timer.js" from "src/main.js". Does the file exist?`

**WHY :** `three/addons` is a path alias that requires explicit configuration in vite.config.js. Without that config Vite cannot resolve the path even though the file exists in node_modules. The correct import path for this Three.js version is `three/examples/jsm/`.

**Fix :** Removed Timer import entirely. Used performance.now() instead. Kept OrbitControls import at `three/examples/jsm/controls/OrbitControls.js`.

**Key lesson :** Always use `three/examples/jsm` for addon imports unless vite.config.js has been explicitly configured with the `three/addons` alias.

---

## Commands Reference

```bash
# Start dev server
npm run dev

# Commit Day 2
git add .
git commit -m "Day 2: floating animation, OrbitControls, performance.now timer"
git push
```

---

## Day 3 Preview

- Build 6 mood presets : happy, sad, angry, calm, anxious, excited
- Each preset defines target color, speed, spread, and particle size
- Learn linear interpolation (lerp) for smooth transitions between mood states
- Add a UI dropdown to switch moods manually without AI
