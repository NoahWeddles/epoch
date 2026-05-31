const stored = localStorage.getItem("dialogue");
let events: string[] = stored ? JSON.parse(stored) : [];

const clearButton = document.querySelector<HTMLElement>(".clear-button")!;

clearButton.addEventListener("click", () => {
    events = [];
    localStorage.removeItem("dialogue");
    update();
});

export function add_event(event: string): void {
    events = [event, ...events];
    localStorage.setItem("dialogue", JSON.stringify(events));
    update(true);
}

function update(animateFirst = false): void {
    const dialogueBox = document.querySelector<HTMLElement>(".dialogue-box")!;
    dialogueBox.replaceChildren();
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const p = document.createElement("p");
        p.style.opacity = String(1 - (i * 0.1));
        p.style.transition = "transform 0.3s ease, opacity 0.3s ease";
        p.textContent = event;

        if (i === 0 && animateFirst) {
            p.style.transform = "translateY(-20px)";
            p.style.opacity = "0";
            dialogueBox.appendChild(p);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    p.style.transform = "translateY(0)";
                    p.style.opacity = String(1 - (i * 0.1));
                });
            });
        } else {
            dialogueBox.appendChild(p);
        }
    }
}

console.log(events);
if (events.length === 0) {
    add_event("Made by Noah");
    setTimeout(() => add_event("Welcome to Epoch!"), 1000);
    setTimeout(() => add_event("Gather food and resources to grow your population. If you run out of food, your population will start to starve."), 2000);
}
update();