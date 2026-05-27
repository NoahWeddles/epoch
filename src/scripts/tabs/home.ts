import { playerData } from "../player_data";
import "../components/timeout_button";
import { unlocked_events } from "../events";

const food_depletion_rate = 0.0001;
let food_depletion_timer = 0;
let set_food_progress_bar: ((timer: number) => void) | null = null;

const population_factor = 1;

setInterval(() => {
    food_depletion_timer += food_depletion_rate;
    if (set_food_progress_bar !== null) {
        set_food_progress_bar(food_depletion_timer)
    }
    if (food_depletion_timer >= 1) {
        food_depletion_timer = 0;
        let depletion = playerData.population * population_factor
        if (playerData.food - depletion >= 0){
            playerData.food -= depletion
        }else{
            playerData.population -= 1;
        }
    }
}, 10);

export function init(): void {
    const food_depletion_progress_bar = document.querySelector<HTMLElement>(".food-depletion-progress")!;

    set_food_progress_bar = (timer: number) => {
        food_depletion_progress_bar.style.width = `${timer * 100}%`;
    };

    let available = playerData.population - playerData.farmers - playerData.soldiers;

    if (unlocked_events.farmer_unlock) {
        document.querySelectorAll<HTMLElement>(".farmer-event").forEach(el => { el.style.display = "" });
    }
    if (unlocked_events.soldier_unlock) {
        document.querySelectorAll<HTMLElement>(".soldier-event").forEach(el => { el.style.display = "" });
    }
    if (unlocked_events.forager_unlock) {
        document.querySelectorAll<HTMLElement>(".forager-event").forEach(el => { el.style.display = "" });
    }
}
