# Aura — Your AI-Powered 3D Interior Design Companion

Ever wanted to see how a new sofa layout or a different flooring material would look in your living room before actually buying anything? Aura helps you plan, design, and visualize your spaces in an interactive web application.

Aura bridges the gap between traditional 2D blueprint drafting and 3D interior design. Best of all, it has an integrated AI Assistant powered by Google Gemini that works alongside you to give design tips, recommend decor, and even trigger actions directly in your workspace.

---

## 🏗️ What you can do with Aura

### 1. Dual-View Floor Planner
* **2D Drafting Mode**: Quickly click and drag to draw walls, place doors and windows, resize rooms, and see square footage calculations instantly. This view is built on **PixiJS**, keeping the 2D layout interaction ultra-smooth and precise.
* **3D Visualizer Mode**: Switch seamlessly to a 3D perspective to explore your room. Drag furniture around, rotate items, zoom, and apply different textures to the floors and walls. This view is built with **Three.js**.

### 2. Meet Your AI Design Assistant
Aura features a sidebar conversation pane powered by Google's **Gemini 1.5 Flash API**. 
* **Contextual Suggestions**: The AI is aware of your workspace. It looks at the room's name, dimensions, current furniture items, and flooring to suggest logical next steps.
* **Interactive Meta-Triggers**: The AI doesn't just give text advice—it can actually trigger changes in the app! For example, if you ask it to recommend furniture, it can send action commands (like `[TRIGGER: ADD_ITEM: Large Potted Plant]`) that automatically place items or apply style themes to your design.
* **Offline Simulation**: If you don't have an API key, Aura falls back to a built-in rule-based design simulator so you can still play with the interactive suggestions.

### 3. Smart Decor Recommendations
Aura spots empty spaces or missing elements in your room design. Under the hood, a recommendation engine checks if you're missing essential items for your selected style theme (e.g. Modern, Minimalist, Scandinavian, or Traditional). It then suggests additions like area rugs, floor lamps, or indoor plants to make the space feel complete.

### 4. Project Storage & Exports
* **Local Saves**: Your layouts are stored locally in your browser's `localStorage` so you won't lose your work when you refresh.
* **Dashboard & Templates**: Start from a blank slate, or load a pre-configured template like a *Cozy Bedroom*, *Modern Living Room*, or a *Professional Office* to see how they're structured.
* **Flexible Exports**: Save a snapshot of your canvas as a PNG, export the scene as a 3D model (GLTF), or download the entire project structure as a ZIP file.

---

## 🛠️ The Tech Stack

We wanted Aura to be fast, responsive, and easy to run without a heavy framework setup:
* **Runtime & Logic**: Plain ES6 JavaScript.
* **UI/Styles**: Custom CSS using a dark glassmorphism theme and smooth animations.
* **Graphics Engines**: **PixiJS** (with `pixi-viewport`) for vector-based 2D interactions, and **Three.js** for the 3D scene and models.
* **Bundler & Dev Server**: **Parcel** for extremely fast builds and hot reloading.
* **AI Core**: Google Gemini 1.5 Flash API.

---

## 🚀 Getting Started

### Prerequisites
You'll need [Node.js](https://nodejs.org/) (v16+ recommended) and `npm` installed.

### Setup and Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dhanya562004/Aura-room-planner.git
   cd Aura-room-planner/blueprint-js
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   This will start a local server at `http://localhost:1234`. Open it in your browser to start designing.

4. **Build for production**:
   ```bash
   npm run build
   ```
   This compiles and optimizes all assets into the `dist/` directory.

---

## 🤖 Activating the AI Assistant

To use the live Gemini AI assistant:
1. Head over to [Google AI Studio](https://aistudio.google.com/) and grab a free API key.
2. In the Aura app, click the **Gemini API Key** button in the dashboard or under Settings.
3. Paste your key. (It is stored entirely in your browser's local `sessionStorage` and is only sent directly to Google's API endpoints).
4. Select a design theme (like Scandinavian Hygge or Warm Minimalist) and start chatting!
