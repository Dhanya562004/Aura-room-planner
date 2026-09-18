export const templates = {
    bedroom: {
        floorplan: {
            version: "2.0.1a",
            corners: {
                "c1": { "x": 0, "y": 0, "elevation": 2.5 },
                "c2": { "x": 0, "y": 5, "elevation": 2.5 },
                "c3": { "x": 5, "y": 5, "elevation": 2.5 },
                "c4": { "x": 5, "y": 0, "elevation": 2.5 }
            },
            walls: [
                { "corner1": "c1", "corner2": "c2", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } },
                { "corner1": "c2", "corner2": "c3", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } },
                { "corner1": "c3", "corner2": "c4", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } },
                { "corner1": "c4", "corner2": "c1", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } }
            ],
            rooms: {
                "c1,c2,c3,c4": { "name": "Cozy Bedroom" }
            },
            newFloorTextures: {
                "c1,c2,c3,c4": {
                    "colormap": "textures/Floor/Wood_Herringbone_Tiles_001/Wood_Herringbone_Tiles_001_basecolor.jpg",
                    "normalmap": "textures/Floor/Wood_Herringbone_Tiles_001/Wood_Herringbone_Tiles_001_normal.jpg",
                    "roughnessmap": "textures/Floor/Wood_Herringbone_Tiles_001/Wood_Herringbone_Tiles_001_roughness.jpg",
                    "ambientmap": "textures/Floor/Wood_Herringbone_Tiles_001/Wood_Herringbone_Tiles_001_ambientOcclusion.jpg",
                    "repeat": 100,
                    "color": "#FFFFFF"
                }
            },
            units: "m"
        },
        items: [
            {
                "itemName": "Double Bed",
                "itemType": 1,
                "position": [250, 40, 110],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [200, 80, 200],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/bedDouble.glb",
                "isParametric": false
            },
            {
                "itemName": "Bedside Drawer Table",
                "itemType": 1,
                "position": [110, 25, 60],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [50, 50, 50],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/cabinetBedDrawerTable.glb",
                "isParametric": false
            },
            {
                "itemName": "Bedside Lamp",
                "itemType": 1,
                "position": [110, 60, 60],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [30, 40, 30],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/0/lampRoundTable.glb",
                "isParametric": false
            },
            {
                "itemName": "Office Desk",
                "itemType": 1,
                "position": [410, 37.5, 300],
                "rotation": [0, 1.5708, 0],
                "scale": [1, 1, 1],
                "size": [120, 75, 60],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/desk.glb",
                "isParametric": false
            },
            {
                "itemName": "Desk Chair",
                "itemType": 1,
                "position": [340, 45, 300],
                "rotation": [0, 1.5708, 0],
                "scale": [1, 1, 1],
                "size": [60, 90, 60],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/chairDesk.glb",
                "isParametric": false
            },
            {
                "itemName": "Laptop",
                "itemType": 1,
                "position": [410, 78, 300],
                "rotation": [0, 1.5708, 0],
                "scale": [1, 1, 1],
                "size": [40, 10, 30],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/0/laptop.glb",
                "isParametric": false
            },
            {
                "itemName": "Potted Plant",
                "itemType": 1,
                "position": [70, 50, 430],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [60, 100, 60],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/pottedPlant.glb",
                "isParametric": false
            },
            {
                "itemName": "Open Bookcase",
                "itemType": 1,
                "position": [460, 100, 110],
                "rotation": [0, -1.5708, 0],
                "scale": [1, 1, 1],
                "size": [80, 200, 40],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/bookcaseOpen.glb",
                "isParametric": false
            },
            {
                "itemName": "Rectangle Rug",
                "itemType": 1,
                "position": [250, 1, 280],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [160, 2, 200],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/rugRectangle.glb",
                "isParametric": false
            }
        ]
    },
    living: {
        floorplan: {
            version: "2.0.1a",
            corners: {
                "c1": { "x": 0, "y": 0, "elevation": 2.5 },
                "c2": { "x": 0, "y": 5, "elevation": 2.5 },
                "c3": { "x": 5, "y": 5, "elevation": 2.5 },
                "c4": { "x": 5, "y": 0, "elevation": 2.5 }
            },
            walls: [
                { "corner1": "c1", "corner2": "c2", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } },
                { "corner1": "c2", "corner2": "c3", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } },
                { "corner1": "c3", "corner2": "c4", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } },
                { "corner1": "c4", "corner2": "c1", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } }
            ],
            rooms: {
                "c1,c2,c3,c4": { "name": "Modern Living Room" }
            },
            newFloorTextures: {
                "c1,c2,c3,c4": {
                    "colormap": "textures/Floor/Marble_Tiles_001/Marble_Tiles_001_basecolor.jpg",
                    "normalmap": "textures/Floor/Marble_Tiles_001/Marble_Tiles_001_normal.jpg",
                    "roughnessmap": "textures/Floor/Marble_Tiles_001/Marble_Tiles_001_roughness.jpg",
                    "ambientmap": "textures/Floor/Marble_Tiles_001/Marble_Tiles_001_ambientOcclusion.jpg",
                    "repeat": 100,
                    "color": "#FFFFFF"
                }
            },
            units: "m"
        },
        items: [
            {
                "itemName": "Lounge Sofa Long",
                "itemType": 1,
                "position": [250, 36.5, 110],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [220, 75, 90],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/loungeSofaLong.glb",
                "isParametric": false
            },
            {
                "itemName": "Coffee Table",
                "itemType": 1,
                "position": [250, 25, 240],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [120, 50, 80],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/tableCoffeeGlass.glb",
                "isParametric": false
            },
            {
                "itemName": "Television Cabinet",
                "itemType": 1,
                "position": [250, 30, 440],
                "rotation": [0, 3.14159, 0],
                "scale": [1, 1, 1],
                "size": [180, 60, 50],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/cabinetTelevisionDoors.glb",
                "isParametric": false
            },
            {
                "itemName": "Television Modern",
                "itemType": 1,
                "position": [250, 80, 440],
                "rotation": [0, 3.14159, 0],
                "scale": [1, 1, 1],
                "size": [120, 70, 15],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/2/televisionModern.glb",
                "isParametric": false
            },
            {
                "itemName": "Modern Cushion Chair",
                "itemType": 1,
                "position": [110, 36.5, 230],
                "rotation": [0, 1.0, 0],
                "scale": [1, 1, 1],
                "size": [80, 75, 80],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/chairModernCushion.glb",
                "isParametric": false
            },
            {
                "itemName": "Round Floor Lamp",
                "itemType": 1,
                "position": [100, 80, 90],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [40, 160, 40],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/lampRoundFloor.glb",
                "isParametric": false
            },
            {
                "itemName": "Potted Plant",
                "itemType": 1,
                "position": [410, 50, 90],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [60, 100, 60],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/pottedPlant.glb",
                "isParametric": false
            },
            {
                "itemName": "Rectangle Rug",
                "itemType": 1,
                "position": [250, 1, 235],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [240, 2, 180],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/rugRectangle.glb",
                "isParametric": false
            }
        ]
    },
    office: {
        floorplan: {
            version: "2.0.1a",
            corners: {
                "c1": { "x": 0, "y": 0, "elevation": 2.5 },
                "c2": { "x": 0, "y": 5, "elevation": 2.5 },
                "c3": { "x": 5, "y": 5, "elevation": 2.5 },
                "c4": { "x": 5, "y": 0, "elevation": 2.5 }
            },
            walls: [
                { "corner1": "c1", "corner2": "c2", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } },
                { "corner1": "c2", "corner2": "c3", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } },
                { "corner1": "c3", "corner2": "c4", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } },
                { "corner1": "c4", "corner2": "c1", "wallType": "STRAIGHT", "thickness": 0.2, "frontTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" }, "backTexture": { "colormap": "textures/Wall/Concrete-Wall-002/Concrete_Wall_002_basecolor.jpg", "repeat": 200, "color": "#FFFFFF" } }
            ],
            rooms: {
                "c1,c2,c3,c4": { "name": "Professional Office" }
            },
            newFloorTextures: {
                "c1,c2,c3,c4": {
                    "colormap": "textures/Floor/Terrazzo_Tiles_001/Terrazzo_Tiles_001_basecolor.jpg",
                    "normalmap": "textures/Floor/Terrazzo_Tiles_001/Terrazzo_Tiles_001_normal.jpg",
                    "roughnessmap": "textures/Floor/Terrazzo_Tiles_001/Terrazzo_Tiles_001_roughness.jpg",
                    "ambientmap": "textures/Floor/Terrazzo_Tiles_001/Terrazzo_Tiles_001_ambientOcclusion.jpg",
                    "repeat": 100,
                    "color": "#FFFFFF"
                }
            },
            units: "m"
        },
        items: [
            {
                "itemName": "Executive Desk",
                "itemType": 1,
                "position": [250, 37.5, 220],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [160, 75, 80],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/desk.glb",
                "isParametric": false
            },
            {
                "itemName": "Office Chair",
                "itemType": 1,
                "position": [250, 45, 140],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [60, 90, 60],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/chairDesk.glb",
                "isParametric": false
            },
            {
                "itemName": "Computer Screen",
                "itemType": 1,
                "position": [250, 95, 220],
                "rotation": [0, 3.14159, 0],
                "scale": [1, 1, 1],
                "size": [60, 40, 20],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/2/computerScreen.glb",
                "isParametric": false
            },
            {
                "itemName": "Keyboard",
                "itemType": 1,
                "position": [250, 78, 240],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [40, 5, 20],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/0/computerKeyboard.glb",
                "isParametric": false
            },
            {
                "itemName": "Open Bookcase",
                "itemType": 1,
                "position": [80, 100, 250],
                "rotation": [0, 1.5708, 0],
                "scale": [1, 1, 1],
                "size": [80, 200, 40],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/bookcaseOpen.glb",
                "isParametric": false
            },
            {
                "itemName": "Potted Plant",
                "itemType": 1,
                "position": [420, 50, 80],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [60, 100, 60],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/pottedPlant.glb",
                "isParametric": false
            },
            {
                "itemName": "Visitor Chair 1",
                "itemType": 1,
                "position": [180, 40, 310],
                "rotation": [0, 3.14159, 0],
                "scale": [1, 1, 1],
                "size": [60, 80, 60],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/chairModernFrameCushion.glb",
                "isParametric": false
            },
            {
                "itemName": "Visitor Chair 2",
                "itemType": 1,
                "position": [320, 40, 310],
                "rotation": [0, 3.14159, 0],
                "scale": [1, 1, 1],
                "size": [60, 80, 60],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/chairModernFrameCushion.glb",
                "isParametric": false
            },
            {
                "itemName": "Office Trashcan",
                "itemType": 1,
                "position": [350, 20, 160],
                "rotation": [0, 0, 0],
                "scale": [1, 1, 1],
                "size": [30, 40, 30],
                "fixed": false,
                "resizable": false,
                "modelURL": "models/gltf/1/trashcan.glb",
                "isParametric": false
            }
        ]
    }
};
