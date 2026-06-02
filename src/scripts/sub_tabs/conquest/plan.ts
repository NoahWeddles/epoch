import * as conquest from "../../tabs/conquest"

export function init() {
    drawCivilizations()
}
function drawCivilizations(): void {
    const template = document.querySelector<HTMLTemplateElement>("template.civilization")!;
    const container = document.querySelector<HTMLElement>(".neighboring_civilizations")!;
    container.innerHTML = ""; // avoid duplicates if the tab is re-opened

    for (const civ of conquest.neighboring_civilizations) {
        const frag = template.content.cloneNode(true) as DocumentFragment;
        const card = frag.firstElementChild as HTMLElement;

        card.querySelector(".name")!.textContent = civ.name;
        card.querySelector(".population")!.textContent = civ.population.toString();

        container.appendChild(frag);
    }
}