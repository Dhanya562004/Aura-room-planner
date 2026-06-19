# Aura — AI-Powered 3D Interior Design Planner

Aura is a state-of-the-art, interactive 3D interior design and floor planning application. It combines traditional CAD-like 2D and 3D drawing capabilities with an intelligent **AI Design Assistant** powered by Google Gemini to help you create, style, and visualize your dream living spaces.

---

## 🌟 Key Features

### 1. Dual-View Design Planner
*   **2D Floorplanner Mode**: Draw walls, position windows and doors, adjust room boundaries, and calculate area dimensions in real-time. Built on top of **PixiJS** for ultra-smooth 2D rendering and manipulation.
*   **3D Interactive Viewer**: Toggle to a fully interactive 3D environment powered by **Three.js**. Rotate, orbit, zoom, place furniture, and select textures dynamically.

### 2. Aura AI Design Assistant
*   An integrated sidebar companion powered by the **Gemini 1.5 Flash API**.
*   **Context-Aware Analysis**: Aura scans your room type, active square footage, floor texture, and placed furniture to provide tailored interior design advice.
*   **Interactive Meta-Triggers**: Aura doesn't just talk — it can actively suggest layout adjustments or push commands like `[TRIGGER: ADD_ITEM: Large Potted Plant]` or `[TRIGGER: SET_STYLE: Modern]` directly into the application space to assist with decorating.
*   **Offline Fallback Mode**: Supports local simulations if a Gemini API key is not supplied.

### 3. Smart Recommendation Engine
*   **Style-Aligned Suggestions**: Pick a theme (Modern, Minimalist, Scandinavian, or Traditional) and receive real-time, context-specific recommendations.
*   **Empty-Space Spotting**: Detects if your room is missing key design items (such as rugs, floor lamps, or plants) and suggests them with clear design rationale.

### 4. Premium Dark Glassmorphism UI
*   A stunning, modern dark-themed user interface utilizing glassmorphism styling, clean micro-animations, customizable colors, and a responsive sidebar layout.

### 5. Client-Side Project Hub
*   Directly save, rename, reload, and manage your projects from the local browser storage (`localStorage`).

---

## 🛠️ Technology Stack

*   **Logic & Runtime**: Vanilla ES6 JavaScript
*   **Styling**: Premium Custom Vanilla CSS
*   **2D Rendering Engine**: [PixiJS](https://pixijs.com/) (with [pixi-viewport](https://github.com/davidfig/pixi-viewport))
*   **3D Graphics Engine**: [Three.js](https://threejs.org/)
*   **Build Tool & Bundler**: [Parcel](https://parceljs.org/)
*   **AI Models**: Google Gemini 1.5 Flash API

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended) along with `npm`.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Dhanya562004/Aura-room-planner.git
   cd Aura-room-planner/blueprint-js
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```

### Running Locally
*   **Start Local Development Server**:
    ```bash
    npm run dev
    ```
    This bundles the assets and starts a local server (typically accessible at `http://localhost:1234`).
*   **Build Production Bundle**:
    ```bash
    npm run build
    ```
    This generates optimized, production-ready files in the `dist/` directory.

---

## 🤖 Activating the AI Assistant

To unlock the full potential of Aura's AI capabilities:
1. Obtain an API Key from the Google AI Studio.
2. Click the **AI Assistant** settings button in the top right corner of the application UI.
3. Paste your Gemini API key in the API key field.
4. Start chatting with Aura about color palettes, spatial layouts, or decor recommendations!
