import { invoke } from "@tauri-apps/api"

export const GetSelection = async () => {
    return await invoke<string>('get_selection_text')
}