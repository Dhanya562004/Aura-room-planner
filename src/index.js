import JSZip from "jszip";
import FileSaver from 'file-saver';
import FPS from 'fps-now';

import { BlueprintJS } from './scripts/blueprint.js';
import { EVENT_LOADED, EVENT_NOTHING_2D_SELECTED, EVENT_CORNER_2D_CLICKED, EVENT_WALL_2D_CLICKED, 
    EVENT_ROOM_2D_CLICKED, EVENT_WALL_CLICKED, EVENT_ROOM_CLICKED, EVENT_NO_ITEM_SELECTED, 
    EVENT_ITEM_SELECTED, EVENT_GLTF_READY } from './scripts/core/events.js';
import { Configuration, configDimUnit, viewBounds, itemStatistics } from './scripts/core/configuration.js';
import { availableDimUnits, dimMeter, TEXTURE_NO_PREVIEW } from './scripts/core/constants.js';

import { Dimensioning } from './scripts/core/dimensioning.js';
import { ParametricsInterface } from './scripts/ParametricsInterface.js';

import * as floor_textures_json from './floor_textures.json';
import * as wall_textures_json from './wall_textures.json';
import * as default_room_json from './design.json';

// Aura Modules
import { templates } from './scripts/templates.js';
import { catalog } from './scripts/catalog.js';
import { AIAssistant } from './scripts/ai-assistant.js';
import { RecommendationEngine } from './scripts/recommendations.js';

// FPS counter initialization
const fps = FPS.of({x: 0, y: 0});
fps.start();

// Application State
let blueprint3d = null;
let aiAssistant = null;
let recommendationEngine = null;
let currentProjectName = "My Design Project";
let currentProjectId = null;
let currentSelectedStyle = "Minimalist";
let selectedRoomRef = null;
let selectedWallRef = null;
let selectedItemRef = null;

const floor_textures = floor_textures_json.default || floor_textures_json;
const floor_texture_keys = Object.keys(floor_textures);

const wall_textures = wall_textures_json.default || wall_textures_json;
const wall_texture_keys = Object.keys(wall_textures);

// Configuration options for BlueprintJS
const opts = {
    viewer2d: {
        id: 'bp3djs-viewer2d',
        viewer2dOptions: {
            'corner-radius': 12.5,
            'boundary-point-radius': 5.0,
            'boundary-line-thickness': 2.0,
            'boundary-point-color':'#6366f1',
            'boundary-line-color':'#475569',
            pannable: true,
            zoomable: true,
            scale: false,
            rotate: true,
            translate: true,
            dimlinecolor: '#6366f1',
            dimarrowcolor: '#ef4444',
            dimtextcolor: '#f1f5f9',
            pixiAppOptions: {
                resolution: window.devicePixelRatio || 1,
                antialias: true
            },
            pixiViewportOptions: {
                passiveWheel: false,
            }
        },
    },
    viewer3d: {
        id: 'bp3djs-viewer3d',
        viewer3dOptions:{
            occludedWalls: false,
            occludedRoofs: false
        }
    },
    textureDir: "models/textures/",
    widget: false,
    resize: true,
};

// Initialize BlueprintJS
blueprint3d = new BlueprintJS(opts);
Configuration.setValue(configDimUnit, dimMeter);
Configuration.setValue(itemStatistics, false);

// Initialize AI Modules
aiAssistant = new AIAssistant(blueprint3d);
recommendationEngine = new RecommendationEngine();

// DOM elements references
const elDashboardOverlay = document.getElementById('dashboard-overlay');
const elWorkspaceContainer = document.getElementById('workspace-container');
const elLoadingOverlay = document.getElementById('loading-overlay');
const elLoadingText = document.getElementById('loading-text');
const elProgressBarFill = document.getElementById('progress-bar-fill');

const elProjectList = document.getElementById('project-list');
const elBtnNewBlank = document.getElementById('btn-new-blank');
const elTemplateCards = document.querySelectorAll('.template-card');

const elBtnToggleView = document.getElementById('btn-toggle-view');
const elRoomStatusName = document.getElementById('room-status-name');
const elRoomStatusDimensions = document.getElementById('room-status-dimensions');

// Sidebar Tabs
const elTabButtons = document.querySelectorAll('.tab-btn');
const elTabPanels = document.querySelectorAll('.tab-panel');

// Editor controls
const elBtnModeMove = document.getElementById('btn-mode-move');
const elBtnModeDraw = document.getElementById('btn-mode-draw');
const elBtnModeTransform = document.getElementById('btn-mode-transform');
const elInputSnapGrid = document.getElementById('input-snap-grid');
const elRangeGridSpacing = document.getElementById('range-grid-spacing');
const elValGridSpacing = document.getElementById('val-grid-spacing');

