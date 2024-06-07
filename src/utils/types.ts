export type SystemTrayItem = {
    id: string;
    label: string;
    active: boolean;
}

export type SystemTrayClickEvent = {
    id: string;
}

export type SetupSystemTrayInf = (items: SystemTrayItem[]) => void;

export type ClearSystemTrayInf = () => void;

export type ClickSystemTrayInf = (item: SystemTrayItem) => void;