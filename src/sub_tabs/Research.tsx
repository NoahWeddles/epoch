import { useRef, useState, useMemo, useCallback } from "react"
import { technologies, unlocked_technologies } from "../lib/research";
import type { Technology } from "../lib/research";
import { changeValue, useGameStore } from "../context/GameContext";

const CARD_W = 140;
const CARD_H = 52;
const COL_GAP = 300;
const ROW_GAP = 200;

function getDepth(id: string, memo: Map<string, number> = new Map()): number {
    if (memo.has(id)) return memo.get(id)!;
    const tech = technologies.find(t => t.id === id);
    if (!tech?.requiredTech?.length) { memo.set(id, 0); return 0; }
    const depth = 1 + Math.max(...tech.requiredTech.map(p => getDepth(p, memo)));
    memo.set(id, depth);
    return depth;
}

function parentMidY(tech: Technology, laid: Map<string, { x: number; y: number }>): number {
    const parents = (tech.requiredTech ?? []).map(id => laid.get(id)).filter((p): p is { x: number; y: number } => !!p);
    if (!parents.length) return 0;
    return parents.reduce((sum, p) => sum + p.y, 0) / parents.length;
}

function computeLayout(techs: Technology[]): Technology[] {
    const depthMemo = new Map<string, number>();
    const byColumn = new Map<number, Technology[]>();

    for (const tech of techs) {
        const col = getDepth(tech.id, depthMemo);
        if (!byColumn.has(col)) byColumn.set(col, []);
        byColumn.get(col)!.push(tech);
    }

    const maxCol = Math.max(...byColumn.keys());
    const positions = new Map<string, { x: number; y: number }>();
    const laid = new Map<string, { x: number; y: number }>();

    for (let col = 0; col <= maxCol; col++) {
        const group = byColumn.get(col) ?? [];

        if (col === 0) {
            group.forEach((tech, i) => {
                const pos = { x: 40, y: 40 + i * ROW_GAP };
                positions.set(tech.id, pos);
                laid.set(tech.id, pos);
            });
            continue;
        }

        const parentGroups = new Map<string, Technology[]>();
        for (const tech of group) {
            const key = (tech.requiredTech ?? []).sort().join("|");
            if (!parentGroups.has(key)) parentGroups.set(key, []);
            parentGroups.get(key)!.push(tech);
        }

        const sortedGroups = [...parentGroups.entries()].sort(([, a], [, b]) =>
            parentMidY(a[0], laid) - parentMidY(b[0], laid)
        );

        for (const [, siblings] of sortedGroups) {
            const midY = parentMidY(siblings[0], laid);
            const span = (siblings.length - 1) * ROW_GAP;
            siblings.forEach((tech, i) => {
                const pos = { x: 40 + col * COL_GAP, y: midY - span / 2 + i * ROW_GAP };
                positions.set(tech.id, pos);
                laid.set(tech.id, pos);
            });
        }
    }

    return techs.map(t => ({ ...t, ...positions.get(t.id) }));
}

function ConnectionLayer({ laid }: { laid: Technology[] }) {
    const svgW = Math.max(...laid.map(t => (t.x ?? 0) + CARD_W)) + 60;
    const svgH = Math.max(...laid.map(t => (t.y ?? 0) + CARD_H)) + 60;

    return (
        <svg width={svgW} height={svgH} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 0, overflow: "visible" }}>
            <defs>
                <marker id="tech-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
            </defs>
            {laid.flatMap(child =>
                (child.requiredTech ?? []).map(parentId => {
                    const parent = laid.find(t => t.id === parentId);
                    if (!parent) return null;
                    const x1 = (parent.x ?? 0) + CARD_W-18, y1 = (parent.y ?? 0) + CARD_H / 2;
                    const x2 = child.x ?? 0, y2 = (child.y ?? 0) + CARD_H / 2;
                    const cx = (x1 + x2) / 2;
                    return <path key={`${parentId}->${child.id}`} d={`M${x1} ${y1} C${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" markerEnd="url(#tech-arrow)" />;
                })
            )}
        </svg>
    );
}

interface TechnologyCardProps {
    tech: Technology;
    unlocked: Record<string, boolean>;
    onUnlock: (tech: Technology) => void;
}

function TechnologyCard({ tech, unlocked, onUnlock }: TechnologyCardProps) {
    const isUnlocked = unlocked[tech.id] === true;
    const prereqsMet = (tech.requiredTech ?? []).every(id => unlocked[id]);
    const stateClass = isUnlocked ? "opacity-60 cursor-default" : prereqsMet ? "hover:brightness-110 active:brightness-80 cursor-pointer" : "opacity-40 cursor-not-allowed";
    return (
        <div onClick={() => onUnlock(tech)} className={`absolute technology_button flex h-15 w-35 p-2 gap-2 border-2 border-main1 ${stateClass}`} style={{ left: tech.x, top: tech.y }}>
            <p className="name">{tech.display}</p>
            <p className="cost">{tech.researchCost}</p>
            <span className="tech_tooltip description absolute left-45 p-2 text-sm max-w-150 min-w-50 min-h-0 border-2 bg-main2">{tech.description}</span>
        </div>
    );
}

export default function Research() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const worldRef = useRef<HTMLDivElement>(null);
    const { research_points } = useGameStore();
    const [unlocked, setUnlocked] = useState<Record<string, boolean>>(() => ({ ...unlocked_technologies }));
    const laid = useMemo(() => computeLayout(technologies), []);
    const drag = useRef({ active: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

    function handleMouseDown(e: React.MouseEvent) {
        drag.current.active = true;
        viewportRef.current?.classList.add("dragging");
        drag.current.startX = e.clientX - drag.current.offsetX;
        drag.current.startY = e.clientY - drag.current.offsetY;
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (!drag.current.active) return;
        drag.current.offsetX = e.clientX - drag.current.startX;
        drag.current.offsetY = e.clientY - drag.current.startY;
        if (worldRef.current) worldRef.current.style.transform = `translate(${drag.current.offsetX}px, ${drag.current.offsetY}px)`;
    }

    function handleMouseUp() {
        drag.current.active = false;
        viewportRef.current?.classList.remove("dragging");
    }

    const handleUnlock = useCallback((tech: Technology) => {
        if (research_points < tech.researchCost) return;
        if (unlocked[tech.id]) return;
        if ((tech.requiredTech ?? []).some(id => !unlocked[id])) return;
        const next = { ...unlocked, [tech.id]: true };
        unlocked_technologies[tech.id] = true;
        localStorage.setItem("unlocked_technologies", JSON.stringify(next));
        changeValue("research_points", -tech.researchCost);
        tech.action();
        setUnlocked(next);
    }, [research_points, unlocked]);

    return (
        <div ref={viewportRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className="viewport border-2 border-main1 relative w-full h-full overflow-hidden">
            <div ref={worldRef} className="world relative">
                <ConnectionLayer laid={laid} />
                {laid.map(tech => <TechnologyCard key={tech.id} tech={tech} unlocked={unlocked} onUnlock={handleUnlock} />)}
            </div>
        </div>
    );
}