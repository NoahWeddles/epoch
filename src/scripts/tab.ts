import { playerData, type PlayerData } from "./player_data";
import * as home from "./tabs/home";
import * as conquest from "./tabs/conquest";
import * as settings from "./tabs/settings";
import { set_bar } from "./sub_tab";

interface PageModule {
    init?: () => (() => void) | void;
}

interface Page {
    templateId: string;
    module: PageModule;
}

const pages: Record<string, Page> = {
    Home:     { templateId: "home",     module: home },
    Conquest: { templateId: "conquest", module: conquest },
    Settings: { templateId: "settings", module: settings },
};

let active_cleanup: (() => void) | null = null;

function main(): void {
    const tab_bar = document.querySelector(".tab-bar")!;

    Object.keys(pages).forEach((key) => {
        const tab = document.createElement("li");
        tab.classList.add("tab");
        tab.addEventListener("click", () => {
            switch_tab(key);
        });
        tab.textContent = key;
        tab_bar.appendChild(tab);
    });
}

function switch_tab(pageName: string): void {
    if (active_cleanup) {
        active_cleanup();
        active_cleanup = null;
    }

    const display = document.querySelector(".display")!;
    display.innerHTML = "";

    const page = pages[pageName];
    const template = document.querySelector<HTMLTemplateElement>(`#${page.templateId}`)!;
    display.appendChild(template.content.cloneNode(true));

    if (page.module.init) {
        active_cleanup = page.module.init() ?? null;
    }

    set_bar(pageName);

    //TERRIBLE fix. easy, but really really really really bad
    for (const key in playerData) {
        const k = key as keyof PlayerData;
        playerData[k] = playerData[k];
    }
}

main();
switch_tab("Home");
