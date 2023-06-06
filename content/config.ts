// 1. Import utilities from `astro:content`
import {defineCollection} from 'astro:content';
import {productsSchema} from "../schemas";

// 2. Define a `type` and `schema` for each collection
const productsCollection = defineCollection({
    type: 'content',
    schema: productsSchema,
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
    'products': productsSchema,
};
