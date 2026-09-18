// AI Assistant Module for Room Planner

export class AIAssistant {
    constructor(blueprint3d) {
        this.blueprint3d = blueprint3d;
        this.apiKey = sessionStorage.getItem('gemini_api_key') || '';
    }

    setApiKey(key) {
        this.apiKey = key;
        sessionStorage.setItem('gemini_api_key', key);
    }

    getApiKey() {
        return this.apiKey;
    }

    /**
     * Gather detailed context from the active floorplan and items.
     */
    getRoomContext() {
        const floorplan = this.blueprint3d.model.floorplan;
        const items = this.blueprint3d.model.getItems();
        const rooms = floorplan.getRooms();
        
        let roomName = "Custom Room";
        let floorTexture = "Standard Wood";
        
        if (rooms.length > 0) {
            roomName = rooms[0].name || "My Room";
            // Get floor texture details
            const roomTex = rooms[0].textureHelper;
            if (roomTex && roomTex.colormap) {
                // Parse filename from path
                const parts = roomTex.colormap.split('/');
                floorTexture = parts[parts.length - 1].replace('_basecolor.jpg', '').replace(/_/g, ' ');
            }
        }

        // Calculate dimensions
        let areaSqM = 0;
        try {
            // Estimate area based on corners
            const dimensions = floorplan.getDimensions();
            // Dimensions are in cm
            const widthM = (dimensions.x / 100).toFixed(1);
            const depthM = (dimensions.z / 100).toFixed(1);
            areaSqM = ((dimensions.x * dimensions.z) / 10000).toFixed(1);
        } catch (e) {
            areaSqM = 25.0; // fallback standard
        }

        const itemsList = items.map(item => {
            return {
                name: item.itemName,
                model: item.modelURL,
                size: item.size.toArray().map(v => Math.round(v)),
                position: item.position.toArray().map(v => Math.round(v))
            };
        });

        return {
            roomName,
            areaSqM,
            floorTexture,
            itemsCount: itemsList.length,
            items: itemsList
        };
    }

