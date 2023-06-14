// 1. Import utilities from `astro:content`
import {defineCollection} from 'astro:content';
import {productsSchema, categoriesSchema} from "../schemas";

// 2. Define a `type` and `schema` for each collection
const productsCollection = defineCollection({
    type: 'content',
    schema: productsSchema,
});

const categoriesCollection = defineCollection({
    type: 'content',
    schema: categoriesSchema,
});


// 3. Export a single `collections` object to register your collection(s)
export const collections = {
    'products': productsSchema,
    'categories' : categoriesCollection
};