// Context panels
const elContextCorner = document.getElementById('context-corner');
const elRangeCornerElevation = document.getElementById('range-corner-elevation');
const elValCornerElevation = document.getElementById('val-corner-elevation');
const elBtnDeleteCorner = document.getElementById('btn-delete-corner');

const elContextWall = document.getElementById('context-wall');
const elRangeWallThickness = document.getElementById('range-wall-thickness');
const elValWallThickness = document.getElementById('val-wall-thickness');
const elBtnDeleteWall = document.getElementById('btn-delete-wall');

const elContextRoom = document.getElementById('context-room');
const elInputRoomName = document.getElementById('input-room-name');

const elContextItem = document.getElementById('context-item');
const elValSelectedItemName = document.getElementById('val-selected-item-name');
const elBtnRotateItemLeft = document.getElementById('btn-rotate-item-left');
const elBtnRotateItemRight = document.getElementById('btn-rotate-item-right');
const elBtnDeleteItem = document.getElementById('btn-delete-item');

// Materials Panel
const elMaterialsRoomContext = document.getElementById('materials-room-context');
const elMaterialsWallContext = document.getElementById('materials-wall-context');
const elFloorTextureGrid = document.getElementById('floor-texture-grid');
const elWallTextureGrid = document.getElementById('wall-texture-grid');
const elPickerFloorColor = document.getElementById('picker-floor-color');
const elPickerWallColor = document.getElementById('picker-wall-color');
const elBtnAddDoorWall = document.getElementById('btn-add-door-wall');

// Settings & Exports
const elInputProjectName = document.getElementById('input-project-name');
const elBtnSaveProjectSettings = document.getElementById('btn-save-project-settings');
const elBtnResetProjectSettings = document.getElementById('btn-reset-project-settings');
const elSaveStatusText = document.getElementById('save-status-text');
const elToggleShadows = document.getElementById('toggle-shadows');
const elBtnExportPng = document.getElementById('btn-export-png');
const elBtnExportGltf = document.getElementById('btn-export-gltf');
const elBtnExportZip = document.getElementById('btn-export-zip');

// AI Chat Panel
const elChatStyleSelect = document.getElementById('chat-style-select');
const elChatMessages = document.getElementById('chat-messages');
const elChatInput = document.getElementById('chat-input');
const elBtnChatSend = document.getElementById('btn-chat-send');
const elQuickPromptBtns = document.querySelectorAll('.quick-prompt-btn');

// API Key Modal
const elModalApiKey = document.getElementById('modal-api-key');
const elInputApiKey = document.getElementById('input-api-key');
const elBtnSaveApiKey = document.getElementById('btn-save-api-key');
const elBtnClearApiKey = document.getElementById('btn-clear-api-key');
const elBtnCloseKeyModal = document.getElementById('btn-close-key-modal');
const elBtnApiKeyHeader = document.getElementById('btn-api-key-header');
const elBtnApiKeySettings = document.getElementById('btn-api-key-settings');

// AI Recommendation Banner
const elAiRecBanner = document.getElementById('ai-rec-banner');
const elAiRecText = document.getElementById('ai-rec-text');
const elBtnApplyAiRec = document.getElementById('btn-apply-ai-rec');
const elBtnCloseAiRec = document.getElementById('btn-close-ai-rec');

let activeRecommendationItem = null;

// ==========================================
// 1. DASHBOARD & PROJECT MANAGER LOGIC
// ==========================================

function getSavedProjects() {
    return JSON.parse(localStorage.getItem('aura_projects')) || {};
}

function saveProjectsList(projects) {
    localStorage.setItem('aura_projects', JSON.stringify(projects));
}

function updateDashboardProjectsList() {
    const projects = getSavedProjects();
    const keys = Object.keys(projects);
    
    if (keys.length === 0) {
        elProjectList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open empty-icon"></i>
                <p>No saved projects yet. Start with a template or create a blank design!</p>
            </div>
        `;
        return;
    }

    elProjectList.innerHTML = '';
    keys.forEach(id => {
        const p = projects[id];
        const item = document.createElement('div');
        item.className = 'project-item';
        item.innerHTML = `
            <div class="project-item-info">
                <h4>${escapeHtml(p.name)}</h4>
                <span>Last updated: ${new Date(p.updatedAt).toLocaleDateString()}</span>
            </div>
            <div class="project-item-actions">
                <button class="btn btn-primary btn-sm btn-load-proj" data-id="${id}">
                    <i class="fa-solid fa-folder-open"></i> Load
                </button>
                <button class="btn btn-danger btn-sm btn-delete-proj" data-id="${id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        elProjectList.appendChild(item);
    });

    // Event listeners for project action buttons
    document.querySelectorAll('.btn-load-proj').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            loadSavedProject(id);
        });
    });

    document.querySelectorAll('.btn-delete-proj').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            deleteSavedProject(id);
        });
    });
}

