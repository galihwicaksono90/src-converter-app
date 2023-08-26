import { writable } from 'svelte/store';
import { dict, type TemplateType } from '$utils/dict';

export type Form = {
	name: string;
	barcode: string;
	brand_id: string;
	category_id: string;
	packaging: string;
	packaging_amount: string;
	packaging2?: string;
	packaging_amount2?: string;
	packaging3?: string;
	packaging_amount3?: string;
	basic_harga_normal: string;
	basic_harga_normal2?: string;
	basic_harga_normal3?: string;
};

const initialForm: Form = {
	name: '',
	barcode: '',
	brand_id: '',
	category_id: '',
	packaging: '',
	packaging_amount: '',
	packaging2: '',
	packaging_amount2: '',
	packaging3: '',
	packaging_amount3: '',
	basic_harga_normal: '',
	basic_harga_normal2: '',
	basic_harga_normal3: ''
};
export const createStore = () => {
	const { subscribe, set, update } = writable<Form>(initialForm);

	const updateForm = (templateType: TemplateType) => {
		const mappings = dict[templateType].mappings;
		update((val) => ({
			...val,
			name: mappings.name ?? '',
			barcode: mappings.barcode ?? '',
			brand_id: mappings.brand_id ?? '',
			category_id: mappings.category_id ?? '',
			packaging: mappings.packaging ?? '',
			packaging_amount: mappings.packaging_amount ?? '',
			basic_harga_normal: mappings.basic_harga_normal ?? '',
			basic_harga_normal2: mappings.basic_harga_normal2 ?? '',
			basic_harga_normal3: mappings.basic_harga_normal2 ?? '',
			packaging2: mappings.packaging2 ?? '',
			packaging_amount2: mappings.packaging_amount2 ?? '',
			packaging3: mappings.packaging3 ?? '',
			packaging_amount3: mappings.packaging_amount3 ?? ''
		}));
	};

	const resetForm = () => {
		update((i) => ({
			...i,
			...initialForm
		}));
	};

	return {
		subscribe,
		set,
		update,
		updateForm,
		resetForm
	};
};

export const form = createStore();
