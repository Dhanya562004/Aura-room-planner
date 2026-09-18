import { catalog } from './catalog.js';

export class RecommendationEngine {
    constructor() {
        // Flatten catalog items for easy searching
        this.allCatalogItems = [];
        catalog.forEach(cat => {
            cat.items.forEach(item => {
                this.allCatalogItems.push({
                    ...item,
                    category: cat.category
                });
            });
        });
    }

    getRecommendations(currentStyle, roomContext) {
        const recommendations = [];
        const currentItemNames = roomContext.items.map(i => i.name.toLowerCase());

        // Recommendation logic based on style and currently placed items
        if (currentStyle === 'Modern') {
            this.recommendForModern(currentItemNames, recommendations);
        } else if (currentStyle === 'Minimalist') {
            this.recommendForMinimalist(currentItemNames, recommendations);
        } else if (currentStyle === 'Scandinavian') {
            this.recommendForScandinavian(currentItemNames, recommendations);
        } else {
            this.recommendForTraditional(currentItemNames, recommendations);
        }

        // Always suggest a plant and a lamp if not present
        const hasPlant = currentItemNames.some(n => n.includes('plant'));
        if (!hasPlant) {
            const plantItem = this.findCatalogItem("Large Potted Plant");
            if (plantItem) {
                recommendations.push({ 
                    ...plantItem, 
                    reason: "Brings organic texture and breaks up sharp room angles." 
                });
            }
        }

        const hasLamp = currentItemNames.some(n => n.includes('lamp'));
        if (!hasLamp) {
            const lampItem = this.findCatalogItem("Round Floor Lamp");
            if (lampItem) {
                recommendations.push({ 
                    ...lampItem, 
                    reason: "Creates warm ambient lighting levels for evening comfort." 
                });
            }
        }

        const hasRug = currentItemNames.some(n => n.includes('rug'));
        if (!hasRug) {
            const rugItem = this.findCatalogItem("Rectangle Area Rug");
            if (rugItem) {
                recommendations.push({
                    ...rugItem,
                    reason: "Grounds seating configurations and absorbs spatial echoes."
                });
            }
        }

        // Deduplicate suggestions by name
        const uniqueRecs = [];
        const seenNames = new Set();
        for (const rec of recommendations) {
            if (!seenNames.has(rec.name)) {
                seenNames.add(rec.name);
                uniqueRecs.push(rec);
            }
        }

        // Limit to 3 suggestions
        return uniqueRecs.slice(0, 3);
    }

    findCatalogItem(name) {
        return this.allCatalogItems.find(i => i.name.toLowerCase() === name.toLowerCase()) || null;
    }

    recommendForModern(currentItemNames, recs) {
        if (!currentItemNames.some(n => n.includes('sofa') || n.includes('bed'))) {
            const sofa = this.findCatalogItem("Long Lounge Sofa");
            if (sofa) recs.push({ ...sofa, reason: "A sleek, low-profile anchor for the modern living layout." });
        }
        if (!currentItemNames.some(n => n.includes('coffee table') || n.includes('desk'))) {
            const table = this.findCatalogItem("Glass Coffee Table");
            if (table) recs.push({ ...table, reason: "Sleek glass reflection adds modern high-end aesthetic." });
        }
        if (!currentItemNames.some(n => n.includes('television') || n.includes('tv'))) {
            const tv = this.findCatalogItem("Modern Television");
            if (tv) recs.push({ ...tv, reason: "Provides entertainment functionality with a slim wall profile." });
        }
    }

    recommendForMinimalist(currentItemNames, recs) {
        if (!currentItemNames.some(n => n.includes('chair'))) {
            const chair = this.findCatalogItem("Modern Armchair");
            if (chair) recs.push({ ...chair, reason: "Simple geometric profile with maximum style and space efficiency." });
        }
        if (!currentItemNames.some(n => n.includes('table') || n.includes('desk'))) {
            const table = this.findCatalogItem("Square Coffee Table");
            if (table) recs.push({ ...table, reason: "Compact square geometry with zero visual clutter." });
        }
    }

    recommendForScandinavian(currentItemNames, recs) {
        if (!currentItemNames.some(n => n.includes('sofa') || n.includes('bed'))) {
            const sofa = this.findCatalogItem("Modern Sofa");
            if (sofa) recs.push({ ...sofa, reason: "Inviting grey fabric textures evoke cozy Nordic hygge." });
        }
        if (!currentItemNames.some(n => n.includes('chair'))) {
            const chair = this.findCatalogItem("Frame Lounge Chair");
            if (chair) recs.push({ ...chair, reason: "Light wood framing complements natural oak floor options." });
        }
    }

    recommendForTraditional(currentItemNames, recs) {
        if (!currentItemNames.some(n => n.includes('bed') || n.includes('sofa'))) {
            const bed = this.findCatalogItem("Double Bed");
            if (bed) recs.push({ ...bed, reason: "A solid wooden centerpiece to create a classically comfortable suite." });
        }
        if (!currentItemNames.some(n => n.includes('cabinet') || n.includes('table'))) {
            const cabinet = this.findCatalogItem("Bedside Drawer Table");
            if (cabinet) recs.push({ ...cabinet, reason: "Rich dark wood cabinet layout adds vintage class." });
        }
    }
}
