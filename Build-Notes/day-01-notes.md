# Day 1 : Vite Setup, Three.js Scene, and 2000 Static Particles

**Project :** AI Mood Visualizer
**Date :** Day 1 of 5

---

## What Was Built

- Vite project scaffolded with vanilla JS template
- Three.js installed and imported
- Scene, PerspectiveCamera, and WebGLRenderer created
- 2000 particles positioned randomly in 3D space using BufferGeometry and Float32Array
- Circular particle texture generated using HTML Canvas
- PointsMaterial configured with circular map, transparency, and depth settings
- Self-scheduling render loop started with requestAnimationFrame
- Window resize handler keeping camera and canvas in sync
- index.html and style.css cleaned of all Vite boilerplate
- Code pushed to GitHub

---

## Updated Project Structure

```
ai-mood-visualizer/
  src/
    main.js        (scene, camera, renderer, particles, render loop)
    style.css      (CSS reset)
  index.html       (entry point)
  package.json
  package-lock.json
  node_modules/    (gitignored)
  .gitignore
```

---

## What Each File Does

**index.html** : Minimal HTML shell. Removed the boilerplate Vite div. Loads main.js as a module using `type="module"` which enables ES import syntax in the browser.

**style.css** : Resets browser default margin and padding on all elements. Sets overflow hidden on both html and body to suppress scrollbars. Sets display block on canvas to remove the inline element gap.

**main.js** : All Three.js logic lives here. Creates the scene, camera, and renderer. Generates particle positions into a Float32Array. Builds the BufferGeometry and attaches the position data. Creates a circular canvas texture and applies it to PointsMaterial. Combines geometry and material into a Points object and adds it to the scene. Starts the render loop and handles window resize.

---

## Core Concepts

**The Three.js Holy Trinity** : Every Three.js project needs a Scene (the 3D space), a Camera (the viewpoint), and a Renderer (the drawing engine). Nothing appears without all three working together.

**BufferGeometry and Float32Array** : Instead of storing each particle as a JavaScript object, all 2000 particle positions are stored in one flat Float32Array (6000 values : x, y, z per particle). This is sent to the GPU in a single operation. The old Geometry class (removed in r125) was slower because it used individual JS objects per vertex.

**requestAnimationFrame** : The browser's built-in animation scheduler. Calls the animate function before each screen repaint at approximately 60fps. Automatically pauses when the tab is hidden, saving CPU and battery. Calling animate() once is enough because it schedules itself on every call.

**PointsMaterial with Canvas Texture** : PointsMaterial renders each vertex as a dot. By default dots are squares. Drawing a circle on an in-memory canvas and passing it as a texture map makes them round. transparent: true hides the texture corners. depthWrite: false prevents depth sorting glitches between overlapping transparent particles.

---

## Complete Flow

```
index.html loads in browser
  : main.js imported as ES module
  : Three.js imported from node_modules
  : Scene, Camera, Renderer created
  : Float32Array filled with 6000 random position values
  : BufferGeometry receives position data
  : Canvas texture drawn and applied to PointsMaterial
  : Points object created and added to scene
  : animate() called once : render loop begins
  : renderer.render(scene, camera) called ~60 times per second
  : window resize updates camera aspect and renderer size
```

---

## Errors Encountered

### Error 1 : White screen on load

**WHY :** Canvas default background is white. style.css was not reset. Vite boilerplate div added phantom page height.

**Fix :** Set `renderer.setClearColor(0x000000)`. Reset style.css. Remove div id app from index.html.

**Key lesson :** Always set setClearColor. Never assume canvas has a black background.

---

### Error 2 : Particles appeared as squares

**WHY :** PointsMaterial renders points as squares by default. That is the GPU default for point primitives.

**Fix :** Create a circular canvas texture using `ctx.arc()`. Assign it to `material.map`. Set `transparent: true` and `depthWrite: false`.

**Key lesson :** PointsMaterial always needs a circular texture map to look round. transparent: true is required or the black texture corners show.

---

### Error 3 : Scrollbars persisting

**WHY :** Browser applies default margins to both html and body separately. Extra div added height. Canvas inline gap added vertical space.

**Fix :** Remove div id app from index.html. Set overflow hidden on both html and body. Set `canvas { display: block }`. Set `document.documentElement.style.overflow = 'hidden'` in JS.

**Key lesson :** Target both html and body in CSS resets. Remove unused divs immediately.

---

## Commands Reference

```bash
# Create project
npm create vite@latest ai-mood-visualizer -- --template vanilla

# Install dependencies
npm install

# Install Three.js
npm install three

# Start dev server
npm run dev

# Git commit
git init
git add .
git commit -m "Day 1: Vite setup, Three.js scene, 2000 static particles"
git remote add origin https://github.com/YOUR_USERNAME/ai-mood-visualizer.git
git branch -M main
git push -u origin main
```

---

## Day 2 Preview

- Animate particles with floating motion by modifying position data in the render loop
- Learn why `geometry.attributes.position.needsUpdate = true` is required for BufferGeometry animation
- Install OrbitControls for mouse-controlled scene rotation
- Understand delta time and frame rate independent animation
