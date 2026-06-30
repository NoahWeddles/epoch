import { useState } from 'react'
import Home from './tabs/Home'
import Conquest from './tabs/Conquest'
import Farms from './sub_tabs/Farms'
import Forage from './sub_tabs/Forage'
import Settings from './tabs/Settings'
import Plan from './sub_tabs/Plan'
import Research from './sub_tabs/Research'
import TabBar from './components/TabBar'
import Government from './sub_tabs/Government'
import Storage from './components/Storage'
import { useDialogueStore, clearEvents } from './context/DialogueContext'
import { useCivEventLoop } from './hooks/useCivEventLoop'

const mainTabs: Record<string, React.ReactNode> = {
    Home: <Home />,
    Conquest: <Conquest />,
    Settings: <Settings />,
}

const subTabs: Record<string, Record<string, React.ReactNode>> = {
    Home: {
        Farms: <Farms />,
        Forage: <Forage />,
        Government: <Government />,
        Research: <Research />,
    },
    Conquest: {
        Plan: <Plan />,
    },
    Settings: {},
}

function App() {
    const [currentTab, setCurrentTab] = useState<string>("Home")
    const [currentSubTab, setCurrentSubTab] = useState<string | null>("Forage")
    const events = useDialogueStore(s => s.events)

    useCivEventLoop()

    function handleMainTabChange(tab: string) {
        setCurrentTab(tab)
        const firstSub = Object.keys(subTabs[tab] ?? {})[0] ?? null
        setCurrentSubTab(firstSub)
    }

    return (
        <div className="flex flex-col w-full h-screen">
            <div className="header p-6 pl-3 flex items-center justify-start w-full h-10 bg-main3">
                <span className="italic text-[22px]">Epoch</span>
                <span className="mute ml-auto">Mute Music</span>
            </div>
            <hr className="text-hr" />
            <div className="main-tab-bar pl-3 pt-0 flex items-center list-none justify-start w-full h-12 bg-main2ish">
                <TabBar
                    tabs={mainTabs}
                    currentTab={currentTab}
                    setCurrentTab={handleMainTabChange}
                />
            </div>
            <div className="sub-tab-bar pl-8 flex items-center list-none justify-start w-full h-9 bg-main2ishish">
                <TabBar
                    tabs={subTabs[currentTab] ?? {}}
                    currentTab={currentSubTab ?? ""}
                    setCurrentTab={setCurrentSubTab}
                />
            </div>
            <hr className="text-hr" />
            <div className="bg-radial-[at_50%_50%] from-main2 to-main3 h-full flex items-center justify-between overflow-hidden">
                <div className="flex flex-col w-full h-full justify-start max-w-md rounded-2xl p-5">
                    <div className="p-4 gap-4 flex flex-col h-full w-full rounded-b-2xl">
                        {mainTabs[currentTab]}
                    </div>
                </div>

                <div className="w-full ml-auto h-full flex-col justify-start rounded-2xl items-start">
                    <div className="sub-display border-x-2 border-hr p-5 gap-4 flex flex-col h-full w-full bg-transparent overflow-hidden">
                        {currentSubTab ? subTabs[currentTab]?.[currentSubTab] : null}
                    </div>
                </div>

                <Storage />

                <div className="w-0 border-l-2 h-full border-hr"></div>

                <div className="w-full h-full max-w-3xs flex flex-col p-5 justify-start items-start overflow-hidden">
                    <div className="flex justify-between w-full">
                        <p className="p-2">Events</p>
                        <button onClick={clearEvents} className="clear-button p-2 min-w-0 bg-main2 rounded-lg hover:brightness-120">Clear</button>
                    </div>
                    <hr className="mt-2 w-full" />
                    <div className="flex flex-col justify-start items-start w-full pt-5 h-full overflow-y-auto">
                        {events.map((event, i) => (
                            <p key={i} className="text-xs p-1">{event}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-main2ishish border-t-2 border-hr text-xs">
                Music by <a href="https://composerlarkin.com/" className="text-orange-400">Christopher Larkin</a> from <a
                    href="https://www.hollowknight.com/" className="text-orange-400">Hollow Knight</a>
            </div>
        </div>
    )
}

export default App
