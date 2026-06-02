import { unlocked_events } from "../events";
import { playerData, PLAYER_FIELDS, subscribe } from "../player_data";

let OCCUPATION_KEYS = (Object.keys(PLAYER_FIELDS) as (keyof typeof PLAYER_FIELDS)[])
    .filter(k => (PLAYER_FIELDS[k] as { type?: string }).type === "occupation");

let available = playerData.population - OCCUPATION_KEYS.reduce((sum, k) => sum + playerData[k], 0);

function change_population(delta: number){
    playerData.population += delta
    OCCUPATION_KEYS = (Object.keys(PLAYER_FIELDS) as (keyof typeof PLAYER_FIELDS)[])
        .filter(k => (PLAYER_FIELDS[k] as { type?: string }).type === "occupation");
    available = playerData.population - OCCUPATION_KEYS.reduce((sum, k) => sum + playerData[k], 0);
}


const rate = 1;
let timer = 0;
let set_progress_bar: ((timer: number) => void) | null = null;

const PEOPLE_PER_HOME = 5

const home_cost = {
    wood: 150,
    stone: 100,
}

setInterval(() => {
    timer += 0.00001 * playerData.population * rate;
    if (set_progress_bar !== null) {
        set_progress_bar(timer)
    }
    if (timer >= 1 && playerData.population < playerData.homes * PEOPLE_PER_HOME) {
        timer = 0;
        change_population(1)
    }
}, 10);

export function init(): void {
    if (unlocked_events.farmer_unlock) {
        document.querySelectorAll<HTMLElement>(".farmer-event").forEach((el) => el.style.display = "");
    }
    if (unlocked_events.soldier_unlock) {
        document.querySelectorAll<HTMLElement>(".soldier-event").forEach((el) => el.style.display = "");
    }
    if (unlocked_events.forager_unlock) {
        document.querySelectorAll<HTMLElement>(".forager-event").forEach((el) => el.style.display = "");
    }

    const progress_bar = document.querySelector<HTMLElement>(".population-progress")!;
    set_progress_bar = (timer: number) => {
        progress_bar.style.width = `${timer * 100}%`;
    };

    document.querySelector<HTMLElement>(".make-person")!
        .addEventListener("timeout-click", () => {
            if (playerData.food < 50) return;
            change_population(1)
            playerData.food -= 50;
        });

    document.querySelector<HTMLElement>(".make-home")!
        .addEventListener("click", () => {
            let can_make = true
            Object.keys(home_cost).forEach((item)=>{
                const key = item as keyof typeof home_cost;
                if(playerData[key] < home_cost[key])
                {
                    can_make = false
                }
            })
            if (can_make) {
                playerData.homes += 1
                Object.keys(home_cost).forEach((item) => {
                    const key = item as keyof typeof home_cost;
                    playerData[key] -= home_cost[key]
                })        
            }
        });

    document.querySelector<HTMLElement>(".add-farmer")!
        .addEventListener("click", () => {
            if (available <= 0) return;
            playerData.farmers += 1;
            available -= 1;
        });
    document.querySelector<HTMLElement>(".remove-farmer")!
        .addEventListener("click", () => {
            if (playerData.farmers === 0) return;
            playerData.farmers -= 1;
            available += 1;
        });
    document.querySelector<HTMLElement>(".add-soldier")!
        .addEventListener("click", () => {
            if (available <= 0) return;
            playerData.soldiers += 1;
            available -= 1;
        });
    document.querySelector<HTMLElement>(".remove-soldier")!
        .addEventListener("click", () => {
            if (playerData.soldiers === 0) return;
            playerData.soldiers -= 1;
            available += 1;
        });
    document.querySelector<HTMLElement>(".add-forager")!
        .addEventListener("click", () => {
            if (available <= 0) return;
            playerData.foragers += 1;
            available -= 1;
        });
    document.querySelector<HTMLElement>(".remove-forager")!
        .addEventListener("click", () => {
            if (playerData.foragers === 0) return;
            playerData.foragers -= 1;
            available += 1;
        });
}