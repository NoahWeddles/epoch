import { create } from 'zustand';

interface DialogueState {
    events: string[];
}

export const useDialogueStore = create<DialogueState>(() => ({
    events: [],
}));

export function addEvent(event: string) {
    useDialogueStore.setState(s => ({ events: [event, ...s.events].slice(0, 100) }));
}

export function clearEvents() {
    useDialogueStore.setState({ events: [] });
}