function createNewBlankProject() {
    currentProjectName = "Blank Design Room";
    currentProjectId = generateUUID();
    
    // Load empty room layout
    const emptyRoomJSON = JSON.stringify(templates.bedroom.floorplan); // Blank square template
    const designData = {
        floorplanner: JSON.parse(emptyRoomJSON),
        items: []
    };
    
    loadSerializedDesign(JSON.stringify(designData));
    enterWorkspace();
    
    elInputProjectName.value = currentProjectName;
    saveActiveProject();
}

function loadSavedProject(id) {
    const projects = getSavedProjects();
    const p = projects[id];
    if (!p) return;

    currentProjectId = id;
    currentProjectName = p.name;
    
    loadSerializedDesign(p.designData);
    enterWorkspace();

    elInputProjectName.value = currentProjectName;
    addSystemChatMessage(`Loaded saved design project: **${p.name}**.`);
}

function deleteSavedProject(id) {
    if (confirm("Are you sure you want to delete this project?")) {
        const projects = getSavedProjects();
        delete projects[id];
        saveProjectsList(projects);
        updateDashboardProjectsList();
    }
}

function saveActiveProject() {
    if (!currentProjectId) {
        currentProjectId = generateUUID();
    }
    
    const projects = getSavedProjects();
    const serialized = blueprint3d.model.exportSerialized();
    
    projects[currentProjectId] = {
        name: currentProjectName,
        designData: serialized,
        updatedAt: new Date().toISOString()
    };
    
    saveProjectsList(projects);
    updateDashboardProjectsList();
    
    // Show visual indicator
    elSaveStatusText.classList.remove('hidden');
    setTimeout(() => {
        elSaveStatusText.classList.add('hidden');
    }, 2500);
}

function loadTemplate(templateName) {
    const template = templates[templateName];
    if (!template) return;

    showLoadingOverlay();
    
    currentProjectId = generateUUID();
    currentProjectName = `${capitalizeFirst(templateName)} Design`;
    
    const design = {
        floorplanner: template.floorplan,
        items: template.items
    };
    
    // Load after brief delay to allow loading spinner to render
    setTimeout(() => {
        loadSerializedDesign(JSON.stringify(design));
        enterWorkspace();
        hideLoadingOverlay();
        elInputProjectName.value = currentProjectName;
        saveActiveProject();
        
        addSystemChatMessage(`Loaded **${capitalizeFirst(templateName)}** room template with pre-configured items.`);
        triggerAIRecommendations();
    }, 100);
}

function enterWorkspace() {
    elDashboardOverlay.classList.add('hidden');
    elWorkspaceContainer.classList.remove('hidden');
    
    // Switch to 3D room planner mode
    if (blueprint3d.currentView === 2) {
        switchViewer();
    }
    
    updateToolbarBadge();
    triggerAIRecommendations();
}

function exitToDashboard() {
    elWorkspaceContainer.classList.add('hidden');
    elDashboardOverlay.classList.remove('hidden');
    updateDashboardProjectsList();
}

// ==========================================
// 2. FURNITURE CATALOG & SPAWNING LOGIC
// ==========================================

function populateCatalogAccordion() {
    const elAccordion = document.getElementById('catalog-accordion');
    elAccordion.innerHTML = '';
    
    catalog.forEach((cat, index) => {
        const header = document.createElement('div');
        header.className = `catalog-cat-header ${index === 0 ? 'open' : ''}`;
        header.innerHTML = `
            <div class="catalog-cat-header-title">
                <span>${cat.icon}</span> ${cat.category}
            </div>
            <i class="fa-solid fa-chevron-right arrow"></i>
        `;
        
        const content = document.createElement('div');
        content.className = 'catalog-cat-content';
        
        cat.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'catalog-item-card';
            card.setAttribute('title', item.description);
            card.innerHTML = `
                <div class="catalog-item-icon"><i class="fa-solid fa-couch"></i></div>
                <h5>${item.name}</h5>
            `;
            
            card.addEventListener('click', () => {
                spawnCatalogItem(item);
            });
            content.appendChild(card);
        });
        
        header.addEventListener('click', () => {
            const isOpen = header.classList.contains('open');
            // Close all headers first
            document.querySelectorAll('.catalog-cat-header').forEach(h => h.classList.remove('open'));
            header.classList.toggle('open', !isOpen);
        });
        
        elAccordion.appendChild(header);
        elAccordion.appendChild(content);
    });
}

