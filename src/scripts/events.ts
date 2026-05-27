import { add_event } from "./event_dialogue";
import { playerData, type PlayerData } from "./player_data";

interface ThresholdEvent {
    message: string;
    fields: Array<keyof PlayerData>;
    thresholds: number[];
    action: () => void;
}

const threshold_events: Record<string, ThresholdEvent> = {
    farmer_unlock: {
        message: "Use farmers to gather food.",
        fields: ["population"],
        thresholds: [10],
        action: () => {
            console.log("Unlocking farmers");
            document.querySelectorAll<HTMLElement>(".farmer-event").forEach(el => { el.style.display = "" });
        },
    },
    soldier_unlock: {
        message: "Use soldiers to defend your settlement, and expand your territory.",
        fields: ["food"],
        thresholds: [1000],
        action: () => {
            console.log("Unlocking soldiers");
            document.querySelectorAll<HTMLElement>(".soldier-event").forEach(el => { el.style.display = "" });
        },
    },
    forager_unlock: {
        message: "Foragers will gather important resources.",
        fields: ["population", "food"],
        thresholds: [15, 500],
        action: () => {
            console.log("Unlocking soldiers");
            document.querySelectorAll<HTMLElement>(".soldier-event").forEach(el => { el.style.display = "" });
        },
    },
};

const stored_unlocked = localStorage.getItem("unlocked_events");
export const unlocked_events: Record<string, boolean> = stored_unlocked
    ? JSON.parse(stored_unlocked)
    : Object.fromEntries(Object.keys(threshold_events).map(key => [key, false]));

interface MiscEvent {
    message: string;
    chance: number;
    action: () => void;
}

const misc_events: Record<string, MiscEvent> = {
    plague: {
        message: "A plague has struck your settlement, killing 10% of your population.",
        chance: 0,
        action: () => {
            const deaths = Math.floor(playerData.population * 0.1);
            playerData.population -= deaths;
            add_event(`The plague has killed ${deaths} people.`);
        },
    },
};

Object.keys(unlocked_events).forEach(key => {
    if (unlocked_events[key]) {
        threshold_events[key].action();
    }
});

setInterval(() => {
    for (const event_key in threshold_events) {
        const event = threshold_events[event_key];
        
        for(let i: number = 0; i < event.fields.length; i++){
            if (playerData[event.fields[i]] >= event.thresholds[i] && !unlocked_events[event_key]) {
                add_event(event.message);
                event.action();
                unlocked_events[event_key] = true;
                localStorage.setItem("unlocked_events", JSON.stringify(unlocked_events));
            }
        }
    }
    for (const event_key in misc_events) {
        const event = misc_events[event_key];
        if (Math.random() < event.chance) {
            add_event(event.message);
            event.action();
        }
    }
}, 1000);
