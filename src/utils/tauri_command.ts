import { invoke } from '@tauri-apps/api/tauri'

const MAX_CACHE_SIZE = 50

type Cache = {
    image: string,
    usage: number
}

export const imageCache = new Map<string, Cache>()

export const FetchImage = async (path: string) => {
    // check if image is in cache
    const cache = imageCache.get(path)
    if (cache) {
        cache.usage++
        return `data:image/png;base64,${cache.image}`
    }

    const image = await invoke<string>('get_image', { path })

    // check length
    if (imageCache.size > MAX_CACHE_SIZE) {
        let minUsage = Number.MAX_SAFE_INTEGER
        let minKey = ''
        imageCache.forEach((value, key) => {
            if (value.usage < minUsage) {
                minUsage = value.usage
                minKey = key
            }
        })
        imageCache.delete(minKey)
    }

    imageCache.set(path, {
        image,
        usage: 1
    })

    return `data:image/png;base64,${image}`
}