function spawnCatalogItem(item) {
    // Generate placement position (approximate center of active floor space)
    const dimensions = blueprint3d.model.floorplan.getDimensions(true);
    const centerPos = [dimensions.x, item.size[1] / 2, dimensions.z];
    
    const itemMetadata = {
        itemName: item.name,
        itemType: item.itemType,
        position: centerPos,
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        size: item.size,
        fixed: false,
        resizable: false,
        modelURL: item.modelURL,
        isParametric: false
    };

    try {
        blueprint3d.model.addItemByMetaData(itemMetadata);
        addSystemChatMessage(`Added **${item.name}** into the room.`);
        
        // Auto-save
        saveActiveProject();
        triggerAIRecommendations();
    } catch (e) {
        console.error("Spawning item failed", e);
    }
}

// ==========================================
// 3. MATERIALS & COLORS APPLY LOGIC
// ==========================================

function populateMaterialsPanel() {
    elFloorTextureGrid.innerHTML = '';
    elWallTextureGrid.innerHTML = '';
    
    // Populate floor textures
    floor_texture_keys.forEach(key => {
        const item = document.createElement('div');
        item.className = 'texture-item';
        const tex = floor_textures[key];
        
        if (tex.colormap) {
            item.style.backgroundImage = `url('${tex.colormap}')`;
        } else {
            item.className += ' no-preview';
            item.innerText = key.replace(/_/g, ' ');
        }
        
        item.addEventListener('click', () => {
            document.querySelectorAll('#floor-texture-grid .texture-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            if (selectedRoomRef) {
                blueprint3d.roomplanningHelper.roomTexturePack = tex;
                saveActiveProject();
            }
        });
        elFloorTextureGrid.appendChild(item);
    });

    // Populate wall textures
    wall_texture_keys.forEach(key => {
        const item = document.createElement('div');
        item.className = 'texture-item';
        const tex = wall_textures[key];
        
        if (tex.colormap) {
            item.style.backgroundImage = `url('${tex.colormap}')`;
        } else {
            item.className += ' no-preview';
            item.innerText = key.replace(/_/g, ' ');
        }
        
        item.addEventListener('click', () => {
            document.querySelectorAll('#wall-texture-grid .texture-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            if (selectedWallRef) {
                // Apply to single wall
                blueprint3d.roomplanningHelper.wallTexturePack = tex;
            } else if (selectedRoomRef) {
                // Apply to all walls in selected room
                blueprint3d.roomplanningHelper.roomWallsTexturePack = tex;
            }
            saveActiveProject();
        });
        elWallTextureGrid.appendChild(item);
    });
}

// Color picker actions
elPickerFloorColor.addEventListener('input', (e) => {
    if (selectedRoomRef) {
        blueprint3d.roomplanningHelper.setRoomFloorColor(e.target.value);
    }
});

elPickerFloorColor.addEventListener('change', () => {
    saveActiveProject();
});

elPickerWallColor.addEventListener('input', (e) => {
    if (selectedWallRef) {
        blueprint3d.roomplanningHelper.setWallColor(e.target.value);
    } else if (selectedRoomRef) {
        blueprint3d.roomplanningHelper.setRoomWallsTextureColor(e.target.value);
    }
});

elPickerWallColor.addEventListener('change', () => {
    saveActiveProject();
});

// Add door to wall
elBtnAddDoorWall.addEventListener('click', () => {
    if (selectedWallRef) {
        blueprint3d.roomplanningHelper.addParametricDoorToCurrentWall(1); // Parametric door type 1
        saveActiveProject();
        addSystemChatMessage("Added a parametric door to the selected wall.");
    }
});

// ==========================================
// 4. EDITOR MODES & SNAP LOGIC
// ==========================================

elBtnModeMove.addEventListener('click', () => {
    blueprint3d.setViewer2DModeToMove();
    setActiveModeButton(elBtnModeMove);
});

elBtnModeDraw.addEventListener('click', () => {
    blueprint3d.setViewer2DModeToDraw();
    setActiveModeButton(elBtnModeDraw);
});

elBtnModeTransform.addEventListener('click', () => {
    blueprint3d.switchViewer2DToTransform();
    setActiveModeButton(elBtnModeTransform);
});

function setActiveModeButton(activeBtn) {
    [elBtnModeMove, elBtnModeDraw, elBtnModeTransform].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Snap settings
elInputSnapGrid.addEventListener('change', (e) => {
    blueprint3d.configurationHelper.snapToGrid = e.target.checked;
});

elRangeGridSpacing.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    elValGridSpacing.innerText = `${val} cm`;
    blueprint3d.configurationHelper.gridSpacing = val;
});

