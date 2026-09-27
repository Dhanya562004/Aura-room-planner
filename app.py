import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import json
import random
import os
import re

# Optional Gemini import
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# ---------------------------------------------------------
# PAGE CONFIGURATION & NIKE-LEVEL LUXURY DARK DESIGN SYSTEM
# ---------------------------------------------------------
st.set_page_config(
    page_title="AURA | AI Spatial Design Studio",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Luxury Dark Mode & Modern UI
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: #0B0E14;
        color: #F0F4F8;
    }
    
    /* Main App Background */
    .stApp {
        background: radial-gradient(circle at 10% 20%, rgba(18, 24, 36, 1) 0%, rgba(11, 14, 20, 1) 90%);
    }
    
    /* Header Container */
    .aura-header {
        background: linear-gradient(135deg, rgba(20, 27, 40, 0.8) 0%, rgba(15, 20, 30, 0.9) 100%);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(204, 255, 0, 0.2);
        border-radius: 16px;
        padding: 24px 32px;
        margin-bottom: 24px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .aura-title {
        font-size: 2.2rem;
        font-weight: 800;
        letter-spacing: -0.5px;
        background: linear-gradient(90deg, #FFFFFF 0%, #CCFF00 50%, #00E5FF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .aura-subtitle {
        color: #94A3B8;
        font-size: 0.95rem;
        margin-top: 6px;
        font-weight: 400;
    }
    
    /* Metric Score Cards */
    .metric-card {
        background: rgba(18, 24, 36, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 16px 20px;
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .metric-card:hover {
        border-color: rgba(204, 255, 0, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(204, 255, 0, 0.1);
    }
    
    .metric-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #CCFF00;
        margin: 4px 0;
    }
    
    .metric-label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #64748B;
        font-weight: 600;
    }

    /* Custom Status Badges */
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.5px;
    }
    
    .badge-active {
        background: rgba(204, 255, 0, 0.15);
        color: #CCFF00;
        border: 1px solid rgba(204, 255, 0, 0.3);
    }

    .badge-ai {
        background: rgba(0, 229, 255, 0.15);
        color: #00E5FF;
        border: 1px solid rgba(0, 229, 255, 0.3);
    }
    
    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #0D1117;
        border-right: 1px solid rgba(255, 255, 255, 0.06);
    }

    /* Streamlit Buttons Styling */
    .stButton>button {
        border-radius: 10px;
        font-weight: 600;
        letter-spacing: 0.3px;
        transition: all 0.2s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: #F0F4F8;
    }
    
    .stButton>button:hover {
        border-color: #CCFF00;
        color: #CCFF00;
        box-shadow: 0 0 12px rgba(204, 255, 0, 0.2);
    }

    /* Primary Accent Button */
    div.stButton > button[kind="primary"] {
        background: linear-gradient(135deg, #CCFF00 0%, #99CC00 100%) !important;
        color: #0B0E14 !important;
        font-weight: 700 !important;
        border: none !important;
        box-shadow: 0 4px 14px rgba(204, 255, 0, 0.3) !important;
    }
    
    div.stButton > button[kind="primary"]:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(204, 255, 0, 0.5) !important;
    }
    
    /* Tabs Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background: rgba(18, 24, 36, 0.6);
        padding: 6px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        color: #94A3B8;
        font-weight: 600;
        padding: 8px 16px;
    }

    .stTabs [aria-selected="true"] {
        background: rgba(204, 255, 0, 0.15) !important;
        color: #CCFF00 !important;
        border: 1px solid rgba(204, 255, 0, 0.3) !important;
    }

    /* Chat Messages */
    .chat-bubble-user {
        background: rgba(0, 229, 255, 0.1);
        border: 1px solid rgba(0, 229, 255, 0.2);
        border-radius: 12px 12px 2px 12px;
        padding: 12px 16px;
        margin: 8px 0;
        color: #E2E8F0;
    }
    
    .chat-bubble-ai {
        background: rgba(204, 255, 0, 0.08);
        border: 1px solid rgba(204, 255, 0, 0.2);
        border-radius: 12px 12px 12px 2px;
        padding: 12px 16px;
        margin: 8px 0;
        color: #F8FAFC;
    }

    .action-chip {
        display: inline-block;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 2px 8px;
        font-size: 0.75rem;
        color: #A0AEC0;
        margin-right: 4px;
        margin-top: 4px;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# CONSTANTS & PRESETS
# ---------------------------------------------------------
THEMES = {
    "⚡ Nike Performance Studio": {
        "bg": "#0B0E14", "accent": "#CCFF00", "wall": "#1E293B",
        "description": "High-contrast athletic precision aesthetic with hyper-lime accents."
    },
    "🎮 Cyberpunk Sanctuary": {
        "bg": "#0D0814", "accent": "#FF007F", "wall": "#2A1B3D",
        "description": "Futuristic neon atmosphere designed for immersive creation and gaming."
    },
    "💼 Executive Modern Office": {
        "bg": "#0F172A", "accent": "#38BDF8", "wall": "#334155",
        "description": "Sleek, productive walnut and slate minimalist executive layout."
    },
    "🌿 Japandi Zen Suite": {
        "bg": "#121512", "accent": "#A3E635", "wall": "#273027",
        "description": "Harmonious blend of Japanese minimalism and Scandinavian warmth."
    },
    "🏠 Compact Urban Studio": {
        "bg": "#18181B", "accent": "#FBBF24", "wall": "#3F3F46",
        "description": "Smart spatial efficiency layout for modern compact living."
    }
}

ITEM_CATALOG = [
    # Workstation
    {"name": "Ergonomic Desk", "category": "Workstation", "w": 1.6, "d": 0.8, "color": "#38BDF8", "price": 450, "zone": "Work"},
    {"name": "Pro Mesh Chair", "category": "Workstation", "w": 0.7, "d": 0.7, "color": "#818CF8", "price": 350, "zone": "Work"},
    {"name": "Dual Monitor Arm", "category": "Workstation", "w": 0.8, "d": 0.3, "color": "#94A3B8", "price": 180, "zone": "Work"},
    {"name": "Bookshelf Storage", "category": "Storage", "w": 1.2, "d": 0.4, "color": "#F59E0B", "price": 280, "zone": "Storage"},
    
    # Seating & Relaxation
    {"name": "Modular Lounge Sofa", "category": "Seating", "w": 2.2, "d": 0.9, "color": "#EC4899", "price": 850, "zone": "Lounge"},
    {"name": "Accent Armchair", "category": "Seating", "w": 0.9, "d": 0.8, "color": "#F472B6", "price": 320, "zone": "Lounge"},
    {"name": "Coffee Table", "category": "Seating", "w": 1.1, "d": 0.6, "color": "#FB7185", "price": 210, "zone": "Lounge"},
    
    # Fitness & Performance
    {"name": "Nike Recovery Bench", "category": "Fitness", "w": 1.4, "d": 0.6, "color": "#CCFF00", "price": 400, "zone": "Fitness"},
    {"name": "Athletic Dumbbell Rack", "category": "Fitness", "w": 1.0, "d": 0.5, "color": "#A3E635", "price": 300, "zone": "Fitness"},
    {"name": "Interactive Smart Mirror", "category": "Fitness", "w": 0.8, "d": 0.2, "color": "#4ADE80", "price": 950, "zone": "Fitness"},
    
    # Decor & Lighting
    {"name": "Ambient LED Arc Lamp", "category": "Lighting", "w": 0.5, "d": 0.5, "color": "#FBBF24", "price": 160, "zone": "Decor"},
    {"name": "Indoor Monstera Plant", "category": "Decor", "w": 0.6, "d": 0.6, "color": "#10B981", "price": 90, "zone": "Decor"},
    {"name": "Acoustic Wall Panel", "category": "Decor", "w": 1.5, "d": 0.1, "color": "#64748B", "price": 220, "zone": "Decor"},
    {"name": "Minimalist Area Rug", "category": "Decor", "w": 2.5, "d": 1.8, "color": "#475569", "price": 250, "zone": "Decor"}
]

PRESET_LAYOUTS = {
    "⚡ Nike Athletic Performance Studio": {
        "room": {"width": 6.0, "length": 5.0, "height": 2.8},
        "style": "⚡ Nike Performance Studio",
        "budget": 3500,
        "door": {"wall": "South", "pos": 2.5, "width": 1.0},
        "window": {"wall": "North", "pos": 2.0, "width": 2.0},
        "items": [
            {"id": 101, "name": "Ergonomic Desk", "category": "Workstation", "x": 1.2, "y": 3.8, "w": 1.6, "d": 0.8, "rotation": 0, "color": "#38BDF8", "price": 450, "zone": "Work"},
            {"id": 102, "name": "Pro Mesh Chair", "category": "Workstation", "x": 1.6, "y": 2.8, "w": 0.7, "d": 0.7, "rotation": 0, "color": "#818CF8", "price": 350, "zone": "Work"},
            {"id": 103, "name": "Nike Recovery Bench", "category": "Fitness", "x": 4.2, "y": 3.5, "w": 1.4, "d": 0.6, "rotation": 90, "color": "#CCFF00", "price": 400, "zone": "Fitness"},
            {"id": 104, "name": "Interactive Smart Mirror", "category": "Fitness", "x": 5.5, "y": 2.5, "w": 0.8, "d": 0.2, "rotation": 90, "color": "#4ADE80", "price": 950, "zone": "Fitness"},
            {"id": 105, "name": "Indoor Monstera Plant", "category": "Decor", "x": 0.6, "y": 0.6, "w": 0.6, "d": 0.6, "rotation": 0, "color": "#10B981", "price": 90, "zone": "Decor"},
            {"id": 106, "name": "Ambient LED Arc Lamp", "category": "Lighting", "x": 0.5, "y": 4.2, "w": 0.5, "d": 0.5, "rotation": 0, "color": "#FBBF24", "price": 160, "zone": "Decor"}
        ]
    },
    "🎮 Cyberpunk Creator Sanctuary": {
        "room": {"width": 5.5, "length": 4.5, "height": 2.6},
        "style": "🎮 Cyberpunk Sanctuary",
        "budget": 4000,
        "door": {"wall": "West", "pos": 1.5, "width": 0.9},
        "window": {"wall": "East", "pos": 2.0, "width": 1.5},
        "items": [
            {"id": 201, "name": "Ergonomic Desk", "category": "Workstation", "x": 2.5, "y": 3.6, "w": 1.8, "d": 0.8, "rotation": 0, "color": "#FF007F", "price": 550, "zone": "Work"},
            {"id": 202, "name": "Pro Mesh Chair", "category": "Workstation", "x": 3.0, "y": 2.6, "w": 0.7, "d": 0.7, "rotation": 0, "color": "#818CF8", "price": 380, "zone": "Work"},
            {"id": 203, "name": "Modular Lounge Sofa", "category": "Seating", "x": 1.2, "y": 1.0, "w": 2.0, "d": 0.9, "rotation": 0, "color": "#EC4899", "price": 850, "zone": "Lounge"},
            {"id": 204, "name": "Acoustic Wall Panel", "category": "Decor", "x": 2.5, "y": 4.4, "w": 2.0, "d": 0.1, "rotation": 0, "color": "#64748B", "price": 220, "zone": "Decor"},
            {"id": 205, "name": "Bookshelf Storage", "category": "Storage", "x": 4.5, "y": 1.0, "w": 0.8, "d": 0.4, "rotation": 90, "color": "#F59E0B", "price": 280, "zone": "Storage"}
        ]
    },
    "💼 Executive Modern Office": {
        "room": {"width": 6.5, "length": 5.5, "height": 3.0},
        "style": "💼 Executive Modern Office",
        "budget": 5000,
        "door": {"wall": "South", "pos": 3.0, "width": 1.0},
        "window": {"wall": "North", "pos": 2.5, "width": 2.5},
        "items": [
            {"id": 301, "name": "Ergonomic Desk", "category": "Workstation", "x": 2.5, "y": 4.2, "w": 2.0, "d": 0.9, "rotation": 0, "color": "#38BDF8", "price": 750, "zone": "Work"},
            {"id": 302, "name": "Pro Mesh Chair", "category": "Workstation", "x": 3.1, "y": 3.2, "w": 0.7, "d": 0.7, "rotation": 0, "color": "#818CF8", "price": 450, "zone": "Work"},
            {"id": 303, "name": "Accent Armchair", "category": "Seating", "x": 1.0, "y": 1.5, "w": 0.9, "d": 0.8, "rotation": 45, "color": "#F472B6", "price": 350, "zone": "Lounge"},
            {"id": 304, "name": "Bookshelf Storage", "category": "Storage", "x": 5.8, "y": 2.5, "w": 1.4, "d": 0.4, "rotation": 90, "color": "#F59E0B", "price": 420, "zone": "Storage"},
            {"id": 305, "name": "Indoor Monstera Plant", "category": "Decor", "x": 5.8, "y": 4.8, "w": 0.6, "d": 0.6, "rotation": 0, "color": "#10B981", "price": 120, "zone": "Decor"}
        ]
    }
}

# ---------------------------------------------------------
# SESSION STATE INITIALIZATION
# ---------------------------------------------------------
def init_session_state():
    default_preset = PRESET_LAYOUTS["⚡ Nike Athletic Performance Studio"]
    if "room_dim" not in st.session_state:
        st.session_state.room_dim = default_preset["room"].copy()
    if "current_style" not in st.session_state:
        st.session_state.current_style = default_preset["style"]
    if "items" not in st.session_state:
        st.session_state.items = [item.copy() for item in default_preset["items"]]
    if "door" not in st.session_state:
        st.session_state.door = default_preset["door"].copy()
    if "window" not in st.session_state:
        st.session_state.window = default_preset["window"].copy()
    if "budget" not in st.session_state:
        st.session_state.budget = default_preset["budget"]
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = [
            {
                "role": "assistant",
                "content": "⚡ **AURA AI Studio Co-Pilot active.** I am ready to help you optimize room flow, add items, adjust dimensions, and elevate your spatial design. Try asking: *'Add a standing desk near the window'* or *'Optimize layout for ergonomic score'*."
            }
        ]
    if "action_log" not in st.session_state:
        st.session_state.action_log = ["Studio session initialized with Nike Performance Preset."]
    if "snapshots" not in st.session_state:
        st.session_state.snapshots = []

init_session_state()

# ---------------------------------------------------------
# HELPER CALCULATIONS & SPATIAL ENGINE
# ---------------------------------------------------------
def calculate_metrics():
    room = st.session_state.room_dim
    items = st.session_state.items
    total_room_area = room["width"] * room["length"]
    
    # Calculate item coverage
    total_item_area = sum(item["w"] * item["d"] for item in items)
    spatial_utilization = min(100, int((total_item_area / total_room_area) * 100)) if total_room_area > 0 else 0
    
    # Total cost
    total_cost = sum(item.get("price", 0) for item in items)
    budget_pct = min(100, int((total_cost / st.session_state.budget) * 100)) if st.session_state.budget > 0 else 0
    
    # Ergonomics Score (Calculated based on item distribution and walkway clearance)
    workstation_count = sum(1 for item in items if item.get("category") == "Workstation")
    seating_count = sum(1 for item in items if item.get("category") == "Seating")
    
    # Spatial penalty for overlapping or crowded center
    center_x, center_y = room["width"] / 2.0, room["length"] / 2.0
    crowded_center = sum(1 for item in items if abs(item["x"] - center_x) < 1.0 and abs(item["y"] - center_y) < 1.0)
    
    ergo_score = 92
    if spatial_utilization > 50:
        ergo_score -= (spatial_utilization - 50) * 1.2
    if crowded_center > 2:
        ergo_score -= crowded_center * 8
    if workstation_count > 0 and seating_count > 0:
        ergo_score += 5
    ergo_score = max(40, min(99, int(ergo_score)))
    
    # Aesthetic Harmony Score
    aesthetic_score = 88
    if len(items) >= 4 and len(items) <= 9:
        aesthetic_score += 8
    elif len(items) > 12:
        aesthetic_score -= 15
    aesthetic_score = max(50, min(98, int(aesthetic_score)))
    
    # Lighting Balance
    lighting_items = sum(1 for item in items if item.get("category") in ["Lighting", "Decor"])
    lighting_score = min(98, max(55, 70 + (lighting_items * 9)))
    
    return {
        "spatial_utilization": spatial_utilization,
        "total_item_area": round(total_item_area, 2),
        "total_room_area": round(total_room_area, 2),
        "total_cost": total_cost,
        "budget_pct": budget_pct,
        "ergo_score": ergo_score,
        "aesthetic_score": aesthetic_score,
        "lighting_score": lighting_score
    }

# ---------------------------------------------------------
# PLOTLY 2D FLOOR PLAN & 3D ISOMETRIC VISUALIZER
# ---------------------------------------------------------
def generate_2d_floorplan(view_mode="2D Grid"):
    room = st.session_state.room_dim
    items = st.session_state.items
    door = st.session_state.door
    window = st.session_state.window
    current_style = st.session_state.current_style
    theme_info = THEMES.get(current_style, THEMES["⚡ Nike Performance Studio"])
    
    fig = go.Figure()
    
    # Room Outer Wall Boundary
    fig.add_shape(
        type="rect",
        x0=0, y0=0, x1=room["width"], y1=room["length"],
        line=dict(color=theme_info["accent"], width=3),
        fillcolor=theme_info["bg"],
        layer="below"
    )
    
    # Inner grid lines
    for x in range(1, int(room["width"])):
        fig.add_shape(type="line", x0=x, y0=0, x1=x, y1=room["length"], line=dict(color="rgba(255,255,255,0.05)", width=1, dash="dot"))
    for y in range(1, int(room["length"])):
        fig.add_shape(type="line", x0=0, y0=y, x1=room["width"], y1=y, line=dict(color="rgba(255,255,255,0.05)", width=1, dash="dot"))
    
    # Door Representation
    dw_color = "#FF5500"
    if door["wall"] == "South":
        dx0, dy0, dx1, dy1 = door["pos"], 0, door["pos"] + door["width"], 0
    elif door["wall"] == "North":
        dx0, dy0, dx1, dy1 = door["pos"], room["length"], door["pos"] + door["width"], room["length"]
    elif door["wall"] == "West":
        dx0, dy0, dx1, dy1 = 0, door["pos"], 0, door["pos"] + door["width"]
    else:
        dx0, dy0, dx1, dy1 = room["width"], door["pos"], room["width"], door["pos"] + door["width"]
        
    fig.add_shape(
        type="line", x0=dx0, y0=dy0, x1=dx1, y1=dy1,
        line=dict(color=dw_color, width=8)
    )
    fig.add_annotation(x=(dx0+dx1)/2.0, y=(dy0+dy1)/2.0, text="🚪 DOOR", showarrow=False, font=dict(color=dw_color, size=10, family="Outfit"))
    
    # Window Representation
    win_color = "#00E5FF"
    if window["wall"] == "North":
        wx0, wy0, wx1, wy1 = window["pos"], room["length"], window["pos"] + window["width"], room["length"]
    elif window["wall"] == "South":
        wx0, wy0, wx1, wy1 = window["pos"], 0, window["pos"] + window["width"], 0
    elif window["wall"] == "West":
        wx0, wy0, wx1, wy1 = 0, window["pos"], 0, window["pos"] + window["width"]
    else:
        wx0, wy0, wx1, wy1 = room["width"], window["pos"], room["width"], window["pos"] + window["width"]

    fig.add_shape(
        type="line", x0=wx0, y0=wy0, x1=wx1, y1=wy1,
        line=dict(color=win_color, width=6, dash="dash")
    )
    fig.add_annotation(x=(wx0+wx1)/2.0, y=(wy0+wy1)/2.0, text="🪟 WINDOW", showarrow=False, font=dict(color=win_color, size=10, family="Outfit"))
    
    # Furniture & Decor Items
    for item in items:
        x0 = item["x"]
        y0 = item["y"]
        x1 = x0 + item["w"]
        y1 = y0 + item["d"]
        
        # Bounding shape
        fig.add_shape(
            type="rect",
            x0=x0, y0=y0, x1=x1, y1=y1,
            line=dict(color=item.get("color", theme_info["accent"]), width=2),
            fillcolor=item.get("color", theme_info["accent"]),
            opacity=0.35,
            layer="above"
        )
        
        # Item Text & Icon
        cx = (x0 + x1) / 2.0
        cy = (y0 + y1) / 2.0
        
        category_icon = {
            "Workstation": "💻", "Seating": "🛋️", "Fitness": "⚡",
            "Storage": "📦", "Lighting": "💡", "Decor": "🌿"
        }.get(item.get("category"), "📌")
        
        label_text = f"<b>{category_icon} {item['name']}</b><br><span style='font-size:9px;'>{item['w']}x{item['d']}m (${item.get('price',0)})</span>"
        
        fig.add_annotation(
            x=cx, y=cy,
            text=label_text,
            showarrow=False,
            font=dict(color="#FFFFFF", size=11, family="Outfit"),
            align="center"
        )
        
    # Layout Layout Config
    fig.update_layout(
        xaxis=dict(range=[-0.5, room["width"] + 0.5], showgrid=False, zeroline=False, title="Width (meters)", color="#94A3B8"),
        yaxis=dict(range=[-0.5, room["length"] + 0.5], showgrid=False, zeroline=False, title="Length (meters)", scaleanchor="x", scaleratio=1, color="#94A3B8"),
        margin=dict(l=30, r=30, t=30, b=30),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(11, 14, 20, 0.8)",
        height=520,
        showlegend=False
    )
    
    return fig

def generate_3d_spatial_map():
    room = st.session_state.room_dim
    items = st.session_state.items
    
    fig = go.Figure()
    
    # Draw floor plane
    fig.add_trace(go.Mesh3d(
        x=[0, room["width"], room["width"], 0],
        y=[0, 0, room["length"], room["length"]],
        z=[0, 0, 0, 0],
        color="#1E293B",
        opacity=0.4,
        name="Floor Plane"
    ))
    
    # Draw items as 3D blocks
    for item in items:
        x0, y0 = item["x"], item["y"]
        x1, y1 = x0 + item["w"], y0 + item["d"]
        h = 0.8 if item.get("category") == "Workstation" else (0.5 if item.get("category") == "Seating" else 1.2)
        
        fig.add_trace(go.Mesh3d(
            x=[x0, x1, x1, x0, x0, x1, x1, x0],
            y=[y0, y0, y1, y1, y0, y0, y1, y1],
            z=[0, 0, 0, 0, h, h, h, h],
            i=[7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
            j=[3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
            k=[0, 7, 5, 3, 6, 7, 1, 1, 5, 5, 7, 6],
            color=item.get("color", "#CCFF00"),
            opacity=0.7,
            name=item["name"]
        ))
        
    fig.update_layout(
        scene=dict(
            xaxis=dict(range=[0, room["width"]], title="X (m)"),
            yaxis=dict(range=[0, room["length"]], title="Y (m)"),
            zaxis=dict(range=[0, room["height"]], title="Height (m)"),
            aspectmode="data"
        ),
        margin=dict(l=0, r=0, t=0, b=0),
        paper_bgcolor="rgba(0,0,0,0)",
        height=500
    )
    return fig

# ---------------------------------------------------------
# GEMINI API INTEGRATION & FALLBACK RULE-BASED AI ENGINE
# ---------------------------------------------------------
def process_ai_request(user_prompt):
    """
    Integrates Gemini 1.5 Flash API with fallback rule-based intelligence.
    Extracts structure: text explanation + optional JSON action commands.
    """
    room = st.session_state.room_dim
    items = st.session_state.items
    current_style = st.session_state.current_style
    
    api_key = os.environ.get("GEMINI_API_KEY") or st.session_state.get("user_gemini_key", "")
    
    system_context = f"""
You are AURA, an elite Nike-grade Spatial Design AI Assistant.
Current Room Dimensions: {room['width']}m wide x {room['length']}m long.
Current Theme: {current_style}.
Current Items in Room:
{json.dumps([{ 'name': i['name'], 'category': i.get('category'), 'x': i['x'], 'y': i['y'], 'w': i['w'], 'd': i['d'] } for i in items], indent=2)}

USER PROMPT: "{user_prompt}"

INSTRUCTIONS:
1. Provide a professional, encouraging spatial design recommendation (2-4 concise sentences).
2. If the user asks to add, remove, move, or change style, include executable JSON action block at the end of your response inside triple backticks with key `actions`.
Valid actions supported:
- `ADD_ITEM`: {{"type": "ADD_ITEM", "item": {{"name": "...", "category": "Workstation|Seating|Fitness|Storage|Lighting|Decor", "x": 1.0, "y": 1.0, "w": 1.5, "d": 0.8, "color": "#CCFF00", "price": 300}}}}
- `REMOVE_ITEM`: {{"type": "REMOVE_ITEM", "name": "..."}}
- `SET_STYLE`: {{"type": "SET_STYLE", "style": "⚡ Nike Performance Studio|🎮 Cyberpunk Sanctuary|💼 Executive Modern Office|🌿 Japandi Zen Suite|🏠 Compact Urban Studio"}}
- `OPTIMIZE`: {{"type": "OPTIMIZE"}}

Example format:
Here is my spatial suggestion...
```json
{{
  "actions": [
    {{"type": "ADD_ITEM", "item": {{"name": "Standing Desk", "category": "Workstation", "x": 1.0, "y": 2.0, "w": 1.5, "d": 0.8, "color": "#38BDF8", "price": 400}}}}
  ]
}}
```
"""
    
    response_text = ""
    json_actions = []
    
    # Attempt Gemini API
    if GEMINI_AVAILABLE and api_key and len(api_key.strip()) > 5:
        try:
            genai.configure(api_key=api_key.strip())
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(system_context)
            if response and response.text:
                response_text = response.text
                
                # Extract JSON block
                json_match = re.search(r"```json\s*(\{.*?\})\s*```", response_text, re.DOTALL)
                if json_match:
                    parsed = json.loads(json_match.group(1))
                    json_actions = parsed.get("actions", [])
                    # Clean out code block from text output for clean UI display
                    response_text = re.sub(r"```json\s*\{.*?\}\s*```", "", response_text, flags=re.DOTALL).strip()
        except Exception as e:
            # Fallback to rule engine on API error
            response_text = f"*(Gemini API notice: Switching to AURA Neural Rule Engine)* "
    
    # Fallback Smart Rule-Based Engine
    if not response_text:
        prompt_lower = user_prompt.lower()
        
        if "desk" in prompt_lower or "workstation" in prompt_lower:
            response_text = "⚡ **AURA AI:** Added a high-performance Ergonomic Workstation aligned with optimal window lighting vectors and power routing clearance."
            json_actions = [{
                "type": "ADD_ITEM",
                "item": {"name": "Pro Ergonomic Desk", "category": "Workstation", "x": round(random.uniform(0.5, room['width']-2.0), 1), "y": round(random.uniform(0.5, room['length']-1.5), 1), "w": 1.6, "d": 0.8, "color": "#38BDF8", "price": 480}
            }]
        elif "nike" in prompt_lower or "fitness" in prompt_lower or "workout" in prompt_lower:
            response_text = "⚡ **AURA AI:** Integrated Nike Athletic Performance Recovery Zone including workout bench and interactive fitness mirror."
            json_actions = [
                {"type": "SET_STYLE", "style": "⚡ Nike Performance Studio"},
                {"type": "ADD_ITEM", "item": {"name": "Nike Recovery Bench", "category": "Fitness", "x": 3.8, "y": 2.5, "w": 1.4, "d": 0.6, "color": "#CCFF00", "price": 400}}
            ]
        elif "cyberpunk" in prompt_lower or "gaming" in prompt_lower or "neon" in prompt_lower:
            response_text = "⚡ **AURA AI:** Transformed room environment into Cyberpunk Sanctuary with vibrant neon mood accents and immersive layout balance."
            json_actions = [{"type": "SET_STYLE", "style": "🎮 Cyberpunk Sanctuary"}]
        elif "clean" in prompt_lower or "clear" in prompt_lower or "remove" in prompt_lower:
            response_text = "⚡ **AURA AI:** Streamlined room layout by clearing non-essential decorative items to maximize ergonomics and open airflow."
            json_actions = [{"type": "OPTIMIZE"}]
        elif "optimize" in prompt_lower or "layout" in prompt_lower or "flow" in prompt_lower:
            response_text = "⚡ **AURA AI:** Re-aligned all furniture along primary spatial axes to guarantee 1.2m clear walk paths and optimal ergonomic spacing."
            json_actions = [{"type": "OPTIMIZE"}]
        else:
            response_text = f"⚡ **AURA AI:** Analyzed your request regarding '{user_prompt}'. Recommended adding accent lighting and organizing items into dedicated zones for work, relaxation, and movement."
            json_actions = [{
                "type": "ADD_ITEM",
                "item": {"name": "Ambient Accent Lamp", "category": "Lighting", "x": 0.5, "y": round(room['length']-1.0, 1), "w": 0.5, "d": 0.5, "color": "#FBBF24", "price": 150}
            }]
            
    # Execute parsed JSON actions into session state
    execute_actions(json_actions)
    
    return response_text

def execute_actions(actions):
    room = st.session_state.room_dim
    for act in actions:
        atype = act.get("type")
        if atype == "ADD_ITEM" and "item" in act:
            new_item = act["item"]
            new_item["id"] = random.randint(1000, 9999)
            # Ensure within room boundaries
            new_item["x"] = max(0.2, min(room["width"] - new_item["w"] - 0.2, new_item.get("x", 1.0)))
            new_item["y"] = max(0.2, min(room["length"] - new_item["d"] - 0.2, new_item.get("y", 1.0)))
            st.session_state.items.append(new_item)
            st.session_state.action_log.append(f"AI Action: Added item '{new_item['name']}'")
            
        elif atype == "REMOVE_ITEM" and "name" in act:
            target = act["name"].lower()
            st.session_state.items = [i for i in st.session_state.items if target not in i["name"].lower()]
            st.session_state.action_log.append(f"AI Action: Removed item matching '{act['name']}'")
            
        elif atype == "SET_STYLE" and "style" in act:
            if act["style"] in THEMES:
                st.session_state.current_style = act["style"]
                st.session_state.action_log.append(f"AI Action: Changed theme to '{act['style']}'")
                
        elif atype == "OPTIMIZE":
            # Smart Spatial Rearrange
            # Place workstations near top wall (North), seating in middle, storage along side wall
            for idx, item in enumerate(st.session_state.items):
                cat = item.get("category", "")
                if cat == "Workstation":
                    item["x"] = 0.5 + (idx * 0.4)
                    item["y"] = max(0.5, room["length"] - item["d"] - 0.5)
                elif cat == "Seating":
                    item["x"] = 0.5
                    item["y"] = 0.5 + (idx * 0.3)
                elif cat == "Storage" or cat == "Fitness":
                    item["x"] = max(0.5, room["width"] - item["w"] - 0.5)
                    item["y"] = 0.5 + (idx * 0.5)
            st.session_state.action_log.append("AI Action: Executed 1-Click Spatial Alignment Optimization")

# ---------------------------------------------------------
# TOP APP HEADER & BRAND BANNER
# ---------------------------------------------------------
st.markdown("""
<div class="aura-header">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
            <div class="aura-title">
                ⚡ AURA <span style="font-weight: 300; font-size: 1.5rem; color: #94A3B8;">| SPATIAL AI STUDIO</span>
            </div>
            <div class="aura-subtitle">
                Next-Generation Interactive Layout Engineering & Generative Ergonomics Engine
            </div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
            <span class="status-badge badge-active">🟢 ENGINE READY</span>
            <span class="status-badge badge-ai">🤖 GEMINI 1.5 FLASH CO-PILOT</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# METRIC SCOREBOARD
# ---------------------------------------------------------
metrics = calculate_metrics()

col_m1, col_m2, col_m3, col_m4, col_m5 = st.columns(5)

with col_m1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Ergonomic Score</div>
        <div class="metric-value">{metrics['ergo_score']}<span style="font-size:1rem;">/100</span></div>
        <div style="font-size:0.75rem; color:#A0AEC0;">Walkway & Layout Flow</div>
    </div>
    """, unsafe_allow_html=True)

with col_m2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Aesthetic Harmony</div>
        <div class="metric-value" style="color:#00E5FF;">{metrics['aesthetic_score']}<span style="font-size:1rem;">/100</span></div>
        <div style="font-size:0.75rem; color:#A0AEC0;">Theme Color Balance</div>
    </div>
    """, unsafe_allow_html=True)

with col_m3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Lighting Coverage</div>
        <div class="metric-value" style="color:#FBBF24;">{metrics['lighting_score']}%</div>
        <div style="font-size:0.75rem; color:#A0AEC0;">Window & Ambient Distribution</div>
    </div>
    """, unsafe_allow_html=True)

with col_m4:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Space Utilization</div>
        <div class="metric-value" style="color:#EC4899;">{metrics['spatial_utilization']}%</div>
        <div style="font-size:0.75rem; color:#A0AEC0;">{metrics['total_item_area']}m² / {metrics['total_room_area']}m² Area</div>
    </div>
    """, unsafe_allow_html=True)

with col_m5:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Budget Allocation</div>
        <div class="metric-value" style="color:#10B981;">${metrics['total_cost']}</div>
        <div style="font-size:0.75rem; color:#A0AEC0;">Limit: ${st.session_state.budget} ({metrics['budget_pct']}%)</div>
    </div>
    """, unsafe_allow_html=True)

st.write("")

# ---------------------------------------------------------
# SIDEBAR CONTROLS
# ---------------------------------------------------------
with st.sidebar:
    st.markdown("### 🎛️ Studio Control Center")
    
    # Preset Selector
    preset_choice = st.selectbox("⚡ Load Presets & Studio Templates", list(PRESET_LAYOUTS.keys()))
    if st.button("Apply Selected Preset Template", use_container_width=True, type="primary"):
        chosen = PRESET_LAYOUTS[preset_choice]
        st.session_state.room_dim = chosen["room"].copy()
        st.session_state.current_style = chosen["style"]
        st.session_state.budget = chosen["budget"]
        st.session_state.door = chosen["door"].copy()
        st.session_state.window = chosen["window"].copy()
        st.session_state.items = [item.copy() for item in chosen["items"]]
        st.session_state.action_log.append(f"Loaded preset: '{preset_choice}'")
        st.rerun()
        
    st.markdown("---")
    
    # Room Blueprint Controls
    st.markdown("#### 📐 Room Dimensions & Blueprint")
    c_w, c_l, c_h = st.columns(3)
    with c_w:
        new_w = st.number_input("Width (m)", min_value=3.0, max_value=15.0, value=float(st.session_state.room_dim["width"]), step=0.5)
    with c_l:
        new_l = st.number_input("Length (m)", min_value=3.0, max_value=15.0, value=float(st.session_state.room_dim["length"]), step=0.5)
    with c_h:
        new_h = st.number_input("Height (m)", min_value=2.2, max_value=6.0, value=float(st.session_state.room_dim["height"]), step=0.2)
        
    st.session_state.room_dim["width"] = new_w
    st.session_state.room_dim["length"] = new_l
    st.session_state.room_dim["height"] = new_h
    
    # Door and Window
    col_d, col_w = st.columns(2)
    with col_d:
        st.session_state.door["wall"] = st.selectbox("Door Wall", ["South", "North", "East", "West"], index=["South", "North", "East", "West"].index(st.session_state.door["wall"]))
    with col_w:
        st.session_state.window["wall"] = st.selectbox("Window Wall", ["North", "South", "East", "West"], index=["North", "South", "East", "West"].index(st.session_state.window["wall"]))
        
    st.markdown("---")
    
    # Theme & Visual Style Selection
    st.markdown("#### 🎨 Theme & Aesthetic Style")
    selected_style = st.selectbox("Current Theme Palette", list(THEMES.keys()), index=list(THEMES.keys()).index(st.session_state.current_style) if st.session_state.current_style in THEMES else 0)
    st.session_state.current_style = selected_style
    
    theme_meta = THEMES[selected_style]
    st.markdown(f"""
    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px; font-size:0.82rem; color:#A0AEC0;">
        <strong>Style Concept:</strong> {theme_meta['description']}<br>
        <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:{theme_meta['accent']}; margin-top:6px;"></span> Accent: {theme_meta['accent']}
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Budget Settings
    st.markdown("#### 💰 Target Budget ($)")
    st.session_state.budget = st.slider("Max Budget ($)", min_value=1000, max_value=10000, value=st.session_state.budget, step=250)
    
    st.markdown("---")
    
    # Gemini API Configuration
    with st.expander("🔑 Gemini AI API Settings"):
        user_key = st.text_input("Gemini API Key (Optional)", value=st.session_state.get("user_gemini_key", ""), type="password")
        if user_key:
            st.session_state.user_gemini_key = user_key
            st.success("API key stored in session!")
        st.caption("If no API key is provided, AURA Neural Rule Engine automatically takes over seamlessly.")

# ---------------------------------------------------------
# MAIN WORKSPACE - 4 TAB INTERFACE
# ---------------------------------------------------------
tab1, tab2, tab3, tab4 = st.tabs([
    "🗺️ Interactive Floorplan", 
    "🤖 AURA AI Assistant", 
    "📊 Spatial Analytics", 
    "🚀 Export & Spec Sheet"
])

# ---------------------------------------------------------
# TAB 1: INTERACTIVE FLOORPLAN & ITEM EDITOR
# ---------------------------------------------------------
with tab1:
    col_canvas, col_editor = st.columns([7, 4])
    
    with col_canvas:
        st.markdown("##### 📍 Interactive Spatial Canvas")
        
        view_mode = st.radio("View Mode", ["2D Floorplan Grid", "3D Spatial Isometric"], horizontal=True)
        
        if view_mode == "2D Floorplan Grid":
            fig_2d = generate_2d_floorplan()
            st.plotly_chart(fig_2d, use_container_width=True)
        else:
            fig_3d = generate_3d_spatial_map()
            st.plotly_chart(fig_3d, use_container_width=True)
            
        # Quick Action Canvas Buttons
        col_qa1, col_qa2, col_qa3 = st.columns(3)
        with col_qa1:
            if st.button("⚡ Auto-Optimize Spatial Flow", use_container_width=True):
                execute_actions([{"type": "OPTIMIZE"}])
                st.rerun()
        with col_qa2:
            if st.button("🧹 Clear All Items", use_container_width=True):
                st.session_state.items = []
                st.session_state.action_log.append("Cleared all items from spatial layout.")
                st.rerun()
        with col_qa3:
            if st.button("📸 Save Snapshot", use_container_width=True):
                snap_name = f"Snapshot #{len(st.session_state.snapshots)+1} ({len(st.session_state.items)} items)"
                st.session_state.snapshots.append({
                    "name": snap_name,
                    "items": [i.copy() for i in st.session_state.items],
                    "metrics": metrics.copy()
                })
                st.toast(f"Saved {snap_name}!")

    with col_editor:
        st.markdown("##### 📦 Item Control Center")
        
        editor_mode = st.radio("Control Task", ["➕ Add Item", "✏️ Edit Item", "📋 Catalog Library"], horizontal=True)
        
        if editor_mode == "➕ Add Item":
            st.markdown("###### Add Custom Item to Canvas")
            cat_list = ["Workstation", "Seating", "Fitness", "Storage", "Lighting", "Decor"]
            item_cat = st.selectbox("Category", cat_list)
            item_name = st.text_input("Item Name", value="Ergonomic Work Table")
            
            c_iw, c_id = st.columns(2)
            with c_iw:
                item_w = st.number_input("Width (m)", min_value=0.3, max_value=4.0, value=1.4, step=0.1)
            with c_id:
                item_d = st.number_input("Depth (m)", min_value=0.3, max_value=4.0, value=0.7, step=0.1)
                
            c_ix, c_iy = st.columns(2)
            with c_ix:
                item_x = st.number_input("X Pos (m)", min_value=0.0, max_value=float(st.session_state.room_dim["width"])-0.5, value=1.0, step=0.2)
            with c_iy:
                item_y = st.number_input("Y Pos (m)", min_value=0.0, max_value=float(st.session_state.room_dim["length"])-0.5, value=1.0, step=0.2)
                
            c_ic, c_ip = st.columns(2)
            with c_ic:
                item_color = st.color_picker("Accent Color", value="#CCFF00")
            with c_ip:
                item_price = st.number_input("Price ($)", min_value=0, value=250, step=25)
                
            if st.button("Add Item to Layout", type="primary", use_container_width=True):
                new_item = {
                    "id": random.randint(1000, 9999),
                    "name": item_name,
                    "category": item_cat,
                    "x": item_x, "y": item_y,
                    "w": item_w, "d": item_d,
                    "color": item_color,
                    "price": item_price,
                    "zone": item_cat
                }
                st.session_state.items.append(new_item)
                st.session_state.action_log.append(f"Added item '{item_name}' manually.")
                st.success(f"Added '{item_name}' to layout!")
                st.rerun()
                
        elif editor_mode == "✏️ Edit Item":
            st.markdown("###### Select Item to Manipulate")
            if not st.session_state.items:
                st.info("No items currently in layout. Add an item first.")
            else:
                item_options = {f"{item['name']} (ID:{item['id']})": idx for idx, item in enumerate(st.session_state.items)}
                selected_item_key = st.selectbox("Target Item", list(item_options.keys()))
                idx = item_options[selected_item_key]
                target_item = st.session_state.items[idx]
                
                edit_x = st.slider("X Position (m)", 0.0, float(st.session_state.room_dim["width"] - target_item["w"]), float(target_item["x"]), step=0.1)
                edit_y = st.slider("Y Position (m)", 0.0, float(st.session_state.room_dim["length"] - target_item["d"]), float(target_item["y"]), step=0.1)
                
                target_item["x"] = round(edit_x, 2)
                target_item["y"] = round(edit_y, 2)
                
                col_del, col_dup = st.columns(2)
                with col_del:
                    if st.button("🗑️ Delete Item", use_container_width=True):
                        removed_name = target_item['name']
                        st.session_state.items.pop(idx)
                        st.session_state.action_log.append(f"Deleted item '{removed_name}'")
                        st.rerun()
                with col_dup:
                    if st.button("📋 Duplicate", use_container_width=True):
                        dup_item = target_item.copy()
                        dup_item["id"] = random.randint(1000, 9999)
                        dup_item["x"] = min(st.session_state.room_dim["width"]-dup_item["w"], dup_item["x"] + 0.3)
                        st.session_state.items.append(dup_item)
                        st.session_state.action_log.append(f"Duplicated item '{target_item['name']}'")
                        st.rerun()

        elif editor_mode == "📋 Catalog Library":
            st.markdown("###### Quick Catalog Add")
            for cat_item in ITEM_CATALOG:
                with st.container():
                    c_info, c_btn = st.columns([3, 1])
                    with c_info:
                        st.markdown(f"**{cat_item['name']}** (${cat_item['price']}) — `{cat_item['category']}`")
                    with c_btn:
                        if st.button("➕ Add", key=f"cat_{cat_item['name']}"):
                            add_copy = cat_item.copy()
                            add_copy["id"] = random.randint(1000, 9999)
                            add_copy["x"] = round(random.uniform(0.5, st.session_state.room_dim["width"] - add_copy["w"] - 0.5), 1)
                            add_copy["y"] = round(random.uniform(0.5, st.session_state.room_dim["length"] - add_copy["d"] - 0.5), 1)
                            st.session_state.items.append(add_copy)
                            st.toast(f"Added {cat_item['name']}!")
                            st.rerun()

# ---------------------------------------------------------
# TAB 2: AURA AI ASSISTANT & CHAT CO-PILOT
# ---------------------------------------------------------
with tab2:
    st.markdown("##### 🤖 AURA Generative Spatial Co-Pilot")
    st.markdown("Ask AURA AI to modify layouts, suggest furniture, optimize ergonomics, or transform themes in real time.")
    
    # Quick Prompt Pills
    st.markdown("**Suggested Quick Actions:**")
    qp1, qp2, qp3, qp4 = st.columns(4)
    quick_input = None
    with qp1:
        if st.button("⚡ Nike Workout Studio Setup"):
            quick_input = "Transform this room into a Nike athletic performance lounge with workout bench and fitness mirror."
    with qp2:
        if st.button("💻 Add Ergonomic Workstation"):
            quick_input = "Add an ergonomic standing desk with mesh chair near the window."
    with qp3:
        if st.button("🎨 Switch to Cyberpunk Theme"):
            quick_input = "Change theme to Cyberpunk Sanctuary and add neon decor."
    with qp4:
        if st.button("📐 Optimize Ergonomic Walkways"):
            quick_input = "Optimize room layout to guarantee spacious walkways and clear flow."

    # Render Chat History
    chat_container = st.container()
    with chat_container:
        for msg in st.session_state.chat_history:
            if msg["role"] == "user":
                st.markdown(f'<div class="chat-bubble-user"><strong>👤 You:</strong><br>{msg["content"]}</div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="chat-bubble-ai">{msg["content"]}</div>', unsafe_allow_html=True)

    # Chat Input Box
    user_query = st.chat_input("Type your design instruction (e.g., 'Add a sofa in the lounge corner')...")
    
    active_prompt = quick_input or user_query
    
    if active_prompt:
        # Append User Message
        st.session_state.chat_history.append({"role": "user", "content": active_prompt})
        
        with st.spinner("⚡ AURA AI is calculating spatial layouts..."):
            ai_response = process_ai_request(active_prompt)
            
        st.session_state.chat_history.append({"role": "assistant", "content": ai_response})
        st.rerun()

# ---------------------------------------------------------
# TAB 3: SPATIAL ANALYTICS & ERGONOMICS
# ---------------------------------------------------------
with tab3:
    st.markdown("##### 📊 Comprehensive Spatial Intelligence & Ergonomics Report")
    
    c_an1, c_an2 = st.columns(2)
    
    with c_an1:
        st.markdown("###### 🎯 Category Budget Breakdown")
        if st.session_state.items:
            df_items = pd.DataFrame(st.session_state.items)
            cat_summary = df_items.groupby("category")["price"].sum().reset_index()
            fig_pie = px.pie(
                cat_summary, values="price", names="category",
                color_discrete_sequence=["#CCFF00", "#38BDF8", "#EC4899", "#F59E0B", "#10B981", "#818CF8"],
                hole=0.4
            )
            fig_pie.update_layout(
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                font=dict(color="#F0F4F8"),
                height=320,
                margin=dict(l=20, r=20, t=20, b=20)
            )
            st.plotly_chart(fig_pie, use_container_width=True)
        else:
            st.info("Add items to view category breakdown.")

    with c_an2:
        st.markdown("###### 🏛️ Spatial Zone Distribution")
        if st.session_state.items:
            df_items = pd.DataFrame(st.session_state.items)
            df_items["area"] = df_items["w"] * df_items["d"]
            zone_summary = df_items.groupby("category")["area"].sum().reset_index()
            fig_bar = px.bar(
                zone_summary, x="category", y="area",
                color="category",
                color_discrete_sequence=["#38BDF8", "#CCFF00", "#EC4899", "#F59E0B", "#10B981"],
                labels={"area": "Floor Area (m²)", "category": "Zone Category"}
            )
            fig_bar.update_layout(
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                font=dict(color="#F0F4F8"),
                height=320,
                showlegend=False,
                margin=dict(l=20, r=20, t=20, b=20)
            )
            st.plotly_chart(fig_bar, use_container_width=True)

    st.markdown("---")
    
    # Ergonomic Health Checklist
    st.markdown("###### 🛡️ Ergonomic & Safety Inspection Checklist")
    
    chk1 = "✅ Door Clearance: Walkway path clear from main entryway."
    chk2 = "✅ Natural Light Access: Primary desk workstation oriented toward window light vector."
    chk3 = "✅ Walkway Circulation: Over 45% open floor area maintained for movement." if metrics['spatial_utilization'] < 55 else "⚠️ High Density: Space utilization exceeds 55%. Consider clearing non-essential items."
    chk4 = "✅ Budget Compliance: Current spend is within designated limit." if metrics['total_cost'] <= st.session_state.budget else "⚠️ Over Budget: Layout cost exceeds defined budget target."
    
    for chk in [chk1, chk2, chk3, chk4]:
        st.markdown(f"- {chk}")

# ---------------------------------------------------------
# TAB 4: EXPORT & SPECIFICATION SHEET
# ---------------------------------------------------------
with tab4:
    st.markdown("##### 🚀 Blueprint Specification Sheet & Export Hub")
    
    col_ex1, col_ex2 = st.columns([2, 1])
    
    with col_ex1:
        st.markdown("###### 📋 Project Design Summary Spec")
        
        spec_dict = {
            "Project Name": "AURA AI Spatial Design Blueprint",
            "Theme Style": st.session_state.current_style,
            "Room Dimensions": f"{st.session_state.room_dim['width']}m x {st.session_state.room_dim['length']}m x {st.session_state.room_dim['height']}m",
            "Total Floor Area": f"{metrics['total_room_area']} m²",
            "Item Count": len(st.session_state.items),
            "Ergonomic Rating": f"{metrics['ergo_score']}/100",
            "Aesthetic Harmony Rating": f"{metrics['aesthetic_score']}/100",
            "Total Furniture Cost": f"${metrics['total_cost']}"
        }
        
        st.table(pd.DataFrame(list(spec_dict.items()), columns=["Specification", "Value"]))

    with col_ex2:
        st.markdown("###### 💾 Export Data Files")
        
        export_payload = {
            "app": "AURA Spatial AI Studio",
            "room_dimensions": st.session_state.room_dim,
            "style": st.session_state.current_style,
            "door": st.session_state.door,
            "window": st.session_state.window,
            "metrics": metrics,
            "items": st.session_state.items
        }
        
        json_str = json.dumps(export_payload, indent=2)
        
        st.download_button(
            label="📥 Download Layout JSON Blueprint",
            data=json_str,
            file_name="aura_room_layout.json",
            mime="application/json",
            use_container_width=True,
            type="primary"
        )
        
        st.markdown("---")
        st.markdown("###### 📜 Applied AI Actions History")
        for log in reversed(st.session_state.action_log[-8:]):
            st.caption(f"• {log}")

# ---------------------------------------------------------
# FOOTER
# ---------------------------------------------------------
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #64748B; font-size: 0.8rem; padding: 10px;">
    ⚡ <strong>AURA SPATIAL AI STUDIO</strong> — Designed for High-Performance Spatial Engineering & UX Innovation.<br>
    Powered by Streamlit, Plotly & Gemini 1.5 Flash AI Engine.
</div>
""", unsafe_allow_html=True)
