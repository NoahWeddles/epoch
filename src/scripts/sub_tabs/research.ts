import { playerData } from "../player_data";

interface Technology {
    id: string;
    display: string;
    description: string;
    requiredTech?: Array<string>;
    action: ()=> void;
    researchCost: number;
    x?: number;
    y?: number;
}

const technologies: Array<Technology> = [
    {
        id: "metal_working",
        display: "Metal Working",
        researchCost: 10,
        action: () => {
            document.body.classList.add("tech-metal_working");
        },
        description: "Allows the use of metals and alloys, stronger than the primitive materials. Unlocks the ability to forage for small amounts of ore"
    },
    {
        id: "basic_military",
        display: "Basic Military",
        researchCost: 25,
        requiredTech: ["metal_working", "agriculture"],
        action: () => {
            document.body.classList.add("tech-basic_military");
        },
        description: "Allows the formation of a rudimentary military. Unlocks soldiers and conquest functionality."
    },
    {
        id: "agriculture",
        display: "Agriculture",
        researchCost: 5,
        action: () => {
            document.body.classList.add("tech-agriculture");
        },
        description: "Grants the ability to cultivate crops. Unlocks farms."
    },
    {
        id: "pottery",
        display: "Pottery",
        researchCost: 10,
        action: () => {

        },
        description: "Pottery"
    },
];

const stored_unlocked = localStorage.getItem("unlocked_technologies");
export const unlocked_technologies: Record<string, boolean> = stored_unlocked
    ? JSON.parse(stored_unlocked)
    : Object.fromEntries(technologies.map(tech => [tech.id, false]));

export function doActions(){
    Object.entries(unlocked_technologies).forEach(([id, unlocked]) => {
        if (unlocked) technologies.find(tech => tech.id == id)?.action()
    })
}
doActions();

const CARD_W = 140;
const CARD_H = 52;
const COL_GAP = 300;
const ROW_GAP = 200;

document.querySelector(".give-research")?.addEventListener("click", ()=>{
    playerData.research_points += 1
    console.log(playerData.research_points + " gave 1 research point")
})

export function init(): void {

    const viewport = document.querySelector<HTMLElement>(".viewport")!;
    const world = document.querySelector<HTMLElement>(".world")!;

    layoutTechnologies();
    drawTechnologies(world);

    let isDragging = false;
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;

    viewport.addEventListener("mousedown", (e: MouseEvent) => {
        isDragging = true;
        viewport.classList.add("dragging");
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
    });

    window.addEventListener("mousemove", (e: MouseEvent) => {
        if (!isDragging) return;
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        world.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
        viewport.classList.remove("dragging");
    });
}

function getDepth(id: string, memo: Map<string, number> = new Map()): number {
    if (memo.has(id)) return memo.get(id)!;
    const tech = technologies.find(t => t.id === id);
    if (!tech?.requiredTech?.length) {
        memo.set(id, 0);
        return 0;
    }
    const depth = 1 + Math.max(...tech.requiredTech.map(p => getDepth(p, memo)));
    memo.set(id, depth);
    return depth;
}

function layoutTechnologies(): void {
    // 1. Assign column (x) by depth.
    const depthMemo = new Map<string, number>();
    const byColumn = new Map<number, Technology[]>();

    for (const tech of technologies) {
        const col = getDepth(tech.id, depthMemo);
        if (!byColumn.has(col)) byColumn.set(col, []);
        byColumn.get(col)!.push(tech);
    }

    // 2. For each tech, determine row (y) within its column based on its
    //    parents' average y — or sequential order for roots.
    //    We process columns left-to-right so parents are positioned first.
    const maxCol = Math.max(...byColumn.keys());

    for (let col = 0; col <= maxCol; col++) {
        const group = byColumn.get(col) ?? [];

        if (col === 0) {
            // Roots: space evenly
            group.forEach((tech, i) => {
                tech.x = 40;
                tech.y = 40 + i * ROW_GAP;
            });
            continue;
        }

        // Group children by the set of their parents (so shared-parent siblings
        // are clustered) then space them relative to their parent midpoint.
        const parentGroups = new Map<string, Technology[]>();

        for (const tech of group) {
            const key = (tech.requiredTech ?? []).sort().join("|");
            if (!parentGroups.has(key)) parentGroups.set(key, []);
            parentGroups.get(key)!.push(tech);
        }

        // Sort parent groups by parent midpoint y so overall ordering is clean.
        const sortedGroups = [...parentGroups.entries()].sort(([, a], [, b]) => {
            return parentMidY(a[0]) - parentMidY(b[0]);
        });

        // Assign y values: center the sibling cluster around the parent midpoint.
        for (const [, siblings] of sortedGroups) {
            const midY = parentMidY(siblings[0]);
            const total = siblings.length;
            const span = (total - 1) * ROW_GAP;

            siblings.forEach((tech, i) => {
                tech.x = 40 + col * COL_GAP;
                tech.y = midY - span / 2 + i * ROW_GAP;
            });
        }
    }
}