// Context deletion
elBtnDeleteCorner.addEventListener('click', () => {
    blueprint3d.floorplanningHelper.deleteCurrentItem();
    elContextCorner.classList.add('hidden');
});

elBtnDeleteWall.addEventListener('click', () => {
    blueprint3d.floorplanningHelper.deleteCurrentItem();
    elContextWall.classList.add('hidden');
});

elBtnRotateItemLeft.addEventListener('click', () => {
    if (selectedItemRef) {
        blueprint3d.model.rotateItem(selectedItemRef, 0, -0.2618, 0); // ~15 degrees
        saveActiveProject();
    }
});

elBtnRotateItemRight.addEventListener('click', () => {
    if (selectedItemRef) {
        blueprint3d.model.rotateItem(selectedItemRef, 0, 0.2618, 0);
        saveActiveProject();
    }
});

elBtnDeleteItem.addEventListener('click', () => {
    if (selectedItemRef) {
        blueprint3d.model.removeItemByMetaData(selectedItemRef);
        elContextItem.classList.add('hidden');
        selectedItemRef = null;
        saveActiveProject();
        triggerAIRecommendations();
    }
});

// Range slider input actions
elRangeCornerElevation.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    elValCornerElevation.innerText = `${val} cm`;
    blueprint3d.floorplanningHelper.cornerElevation = val;
});

elRangeCornerElevation.addEventListener('change', () => saveActiveProject());

elRangeWallThickness.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) / 100;
    elValWallThickness.innerText = `${e.target.value} cm`;
    blueprint3d.floorplanningHelper.wallThickness = val;
});

elRangeWallThickness.addEventListener('change', () => saveActiveProject());

elInputRoomName.addEventListener('change', (e) => {
    blueprint3d.floorplanningHelper.roomName = e.target.value;
    updateToolbarBadge();
    saveActiveProject();
});

// ==========================================
// 5. AI INTERIOR ASSISTANT CHAT LOGIC
// ==========================================

elChatStyleSelect.addEventListener('change', (e) => {
    currentSelectedStyle = e.target.value;
    triggerAIRecommendations();
});

elBtnChatSend.addEventListener('click', () => {
    sendChatMessage();
});

elChatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
    }
});

async function sendChatMessage() {
    const text = elChatInput.value.trim();
    if (text === '') return;

    // Render User Message
    appendChatBubble('user', text, 'You');
    elChatInput.value = '';

    // Render loading indicator
    const elLoadingMsg = appendChatBubble('assistant', '<div class="spinner btn-sm"></div> Thinking...', 'Aura Assistant');

    try {
        const response = await aiAssistant.ask(text, currentSelectedStyle);
        // Remove loading and replace with output
        elLoadingMsg.remove();
        
        // Render assistant output
        const cleanResponse = parseAITriggers(response);
        appendChatBubble('assistant', cleanResponse, 'Aura Assistant');
    } catch (e) {
        elLoadingMsg.remove();
        appendChatBubble('assistant', "I encountered a styling issue trying to process this request. Please try again.", 'Aura Assistant');
    }
}

function appendChatBubble(role, content, senderName) {
    const bubble = document.createElement('div');
    bubble.className = `message ${role}`;
    
    // Parse Markdown basic features (bold, bullets, headings)
    const formattedText = formatMarkdown(content);
    
    bubble.innerHTML = `
        <div class="message-sender">${senderName}</div>
        <div class="message-text">${formattedText}</div>
    `;
    elChatMessages.appendChild(bubble);
    elChatMessages.scrollTop = elChatMessages.scrollHeight;
    return bubble;
}

function addSystemChatMessage(text) {
    appendChatBubble('system', text, 'System Notification');
}

/**
 * Scan AI messages for special bracket triggers to modify room live.
 */
function parseAITriggers(text) {
    // 1. Spawning items trigger
    const addRegex = /\[TRIGGER:\s*ADD_ITEM:\s*([^\]]+)\]/i;
    const addMatch = text.match(addRegex);
    if (addMatch) {
        const itemName = addMatch[1].trim();
        setTimeout(() => {
            // Find item in catalog
            let found = null;
            catalog.forEach(cat => {
                const i = cat.items.find(it => it.name.toLowerCase() === itemName.toLowerCase());
                if (i) found = i;
            });
            if (found) {
                spawnCatalogItem(found);
            }
        }, 1200);
        return text.replace(addRegex, `*(AI Action: Placing a ${itemName} into your layout)*`);
    }

    // 2. Style setting trigger
    const styleRegex = /\[TRIGGER:\s*SET_STYLE:\s*([^\]]+)\]/i;
    const styleMatch = text.match(styleRegex);
    if (styleMatch) {
        const styleName = styleMatch[1].trim();
        setTimeout(() => {
            elChatStyleSelect.value = styleName;
            currentSelectedStyle = styleName;
            triggerAIRecommendations();
        }, 1200);
        return text.replace(styleRegex, `*(AI Action: Switching workspace theme style to ${styleName})*`);
    }

    return text;
}

