// 1. Import utilities from `astro:content`
import { z } from 'astro:content';
export const categoriesSchema = ({ image }) => z.object({
    id: z.number().int(),
    title: z.string(),
    image: image(),
    ready: z.boolean()
})