declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;
	export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<AnyEntryMap[C]>;

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"categories": {
"completion-equipment/index.mdx": {
	id: "completion-equipment/index.mdx";
  slug: "completion-equipment";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/index.mdx": {
	id: "flow-control-equipment/index.mdx";
  slug: "flow-control-equipment";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/index.mdx": {
	id: "gas-lift-equipment/index.mdx";
  slug: "gas-lift-equipment";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".mdx"] };
"miscellaneous-products/index.mdx": {
	id: "miscellaneous-products/index.mdx";
  slug: "miscellaneous-products";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".mdx"] };
"sucker-rod-pressure-control-equipment/index.mdx": {
	id: "sucker-rod-pressure-control-equipment/index.mdx";
  slug: "sucker-rod-pressure-control-equipment";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/index.mdx": {
	id: "surface-pressure-control-equipment/index.mdx";
  slug: "surface-pressure-control-equipment";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/index.mdx": {
	id: "wireline-tools-accessories/index.mdx";
  slug: "wireline-tools-accessories";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".mdx"] };
};
"products": {
"calibration-of-gaslift-valves/coiled-tubing-quad-bop-combi-bop/index.mdx": {
	id: "calibration-of-gaslift-valves/coiled-tubing-quad-bop-combi-bop/index.mdx";
  slug: "calibration-of-gaslift-valves/coiled-tubing-quad-bop-combi-bop";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"calibration-of-gaslift-valves/side-loading-stripper-packer/index.mdx": {
	id: "calibration-of-gaslift-valves/side-loading-stripper-packer/index.mdx";
  slug: "calibration-of-gaslift-valves/side-loading-stripper-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/1-50-od-shorty-setting-tool-minimum-and-maximum-wear/index.mdx": {
	id: "completion-equipment/1-50-od-shorty-setting-tool-minimum-and-maximum-wear/index.mdx";
  slug: "completion-equipment/1-50-od-shorty-setting-tool-minimum-and-maximum-wear";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/1-50-od-shorty-setting-tool/index.mdx": {
	id: "completion-equipment/1-50-od-shorty-setting-tool/index.mdx";
  slug: "completion-equipment/1-50-od-shorty-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/1-71-od-shorty-setting-tool-minimum-and-maximum-wear/index.mdx": {
	id: "completion-equipment/1-71-od-shorty-setting-tool-minimum-and-maximum-wear/index.mdx";
  slug: "completion-equipment/1-71-od-shorty-setting-tool-minimum-and-maximum-wear";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/1-71-od-shorty-setting-tool/index.mdx": {
	id: "completion-equipment/1-71-od-shorty-setting-tool/index.mdx";
  slug: "completion-equipment/1-71-od-shorty-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/1-718-od-multi-stage-setting-tool-minimum-and-maximum-wear/index.mdx": {
	id: "completion-equipment/1-718-od-multi-stage-setting-tool-minimum-and-maximum-wear/index.mdx";
  slug: "completion-equipment/1-718-od-multi-stage-setting-tool-minimum-and-maximum-wear";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/1-718-od-multi-stage-setting-tool/index.mdx": {
	id: "completion-equipment/1-718-od-multi-stage-setting-tool/index.mdx";
  slug: "completion-equipment/1-718-od-multi-stage-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/2-1-8-od-multi-stage-setting-tool-minimum-and-maximum-wear/index.mdx": {
	id: "completion-equipment/2-1-8-od-multi-stage-setting-tool-minimum-and-maximum-wear/index.mdx";
  slug: "completion-equipment/2-1-8-od-multi-stage-setting-tool-minimum-and-maximum-wear";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/2-1-8-od-multi-stage-setting-tool/index.mdx": {
	id: "completion-equipment/2-1-8-od-multi-stage-setting-tool/index.mdx";
  slug: "completion-equipment/2-1-8-od-multi-stage-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/3-1-4-od-multi-stage-setting-tool/index.mdx": {
	id: "completion-equipment/3-1-4-od-multi-stage-setting-tool/index.mdx";
  slug: "completion-equipment/3-1-4-od-multi-stage-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/3-5-8-od-bp-setting-tool-assembly-instructions/index.mdx": {
	id: "completion-equipment/3-5-8-od-bp-setting-tool-assembly-instructions/index.mdx";
  slug: "completion-equipment/3-5-8-od-bp-setting-tool-assembly-instructions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/3-5-8-od-bp-setting-tool-minimum-and-maximum-wear/index.mdx": {
	id: "completion-equipment/3-5-8-od-bp-setting-tool-minimum-and-maximum-wear/index.mdx";
  slug: "completion-equipment/3-5-8-od-bp-setting-tool-minimum-and-maximum-wear";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/3-5-8-od-bp-setting-tool/index.mdx": {
	id: "completion-equipment/3-5-8-od-bp-setting-tool/index.mdx";
  slug: "completion-equipment/3-5-8-od-bp-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/ad-1-tension-packer/index.mdx": {
	id: "completion-equipment/ad-1-tension-packer/index.mdx";
  slug: "completion-equipment/ad-1-tension-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/anchor-latch-seal-assembly/index.mdx": {
	id: "completion-equipment/anchor-latch-seal-assembly/index.mdx";
  slug: "completion-equipment/anchor-latch-seal-assembly";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/as1-x-mechanical-packer/index.mdx": {
	id: "completion-equipment/as1-x-mechanical-packer/index.mdx";
  slug: "completion-equipment/as1-x-mechanical-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/as1-xhp-mechanical-packer/index.mdx": {
	id: "completion-equipment/as1-xhp-mechanical-packer/index.mdx";
  slug: "completion-equipment/as1-xhp-mechanical-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/dissolvable-frac-balls/index.mdx": {
	id: "completion-equipment/dissolvable-frac-balls/index.mdx";
  slug: "completion-equipment/dissolvable-frac-balls";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/double-grip-retrievable-packer-model-r/index.mdx": {
	id: "completion-equipment/double-grip-retrievable-packer-model-r/index.mdx";
  slug: "completion-equipment/double-grip-retrievable-packer-model-r";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/drill-stem-testing-tools/index.mdx": {
	id: "completion-equipment/drill-stem-testing-tools/index.mdx";
  slug: "completion-equipment/drill-stem-testing-tools";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/erd-retrievable-seal-bore-packer/index.mdx": {
	id: "completion-equipment/erd-retrievable-seal-bore-packer/index.mdx";
  slug: "completion-equipment/erd-retrievable-seal-bore-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/frac-plugs-wireline-set-big-bore-frac-plug/index.mdx": {
	id: "completion-equipment/frac-plugs-wireline-set-big-bore-frac-plug/index.mdx";
  slug: "completion-equipment/frac-plugs-wireline-set-big-bore-frac-plug";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/frac-plugs-wireline-set-standard-frac-plug/index.mdx": {
	id: "completion-equipment/frac-plugs-wireline-set-standard-frac-plug/index.mdx";
  slug: "completion-equipment/frac-plugs-wireline-set-standard-frac-plug";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/hydraulic-overshot-expansion-joint-hoej-assembly/index.mdx": {
	id: "completion-equipment/hydraulic-overshot-expansion-joint-hoej-assembly/index.mdx";
  slug: "completion-equipment/hydraulic-overshot-expansion-joint-hoej-assembly";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/hydraulic-setting-tool/index.mdx": {
	id: "completion-equipment/hydraulic-setting-tool/index.mdx";
  slug: "completion-equipment/hydraulic-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/hydro-trip-pressure-sub/index.mdx": {
	id: "completion-equipment/hydro-trip-pressure-sub/index.mdx";
  slug: "completion-equipment/hydro-trip-pressure-sub";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/indexing-mule-shoe/index.mdx": {
	id: "completion-equipment/indexing-mule-shoe/index.mdx";
  slug: "completion-equipment/indexing-mule-shoe";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/locator-tubing-seal-assembly/index.mdx": {
	id: "completion-equipment/locator-tubing-seal-assembly/index.mdx";
  slug: "completion-equipment/locator-tubing-seal-assembly";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/mechanical-production-packers-sure-lok-packer/index.mdx": {
	id: "completion-equipment/mechanical-production-packers-sure-lok-packer/index.mdx";
  slug: "completion-equipment/mechanical-production-packers-sure-lok-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/millout-extension copy/index.mdx": {
	id: "completion-equipment/millout-extension copy/index.mdx";
  slug: "completion-equipment/millout-extension-copy";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/millout-extension/index.mdx": {
	id: "completion-equipment/millout-extension/index.mdx";
  slug: "completion-equipment/millout-extension";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-lite-bridge-plug-wireline-set-drillable-2/index.mdx": {
	id: "completion-equipment/model-bkr-lite-bridge-plug-wireline-set-drillable-2/index.mdx";
  slug: "completion-equipment/model-bkr-lite-bridge-plug-wireline-set-drillable-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-lite-bridge-plug-wireline-set-drillable/index.mdx": {
	id: "completion-equipment/model-bkr-lite-bridge-plug-wireline-set-drillable/index.mdx";
  slug: "completion-equipment/model-bkr-lite-bridge-plug-wireline-set-drillable";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-lite-cement-retainer-wireline-set-drillable/index.mdx": {
	id: "completion-equipment/model-bkr-lite-cement-retainer-wireline-set-drillable/index.mdx";
  slug: "completion-equipment/model-bkr-lite-cement-retainer-wireline-set-drillable";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-mechanical-setting-tool-2/index.mdx": {
	id: "completion-equipment/model-bkr-mechanical-setting-tool-2/index.mdx";
  slug: "completion-equipment/model-bkr-mechanical-setting-tool-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-mechanical-setting-tool-for-bkr-sleeve-valve-cement-retainers-and-b-1-bridge-plugs/index.mdx": {
	id: "completion-equipment/model-bkr-mechanical-setting-tool-for-bkr-sleeve-valve-cement-retainers-and-b-1-bridge-plugs/index.mdx";
  slug: "completion-equipment/model-bkr-mechanical-setting-tool-for-bkr-sleeve-valve-cement-retainers-and-b-1-bridge-plugs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-mechanical-setting-tool-for-bkr-sleeve-valve-cement-retainers/index.mdx": {
	id: "completion-equipment/model-bkr-mechanical-setting-tool-for-bkr-sleeve-valve-cement-retainers/index.mdx";
  slug: "completion-equipment/model-bkr-mechanical-setting-tool-for-bkr-sleeve-valve-cement-retainers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-mechanical-setting-tool/index.mdx": {
	id: "completion-equipment/model-bkr-mechanical-setting-tool/index.mdx";
  slug: "completion-equipment/model-bkr-mechanical-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-premium-bridge-plug-wireline-set-drillable/index.mdx": {
	id: "completion-equipment/model-bkr-premium-bridge-plug-wireline-set-drillable/index.mdx";
  slug: "completion-equipment/model-bkr-premium-bridge-plug-wireline-set-drillable";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-premium-cement-retainer-wireline-set-drillable/index.mdx": {
	id: "completion-equipment/model-bkr-premium-cement-retainer-wireline-set-drillable/index.mdx";
  slug: "completion-equipment/model-bkr-premium-cement-retainer-wireline-set-drillable";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bkr-seal-nipples-bkr-sleeve-valve-cement-retainers/index.mdx": {
	id: "completion-equipment/model-bkr-seal-nipples-bkr-sleeve-valve-cement-retainers/index.mdx";
  slug: "completion-equipment/model-bkr-seal-nipples-bkr-sleeve-valve-cement-retainers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-bp-wireline-setting-tools-compact-single-stage/index.mdx": {
	id: "completion-equipment/model-bp-wireline-setting-tools-compact-single-stage/index.mdx";
  slug: "completion-equipment/model-bp-wireline-setting-tools-compact-single-stage";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-d-f-permanent-packers/index.mdx": {
	id: "completion-equipment/model-d-f-permanent-packers/index.mdx";
  slug: "completion-equipment/model-d-f-permanent-packers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-db-hydraulic-set-permanent-packer/index.mdx": {
	id: "completion-equipment/model-db-hydraulic-set-permanent-packer/index.mdx";
  slug: "completion-equipment/model-db-hydraulic-set-permanent-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-05-hydraulic-setting-tool-assembly-instructions/index.mdx": {
	id: "completion-equipment/model-fury-05-hydraulic-setting-tool-assembly-instructions/index.mdx";
  slug: "completion-equipment/model-fury-05-hydraulic-setting-tool-assembly-instructions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-05-hydraulic-setting-tool-operational-procedure/index.mdx": {
	id: "completion-equipment/model-fury-05-hydraulic-setting-tool-operational-procedure/index.mdx";
  slug: "completion-equipment/model-fury-05-hydraulic-setting-tool-operational-procedure";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-05-hydraulic-setting-tool-part-list/index.mdx": {
	id: "completion-equipment/model-fury-05-hydraulic-setting-tool-part-list/index.mdx";
  slug: "completion-equipment/model-fury-05-hydraulic-setting-tool-part-list";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-10-hydraulic-setting-tool-assembly-instructions/index.mdx": {
	id: "completion-equipment/model-fury-10-hydraulic-setting-tool-assembly-instructions/index.mdx";
  slug: "completion-equipment/model-fury-10-hydraulic-setting-tool-assembly-instructions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-10-hydraulic-setting-tool-dimensional-data-specs/index.mdx": {
	id: "completion-equipment/model-fury-10-hydraulic-setting-tool-dimensional-data-specs/index.mdx";
  slug: "completion-equipment/model-fury-10-hydraulic-setting-tool-dimensional-data-specs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-10-hydraulic-setting-tool-operational-procedure/index.mdx": {
	id: "completion-equipment/model-fury-10-hydraulic-setting-tool-operational-procedure/index.mdx";
  slug: "completion-equipment/model-fury-10-hydraulic-setting-tool-operational-procedure";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-10-hydraulic-setting-tool-parts-list/index.mdx": {
	id: "completion-equipment/model-fury-10-hydraulic-setting-tool-parts-list/index.mdx";
  slug: "completion-equipment/model-fury-10-hydraulic-setting-tool-parts-list";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-20-hydraulic-setting-tool-assembly-instructions/index.mdx": {
	id: "completion-equipment/model-fury-20-hydraulic-setting-tool-assembly-instructions/index.mdx";
  slug: "completion-equipment/model-fury-20-hydraulic-setting-tool-assembly-instructions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-20-hydraulic-setting-tool-dimensional-data-specs/index.mdx": {
	id: "completion-equipment/model-fury-20-hydraulic-setting-tool-dimensional-data-specs/index.mdx";
  slug: "completion-equipment/model-fury-20-hydraulic-setting-tool-dimensional-data-specs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-20-hydraulic-setting-tool-operating-procedure/index.mdx": {
	id: "completion-equipment/model-fury-20-hydraulic-setting-tool-operating-procedure/index.mdx";
  slug: "completion-equipment/model-fury-20-hydraulic-setting-tool-operating-procedure";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-20-hydraulic-setting-tool-parts-list/index.mdx": {
	id: "completion-equipment/model-fury-20-hydraulic-setting-tool-parts-list/index.mdx";
  slug: "completion-equipment/model-fury-20-hydraulic-setting-tool-parts-list";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-25-hydraulic-setting-tool-assembly-instructions/index.mdx": {
	id: "completion-equipment/model-fury-25-hydraulic-setting-tool-assembly-instructions/index.mdx";
  slug: "completion-equipment/model-fury-25-hydraulic-setting-tool-assembly-instructions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-fury-25-hydraulic-setting-tool-operational-procedure/index.mdx": {
	id: "completion-equipment/model-fury-25-hydraulic-setting-tool-operational-procedure/index.mdx";
  slug: "completion-equipment/model-fury-25-hydraulic-setting-tool-operational-procedure";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-premium-lite-hm-bridge-plug-tubing-set-2/index.mdx": {
	id: "completion-equipment/model-premium-lite-hm-bridge-plug-tubing-set-2/index.mdx";
  slug: "completion-equipment/model-premium-lite-hm-bridge-plug-tubing-set-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-premium-lite-hm-bridge-plug-tubing-set-3/index.mdx": {
	id: "completion-equipment/model-premium-lite-hm-bridge-plug-tubing-set-3/index.mdx";
  slug: "completion-equipment/model-premium-lite-hm-bridge-plug-tubing-set-3";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-premium-lite-hm-bridge-plug-tubing-set/index.mdx": {
	id: "completion-equipment/model-premium-lite-hm-bridge-plug-tubing-set/index.mdx";
  slug: "completion-equipment/model-premium-lite-hm-bridge-plug-tubing-set";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/model-tst-1-mechanical-set-packer/index.mdx": {
	id: "completion-equipment/model-tst-1-mechanical-set-packer/index.mdx";
  slug: "completion-equipment/model-tst-1-mechanical-set-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/multi-stage-setting-tool-assembly-instructions/index.mdx": {
	id: "completion-equipment/multi-stage-setting-tool-assembly-instructions/index.mdx";
  slug: "completion-equipment/multi-stage-setting-tool-assembly-instructions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/overshot-expansion-joint-oej-assembly/index.mdx": {
	id: "completion-equipment/overshot-expansion-joint-oej-assembly/index.mdx";
  slug: "completion-equipment/overshot-expansion-joint-oej-assembly";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/packer-milling-tool/index.mdx": {
	id: "completion-equipment/packer-milling-tool/index.mdx";
  slug: "completion-equipment/packer-milling-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/packer-retrieving-tool/index.mdx": {
	id: "completion-equipment/packer-retrieving-tool/index.mdx";
  slug: "completion-equipment/packer-retrieving-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/parveen-drillable-bridge-plugs-wireline-set/index.mdx": {
	id: "completion-equipment/parveen-drillable-bridge-plugs-wireline-set/index.mdx";
  slug: "completion-equipment/parveen-drillable-bridge-plugs-wireline-set";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/parveen-drillable-cement-retainers-wireline-set/index.mdx": {
	id: "completion-equipment/parveen-drillable-cement-retainers-wireline-set/index.mdx";
  slug: "completion-equipment/parveen-drillable-cement-retainers-wireline-set";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/parveen-model-a-lite-bridge-plug-wireline-set-drillable/index.mdx": {
	id: "completion-equipment/parveen-model-a-lite-bridge-plug-wireline-set-drillable/index.mdx";
  slug: "completion-equipment/parveen-model-a-lite-bridge-plug-wireline-set-drillable";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/parveen-model-a-premium-bridge-plug-wireline-set-drillable/index.mdx": {
	id: "completion-equipment/parveen-model-a-premium-bridge-plug-wireline-set-drillable/index.mdx";
  slug: "completion-equipment/parveen-model-a-premium-bridge-plug-wireline-set-drillable";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/parveen-model-h-hydraulic-setting-tool/index.mdx": {
	id: "completion-equipment/parveen-model-h-hydraulic-setting-tool/index.mdx";
  slug: "completion-equipment/parveen-model-h-hydraulic-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/polished-seal-bore-receptacle/index.mdx": {
	id: "completion-equipment/polished-seal-bore-receptacle/index.mdx";
  slug: "completion-equipment/polished-seal-bore-receptacle";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/pressure-bleeding-locations1-1-2-2-1-8-od-setting-tools/index.mdx": {
	id: "completion-equipment/pressure-bleeding-locations1-1-2-2-1-8-od-setting-tools/index.mdx";
  slug: "completion-equipment/pressure-bleeding-locations1-1-2-2-1-8-od-setting-tools";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/pump-out-plugs/index.mdx": {
	id: "completion-equipment/pump-out-plugs/index.mdx";
  slug: "completion-equipment/pump-out-plugs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/rhp-db-dual-bore-hydraulic-set-retrievable-packer/index.mdx": {
	id: "completion-equipment/rhp-db-dual-bore-hydraulic-set-retrievable-packer/index.mdx";
  slug: "completion-equipment/rhp-db-dual-bore-hydraulic-set-retrievable-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/rhp-spr-hydraulic-set-retrievable-packer/index.mdx": {
	id: "completion-equipment/rhp-spr-hydraulic-set-retrievable-packer/index.mdx";
  slug: "completion-equipment/rhp-spr-hydraulic-set-retrievable-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/seal-bore-extension/index.mdx": {
	id: "completion-equipment/seal-bore-extension/index.mdx";
  slug: "completion-equipment/seal-bore-extension";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/shear-out-safety-joint/index.mdx": {
	id: "completion-equipment/shear-out-safety-joint/index.mdx";
  slug: "completion-equipment/shear-out-safety-joint";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/single-grip-retrievable-packer-model-r/index.mdx": {
	id: "completion-equipment/single-grip-retrievable-packer-model-r/index.mdx";
  slug: "completion-equipment/single-grip-retrievable-packer-model-r";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/size-10-wireline-pressure-setting-tool/index.mdx": {
	id: "completion-equipment/size-10-wireline-pressure-setting-tool/index.mdx";
  slug: "completion-equipment/size-10-wireline-pressure-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/size-20-wireline-pressure-setting-tool/index.mdx": {
	id: "completion-equipment/size-20-wireline-pressure-setting-tool/index.mdx";
  slug: "completion-equipment/size-20-wireline-pressure-setting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/size-20-wireline-setting-tool-assembly-instructions/index.mdx": {
	id: "completion-equipment/size-20-wireline-setting-tool-assembly-instructions/index.mdx";
  slug: "completion-equipment/size-20-wireline-setting-tool-assembly-instructions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/splined-expansion-joint-assy/index.mdx": {
	id: "completion-equipment/splined-expansion-joint-assy/index.mdx";
  slug: "completion-equipment/splined-expansion-joint-assy";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/storm-valve/index.mdx": {
	id: "completion-equipment/storm-valve/index.mdx";
  slug: "completion-equipment/storm-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/t-2-on-off-tool/index.mdx": {
	id: "completion-equipment/t-2-on-off-tool/index.mdx";
  slug: "completion-equipment/t-2-on-off-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"completion-equipment/tubing-anchor-catcher-tac/index.mdx": {
	id: "completion-equipment/tubing-anchor-catcher-tac/index.mdx";
  slug: "completion-equipment/tubing-anchor-catcher-tac";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/control-line-accessories/control-line-accessories.mdx": {
	id: "flow-control-equipment/control-line-accessories/control-line-accessories.mdx";
  slug: "flow-control-equipment/control-line-accessories/control-line-accessories";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/deformation-lockout-tool/deformation-lockout-tool.mdx": {
	id: "flow-control-equipment/deformation-lockout-tool/deformation-lockout-tool.mdx";
  slug: "flow-control-equipment/deformation-lockout-tool/deformation-lockout-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/flow-couplings/index.mdx": {
	id: "flow-control-equipment/flow-couplings/index.mdx";
  slug: "flow-control-equipment/flow-couplings";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/landing-nipples-and-lock-mandrels/landing-nipples-and-lock-mandrels.mdx": {
	id: "flow-control-equipment/landing-nipples-and-lock-mandrels/landing-nipples-and-lock-mandrels.mdx";
  slug: "flow-control-equipment/landing-nipples-and-lock-mandrels/landing-nipples-and-lock-mandrels";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/lockout-tool/lockout-tool.mdx": {
	id: "flow-control-equipment/lockout-tool/lockout-tool.mdx";
  slug: "flow-control-equipment/lockout-tool/lockout-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-b-downhole-instrument-hangers/parveen-model-b-downhole-instrument-hangers.mdx": {
	id: "flow-control-equipment/parveen-model-b-downhole-instrument-hangers/parveen-model-b-downhole-instrument-hangers.mdx";
  slug: "flow-control-equipment/parveen-model-b-downhole-instrument-hangers/parveen-model-b-downhole-instrument-hangers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-f-nipple/parveen-model-f-nipple.mdx": {
	id: "flow-control-equipment/parveen-model-f-nipple/parveen-model-f-nipple.mdx";
  slug: "flow-control-equipment/parveen-model-f-nipple/parveen-model-f-nipple";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-fb-2-and-rb-2-equalizing-check-valves/parveen-model-fb-2-and-rb-2-equalizing-check-valves.mdx": {
	id: "flow-control-equipment/parveen-model-fb-2-and-rb-2-equalizing-check-valves/parveen-model-fb-2-and-rb-2-equalizing-check-valves.mdx";
  slug: "flow-control-equipment/parveen-model-fb-2-and-rb-2-equalizing-check-valves/parveen-model-fb-2-and-rb-2-equalizing-check-valves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-fgk-equalizing-check-valve-choke-with-ceramic-bean/parveen-model-fgk-equalizing-check-valve-choke-with-ceramic-bean.mdx": {
	id: "flow-control-equipment/parveen-model-fgk-equalizing-check-valve-choke-with-ceramic-bean/parveen-model-fgk-equalizing-check-valve-choke-with-ceramic-bean.mdx";
  slug: "flow-control-equipment/parveen-model-fgk-equalizing-check-valve-choke-with-ceramic-bean/parveen-model-fgk-equalizing-check-valve-choke-with-ceramic-bean";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-g-bottom-bypass-blanking-plugs/parveen-model-g-bottom-bypass-blanking-plugs.mdx": {
	id: "flow-control-equipment/parveen-model-g-bottom-bypass-blanking-plugs/parveen-model-g-bottom-bypass-blanking-plugs.mdx";
  slug: "flow-control-equipment/parveen-model-g-bottom-bypass-blanking-plugs/parveen-model-g-bottom-bypass-blanking-plugs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-l-sliding-sleeve/parveen-model-l-sliding-sleeve.mdx": {
	id: "flow-control-equipment/parveen-model-l-sliding-sleeve/parveen-model-l-sliding-sleeve.mdx";
  slug: "flow-control-equipment/parveen-model-l-sliding-sleeve/parveen-model-l-sliding-sleeve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-lge-separation-sleeve/parveen-model-lge-separation-sleeve.mdx": {
	id: "flow-control-equipment/parveen-model-lge-separation-sleeve/parveen-model-lge-separation-sleeve.mdx";
  slug: "flow-control-equipment/parveen-model-lge-separation-sleeve/parveen-model-lge-separation-sleeve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-lgk-equalizing-check-valve-choke-with-ceramic-bean/parveen-model-lgk-equalizing-check-valve-choke-with-ceramic-bean.mdx": {
	id: "flow-control-equipment/parveen-model-lgk-equalizing-check-valve-choke-with-ceramic-bean/parveen-model-lgk-equalizing-check-valve-choke-with-ceramic-bean.mdx";
  slug: "flow-control-equipment/parveen-model-lgk-equalizing-check-valve-choke-with-ceramic-bean/parveen-model-lgk-equalizing-check-valve-choke-with-ceramic-bean";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-lgu-bypass-choke/parveen-model-lgu-bypass-choke.mdx": {
	id: "flow-control-equipment/parveen-model-lgu-bypass-choke/parveen-model-lgu-bypass-choke.mdx";
  slug: "flow-control-equipment/parveen-model-lgu-bypass-choke/parveen-model-lgu-bypass-choke";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-pcmd-and-pcmu-sliding-sleeve/parveen-model-pcmd-and-pcmu-sliding-sleeve.mdx": {
	id: "flow-control-equipment/parveen-model-pcmd-and-pcmu-sliding-sleeve/parveen-model-pcmd-and-pcmu-sliding-sleeve.mdx";
  slug: "flow-control-equipment/parveen-model-pcmd-and-pcmu-sliding-sleeve/parveen-model-pcmd-and-pcmu-sliding-sleeve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-pxd-and-pxu-sliding-sleeve/parveen-model-pxd-and-pxu-sliding-sleeve.mdx": {
	id: "flow-control-equipment/parveen-model-pxd-and-pxu-sliding-sleeve/parveen-model-pxd-and-pxu-sliding-sleeve.mdx";
  slug: "flow-control-equipment/parveen-model-pxd-and-pxu-sliding-sleeve/parveen-model-pxd-and-pxu-sliding-sleeve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-model-r-nipple/parveen-model-r-nipple.mdx": {
	id: "flow-control-equipment/parveen-model-r-nipple/parveen-model-r-nipple.mdx";
  slug: "flow-control-equipment/parveen-model-r-nipple/parveen-model-r-nipple";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-rpt-no-go-landing-nipple-and-lock-mandrel/parveen-rpt-no-go-landing-nipple-and-lock-mandrel.mdx": {
	id: "flow-control-equipment/parveen-rpt-no-go-landing-nipple-and-lock-mandrel/parveen-rpt-no-go-landing-nipple-and-lock-mandrel.mdx";
  slug: "flow-control-equipment/parveen-rpt-no-go-landing-nipple-and-lock-mandrel/parveen-rpt-no-go-landing-nipple-and-lock-mandrel";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-tubing-pack-off-anchor-assembly/parveen-tubing-pack-off-anchor-assembly.mdx": {
	id: "flow-control-equipment/parveen-tubing-pack-off-anchor-assembly/parveen-tubing-pack-off-anchor-assembly.mdx";
  slug: "flow-control-equipment/parveen-tubing-pack-off-anchor-assembly/parveen-tubing-pack-off-anchor-assembly";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/parveen-tubing-retrievable-safety-valve/parveen-tubing-retrievable-safety-valve.mdx": {
	id: "flow-control-equipment/parveen-tubing-retrievable-safety-valve/parveen-tubing-retrievable-safety-valve.mdx";
  slug: "flow-control-equipment/parveen-tubing-retrievable-safety-valve/parveen-tubing-retrievable-safety-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/safety-valve-landing-nipple/index.mdx": {
	id: "flow-control-equipment/safety-valve-landing-nipple/index.mdx";
  slug: "flow-control-equipment/safety-valve-landing-nipple";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/separation-sleeve/index.mdx": {
	id: "flow-control-equipment/separation-sleeve/index.mdx";
  slug: "flow-control-equipment/separation-sleeve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/slip-lock-assembly/slip-lock-assembly.mdx": {
	id: "flow-control-equipment/slip-lock-assembly/slip-lock-assembly.mdx";
  slug: "flow-control-equipment/slip-lock-assembly/slip-lock-assembly";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/surface-controlled-subsurface-safety-valves-sssv/surface-controlled-subsurface-safety-valves-sssv.mdx": {
	id: "flow-control-equipment/surface-controlled-subsurface-safety-valves-sssv/surface-controlled-subsurface-safety-valves-sssv.mdx";
  slug: "flow-control-equipment/surface-controlled-subsurface-safety-valves-sssv/surface-controlled-subsurface-safety-valves-sssv";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"flow-control-equipment/surge-tool-assembly/surge-tool-assembly.mdx": {
	id: "flow-control-equipment/surge-tool-assembly/surge-tool-assembly.mdx";
  slug: "flow-control-equipment/surge-tool-assembly/surge-tool-assembly";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/4501-mechanical-time-cycle-controllers/index.mdx": {
	id: "gas-lift-equipment/4501-mechanical-time-cycle-controllers/index.mdx";
  slug: "gas-lift-equipment/4501-mechanical-time-cycle-controllers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/chemical-injection-nipple-cw-dual-check-rupture-cartridge/index.mdx": {
	id: "gas-lift-equipment/chemical-injection-nipple-cw-dual-check-rupture-cartridge/index.mdx";
  slug: "gas-lift-equipment/chemical-injection-nipple-cw-dual-check-rupture-cartridge";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/completion-systems-2/index.mdx": {
	id: "gas-lift-equipment/completion-systems-2/index.mdx";
  slug: "gas-lift-equipment/completion-systems-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/completion-systems-3/index.mdx": {
	id: "gas-lift-equipment/completion-systems-3/index.mdx";
  slug: "gas-lift-equipment/completion-systems-3";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/completion-systems-4/index.mdx": {
	id: "gas-lift-equipment/completion-systems-4/index.mdx";
  slug: "gas-lift-equipment/completion-systems-4";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/completion-systems/index.mdx": {
	id: "gas-lift-equipment/completion-systems/index.mdx";
  slug: "gas-lift-equipment/completion-systems";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/conventional-mandrels-2/index.mdx": {
	id: "gas-lift-equipment/conventional-mandrels-2/index.mdx";
  slug: "gas-lift-equipment/conventional-mandrels-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/conventional-mandrels/index.mdx": {
	id: "gas-lift-equipment/conventional-mandrels/index.mdx";
  slug: "gas-lift-equipment/conventional-mandrels";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/dummy-and-equalizing-valves/index.mdx": {
	id: "gas-lift-equipment/dummy-and-equalizing-valves/index.mdx";
  slug: "gas-lift-equipment/dummy-and-equalizing-valves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/hd-tp-hd-tmp-positioning-tools/index.mdx": {
	id: "gas-lift-equipment/hd-tp-hd-tmp-positioning-tools/index.mdx";
  slug: "gas-lift-equipment/hd-tp-hd-tmp-positioning-tools";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/hd-tp-positioning-tools/index.mdx": {
	id: "gas-lift-equipment/hd-tp-positioning-tools/index.mdx";
  slug: "gas-lift-equipment/hd-tp-positioning-tools";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/high-strength-conventional-mandrels/index.mdx": {
	id: "gas-lift-equipment/high-strength-conventional-mandrels/index.mdx";
  slug: "gas-lift-equipment/high-strength-conventional-mandrels";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/injection-pressure-operated-gas-lift-valve/index.mdx": {
	id: "gas-lift-equipment/injection-pressure-operated-gas-lift-valve/index.mdx";
  slug: "gas-lift-equipment/injection-pressure-operated-gas-lift-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/latches/index.mdx": {
	id: "gas-lift-equipment/latches/index.mdx";
  slug: "gas-lift-equipment/latches";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/orifice-valves/index.mdx": {
	id: "gas-lift-equipment/orifice-valves/index.mdx";
  slug: "gas-lift-equipment/orifice-valves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/pdk-1-wireline-retrievable-dummy-valve/index.mdx": {
	id: "gas-lift-equipment/pdk-1-wireline-retrievable-dummy-valve/index.mdx";
  slug: "gas-lift-equipment/pdk-1-wireline-retrievable-dummy-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/pilot-operated-gas-lift-valves/index.mdx": {
	id: "gas-lift-equipment/pilot-operated-gas-lift-valves/index.mdx";
  slug: "gas-lift-equipment/pilot-operated-gas-lift-valves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/plunger-lift-systems/index.mdx": {
	id: "gas-lift-equipment/plunger-lift-systems/index.mdx";
  slug: "gas-lift-equipment/plunger-lift-systems";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/retrievable-production-pressure-operated-gas-lift-equipment/index.mdx": {
	id: "gas-lift-equipment/retrievable-production-pressure-operated-gas-lift-equipment/index.mdx";
  slug: "gas-lift-equipment/retrievable-production-pressure-operated-gas-lift-equipment";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/side-pocket-mandrels/index.mdx": {
	id: "gas-lift-equipment/side-pocket-mandrels/index.mdx";
  slug: "gas-lift-equipment/side-pocket-mandrels";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/standing-valves-and-seating-nipples/index.mdx": {
	id: "gas-lift-equipment/standing-valves-and-seating-nipples/index.mdx";
  slug: "gas-lift-equipment/standing-valves-and-seating-nipples";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/surface-flow-controls-acv-series-adjustable-choke-valves/index.mdx": {
	id: "gas-lift-equipment/surface-flow-controls-acv-series-adjustable-choke-valves/index.mdx";
  slug: "gas-lift-equipment/surface-flow-controls-acv-series-adjustable-choke-valves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/surface-flow-controls-motor-valves/index.mdx": {
	id: "gas-lift-equipment/surface-flow-controls-motor-valves/index.mdx";
  slug: "gas-lift-equipment/surface-flow-controls-motor-valves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/surface-flow-controls-wfc-series-waterflood-control-valves/index.mdx": {
	id: "gas-lift-equipment/surface-flow-controls-wfc-series-waterflood-control-valves/index.mdx";
  slug: "gas-lift-equipment/surface-flow-controls-wfc-series-waterflood-control-valves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/time-cycle-controllers-with-accessories-time-cycle-electronic-controllers/index.mdx": {
	id: "gas-lift-equipment/time-cycle-controllers-with-accessories-time-cycle-electronic-controllers/index.mdx";
  slug: "gas-lift-equipment/time-cycle-controllers-with-accessories-time-cycle-electronic-controllers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gas-lift-equipment/wireline-retrievable-super-flow-orifice-valve/index.mdx": {
	id: "gas-lift-equipment/wireline-retrievable-super-flow-orifice-valve/index.mdx";
  slug: "gas-lift-equipment/wireline-retrievable-super-flow-orifice-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/automatic-unitised-casing-hanger/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/automatic-unitised-casing-hanger/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/automatic-unitised-casing-hanger";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/blind-and-test-flanges/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/blind-and-test-flanges/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/blind-and-test-flanges";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/blind-flanges/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/blind-flanges/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/blind-flanges";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/bottom-pack-off-cross-over-seal/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/bottom-pack-off-cross-over-seal/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/bottom-pack-off-cross-over-seal";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/casing-head-2/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/casing-head-2/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/casing-head-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/casing-head-spool/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/casing-head-spool/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/casing-head-spool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/cementing-head-1/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/cementing-head-1/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/cementing-head-1";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/cementing-head-2/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/cementing-head-2/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/cementing-head-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/check-valves-2/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/check-valves-2/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/check-valves-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-and-kill-manifold/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-and-kill-manifold/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-and-kill-manifold";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-valve-2/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-valve-2/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-valve-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-valve-3/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-valve-3/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-valve-3";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-valve/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-valve/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/choke-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/dual-split-type-extended-neck-type-tubing-hanger/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/dual-split-type-extended-neck-type-tubing-hanger/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/dual-split-type-extended-neck-type-tubing-hanger";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/extended-neck-hanger/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/extended-neck-hanger/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/extended-neck-hanger";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/flanged-crosses-and-tees-as-per-api-6a/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/flanged-crosses-and-tees-as-per-api-6a/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/flanged-crosses-and-tees-as-per-api-6a";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/flanges-introduction/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/flanges-introduction/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/flanges-introduction";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/flanges-studded-crosses-and-tees-as-per-api-6a/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/flanges-studded-crosses-and-tees-as-per-api-6a/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/flanges-studded-crosses-and-tees-as-per-api-6a";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/high-temperature-service-gate-valve/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/high-temperature-service-gate-valve/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/high-temperature-service-gate-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/integral-flanges-2/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/integral-flanges-2/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/integral-flanges-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/layout-for-testing-gas-condensate-or-oil-wells/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/layout-for-testing-gas-condensate-or-oil-wells/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/layout-for-testing-gas-condensate-or-oil-wells";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/manifolds-unitized-well-control-head-data-header/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/manifolds-unitized-well-control-head-data-header/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/manifolds-unitized-well-control-head-data-header";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/manual-gate-valve/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/manual-gate-valve/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/manual-gate-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/mud-valve/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/mud-valve/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/mud-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/plug-valves-2/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/plug-valves-2/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/plug-valves-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/plug-valves-3/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/plug-valves-3/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/plug-valves-3";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/pneumatic-gate-valve/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/pneumatic-gate-valve/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/pneumatic-gate-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/single-completion-component/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/single-completion-component/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/single-completion-component";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/slab-type-gate-valve/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/slab-type-gate-valve/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/slab-type-gate-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/surface-safety-valve/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/surface-safety-valve/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/surface-safety-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/threaded-flanges/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/threaded-flanges/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/threaded-flanges";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/tools-service-equipment-2/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tools-service-equipment-2/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tools-service-equipment-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/tools-service-equipment-3/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tools-service-equipment-3/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tools-service-equipment-3";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/tools-service-equipment/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tools-service-equipment/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tools-service-equipment";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-hanger-spool-coupling/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-hanger-spool-coupling/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-hanger-spool-coupling";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-head-adapter/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-head-adapter/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-head-adapter";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-head-spool/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-head-spool/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-head-spool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-head/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-head/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/tubing-head";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/typical-single-dual-completion-wellhead-x-mas-tree-assemblies/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/typical-single-dual-completion-wellhead-x-mas-tree-assemblies/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/typical-single-dual-completion-wellhead-x-mas-tree-assemblies";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/weld-neck-flanges/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/weld-neck-flanges/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/weld-neck-flanges";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"gate-valves-choke-manifolds-wellheads-x-mas-trees/x-mas-tree-cap/index.mdx": {
	id: "gate-valves-choke-manifolds-wellheads-x-mas-trees/x-mas-tree-cap/index.mdx";
  slug: "gate-valves-choke-manifolds-wellheads-x-mas-trees/x-mas-tree-cap";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"miscellaneous-products/casing-scraper/index.mdx": {
	id: "miscellaneous-products/casing-scraper/index.mdx";
  slug: "miscellaneous-products/casing-scraper";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"miscellaneous-products/tubing-casing-couplings/index.mdx": {
	id: "miscellaneous-products/tubing-casing-couplings/index.mdx";
  slug: "miscellaneous-products/tubing-casing-couplings";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"miscellaneous-products/unibolt-couplings/index.mdx": {
	id: "miscellaneous-products/unibolt-couplings/index.mdx";
  slug: "miscellaneous-products/unibolt-couplings";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"sucker-rod-pressure-control-equipment/coiled-tubing-quad-bop-combi-bop/index.mdx": {
	id: "sucker-rod-pressure-control-equipment/coiled-tubing-quad-bop-combi-bop/index.mdx";
  slug: "sucker-rod-pressure-control-equipment/coiled-tubing-quad-bop-combi-bop";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"sucker-rod-pressure-control-equipment/conventional-coiled-tubing-stripper-packers/index.mdx": {
	id: "sucker-rod-pressure-control-equipment/conventional-coiled-tubing-stripper-packers/index.mdx";
  slug: "sucker-rod-pressure-control-equipment/conventional-coiled-tubing-stripper-packers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"sucker-rod-pressure-control-equipment/side-loading-stripper-packer/index.mdx": {
	id: "sucker-rod-pressure-control-equipment/side-loading-stripper-packer/index.mdx";
  slug: "sucker-rod-pressure-control-equipment/side-loading-stripper-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"sucker-rod-pressure-control-equipment/sucker-rod-blowout-preventers/index.mdx": {
	id: "sucker-rod-pressure-control-equipment/sucker-rod-blowout-preventers/index.mdx";
  slug: "sucker-rod-pressure-control-equipment/sucker-rod-blowout-preventers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"sucker-rod-pressure-control-equipment/tandem-side-loading-stripper-packer/index.mdx": {
	id: "sucker-rod-pressure-control-equipment/tandem-side-loading-stripper-packer/index.mdx";
  slug: "sucker-rod-pressure-control-equipment/tandem-side-loading-stripper-packer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/api-threaded-adapters/index.mdx": {
	id: "surface-pressure-control-equipment/api-threaded-adapters/index.mdx";
  slug: "surface-pressure-control-equipment/api-threaded-adapters";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/blanking-caps-plugs/index.mdx": {
	id: "surface-pressure-control-equipment/blanking-caps-plugs/index.mdx";
  slug: "surface-pressure-control-equipment/blanking-caps-plugs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/blowout-preventers-2/index.mdx": {
	id: "surface-pressure-control-equipment/blowout-preventers-2/index.mdx";
  slug: "surface-pressure-control-equipment/blowout-preventers-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/blowout-preventers/index.mdx": {
	id: "surface-pressure-control-equipment/blowout-preventers/index.mdx";
  slug: "surface-pressure-control-equipment/blowout-preventers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/check-valve-unions/index.mdx": {
	id: "surface-pressure-control-equipment/check-valve-unions/index.mdx";
  slug: "surface-pressure-control-equipment/check-valve-unions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/chemical-injection-subs/index.mdx": {
	id: "surface-pressure-control-equipment/chemical-injection-subs/index.mdx";
  slug: "surface-pressure-control-equipment/chemical-injection-subs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/grease-head-cable-cutter/index.mdx": {
	id: "surface-pressure-control-equipment/grease-head-cable-cutter/index.mdx";
  slug: "surface-pressure-control-equipment/grease-head-cable-cutter";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/grease-hydraulic-control-unit/index.mdx": {
	id: "surface-pressure-control-equipment/grease-hydraulic-control-unit/index.mdx";
  slug: "surface-pressure-control-equipment/grease-hydraulic-control-unit";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/grease-injection-control-head/index.mdx": {
	id: "surface-pressure-control-equipment/grease-injection-control-head/index.mdx";
  slug: "surface-pressure-control-equipment/grease-injection-control-head";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/grease-injection-supply-system/index.mdx": {
	id: "surface-pressure-control-equipment/grease-injection-supply-system/index.mdx";
  slug: "surface-pressure-control-equipment/grease-injection-supply-system";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/hydraulic-line-wipers/index.mdx": {
	id: "surface-pressure-control-equipment/hydraulic-line-wipers/index.mdx";
  slug: "surface-pressure-control-equipment/hydraulic-line-wipers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/hydraulic-tool-catchers/index.mdx": {
	id: "surface-pressure-control-equipment/hydraulic-tool-catchers/index.mdx";
  slug: "surface-pressure-control-equipment/hydraulic-tool-catchers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/hydraulic-tool-traps/index.mdx": {
	id: "surface-pressure-control-equipment/hydraulic-tool-traps/index.mdx";
  slug: "surface-pressure-control-equipment/hydraulic-tool-traps";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/lubricator-accessories/index.mdx": {
	id: "surface-pressure-control-equipment/lubricator-accessories/index.mdx";
  slug: "surface-pressure-control-equipment/lubricator-accessories";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/lubricator-risers/index.mdx": {
	id: "surface-pressure-control-equipment/lubricator-risers/index.mdx";
  slug: "surface-pressure-control-equipment/lubricator-risers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/phgp-01-hydraulic-gin-pole/index.mdx": {
	id: "surface-pressure-control-equipment/phgp-01-hydraulic-gin-pole/index.mdx";
  slug: "surface-pressure-control-equipment/phgp-01-hydraulic-gin-pole";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/prs-02-spooling-unit/index.mdx": {
	id: "surface-pressure-control-equipment/prs-02-spooling-unit/index.mdx";
  slug: "surface-pressure-control-equipment/prs-02-spooling-unit";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/pump-in-subs-pump-in-sub-w-hammer-union-on-side-outlet/index.mdx": {
	id: "surface-pressure-control-equipment/pump-in-subs-pump-in-sub-w-hammer-union-on-side-outlet/index.mdx";
  slug: "surface-pressure-control-equipment/pump-in-subs-pump-in-sub-w-hammer-union-on-side-outlet";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/quick-test-subs/index.mdx": {
	id: "surface-pressure-control-equipment/quick-test-subs/index.mdx";
  slug: "surface-pressure-control-equipment/quick-test-subs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/quick-unions/index.mdx": {
	id: "surface-pressure-control-equipment/quick-unions/index.mdx";
  slug: "surface-pressure-control-equipment/quick-unions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/u-winch/index.mdx": {
	id: "surface-pressure-control-equipment/u-winch/index.mdx";
  slug: "surface-pressure-control-equipment/u-winch";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/wellhead-flange-adapters/index.mdx": {
	id: "surface-pressure-control-equipment/wellhead-flange-adapters/index.mdx";
  slug: "surface-pressure-control-equipment/wellhead-flange-adapters";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"surface-pressure-control-equipment/wireline-stuffing-boxes/index.mdx": {
	id: "surface-pressure-control-equipment/wireline-stuffing-boxes/index.mdx";
  slug: "surface-pressure-control-equipment/wireline-stuffing-boxes";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/crossover-connectors/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/crossover-connectors/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/crossover-connectors";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/drill-collars-grooves/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/drill-collars-grooves/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/drill-collars-grooves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/drill-collars-hard-binding/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/drill-collars-hard-binding/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/drill-collars-hard-binding";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/drill-collars/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/drill-collars/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/drill-collars";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/drill-pipe-pup-joints/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/drill-pipe-pup-joints/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/drill-pipe-pup-joints";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/drill-stem-subs/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/drill-stem-subs/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/drill-stem-subs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/heavy-wall-drill-pipe/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/heavy-wall-drill-pipe/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/heavy-wall-drill-pipe";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/inside-blow-out-preventer/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/inside-blow-out-preventer/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/inside-blow-out-preventer";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/integral-blade-stabilizers/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/integral-blade-stabilizers/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/integral-blade-stabilizers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/kelly-cocks-2/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/kelly-cocks-2/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/kelly-cocks-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/kelly-cocks/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/kelly-cocks/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/kelly-cocks";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/lifts-subs-lifts-plugs/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/lifts-subs-lifts-plugs/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/lifts-subs-lifts-plugs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/non-magnetic-drill-collars/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/non-magnetic-drill-collars/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/non-magnetic-drill-collars";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/sleeve-type-stabilizers/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/sleeve-type-stabilizers/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/sleeve-type-stabilizers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/spiral-drill-collars/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/spiral-drill-collars/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/spiral-drill-collars";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/thread-protectors/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/thread-protectors/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/thread-protectors";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/tubulars-2/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/tubulars-2/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/tubulars-2";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"tubulars-drilling-workover-tools-cementing-equipment/tubulars/index.mdx": {
	id: "tubulars-drilling-workover-tools-cementing-equipment/tubulars/index.mdx";
  slug: "tubulars-drilling-workover-tools-cementing-equipment/tubulars";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/air-unions/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/air-unions/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/air-unions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/cementing-and-circulating-hoses/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/cementing-and-circulating-hoses/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/cementing-and-circulating-hoses";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/changeover-crossover-adaptors/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/changeover-crossover-adaptors/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/changeover-crossover-adaptors";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/circulating-head/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/circulating-head/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/circulating-head";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/hammer-unions/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/hammer-unions/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/hammer-unions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/integral-fabricated-union-connections/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/integral-fabricated-union-connections/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/integral-fabricated-union-connections";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/integral-welded-union-end-fittings/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/integral-welded-union-end-fittings/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/integral-welded-union-end-fittings";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/mud-gun/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/mud-gun/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/mud-gun";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/swivel-joints/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/swivel-joints/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/swivel-joints";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"unions-swivels-treating-irons-circulating-heads/treating-irons-union-connections-bull-plugs-cross-over-adaptors-swages/index.mdx": {
	id: "unions-swivels-treating-irons-circulating-heads/treating-irons-union-connections-bull-plugs-cross-over-adaptors-swages/index.mdx";
  slug: "unions-swivels-treating-irons-circulating-heads/treating-irons-union-connections-bull-plugs-cross-over-adaptors-swages";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/back-pressure-control-valve/index.mdx": {
	id: "wellhead-and-fountain-fittings/back-pressure-control-valve/index.mdx";
  slug: "wellhead-and-fountain-fittings/back-pressure-control-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/column-head-coils/index.mdx": {
	id: "wellhead-and-fountain-fittings/column-head-coils/index.mdx";
  slug: "wellhead-and-fountain-fittings/column-head-coils";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/column-heads-for-coal-seam-methane-wells/index.mdx": {
	id: "wellhead-and-fountain-fittings/column-heads-for-coal-seam-methane-wells/index.mdx";
  slug: "wellhead-and-fountain-fittings/column-heads-for-coal-seam-methane-wells";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/column-heads/index.mdx": {
	id: "wellhead-and-fountain-fittings/column-heads/index.mdx";
  slug: "wellhead-and-fountain-fittings/column-heads";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/combined-tool/index.mdx": {
	id: "wellhead-and-fountain-fittings/combined-tool/index.mdx";
  slug: "wellhead-and-fountain-fittings/combined-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/components-for-finishing-single-row-wells/index.mdx": {
	id: "wellhead-and-fountain-fittings/components-for-finishing-single-row-wells/index.mdx";
  slug: "wellhead-and-fountain-fittings/components-for-finishing-single-row-wells";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/components-for-finishing-single-row-wellsavalves-on-the-discharge-lines-of-the-drilling-pump/index.mdx": {
	id: "wellhead-and-fountain-fittings/components-for-finishing-single-row-wellsavalves-on-the-discharge-lines-of-the-drilling-pump/index.mdx";
  slug: "wellhead-and-fountain-fittings/components-for-finishing-single-row-wellsavalves-on-the-discharge-lines-of-the-drilling-pump";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/cover-of-the-fountain-fittings/index.mdx": {
	id: "wellhead-and-fountain-fittings/cover-of-the-fountain-fittings/index.mdx";
  slug: "wellhead-and-fountain-fittings/cover-of-the-fountain-fittings";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/double-sealing-flange-with-stud-mounting/index.mdx": {
	id: "wellhead-and-fountain-fittings/double-sealing-flange-with-stud-mounting/index.mdx";
  slug: "wellhead-and-fountain-fittings/double-sealing-flange-with-stud-mounting";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/faceplates/index.mdx": {
	id: "wellhead-and-fountain-fittings/faceplates/index.mdx";
  slug: "wellhead-and-fountain-fittings/faceplates";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/fitting-valve-with-external-sleeve/index.mdx": {
	id: "wellhead-and-fountain-fittings/fitting-valve-with-external-sleeve/index.mdx";
  slug: "wellhead-and-fountain-fittings/fitting-valve-with-external-sleeve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/fitting-valves-the-target-type/index.mdx": {
	id: "wellhead-and-fountain-fittings/fitting-valves-the-target-type/index.mdx";
  slug: "wellhead-and-fountain-fittings/fitting-valves-the-target-type";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/fitting-valves/index.mdx": {
	id: "wellhead-and-fountain-fittings/fitting-valves/index.mdx";
  slug: "wellhead-and-fountain-fittings/fitting-valves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/flangez/index.mdx": {
	id: "wellhead-and-fountain-fittings/flangez/index.mdx";
  slug: "wellhead-and-fountain-fittings/flangez";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/high-temperature-gate-valve/index.mdx": {
	id: "wellhead-and-fountain-fittings/high-temperature-gate-valve/index.mdx";
  slug: "wellhead-and-fountain-fittings/high-temperature-gate-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/hydraulic-fracturing-equipment/index.mdx": {
	id: "wellhead-and-fountain-fittings/hydraulic-fracturing-equipment/index.mdx";
  slug: "wellhead-and-fountain-fittings/hydraulic-fracturing-equipment";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/hydraulic-fracturing-manifold/index.mdx": {
	id: "wellhead-and-fountain-fittings/hydraulic-fracturing-manifold/index.mdx";
  slug: "wellhead-and-fountain-fittings/hydraulic-fracturing-manifold";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/hydraulic-fracturing-wellhead-fittings/index.mdx": {
	id: "wellhead-and-fountain-fittings/hydraulic-fracturing-wellhead-fittings/index.mdx";
  slug: "wellhead-and-fountain-fittings/hydraulic-fracturing-wellhead-fittings";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/hydraulic-operated-ground-shut-off-valves-ssv/index.mdx": {
	id: "wellhead-and-fountain-fittings/hydraulic-operated-ground-shut-off-valves-ssv/index.mdx";
  slug: "wellhead-and-fountain-fittings/hydraulic-operated-ground-shut-off-valves-ssv";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/lubricator-for-valve-removal-pvrl/index.mdx": {
	id: "wellhead-and-fountain-fittings/lubricator-for-valve-removal-pvrl/index.mdx";
  slug: "wellhead-and-fountain-fittings/lubricator-for-valve-removal-pvrl";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/lubricator-pl/index.mdx": {
	id: "wellhead-and-fountain-fittings/lubricator-pl/index.mdx";
  slug: "wellhead-and-fountain-fittings/lubricator-pl";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/manifolds-for-silencing-and-throttling-wells/index.mdx": {
	id: "wellhead-and-fountain-fittings/manifolds-for-silencing-and-throttling-wells/index.mdx";
  slug: "wellhead-and-fountain-fittings/manifolds-for-silencing-and-throttling-wells";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/monobloc-wellwear-and-fountain-fixtures/index.mdx": {
	id: "wellhead-and-fountain-fittings/monobloc-wellwear-and-fountain-fixtures/index.mdx";
  slug: "wellhead-and-fountain-fittings/monobloc-wellwear-and-fountain-fixtures";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/phdc-01-hydraulic-drill-string-fittings-with-control-panel/index.mdx": {
	id: "wellhead-and-fountain-fittings/phdc-01-hydraulic-drill-string-fittings-with-control-panel/index.mdx";
  slug: "wellhead-and-fountain-fittings/phdc-01-hydraulic-drill-string-fittings-with-control-panel";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/plug-for-crimping/index.mdx": {
	id: "wellhead-and-fountain-fittings/plug-for-crimping/index.mdx";
  slug: "wellhead-and-fountain-fittings/plug-for-crimping";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/pneumatic-diaphragm-valve/index.mdx": {
	id: "wellhead-and-fountain-fittings/pneumatic-diaphragm-valve/index.mdx";
  slug: "wellhead-and-fountain-fittings/pneumatic-diaphragm-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/seals/index.mdx": {
	id: "wellhead-and-fountain-fittings/seals/index.mdx";
  slug: "wellhead-and-fountain-fittings/seals";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/slide-gate-valve/index.mdx": {
	id: "wellhead-and-fountain-fittings/slide-gate-valve/index.mdx";
  slug: "wellhead-and-fountain-fittings/slide-gate-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/standard-wellhead-and-fountain/index.mdx": {
	id: "wellhead-and-fountain-fittings/standard-wellhead-and-fountain/index.mdx";
  slug: "wellhead-and-fountain-fittings/standard-wellhead-and-fountain";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/stoppers-for-removing-valves-pvp/index.mdx": {
	id: "wellhead-and-fountain-fittings/stoppers-for-removing-valves-pvp/index.mdx";
  slug: "wellhead-and-fountain-fittings/stoppers-for-removing-valves-pvp";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/translators-and-tees-with-flanges/index.mdx": {
	id: "wellhead-and-fountain-fittings/translators-and-tees-with-flanges/index.mdx";
  slug: "wellhead-and-fountain-fittings/translators-and-tees-with-flanges";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/translators-and-tees-with-stud-flanges/index.mdx": {
	id: "wellhead-and-fountain-fittings/translators-and-tees-with-stud-flanges/index.mdx";
  slug: "wellhead-and-fountain-fittings/translators-and-tees-with-stud-flanges";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/tubing-heads-for-coal-paste-methane-wells/index.mdx": {
	id: "wellhead-and-fountain-fittings/tubing-heads-for-coal-paste-methane-wells/index.mdx";
  slug: "wellhead-and-fountain-fittings/tubing-heads-for-coal-paste-methane-wells";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/tubing-heads/index.mdx": {
	id: "wellhead-and-fountain-fittings/tubing-heads/index.mdx";
  slug: "wellhead-and-fountain-fittings/tubing-heads";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/tubing-suspensions/index.mdx": {
	id: "wellhead-and-fountain-fittings/tubing-suspensions/index.mdx";
  slug: "wellhead-and-fountain-fittings/tubing-suspensions";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/two-way-check-valve/index.mdx": {
	id: "wellhead-and-fountain-fittings/two-way-check-valve/index.mdx";
  slug: "wellhead-and-fountain-fittings/two-way-check-valve";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/unified-wellhead-fittings/index.mdx": {
	id: "wellhead-and-fountain-fittings/unified-wellhead-fittings/index.mdx";
  slug: "wellhead-and-fountain-fittings/unified-wellhead-fittings";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/unregulated-fitting-valves/index.mdx": {
	id: "wellhead-and-fountain-fittings/unregulated-fitting-valves/index.mdx";
  slug: "wellhead-and-fountain-fittings/unregulated-fitting-valves";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/valves-on-the-switch-lines/index.mdx": {
	id: "wellhead-and-fountain-fittings/valves-on-the-switch-lines/index.mdx";
  slug: "wellhead-and-fountain-fittings/valves-on-the-switch-lines";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/valves-with-expansion/index.mdx": {
	id: "wellhead-and-fountain-fittings/valves-with-expansion/index.mdx";
  slug: "wellhead-and-fountain-fittings/valves-with-expansion";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/wear-resistant-liner/index.mdx": {
	id: "wellhead-and-fountain-fittings/wear-resistant-liner/index.mdx";
  slug: "wellhead-and-fountain-fittings/wear-resistant-liner";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/wedge-suspension-casing-columns/index.mdx": {
	id: "wellhead-and-fountain-fittings/wedge-suspension-casing-columns/index.mdx";
  slug: "wellhead-and-fountain-fittings/wedge-suspension-casing-columns";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wellhead-and-fountain-fittings/wellhead-flange-coil-fbs/index.mdx": {
	id: "wellhead-and-fountain-fittings/wellhead-flange-coil-fbs/index.mdx";
  slug: "wellhead-and-fountain-fittings/wellhead-flange-coil-fbs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/alligator-grabs/index.mdx": {
	id: "wireline-tools-accessories/alligator-grabs/index.mdx";
  slug: "wireline-tools-accessories/alligator-grabs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/anti-blow-up-tool/index.mdx": {
	id: "wireline-tools-accessories/anti-blow-up-tool/index.mdx";
  slug: "wireline-tools-accessories/anti-blow-up-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/b-shifting-tool/index.mdx": {
	id: "wireline-tools-accessories/b-shifting-tool/index.mdx";
  slug: "wireline-tools-accessories/b-shifting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/ball-orienting-impression-tool/index.mdx": {
	id: "wireline-tools-accessories/ball-orienting-impression-tool/index.mdx";
  slug: "wireline-tools-accessories/ball-orienting-impression-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/blind-box/index.mdx": {
	id: "wireline-tools-accessories/blind-box/index.mdx";
  slug: "wireline-tools-accessories/blind-box";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/bow-spring-centraliser/index.mdx": {
	id: "wireline-tools-accessories/bow-spring-centraliser/index.mdx";
  slug: "wireline-tools-accessories/bow-spring-centraliser";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/bull-dog-spears/index.mdx": {
	id: "wireline-tools-accessories/bull-dog-spears/index.mdx";
  slug: "wireline-tools-accessories/bull-dog-spears";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/calibrator-subs/index.mdx": {
	id: "wireline-tools-accessories/calibrator-subs/index.mdx";
  slug: "wireline-tools-accessories/calibrator-subs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/center-spear/index.mdx": {
	id: "wireline-tools-accessories/center-spear/index.mdx";
  slug: "wireline-tools-accessories/center-spear";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/dump-bailers/index.mdx": {
	id: "wireline-tools-accessories/dump-bailers/index.mdx";
  slug: "wireline-tools-accessories/dump-bailers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/fishing-bar-clamp/index.mdx": {
	id: "wireline-tools-accessories/fishing-bar-clamp/index.mdx";
  slug: "wireline-tools-accessories/fishing-bar-clamp";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/fluted-centralizers/index.mdx": {
	id: "wireline-tools-accessories/fluted-centralizers/index.mdx";
  slug: "wireline-tools-accessories/fluted-centralizers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/forged-knuckle-joints/index.mdx": {
	id: "wireline-tools-accessories/forged-knuckle-joints/index.mdx";
  slug: "wireline-tools-accessories/forged-knuckle-joints";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/go-devil/index.mdx": {
	id: "wireline-tools-accessories/go-devil/index.mdx";
  slug: "wireline-tools-accessories/go-devil";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/gs-pulling-tool/index.mdx": {
	id: "wireline-tools-accessories/gs-pulling-tool/index.mdx";
  slug: "wireline-tools-accessories/gs-pulling-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/gu-shear-up-adapter/index.mdx": {
	id: "wireline-tools-accessories/gu-shear-up-adapter/index.mdx";
  slug: "wireline-tools-accessories/gu-shear-up-adapter";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/heavy-duty-accelerators/index.mdx": {
	id: "wireline-tools-accessories/heavy-duty-accelerators/index.mdx";
  slug: "wireline-tools-accessories/heavy-duty-accelerators";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/heavy-duty-gs-pulling-tool/index.mdx": {
	id: "wireline-tools-accessories/heavy-duty-gs-pulling-tool/index.mdx";
  slug: "wireline-tools-accessories/heavy-duty-gs-pulling-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/heavy-duty-releasable-pulling-tool/index.mdx": {
	id: "wireline-tools-accessories/heavy-duty-releasable-pulling-tool/index.mdx";
  slug: "wireline-tools-accessories/heavy-duty-releasable-pulling-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/hydrostatic-bailers/index.mdx": {
	id: "wireline-tools-accessories/hydrostatic-bailers/index.mdx";
  slug: "wireline-tools-accessories/hydrostatic-bailers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/impression-blocks/index.mdx": {
	id: "wireline-tools-accessories/impression-blocks/index.mdx";
  slug: "wireline-tools-accessories/impression-blocks";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/knuckle-joints/index.mdx": {
	id: "wireline-tools-accessories/knuckle-joints/index.mdx";
  slug: "wireline-tools-accessories/knuckle-joints";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/knuckle-swivel-joint/index.mdx": {
	id: "wireline-tools-accessories/knuckle-swivel-joint/index.mdx";
  slug: "wireline-tools-accessories/knuckle-swivel-joint";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/lead-filled-stems/index.mdx": {
	id: "wireline-tools-accessories/lead-filled-stems/index.mdx";
  slug: "wireline-tools-accessories/lead-filled-stems";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/magnetic-fishing-tools/index.mdx": {
	id: "wireline-tools-accessories/magnetic-fishing-tools/index.mdx";
  slug: "wireline-tools-accessories/magnetic-fishing-tools";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/mechanical-spring-jars/index.mdx": {
	id: "wireline-tools-accessories/mechanical-spring-jars/index.mdx";
  slug: "wireline-tools-accessories/mechanical-spring-jars";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/memory-gauge-knuckle-joint/index.mdx": {
	id: "wireline-tools-accessories/memory-gauge-knuckle-joint/index.mdx";
  slug: "wireline-tools-accessories/memory-gauge-knuckle-joint";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/model-c-1-running-tool/index.mdx": {
	id: "wireline-tools-accessories/model-c-1-running-tool/index.mdx";
  slug: "wireline-tools-accessories/model-c-1-running-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/model-d-2-shifting-tool/index.mdx": {
	id: "wireline-tools-accessories/model-d-2-shifting-tool/index.mdx";
  slug: "wireline-tools-accessories/model-d-2-shifting-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/multi-roller-wheel-fluted-centraliser/index.mdx": {
	id: "wireline-tools-accessories/multi-roller-wheel-fluted-centraliser/index.mdx";
  slug: "wireline-tools-accessories/multi-roller-wheel-fluted-centraliser";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/multi-roller-wheel-go-devil-flat-bottom-cutter-type/index.mdx": {
	id: "wireline-tools-accessories/multi-roller-wheel-go-devil-flat-bottom-cutter-type/index.mdx";
  slug: "wireline-tools-accessories/multi-roller-wheel-go-devil-flat-bottom-cutter-type";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/multi-roller-wheel-linear-jars/index.mdx": {
	id: "wireline-tools-accessories/multi-roller-wheel-linear-jars/index.mdx";
  slug: "wireline-tools-accessories/multi-roller-wheel-linear-jars";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/multi-roller-wheel-snipper/index.mdx": {
	id: "wireline-tools-accessories/multi-roller-wheel-snipper/index.mdx";
  slug: "wireline-tools-accessories/multi-roller-wheel-snipper";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/paraffin-scratchers/index.mdx": {
	id: "wireline-tools-accessories/paraffin-scratchers/index.mdx";
  slug: "wireline-tools-accessories/paraffin-scratchers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/pinning-tool/index.mdx": {
	id: "wireline-tools-accessories/pinning-tool/index.mdx";
  slug: "wireline-tools-accessories/pinning-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/pulling-tool-r-series/index.mdx": {
	id: "wireline-tools-accessories/pulling-tool-r-series/index.mdx";
  slug: "wireline-tools-accessories/pulling-tool-r-series";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/pulling-tool-s-series/index.mdx": {
	id: "wireline-tools-accessories/pulling-tool-s-series/index.mdx";
  slug: "wireline-tools-accessories/pulling-tool-s-series";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/pulling-tools-jd-ju-series/index.mdx": {
	id: "wireline-tools-accessories/pulling-tools-jd-ju-series/index.mdx";
  slug: "wireline-tools-accessories/pulling-tools-jd-ju-series";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/quick-lock-connection/index.mdx": {
	id: "wireline-tools-accessories/quick-lock-connection/index.mdx";
  slug: "wireline-tools-accessories/quick-lock-connection";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/quick-lock-couplings/index.mdx": {
	id: "wireline-tools-accessories/quick-lock-couplings/index.mdx";
  slug: "wireline-tools-accessories/quick-lock-couplings";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/releasable-collet-bull-dog-spears/index.mdx": {
	id: "wireline-tools-accessories/releasable-collet-bull-dog-spears/index.mdx";
  slug: "wireline-tools-accessories/releasable-collet-bull-dog-spears";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/releasable-overshots/index.mdx": {
	id: "wireline-tools-accessories/releasable-overshots/index.mdx";
  slug: "wireline-tools-accessories/releasable-overshots";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/releasable-rope-sockets/index.mdx": {
	id: "wireline-tools-accessories/releasable-rope-sockets/index.mdx";
  slug: "wireline-tools-accessories/releasable-rope-sockets";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/releasing-tool/index.mdx": {
	id: "wireline-tools-accessories/releasing-tool/index.mdx";
  slug: "wireline-tools-accessories/releasing-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/roller-go-devil/index.mdx": {
	id: "wireline-tools-accessories/roller-go-devil/index.mdx";
  slug: "wireline-tools-accessories/roller-go-devil";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/roller-kickover-tool/index.mdx": {
	id: "wireline-tools-accessories/roller-kickover-tool/index.mdx";
  slug: "wireline-tools-accessories/roller-kickover-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/roller-stems/index.mdx": {
	id: "wireline-tools-accessories/roller-stems/index.mdx";
  slug: "wireline-tools-accessories/roller-stems";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/rope-sockets/index.mdx": {
	id: "wireline-tools-accessories/rope-sockets/index.mdx";
  slug: "wireline-tools-accessories/rope-sockets";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/running-tools-for-gas-lift-accessories/index.mdx": {
	id: "wireline-tools-accessories/running-tools-for-gas-lift-accessories/index.mdx";
  slug: "wireline-tools-accessories/running-tools-for-gas-lift-accessories";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/rx-running-tool/index.mdx": {
	id: "wireline-tools-accessories/rx-running-tool/index.mdx";
  slug: "wireline-tools-accessories/rx-running-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/sample-bailers/index.mdx": {
	id: "wireline-tools-accessories/sample-bailers/index.mdx";
  slug: "wireline-tools-accessories/sample-bailers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/sand-pump-bailers/index.mdx": {
	id: "wireline-tools-accessories/sand-pump-bailers/index.mdx";
  slug: "wireline-tools-accessories/sand-pump-bailers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/self-releasing-overshots/index.mdx": {
	id: "wireline-tools-accessories/self-releasing-overshots/index.mdx";
  slug: "wireline-tools-accessories/self-releasing-overshots";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/shock-absorbers/index.mdx": {
	id: "wireline-tools-accessories/shock-absorbers/index.mdx";
  slug: "wireline-tools-accessories/shock-absorbers";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/side-wall-cutter/index.mdx": {
	id: "wireline-tools-accessories/side-wall-cutter/index.mdx";
  slug: "wireline-tools-accessories/side-wall-cutter";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/skate-system/index.mdx": {
	id: "wireline-tools-accessories/skate-system/index.mdx";
  slug: "wireline-tools-accessories/skate-system";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/slickline-roller-glides/index.mdx": {
	id: "wireline-tools-accessories/slickline-roller-glides/index.mdx";
  slug: "wireline-tools-accessories/slickline-roller-glides";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/solid-wirefinder/index.mdx": {
	id: "wireline-tools-accessories/solid-wirefinder/index.mdx";
  slug: "wireline-tools-accessories/solid-wirefinder";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/spang-link-jars-mechanical-jars/index.mdx": {
	id: "wireline-tools-accessories/spang-link-jars-mechanical-jars/index.mdx";
  slug: "wireline-tools-accessories/spang-link-jars-mechanical-jars";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/star-bit-chisel/index.mdx": {
	id: "wireline-tools-accessories/star-bit-chisel/index.mdx";
  slug: "wireline-tools-accessories/star-bit-chisel";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/sucker-rod-connection/index.mdx": {
	id: "wireline-tools-accessories/sucker-rod-connection/index.mdx";
  slug: "wireline-tools-accessories/sucker-rod-connection";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/thread-chaser/index.mdx": {
	id: "wireline-tools-accessories/thread-chaser/index.mdx";
  slug: "wireline-tools-accessories/thread-chaser";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/tubing-broach/index.mdx": {
	id: "wireline-tools-accessories/tubing-broach/index.mdx";
  slug: "wireline-tools-accessories/tubing-broach";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/tubing-end-locator/index.mdx": {
	id: "wireline-tools-accessories/tubing-end-locator/index.mdx";
  slug: "wireline-tools-accessories/tubing-end-locator";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/tubing-gauge-cutter-ring-set/index.mdx": {
	id: "wireline-tools-accessories/tubing-gauge-cutter-ring-set/index.mdx";
  slug: "wireline-tools-accessories/tubing-gauge-cutter-ring-set";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/tubing-gauge-paraffin-cutter/index.mdx": {
	id: "wireline-tools-accessories/tubing-gauge-paraffin-cutter/index.mdx";
  slug: "wireline-tools-accessories/tubing-gauge-paraffin-cutter";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/tubing-perforator-punch/index.mdx": {
	id: "wireline-tools-accessories/tubing-perforator-punch/index.mdx";
  slug: "wireline-tools-accessories/tubing-perforator-punch";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/tubing-swages/index.mdx": {
	id: "wireline-tools-accessories/tubing-swages/index.mdx";
  slug: "wireline-tools-accessories/tubing-swages";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/tungsten-filled-stems/index.mdx": {
	id: "wireline-tools-accessories/tungsten-filled-stems/index.mdx";
  slug: "wireline-tools-accessories/tungsten-filled-stems";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/universal-pulling-tool/index.mdx": {
	id: "wireline-tools-accessories/universal-pulling-tool/index.mdx";
  slug: "wireline-tools-accessories/universal-pulling-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/universal-tubing-broach/index.mdx": {
	id: "wireline-tools-accessories/universal-tubing-broach/index.mdx";
  slug: "wireline-tools-accessories/universal-tubing-broach";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/w-running-tool/index.mdx": {
	id: "wireline-tools-accessories/w-running-tool/index.mdx";
  slug: "wireline-tools-accessories/w-running-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wire-finder-grab/index.mdx": {
	id: "wireline-tools-accessories/wire-finder-grab/index.mdx";
  slug: "wireline-tools-accessories/wire-finder-grab";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-accelerators/index.mdx": {
	id: "wireline-tools-accessories/wireline-accelerators/index.mdx";
  slug: "wireline-tools-accessories/wireline-accelerators";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-cross-overs/index.mdx": {
	id: "wireline-tools-accessories/wireline-cross-overs/index.mdx";
  slug: "wireline-tools-accessories/wireline-cross-overs";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-cutter/index.mdx": {
	id: "wireline-tools-accessories/wireline-cutter/index.mdx";
  slug: "wireline-tools-accessories/wireline-cutter";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-fishing-magnets/index.mdx": {
	id: "wireline-tools-accessories/wireline-fishing-magnets/index.mdx";
  slug: "wireline-tools-accessories/wireline-fishing-magnets";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-grab/index.mdx": {
	id: "wireline-tools-accessories/wireline-grab/index.mdx";
  slug: "wireline-tools-accessories/wireline-grab";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-overshot/index.mdx": {
	id: "wireline-tools-accessories/wireline-overshot/index.mdx";
  slug: "wireline-tools-accessories/wireline-overshot";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-retriver/index.mdx": {
	id: "wireline-tools-accessories/wireline-retriver/index.mdx";
  slug: "wireline-tools-accessories/wireline-retriver";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-sleeved-expanding-wire-finder/index.mdx": {
	id: "wireline-tools-accessories/wireline-sleeved-expanding-wire-finder/index.mdx";
  slug: "wireline-tools-accessories/wireline-sleeved-expanding-wire-finder";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-snipper/index.mdx": {
	id: "wireline-tools-accessories/wireline-snipper/index.mdx";
  slug: "wireline-tools-accessories/wireline-snipper";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-spears/index.mdx": {
	id: "wireline-tools-accessories/wireline-spears/index.mdx";
  slug: "wireline-tools-accessories/wireline-spears";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-stems-weight-bars/index.mdx": {
	id: "wireline-tools-accessories/wireline-stems-weight-bars/index.mdx";
  slug: "wireline-tools-accessories/wireline-stems-weight-bars";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-swivel-joint/index.mdx": {
	id: "wireline-tools-accessories/wireline-swivel-joint/index.mdx";
  slug: "wireline-tools-accessories/wireline-swivel-joint";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-tool-string/index.mdx": {
	id: "wireline-tools-accessories/wireline-tool-string/index.mdx";
  slug: "wireline-tools-accessories/wireline-tool-string";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-torsion-tester/index.mdx": {
	id: "wireline-tools-accessories/wireline-torsion-tester/index.mdx";
  slug: "wireline-tools-accessories/wireline-torsion-tester";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-tubular-jars/index.mdx": {
	id: "wireline-tools-accessories/wireline-tubular-jars/index.mdx";
  slug: "wireline-tools-accessories/wireline-tubular-jars";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/wireline-wirefinder/index.mdx": {
	id: "wireline-tools-accessories/wireline-wirefinder/index.mdx";
  slug: "wireline-tools-accessories/wireline-wirefinder";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/x-check-set-tool/index.mdx": {
	id: "wireline-tools-accessories/x-check-set-tool/index.mdx";
  slug: "wireline-tools-accessories/x-check-set-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
"wireline-tools-accessories/x-r-running-tool/index.mdx": {
	id: "wireline-tools-accessories/x-r-running-tool/index.mdx";
  slug: "wireline-tools-accessories/x-r-running-tool";
  body: string;
  collection: "products";
  data: any
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = never;
}
