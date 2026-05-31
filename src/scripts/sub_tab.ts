import { playerData, type PlayerData } from "./player_data";
import * as farms from "./sub_tabs/farms";
import * as government from "./sub_tabs/government";
import * as research from "./sub_tabs/research";
import * as forage from "./sub_tabs/forage";

interface PageModule {
    init?: () => (() => void) | void;
}

interface SubPage {
    templateId: string;
    module: PageModule | null;
}

const pages: Record<string, Record<string, SubPage>> = {
    Home: {
        Farms:      { templateId: "farms",      module: farms },
        Gov: { templateId: "government", module: government },
        Research:   { templateId: "research",   module: research },
        Forage: { templateId: "forage", module: forage}
    },
    Conquest: {
        Map: { templateId: "map", module: null },
    },
};

let active_cleanup: (() => void) | null = null;

let active_tab: String | null = null

export function set_bar(pageName: string): void {
    const tab_bar = document.querySelector<HTMLElement>(".sub-tab-bar")!;
    tab_bar.innerHTML = "";

    let tabs: HTMLElement[] = []

    Object.keys(pages[pageName]).forEach((key) => {
        const tab = document.createElement("li");
        tab.classList.add("sub-tab");
        tabs.push(tab)

        if (key == active_tab){
            tab.classList.add("active-sub-tab")
        }

        tab.addEventListener("click", () => {
            tab.classList.add("active-sub-tab")
            active_tab = key
            tabs.forEach((t) => {
                if (t !== tab) {
                    t.classList.remove("active-sub-tab")
                }
            })
            switch_tab(pageName, key);
        });
        tab.textContent = key;
        tab_bar.appendChild(tab);
    });
}

function switch_tab(pageName: string, tabName: string): void {

    research.doActions()

    if (active_cleanup) {
        active_cleanup();
        active_cleanup = null;
    }

    const display = document.querySelector<HTMLElement>(".sub-display")!;
    display.innerHTML = "";

    const page = pages[pageName][tabName];
    const template = document.querySelector<HTMLTemplateElement>(`template.${page.templateId}`)!;
    display.appendChild(template.content.cloneNode(true));

    if (page.module?.init) {
        active_cleanup = page.module.init() ?? null;
    }

    for (const key in playerData) {
        const k = key as keyof PlayerData;
        playerData[k] = playerData[k];
    }
}