function parentMidY(tech: Technology): number {
    const parents = (tech.requiredTech ?? [])
        .map(id => technologies.find(t => t.id === id))
        .filter((t): t is Technology => !!t && t.y !== undefined);
    if (!parents.length) return 0;
    return parents.reduce((sum, p) => sum + p.y!, 0) / parents.length;
}

function drawTechnologies(world: HTMLElement): void {
    const template = document.querySelector<HTMLTemplateElement>("template.technology")!;

    for (const tech of technologies) {
        const frag = template.content.cloneNode(true) as DocumentFragment;
        const card = frag.firstElementChild as HTMLElement;

        card.dataset.techId = tech.id;          // <-- tag each card
        card.style.left = `${tech.x!}px`;
        card.style.top = `${tech.y!}px`;

        card.querySelector(".name")!.textContent = tech.display;
        card.querySelector(".cost")!.textContent = String(tech.researchCost);
        card.querySelector(".description")!.textContent = tech.description

        card.addEventListener("click", () => unlockTechnology(tech)) // <-- add the action for unlocking

        world.appendChild(frag);
    }

    drawConnections(world);
}

function unlockTechnology(tech: Technology): void{
    let can_unlock : boolean = true

    if (playerData.research_points < tech.researchCost) can_unlock = false;
    if (unlocked_technologies[tech.id] === true) can_unlock = false;

    tech.requiredTech?.forEach(id => {
        if(!unlocked_technologies[id]) can_unlock = false
    });

    if (can_unlock){
        unlocked_technologies[tech.id] = true
        localStorage.setItem("unlocked_technologies", JSON.stringify(unlocked_technologies));
        playerData.research_points -= tech.researchCost

        tech.action()
    }
}

function drawConnections(world: HTMLElement): void {
    // Measure the canvas bounds so the SVG covers the whole scrollable area
    const allX = technologies.map(t => t.x! + CARD_W);
    const allY = technologies.map(t => t.y! + CARD_H);
    const svgW = Math.max(...allX) + 60;
    const svgH = Math.max(...allY) + 60;

    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", String(svgW));
    svg.setAttribute("height", String(svgH));
    svg.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;z-index:0;overflow:visible";

    // Arrow marker
    const defs = document.createElementNS(NS, "defs");
    const marker = document.createElementNS(NS, "marker");
    marker.setAttribute("id", "tech-arrow");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "6");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("orient", "auto-start-reverse");
    const arrowPath = document.createElementNS(NS, "path");
    arrowPath.setAttribute("d", "M2 1L8 5L2 9");
    arrowPath.setAttribute("fill", "none");
    arrowPath.setAttribute("stroke", "context-stroke");
    arrowPath.setAttribute("stroke-width", "1.5");
    arrowPath.setAttribute("stroke-linecap", "round");
    arrowPath.setAttribute("stroke-linejoin", "round");
    marker.appendChild(arrowPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Draw one bezier per prerequisite edge
    for (const child of technologies) {
        if (!child.requiredTech?.length) continue;
        for (const parentId of child.requiredTech) {
            const parent = technologies.find(t => t.id === parentId);
            if (!parent) continue;

            // Exit: right-mid of parent card
            const x1 = parent.x! + CARD_W;
            const y1 = parent.y! + CARD_H / 2;
            // Enter: left-mid of child card
            const x2 = child.x!;
            const y2 = child.y! + CARD_H / 2;
            // Control points: pull horizontally to midpoint column
            const cx = (x1 + x2) / 2;

            const path = document.createElementNS(NS, "path");
            path.setAttribute("d", `M${x1} ${y1} C${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "rgba(128,120,255,0.45)");
            path.setAttribute("stroke-width", "1.5");
            path.setAttribute("marker-end", "url(#tech-arrow)");
            svg.appendChild(path);
        }
    }

    // Insert behind the cards
    world.insertBefore(svg, world.firstChild);
}
