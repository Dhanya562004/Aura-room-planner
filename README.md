<div align="center">

# ⚡ AURA | AI SPATIAL DESIGN STUDIO
### *Generative Layout Engineering, Spatial Intelligence & Ergonomic Co-Pilot*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Streamlit_Cloud-CCFF00?style=for-the-badge&logo=streamlit&logoColor=0B0E14)](https://aura-room-planner-k62zn6otu4qhwsgn36ttub.streamlit.app/)
[![Gemini AI](https://img.shields.io/badge/🤖_AI_Engine-Gemini_1.5_Flash-00E5FF?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

### 🌐 [**LAUNCH LIVE WEB APP DEMO**](https://aura-room-planner-k62zn6otu4qhwsgn36ttub.streamlit.app/)

</div>

---

## 🌟 Overview

**AURA** is an interactive, product-grade AI design assistant inspired by high-performance product design and Nike UX aesthetics. Built with **Streamlit**, **Plotly**, and **Google Gemini 1.5 Flash**, AURA bridges the gap between complex 3D spatial CAD software and natural language AI interface.

Whether designing a **Nike Athletic Performance Studio**, a **Cyberpunk Gaming Sanctuary**, or an **Executive Modern Office**, AURA allows users to seamlessly move through a complete product journey:

```text
  [ 📐 INPUT ] ──► [ 🎨 CUSTOMIZE ] ──► [ 🗺️ VISUALIZE ] ──► [ 🤖 IMPROVE (AI) ]
  Dimensions         Preset Themes        2D/3D Plotly Map       Gemini Co-Pilot
```

---

## ✨ Key Features & Product Workflows

### 1. 📐 Spatial Blueprint & Preset Engine
- **Room Controls**: Precise width, length, and height dimensioning with customizable door and window placements.
- **Preset Studio Templates**:
  - ⚡ **Nike Athletic Performance Lounge**: Recovery bench, interactive smart mirror, workout gear, ambient lighting.
  - 🎮 **Cyberpunk Creator Sanctuary**: High-contrast L-desk, neon mood lighting, acoustic panels, modular lounge.
  - 💼 **Executive Modern Office**: Slate minimalist desk, ergonomic mesh seating, storage credentials.
  - 🌿 **Japandi Zen Suite**: Natural wooden tones, monstera planters, platform seating.
  - 🏠 **Compact Urban Studio**: Space-saving modular layout for compact studio living.
- **Dynamic Aesthetic Palettes**: Modern Minimalist, Cyberpunk Electric, Luxury Scandinavian, Industrial Loft, Nike Athletic Studio.

### 2. 🗺️ Dual 2D & 3D Interactive Visualizers
- **2D Vector Floorplan Grid**: Real-time Plotly interactive map rendering room perimeters, door swing arcs, window markers, color-coded item bounding boxes, dimension labels, and metric grid overlays.
- **3D Spatial Volume Projection**: Interactive 3D mesh volume renderer visualizing spatial clearance, item height distribution, and 3D depth.
- **Item Control Center**: Move items with real-time X/Y position sliders, duplicate, delete, recolor, or add items from an expansive furniture catalog.

### 3. 🤖 AURA Generative AI Co-Pilot (Gemini 1.5 Flash + Neural Rule Engine)
- **Natural Language Interaction**: Type requests like *"Add an ergonomic desk near the window"*, *"Switch theme to Cyberpunk Sanctuary"*, or *"Optimize spatial flow"*.
- **Structured JSON Command Execution**: Parses AI responses into actionable real-time state mutations (`ADD_ITEM`, `REMOVE_ITEM`, `SET_STYLE`, `OPTIMIZE`).
- **Resilient Fallback Engine**: If no Gemini API key is provided or network calls fail, AURA's built-in **Neural Rule Engine** seamlessly handles requests with **100% operational uptime and zero errors**.

### 4. 📊 Spatial Analytics & Ergonomics Scorecard
- **Real-Time Ergonomic Score**: Calculates walkway clearance, item density, and circulation pathways (Score out of 100).
- **Aesthetic Harmony Score**: Evaluates color balance and visual clutter.
- **Lighting Coverage %**: Analyzes ambient light coverage relative to window vectors.
- **Budget Tracking**: Live cost breakdown pie chart and target budget slider.
- **Zone Area Allocation**: Bar charts showing space distribution across Workstation, Seating, Fitness, Storage, and Decor.

### 5. 🚀 Export & Spec Sheet
- **Design Specification Sheet**: Product summary table of layout specs, dimensions, ratings, and costs.
- **Downloadable JSON Blueprint**: Export layout blueprints for external CAD/3D software.
- **Snapshot Revision Manager**: Save and compare multiple layout revisions side-by-side.

---

## 🛠️ Technology Stack

| Domain | Technology / Library |
| :--- | :--- |
| **Framework & UI** | [Streamlit](https://streamlit.io/) (Custom Glassmorphic Dark Design System) |
| **Visualization Engine** | [Plotly (Graph Objects & Express)](https://plotly.com/python/) |
| **AI / LLM Integration** | [Google Generative AI SDK](https://ai.google.dev/) (`gemini-1.5-flash`) |
| **Data Engine** | [Pandas](https://pandas.pydata.org/) & [NumPy](https://numpy.org/) |
| **Styling & Aesthetics** | Custom CSS (Google Fonts: *Outfit* & *Inter*, Translucent Panels, Glowing Accents) |

---

## 🚀 Quick Start & Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/Dhanya562004/Aura-room-planner.git
cd Aura-room-planner
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Application
```bash
streamlit run app.py
```

Navigate to `http://localhost:8501` in your browser.

---

## 🔑 Gemini API Key Configuration (Optional)

AURA automatically detects Gemini API keys from multiple sources:
1. **In-App Sidebar**: Enter your API key under `🔑 Gemini AI API Settings`.
2. **Streamlit Secrets (`.streamlit/secrets.toml`)**:
   ```toml
   GEMINI_API_KEY = "your_actual_api_key_here"
   ```
3. **Environment Variable**:
   ```bash
   export GEMINI_API_KEY="your_actual_api_key_here"
   ```
*Note: If no API key is set, AURA's built-in Neural Rule Engine takes over automatically with 100% uptime.*

---

## ☁️ Deployment

This project is 100% optimized for deployment on **Streamlit Community Cloud**.

- **Live URL**: [https://aura-room-planner-k62zn6otu4qhwsgn36ttub.streamlit.app/](https://aura-room-planner-k62zn6otu4qhwsgn36ttub.streamlit.app/)
- **Main File**: `app.py`
- **Secrets Key**: `GEMINI_API_KEY`

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ⚡ for High-Performance Spatial Engineering & UX Innovation.</sub>
</div>
