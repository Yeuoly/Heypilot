import { Store } from 'tauri-plugin-store-api'

const store = new Store(import.meta.env.VITE_STORE_PATH);

export const SetData = async (key: string, value: any) => {
    await store.set(key, value)
}

export const GetData = async <T>(key: string, def?: T) => {
    return (await store.get<T>(key) || def) as T
}
