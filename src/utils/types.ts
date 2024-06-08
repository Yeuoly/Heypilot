export type SystemTrayItem = {
    id: string;
    label: string;
    active: boolean;
}

export type SystemTrayClickEvent = {
    id: string;
}

export type SystemScreenShotRequestPayload = {
    x: number;
    y: number;
    width: number;
    height: number;
    monitor?: number;
}

export type SystemScreenShotResponsePayload = {
    error: string;
    image: string;
}

export type MoveToAndSetOnTopPayload = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type SetupSystemTrayInf = (items: SystemTrayItem[]) => void;

export type ClearSystemTrayInf = () => void;

export type ClickSystemTrayInf = (item: SystemTrayItem) => void;