// ==========================================
// 6. RECOMMENDATION ENGINE LOGIC
// ==========================================

function triggerAIRecommendations() {
    if (!blueprint3d) return;
    
    // Wait brief moment to allow items array to update
    setTimeout(() => {
        const context = aiAssistant.getRoomContext();
        const recs = recommendationEngine.getRecommendations(currentSelectedStyle, context);
        
        if (recs.length > 0) {
            activeRecommendationItem = recs[0];
            elAiRecText.innerHTML = `Recommend adding a **${activeRecommendationItem.name}** to complete your *${currentSelectedStyle}* style room. <br><span class="help-text">${activeRecommendationItem.reason}</span>`;
            elAiRecBanner.classList.remove('hidden');
        } else {
            elAiRecBanner.classList.add('hidden');
        }
    }, 500);
}

elBtnApplyAiRec.addEventListener('click', () => {
    if (activeRecommendationItem) {
        spawnCatalogItem(activeRecommendationItem);
        elAiRecBanner.classList.add('hidden');
    }
});

elBtnCloseAiRec.addEventListener('click', () => {
    elAiRecBanner.classList.add('hidden');
});

// Hook quick queries buttons
elQuickPromptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-prompt');
        elChatInput.value = query;
        sendChatMessage();
    });
});

// ==========================================
// 7. EXPORTS AND SETTINGS LOGIC
// ==========================================

elInputProjectName.addEventListener('change', (e) => {
    currentProjectName = e.target.value;
    saveActiveProject();
});

elBtnSaveProjectSettings.addEventListener('click', () => {
    saveActiveProject();
});

elBtnResetProjectSettings.addEventListener('click', () => {
    if (confirm("Reset current design layout to empty room?")) {
        blueprint3d.model.reset();
        saveActiveProject();
        addSystemChatMessage("Reset layout to blank room.");
        triggerAIRecommendations();
    }
});

// Toggle shadow quality
elToggleShadows.addEventListener('change', (e) => {
    blueprint3d.roomplanner.setShadowsEnabled(e.target.checked);
});

// Export View as PNG Image
elBtnExportPng.addEventListener('click', () => {
    try {
        let dataURL = null;
        if (blueprint3d.currentView === 3) {
            dataURL = blueprint3d.roomplanner.exportScreenshot();
        } else {
            // Take 2D canvas screenshot
            const pixiCanvas = document.querySelector('#bp3djs-viewer2d canvas');
            if (pixiCanvas) {
                dataURL = pixiCanvas.toDataURL('image/png');
            }
        }
        
        if (dataURL) {
            const link = document.createElement('a');
            link.download = `${currentProjectName.replace(/\s+/g, '_')}_view.png`;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            addSystemChatMessage("Successfully exported viewport screenshot as PNG image.");
        }
    } catch (e) {
        console.error(e);
        alert("Failed to export canvas view.");
    }
});

elBtnExportGltf.addEventListener('click', () => {
    blueprint3d.roomplanner.exportSceneAsGTLF();
});

elBtnExportZip.addEventListener('click', () => {
    exportDesignAsPackage();
});

// API Key Dialog Triggers
elBtnApiKeyHeader.addEventListener('click', () => openApiKeyModal());
elBtnApiKeySettings.addEventListener('click', () => openApiKeyModal());
elBtnCloseKeyModal.addEventListener('click', () => closeApiKeyModal());
elModalApiKey.addEventListener('click', (e) => {
    if (e.target === elModalApiKey) closeApiKeyModal();
});

function openApiKeyModal() {
    elInputApiKey.value = aiAssistant.getApiKey();
    elModalApiKey.classList.remove('hidden');
}

function closeApiKeyModal() {
    elModalApiKey.classList.add('hidden');
}

elBtnSaveApiKey.addEventListener('click', () => {
    const key = elInputApiKey.value.trim();
    aiAssistant.setApiKey(key);
    closeApiKeyModal();
    addSystemChatMessage("Gemini API key successfully configured.");
});

elBtnClearApiKey.addEventListener('click', () => {
    aiAssistant.setApiKey('');
    elInputApiKey.value = '';
    closeApiKeyModal();
    addSystemChatMessage("Gemini API key cleared. Switched to simulation designer agent.");
});

// ==========================================
// 8. CORE EVENT LISTENERS
// ==========================================

blueprint3d.model.addEventListener(EVENT_LOADED, () => {
    hideLoadingOverlay();
    populateMaterialsPanel();
    triggerAIRecommendations();
});

