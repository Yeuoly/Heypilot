import { FetchImage } from "../../utils/image"
import { MessageFrom } from "./entities"

export class Message {
    id: string
    from: MessageFrom
    content: string
    timestamp: number
    images: string[]

    constructor(id: string, from: MessageFrom, content: string, timestamp: number, images: string[]) {
        this.id = id
        this.from = from
        this.content = content
        this.timestamp = timestamp
        this.images = images
    }

    async FetchImages() {
        const images = []
        for (const image of this.images) {
            images.push(await FetchImage(image))
        }
        return images
    }

    ToJSON() {
        return {
            id: this.id,
            from: this.from,
            content: this.content,
            timestamp: this.timestamp,
            images: this.images
        }
    }
}