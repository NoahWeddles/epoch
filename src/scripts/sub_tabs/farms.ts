import { playerData, type PlayerData } from "../player_data";
import { add_event } from "../event_dialogue";
import { unlocked_events } from "../events";

const harvest_rate = 0.01;
let harvest_timer = 0;
let set_harvest_progress_bar: ((timer: number) => void) | null = null;



export function init() {
    const harvest_progress_bar = document.querySelector<HTMLElement>(".harvest-progress")!;
    set_harvest_progress_bar = (timer: number) => {
        harvest_progress_bar.style.width = `${timer * 100}%`;
    };

    if (unlocked_events.farmer_unlock) {
        document.querySelectorAll<HTMLElement>(".farmer-event").forEach(el => { el.style.display = "" });
    }
    document.querySelector(".gather-food")!
        .addEventListener("timeout-click", () => {
            playerData.food += 10;
    });
}

setInterval(() => {
    harvest_timer += (playerData.farmers/10) * harvest_rate;
    if (set_harvest_progress_bar !== null) {
        set_harvest_progress_bar(harvest_timer);
    }
    if (harvest_timer >= 1) {
        harvest_timer = 0;
        playerData.food += playerData.farmers;
    }
}, 10);