    /**
     * Send a design query to the AI assistant.
     */
    async ask(userMessage, selectedStyle = 'Modern') {
        const context = this.getRoomContext();
        
        // If API key is available, use real Gemini API
        if (this.apiKey && this.apiKey.trim() !== '') {
            try {
                return await this.callGeminiAPI(userMessage, context, selectedStyle);
            } catch (err) {
                console.error("Gemini API Error, falling back to local simulation:", err);
                return this.generateSimulatedResponse(userMessage, context, selectedStyle) + 
                    "\n\n*(Note: Encountered an error with the Gemini API. Falling back to the offline designer agent.)*";
            }
        } else {
            // Fallback to offline simulation
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.generateSimulatedResponse(userMessage, context, selectedStyle));
                }, 1000);
            });
        }
    }

    /**
     * Direct integration with client-side Gemini API
     */
    async callGeminiAPI(userMessage, context, selectedStyle) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        
        const systemPrompt = `You are a premium, expert interior design assistant. You help users style their rooms, select color palettes, recommend furniture layout improvements, and answer design queries.
You have access to the user's active 3D room planner layout. 
Active Layout Context:
- Room Type: ${context.roomName}
- Room Area: ${context.areaSqM} square meters
- Floor Texture: ${context.floorTexture}
- Placed Furniture: ${JSON.stringify(context.items)}
- Selected Theme/Style Preference: ${selectedStyle}

Rules:
1. Provide highly specific, actionable design advice based on the active layout and selected theme.
2. Structure your response with clean markdown headings, bullet points, and highlights.
3. Suggest 2-3 specific furniture items that would fit nicely (recommend items like Beds, Lounge Sofas, Coffee Tables, Rugs, Floor Lamps, or Plants).
4. Do not mention API keys or system logs. Keep the conversation stylish, professional, and friendly.
5. If the user asks you to add an item or apply a theme, include a special metadata trigger in your response at the end of the text on a new line (formatted as: [TRIGGER: ADD_ITEM: <ItemName>] or [TRIGGER: SET_STYLE: <StyleName>]). This allows the interface to react to your commands.
`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: systemPrompt },
                            { text: `User asks: ${userMessage}` }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Invalid response format from Gemini API");
        }
    }

    /**
     * Offline agent that returns extremely detailed, context-specific design recommendations.
     */
    generateSimulatedResponse(userMessage, context, selectedStyle) {
        const query = userMessage.toLowerCase();
        
        // Analyze context for intelligent feedback
        const hasRug = context.items.some(i => i.name.toLowerCase().includes('rug'));
        const hasPlant = context.items.some(i => i.name.toLowerCase().includes('plant'));
        const hasLamp = context.items.some(i => i.name.toLowerCase().includes('lamp'));
        
        let response = "";

        if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
            response = `### Hello! I am your AI Interior Design Assistant. 👋

I see you are designing a **${context.roomName}** (${context.areaSqM} m²) styled in a **${selectedStyle}** theme. 

Currently, you have placed **${context.itemsCount} furniture items** on a **${context.floorTexture}** floor.

How can I assist you today? You can:
- Ask for **layout improvements** based on your current setup.
- Request **color palette suggestions** matching the **${selectedStyle}** style.
- Ask for **furniture recommendations** to fill empty spaces.`;
            return response;
        }

        if (query.includes('color') || query.includes('palette') || query.includes('paint') || query.includes('wall')) {
            response = `### 🎨 ${selectedStyle} Color Palette Recommendations

For your **${context.roomName}**, here is a harmonized color scheme aligned with your **${selectedStyle}** style:

*   **Primary Wall Color**: ${selectedStyle === 'Modern' ? 'Cool Slate Gray (#ECEFF1)' : selectedStyle === 'Minimalist' ? 'Warm Alabaster White (#F5F5F3)' : selectedStyle === 'Scandinavian' ? 'Chalky Soft White (#FAF9F6)' : 'Classic Cream Beige (#F5EBE6)'}
*   **Secondary/Accent Wall**: ${selectedStyle === 'Modern' ? 'Deep Charcoal Blue (#263238)' : selectedStyle === 'Minimalist' ? 'Matte Slate Accent (#37474F)' : selectedStyle === 'Scandinavian' ? 'Forest Sage Green (#8FBC8F)' : 'Deep Burgundy (#5C1D24)'}
*   **Trim & Ceiling**: Clean Flat White (#FFFFFF)
*   **Accent Decor Tones**: ${selectedStyle === 'Modern' ? 'Brushed brass metals, mustard yellow highlights.' : selectedStyle === 'Minimalist' ? 'Black steel framing, pale oak wood textures.' : selectedStyle === 'Scandinavian' ? 'Warm beige textiles, tan leather, soft copper accents.' : 'Polished mahogany wood, forest green cushions.'}

Would you like me to recommend some items that match these tones?
[TRIGGER: SET_STYLE: ${selectedStyle}]`;
            return response;
        }

        if (query.includes('layout') || query.includes('improve') || query.includes('arrangement') || query.includes('placement')) {
            response = `### 📐 Spatial Layout Analysis for your ${context.roomName}

Looking at your current layout (${context.areaSqM} m² with ${context.itemsCount} items):

`;
            
            // Spatial density checks
            if (context.itemsCount === 0) {
                response += `*   **Empty Canvas**: You haven't added any furniture items yet! Start by choosing one of our room templates (like Bedroom or Living Room) or add a core piece from the catalog (e.g. a **Double Bed** or **Lounge Sofa**).`;
            } else {
                response += `*   **Core Furniture**: You have placed **${context.items[0].name}** as a key item. Ensure there is at least 70-80cm of walking space around it to keep traffic pathways clear.
`;
                if (!hasRug) {
                    response += `*   **Grounding the Space**: I notice you don't have an area rug. Adding a **Rectangle Area Rug** in the center will visually group your seating or bedding arrangement and make the floor feel warm.
`;
                }
                if (!hasPlant) {
                    response += `*   **Biophilic Accent**: Consider adding a **Large Potted Plant** in an empty corner. Plants break up sharp wall angles and bring life into a **${selectedStyle}** layout.
`;
                }
                if (!hasLamp) {
                    response += `*   **Lighting Layers**: Your layout needs ambient lighting. A **Round Floor Lamp** positioned near your seating or desk area will provide pleasant diffuse light instead of harsh overhead lighting.
`;
                }
                response += `*   **Style Harmony**: With your **${context.floorTexture}** floor, avoid wood finishes that clash. Try matching tables and desks with either black metal legs or contrasting light colors.`;
            }
            
            return response;
        }

        // Default smart suggestion
        response = `### 💡 Interior Design Recommendations (Theme: ${selectedStyle})

Here are some tailored recommendations for your **${context.roomName}**:

1.  **Introduce Layered Lighting**: Place a **Round Floor Lamp** next to your seating to create a cozy reading nook.
2.  **Add Natural Textures**: Placing a **Rectangle Area Rug** will anchor the layout and complement your **${context.floorTexture}** floor.
3.  **Incorporate Greenery**: Add a **Large Potted Plant** in the corner to enhance air quality and visual comfort.
4.  **Furnishing**: Try adding a **Glass Coffee Table** or **Modern Armchair** to complete the functionality of the space.

*Ask me for specific layout tips, color palettes, or furniture ideas!*`;

        if (!hasPlant) {
            response += `\n\n[TRIGGER: ADD_ITEM: Large Potted Plant]`;
        } else if (!hasRug) {
            response += `\n\n[TRIGGER: ADD_ITEM: Rectangle Area Rug]`;
        }

        return response;
    }
}
