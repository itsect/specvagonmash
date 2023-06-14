// 1. Import utilities from `astro:content`
import { z } from 'astro:content';
export const categoriesSchema = ({ image }) => z.object({
    id: z.number().int(),
    title: z.string(),
    image: image().refine((img) => img.width >= 1080, {
        message: "Cover image must be at least 1080 pixels wide!",
    })
})