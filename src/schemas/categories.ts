// 1. Import utilities from `astro:content`
import { z } from 'astro:content';
export const categoriesSchema = z.object({
    title: z.string(),
    featured_image: z.string()
})