// Viewport toggle view (2D vs 3D)
elBtnToggleView.addEventListener('click', () => {
    switchViewer();
});

function switchViewer() {
    blueprint3d.switchView();
    if (blueprint3d.currentView === 2) {
        elBtnToggleView.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i> Switch to 3D View';
        
        // Hide 3D contexts, show 2D
        document.getElementById('btn-mode-move').parentElement.parentElement.classList.remove('hidden');
    } else {
        elBtnToggleView.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i> Switch to 2D Editor';
        
        // Hide 2D contexts
        document.getElementById('btn-mode-move').parentElement.parentElement.classList.add('hidden');
        elContextCorner.classList.add('hidden');
        elContextWall.classList.add('hidden');
        elContextRoom.classList.add('hidden');
    }
}

// 2D Floorplanner click handlers
blueprint3d.floorplanner.addFloorplanListener(EVENT_NOTHING_2D_SELECTED, () => {
    elContextCorner.classList.add('hidden');
    elContextWall.classList.add('hidden');
    elContextRoom.classList.add('hidden');
});

blueprint3d.floorplanner.addFloorplanListener(EVENT_CORNER_2D_CLICKED, (evt) => {
    elContextCorner.classList.remove('hidden');
    elContextWall.classList.add('hidden');
    elContextRoom.classList.add('hidden');
    
    const val = Dimensioning.cmToMeasureRaw(evt.item.elevation);
    elRangeCornerElevation.value = Math.round(val);
    elValCornerElevation.innerText = `${Math.round(val)} cm`;
});

blueprint3d.floorplanner.addFloorplanListener(EVENT_WALL_2D_CLICKED, (evt) => {
    elContextCorner.classList.add('hidden');
    elContextWall.classList.remove('hidden');
    elContextRoom.classList.add('hidden');
    
    selectedWallRef = evt.item;
    const val = Dimensioning.cmToMeasureRaw(evt.item.thickness);
    elRangeWallThickness.value = Math.round(val);
    elValWallThickness.innerText = `${Math.round(val)} cm`;
    
    // Open Materials and show wall options
    switchTab('tab-materials');
    elMaterialsWallContext.classList.remove('hidden');
    elMaterialsRoomContext.classList.add('hidden');
});

blueprint3d.floorplanner.addFloorplanListener(EVENT_ROOM_2D_CLICKED, (evt) => {
    elContextCorner.classList.add('hidden');
    elContextWall.classList.add('hidden');
    elContextRoom.classList.remove('hidden');
    
    selectedRoomRef = evt.item;
    elInputRoomName.value = evt.item.name || '';
    
    // Open Materials and show room floor options
    switchTab('tab-materials');
    elMaterialsWallContext.classList.add('hidden');
    elMaterialsRoomContext.classList.remove('hidden');
});

// 3D Roomplanner click handlers
blueprint3d.roomplanner.addRoomplanListener(EVENT_ITEM_SELECTED, (evt) => {
    elContextItem.classList.remove('hidden');
    selectedItemRef = evt.itemModel || evt.item;
    elValSelectedItemName.innerText = selectedItemRef.itemName || "Selected Item";
    
    switchTab('tab-editor');
});

blueprint3d.roomplanner.addRoomplanListener(EVENT_NO_ITEM_SELECTED, () => {
    elContextItem.classList.add('hidden');
    selectedItemRef = null;
});

blueprint3d.roomplanner.addRoomplanListener(EVENT_WALL_CLICKED, (evt) => {
    selectedWallRef = evt.item;
    selectedRoomRef = null;
    
    switchTab('tab-materials');
    elMaterialsWallContext.classList.remove('hidden');
    elMaterialsRoomContext.classList.add('hidden');
});

blueprint3d.roomplanner.addRoomplanListener(EVENT_ROOM_CLICKED, (evt) => {
    selectedRoomRef = evt.item;
    selectedWallRef = null;
    
    switchTab('tab-materials');
    elMaterialsWallContext.classList.add('hidden');
    elMaterialsRoomContext.classList.remove('hidden');
});

