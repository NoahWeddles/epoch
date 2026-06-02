import { playerData, type PlayerData } from "../player_data";
import { add_event } from "../event_dialogue";
import { unlocked_events } from "../events";


let harvest_timer = 0;
let set_harvest_progress_bar: ((timer: number) => void) | null = null;

const HARVEST_RATE = 1 / 1500;
const TICK_MS = 10;
const FOOD_PER_SET = 5

const farm_cost = {
    wood: 10,
    stone: 10,
}

export function init() {
    const harvest_progress_bar = document.querySelector<HTMLElement>(".harvest-progress")!;
    set_harvest_progress_bar = (timer: number) => {
        harvest_progress_bar.style.width = `${timer * 100}%`;
    };

    if (unlocked_events.farmer_unlock) {
        document.querySelectorAll<HTMLElement>(".farmer-event").forEach((el) => el.style.display = "");
    }
    document.querySelector<HTMLElement>(".gather-food")!
        .addEventListener("click", () => {
            playerData.food += 10;
    });
    document.querySelector<HTMLElement>(".make-farm")!
        .addEventListener("click", () => {
            let can_make = true
            Object.keys(farm_cost).forEach((item)=>{
                const key = item as keyof typeof farm_cost;
                if(playerData[key] < farm_cost[key])
                {
                    can_make = false
                }
            })
            if (can_make) {
                playerData.farms += 1
                Object.keys(farm_cost).forEach((item) => {
                    const key = item as keyof typeof farm_cost;
                    playerData[key] -= farm_cost[key]
                })        
            }
        });
}

setInterval(() => {
    const active_pairs = Math.min(playerData.farmers, playerData.farms);

    if (active_pairs > 0) {
        harvest_timer += active_pairs * (1/10) * HARVEST_RATE;
        harvest_timer += active_pairs * HARVEST_RATE;
    }
    set_harvest_progress_bar?.(harvest_timer);
    if (harvest_timer >= 1) {
        harvest_timer = 0;
        playerData.food += active_pairs * FOOD_PER_SET;
    }

}, TICK_MS);

