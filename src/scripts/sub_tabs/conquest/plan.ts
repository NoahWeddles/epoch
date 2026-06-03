import * as conquest from "../../tabs/conquest"

export function init() {
    drawCivilizations()
    setInterval(drawCivilizations, 2000)
}


export function drawCivilizations(): void {
    const template = document.querySelector<HTMLTemplateElement>("template.civilization")!;
    const container = document.querySelector<HTMLElement>(".neighboring_civilizations")!;
    container.innerHTML = "";

    for (let i = 0; i < conquest.neighboring_civilizations.length; i++) {
        const civ = conquest.neighboring_civilizations[i];
        let card = container.children[i] as HTMLElement | undefined;
        if (!card) {
            const frag = template.content.cloneNode(true) as DocumentFragment;
            card = frag.firstElementChild as HTMLElement;
            container.appendChild(frag);
            card = container.children[i] as HTMLElement;
        }

        card.querySelector(".civ-name")!.textContent = civ.name;
        card.querySelector(".civ-population")!.textContent = civ.population.toString();
        card.querySelector(".civ-military-strength")!.textContent = civ.military_strength.toString();
        card.querySelector(".civ-type")!.textContent = civ.type.toString();
    }

}