import { writable } from 'svelte/store';

export type DataBank = {
	sku_id: string;
	name: string;
	barcode: string;
	brand_id: string;
	brand_name: string;
	category_id: string;
	category_name: string;
	pin_up: string;
	created_at: string;
	'Special Rate for Pojok Modal (EKF)': string;
	'dapat dipesan melalui GSM / GSM Hub / ke Mitra Hub / Supplier': string;
	'Produk baru (30 hari terakhir)': string;
};

export const databank = writable<Record<string, DataBank>>({});
