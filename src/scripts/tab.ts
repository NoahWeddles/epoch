import { playerData, type PlayerData } from "./player_data";
import * as home from "./tabs/home";
import * as conquest from "./tabs/conquest";
import * as settings from "./tabs/settings";
import { set_bar } from "./sub_tab";
import {doActions} from "./sub_tabs/research"

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
    const tab_bar = document.querySelector<HTMLElement>(".main-tab-bar")!;

    let tabs : HTMLElement[] = []

    Object.keys(pages).forEach((key) => {
        const tab = document.createElement("li");
        tab.classList.add("tab");
        tab.classList.add(`${key.toLowerCase()}-tab`)
        tabs.push(tab)
        tab.addEventListener("click", () => {
            tab.classList.add("active-tab")
            tabs.forEach((t)=>{
                if(t !== tab){
                    t.classList.remove("active-tab")
                }
            })
            switch_tab(key);
        });
        tab.textContent = key;
        tab_bar.appendChild(tab);
    });
}

function switch_tab(pageName: string): void {

    doActions()

    if (active_cleanup) {
        active_cleanup();
        active_cleanup = null;
    }

    const display = document.querySelector<HTMLElement>(".display")!;
    display.innerHTML = "";

    const page = pages[pageName];
    const template = document.querySelector<HTMLTemplateElement>(`template.${page.templateId}`)!;
    template.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    template.style.transform = "translateY(-20px)";
    template.style.opacity = "0";
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            template.style.transform = "translateY(0)";
            template.style.opacity = String(1);
        });
    });
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
