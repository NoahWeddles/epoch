import { playerData, type PlayerData } from "../player_data";
import { add_event } from "../event_dialogue";
import { unlocked_events } from "../events";

interface Forageable{
    chance: number;
    min: number;
    max: number;
    message?: string;
}
const forageables: Record<string, Forageable> = {
    "ore": {
        chance: 0.05,
        min: 1,
        max: 3,
    },
    "wood": {
        chance: 0.1,
        min: 10,
        max: 20
    },
    "stone": {
        chance: 0.1,
        min: 5,
        max: 10,
    }
}

const forage_rate = 1;
let forage_timer = 0;
let set_forage_progress_bar: ((timer: number) => void) | null = null;

export function init(){
    document.querySelector(".forage-button")!.addEventListener("timeout-click", forage);
    const forage_progress_bar = document.querySelector<HTMLElement>(".forage-progress")!;
    set_forage_progress_bar = (timer: number) => {
        forage_progress_bar.style.width = `${timer * 100}%`;
    };

    if (unlocked_events.forager_unlock) {
        document.querySelectorAll<HTMLElement>(".forager-event").forEach(el => { el.style.display = "" });
    }
}
setInterval(() => {
    forage_timer += 0.0001 * playerData.foragers * forage_rate;
    if (set_forage_progress_bar !== null) {
        set_forage_progress_bar(forage_timer)
    }
    if (forage_timer >= 1) {
        forage_timer = 0;
        forage()
    }
}, 10);

function forage() : void {
    const keys = Object.keys(forageables) as Array<keyof PlayerData>
    keys.forEach((key)=>{
        const forageable = forageables[key]

        if(Math.random() < forageable.chance){
            playerData[key] += Math.floor(Math.random()* (forageable.max - forageable.min + 1) + forageable.min)

            if(forageable.message) add_event(forageable.message)
        }
    })
}