blueprint3d.roomplanner.addRoomplanListener(EVENT_GLTF_READY, (evt) => {
    const data = evt.gltf;
    const a = window.document.createElement('a');
    const blob = new Blob([data], { type: 'text' });
    a.href = window.URL.createObjectURL(blob);
    a.download = `${currentProjectName.replace(/\s+/g, '_')}_model.gltf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addSystemChatMessage("Exported 3D scene model in GLTF format successfully.");
});

// ==========================================
// 9. HELPER UTILS & BOOTSTRAP
// ==========================================

function switchTab(tabId) {
    elTabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    elTabPanels.forEach(panel => {
        if (panel.id === tabId) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
}

elTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        switchTab(tabId);
    });
});

document.getElementById('btn-dashboard-home').addEventListener('click', () => {
    exitToDashboard();
});

function updateToolbarBadge() {
    elRoomStatusName.innerText = currentProjectName;
    try {
        const dims = blueprint3d.model.floorplan.getDimensions();
        elRoomStatusDimensions.innerText = `${(dims.x / 100).toFixed(1)}m x ${(dims.z / 100).toFixed(1)}m`;
    } catch(e) {
        elRoomStatusDimensions.innerText = "5.0m x 5.0m";
    }
}

function loadSerializedDesign(jsonString) {
    try {
        blueprint3d.model.loadSerialized(jsonString);
        updateToolbarBadge();
    } catch (e) {
        console.error("Loading serialized blueprint failed", e);
    }
}

function showLoadingOverlay() {
    elLoadingOverlay.classList.remove('hidden');
    elProgressBarFill.style.width = '0%';
    elLoadingText.innerText = '0%';
}

function hideLoadingOverlay() {
    elLoadingOverlay.classList.add('hidden');
}

// Custom ZIP package exporter
function exportDesignAsPackage() {
    function getWallTextureImages(texobject, pre_image_paths) {
        let image_paths = [];
        if (!texobject) return image_paths;
        ['normalmap', 'colormap', 'roughnessmap', 'ambientmap', 'bumpmap'].forEach(map => {
            if (texobject[map] && !pre_image_paths.includes(texobject[map])) {
                image_paths.push(texobject[map]);
            }
        });
        return image_paths;
    }

    let designFile = blueprint3d.model.exportSerialized();
    let jsonDesignFile = JSON.parse(designFile);
    let floorplan = jsonDesignFile.floorplan || jsonDesignFile.floorplanner;
    let items = jsonDesignFile.items;
    let images = [];
    let models = [];
    let i = 0;
    
    for (i = 0; i < floorplan.walls.length; i++) {
        let wall = floorplan.walls[i];
        images = images.concat(getWallTextureImages(wall.frontTexture, images));
        images = images.concat(getWallTextureImages(wall.backTexture, images));
    }
    
    if (floorplan.newFloorTextures) {
        Object.values(floorplan.newFloorTextures).forEach((texturePack) => {
            images = images.concat(getWallTextureImages(texturePack, images));
        });
    }

    for (i = 0; i < items.length; i++) {
        let item = items[i];
        if (!item.isParametric && item.modelURL && !models.includes(item.modelURL)) {
            models.push(item.modelURL);
        }
    }

    let zip = new JSZip();
    zip.file('design.blueprint3d', designFile);

    const promises = [];

    // Add textures
    images.forEach(image_path => {
        const promise = fetch(image_path)
            .then(res => res.status === 200 ? res.blob() : Promise.reject())
            .then(blob => zip.file(image_path, blob))
            .catch(() => console.warn(`Failed to package texture image: ${image_path}`));
        promises.push(promise);
    });

    // Add GLB models
    models.forEach(model_path => {
        const promise = fetch(model_path)
            .then(res => res.status === 200 ? res.blob() : Promise.reject())
            .then(blob => zip.file(model_path, blob))
            .catch(() => console.warn(`Failed to package model file: ${model_path}`));
        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        zip.generateAsync({ type: "blob" }).then(function(content) {
            FileSaver.saveAs(content, `${currentProjectName.replace(/\s+/g, '_')}_Project.zip`);
            addSystemChatMessage("Successfully packaged full layout project ZIP.");
        });
    });
}

// Utility functions
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/### (.*?)\n/g, '<h5>$1</h5>')
        .replace(/## (.*?)\n/g, '<h4>$1</h4>')
        .replace(/- (.*?)\n/g, '<li>$1</li>')
        .replace(/\n/g, '<br>');
}

// On Startup bootstrap
window.addEventListener('DOMContentLoaded', () => {
    console.log('Aura Interior Planner App Bootstrapped');
    
    // Load default room design Initially
    let default_room = JSON.stringify(default_room_json.default || default_room_json);
    loadSerializedDesign(default_room);
    
    // Initialize panels
    populateCatalogAccordion();
    populateMaterialsPanel();
    updateDashboardProjectsList();
    
    // Show dashboard overlay initially
    elDashboardOverlay.classList.remove('hidden');
    elWorkspaceContainer.classList.add('hidden');
    
    // Hook new blank and template actions
    elBtnNewBlank.addEventListener('click', createNewBlankProject);
    elTemplateCards.forEach(card => {
        card.addEventListener('click', () => {
            const templateType = card.getAttribute('data-template');
            loadTemplate(templateType);
        });
    });
});