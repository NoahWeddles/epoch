import type React from "react";

export default function TabBar({ tabs, currentTab, setCurrentTab }: {
    tabs: Record<string, React.ReactNode>,
    currentTab: string,
    setCurrentTab: (tab: string) => void,
}) {
    return (
        <>
            {Object.keys(tabs).map((key) => (
                <Tab
                    key={key}
                    tab={key}
                    isActive={currentTab === key}
                    setCurrentTab={setCurrentTab}
                />
            ))}
        </>
    )
}

function Tab({ tab, isActive, setCurrentTab }: {
    tab: string,
    isActive: boolean,
    setCurrentTab: (tab: string) => void,
}) {
    return (
        <div
            onClick={() => setCurrentTab(tab)}
            className={`tab ${isActive ? "active" : ""}`}
        >
            {tab}
        </div>
    )
}