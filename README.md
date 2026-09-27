# ⚡ AURA | AI Spatial Design Studio

> **Next-Generation Generative Interior & Spatial Design Assistant** — Built with Streamlit, Plotly, and Google Gemini 1.5 Flash AI. Inspired by high-performance product design and Nike UX aesthetics.

---

## 🌟 Overview

**AURA** is a product-grade, AI-powered interactive spatial design tool. It empowers users to create, customize, visualize, analyze, and optimize room layouts in real-time. Combining a high-contrast luxury dark UI with interactive 2D floorplans, 3D spatial visualizers, spatial ergonomic analytics, and a natural language AI co-pilot powered by **Gemini 1.5 Flash**.

---

## ✨ Key Features & User Journey

### 1. 📐 Input & Customization
- **Dynamic Blueprint Controls**: Adjust room dimensions (width, length, height), door/window placements, and target budget.
- **Preset Studio Templates**:
  - ⚡ *Nike Athletic Performance Lounge*
  - 🎮 *Cyberpunk Creator Sanctuary*
  - 💼 *Executive Modern Office*
  - 🌿 *Japandi Zen Suite*
  - 🏠 *Compact Urban Studio*
- **Curated Theme Palettes**: Modern Minimalist, Cyberpunk Electric, Luxury Scandinavian, Industrial Loft, and Nike Athletic Studio.

### 2. 🗺️ Interactive Visualization
- **2D Floorplan Canvas**: Interactive Plotly engine featuring wall perimeters, door swing arcs, window markers, color-coded item bounding boxes, dimensional labels, and metric grids.
- **3D Spatial Isometric View**: 3D block representation visualizing volume, height clearance, and spatial depth.
- **Item Control Center**: Move, rotate, recolor, duplicate, delete, or add items from a categorized furniture library.

### 3. 🤖 AURA AI Assistant (Gemini 1.5 Flash & Fallback Engine)
- **Natural Language Command Processing**: Ask AURA AI to *"Add a standing desk near the window"*, *"Switch theme to Cyberpunk"*, or *"Optimize spatial flow"*.
- **Structured Action Parsing**: Converts AI responses into real-time layout manipulations (`ADD_ITEM`, `REMOVE_ITEM`, `SET_STYLE`, `OPTIMIZE`).
- **Resilient Fallback Engine**: If no Gemini API key is provided or the network is offline, AURA's built-in **Neural Rule Engine** seamlessly executes smart spatial actions with zero downtime or errors.

### 4. 📊 Spatial Analytics & Ergonomic Intelligence
- **Real-Time Scorecard**: Ergonomic Score, Aesthetic Harmony, Lighting Coverage %, Space Utilization %, and Budget Allocation.
- **Visual Analytics**: Category expense distribution pie charts, zone floor-area allocation bar charts, and ergonomic safety checklists.

### 5. 🚀 Export & Spec Sheet
- **Design Specification Sheet**: Table summary of layout specs, dimensions, ratings, and costs.
- **Downloadable JSON Blueprint**: Full layout export compatible with standard spatial engines.
- **Snapshot Revision Manager**: Save and compare multiple layout revisions side-by-side.

---

## 🛠️ Technology Stack

- **Frontend & App Framework**: [Streamlit](https://streamlit.io/)
- **Visual Engine**: [Plotly (Graph Objects & Express)](https://plotly.com/python/)
- **AI / LLM Integration**: [Google Generative AI SDK (Gemini 1.5 Flash)](https://ai.google.dev/)
- **Data Analytics**: [Pandas](https://pandas.pydata.org/)
- **Styling**: Vanilla CSS Injection (Glassmorphism, Neon Accents, Modern Typography)

---

## 🚀 Quick Start & Local Run

### 1. Prerequisites
Ensure you have Python 3.9+ installed.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the App
```bash
streamlit run app.py
```

Open `http://localhost:8501` in your web browser.

---

## 🔑 Gemini API Key Setup (Optional)

You can set up your Gemini API key in two ways:
1. **In-App Sidebar**: Enter your API key under the `🔑 Gemini AI API Settings` expander in the app sidebar.
2. **Environment Variable**:
   ```bash
   export GEMINI_API_KEY="your_actual_api_key_here"
   ```
3. **Streamlit Secrets (`.streamlit/secrets.toml`)**:
   ```toml
   GEMINI_API_KEY = "your_actual_api_key_here"
   ```
*Note: If no API key is provided, AURA automatically operates using its built-in rule engine.*

---

## ☁️ Streamlit Cloud Deployment

AURA is 100% compatible with Streamlit Cloud:
1. Push repository to GitHub.
2. Connect repository to [Streamlit Community Cloud](https://share.streamlit.io/).
3. Set main file path to `app.py`.
4. (Optional) Add `GEMINI_API_KEY` to App Secrets in Streamlit Cloud Settings.

---

## 📄 License

MIT License © 2026 AURA Spatial Design Team
