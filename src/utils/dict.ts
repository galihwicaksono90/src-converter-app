import type Exceljs from 'exceljs';

export const templateTypes = [
	'SID Retail PRO (Harga Toko)',
	'SID Retail PRO (Harga Partai)'
] as const;

export type TemplateTypes = (typeof templateTypes)[number];

export type Dictionary = Record<TemplateTypes, DictionaryMapProperties>;

export type DictionaryMapProperties = {
	startRow: number;
	sheetName: string;
	mappings: DictionaryRow;
	// mappings: MapArray;
};

export interface Row {
	sku_id?: any;
	name: any;
	other_name?: any;
	barcode?: any;
	brand_id?: any;
	brand_name: any;
	category_id: any;
	alias?: any;
	availability?: any;
	status?: any;
	packaging?: any;
	packaging_amount: any;
	basic_harga_normal: any;
	basic_harga_diskon?: any;
	basic_tanggal_kadaluarsa?: any;
	gold_harga_normal?: any;
	gold_harga_diskon?: any;
	gold_tanggal_kadaluarsa?: any;
	src_harga_normal?: any;
	src_harga_diskon?: any;
	src_tanggal_kadaluarsa?: any;
}

// export interface DictionaryRow {
// 	sku_id?: string;
// 	name?: string;
// 	other_name?: string;
// 	barcode?: string;
// 	brand_id?: string;
// 	brand_name?: string;
// 	category_id?: string;
// 	alias?: string;
// 	availability?: string;
// 	status?: string;
// 	packaging?: string;
// 	packaging_amount?: string;
// 	basic_harga_normal?: string;
// 	basic_harga_diskon?: string;
// 	basic_tanggal_kadaluarsa?: string;
// 	gold_harga_normal?: string;
// 	gold_harga_diskon?: string;
// 	gold_tanggal_kadaluarsa?: string;
// 	src_harga_normal?: string;
// 	src_harga_diskon?: string;
// 	src_tanggal_kadaluarsa?: string;
// }

export type DictionaryRow = {
	sku_id?: string;
	name?: string;
	other_name?: string;
	barcode?: string;
	brand_id?: string;
	brand_name?: string;
	category_id?: string;
	alias?: string;
	availability?: string;
	status?: string;
	packaging?: string;
	packaging_amount?: string;
	basic_harga_normal?: string;
	basic_harga_diskon?: string;
	basic_tanggal_kadaluarsa?: string;
	gold_harga_normal?: string;
	gold_harga_diskon?: string;
	gold_tanggal_kadaluarsa?: string;
	src_harga_normal?: string;
	src_harga_diskon?: string;
	src_tanggal_kadaluarsa?: string;
};

export const dict: Dictionary = {
	'SID Retail PRO (Harga Toko)': {
		startRow: 2,
		sheetName: 'Sheet1',
		mappings: {
			// sku_id: 1,
			name: 'NAMA',
			//other_name: '',
			barcode: 'KODE_BARCODE',
			brand_id: 'KODE_BARCODE_2',
			//brand_name: 'f',
			category_id: 'KATEGORI',
			//alias: 'h',
			//availability: 'i',
			//status: 'j',
			packaging: 'SATUAN_1',
			packaging_amount: 'ISI',
			basic_harga_normal: 'HARGA_TOKO_1'
			// basic_harga_diskon: 17
		} as const
	},
	'SID Retail PRO (Harga Partai)': {
		startRow: 2,
		sheetName: 'Sheet1',
		mappings: {
			// sku_id: 1,
			name: 'NAMA',
			//other_name: '',
			barcode: 'KODE_BARCODE',
			brand_id: 'KODE_BARCODE_2',
			//brand_name: 'f',
			category_id: 'KATEGORI',
			//alias: 'h',
			//availability: 'i',
			//status: 'j',
			packaging: 'SATUAN_1',
			packaging_amount: 'ISI',
			basic_harga_normal: 'HARGA_PARTAI_1'
			// basic_harga_diskon: 17
		} as const
	}
};

export const header: Row = {
	sku_id: 'jika menambah baru sku id di kosongkan. Mohon untuk tidak mengubah data sku id',
	name: '(WAJIB DIISI) panjang maksimal karakter adalah 191',
	other_name:
		'nama yang ditampilkan pada aplikasi toko dan nota belanja, panjang maksimal karakter adalah 191',
	barcode: 'panjang maksimal karakter adalah 191',
	brand_id:
		'silahkan pilih dari sheet brand atau jika dikosongkan akan menggunakan kolom brand_name',
	brand_name: '(WAJIB DIISI) \n panjang maksimal karakter adalah 191',
	category_id: '(WAJIB DIISI) \n silahkan pilih dari sheet category',
	alias:
		'bisa menambahkan beberapa alias dengan menggunakan koma. panjang maksimal karakter adalah 1000',
	availability: '(WAJIB DIISI) \n in-stock(1) / out-of-stock(0)',
	status: '(WAJIB DIISI) \n active / inactive',
	packaging: '(WAJIB DIISI)',
	packaging_amount: '(WAJIB DIISI) \n satuan dari packaging',
	basic_harga_normal: '(WAJIB DIISI) harga normal',
	basic_harga_diskon: 'harga diskon',
	basic_tanggal_kadaluarsa: 'tanggal kadaluarsa harga diskon. format: DD-MM-YYYY',
	gold_harga_normal: 'harga normal',
	gold_harga_diskon: 'harga diskon',
	gold_tanggal_kadaluarsa: 'tanggal kadaluarsa harga diskon. format: DD-MM-YYYY',
	src_harga_normal: 'harga normal',
	src_harga_diskon: 'harga diskon',
	src_tanggal_kadaluarsa: 'tanggal kadaluarsa harga diskon. format: DD-MM-YYYY'
};

export const excelColumns: Partial<Exceljs.Column>[] = [
	{
		header: 'sku_id',
		key: 'sku_id',
		width: 36
	},
	{
		header: 'name',
		key: 'name',
		width: 36
	},
	{
		header: 'other_name',
		key: 'other_name',
		width: 36
	},
	{
		header: 'barcode',
		key: 'barcode',
		width: 36
	},
	{
		header: 'brand_id',
		key: 'brand_id',
		width: 36
	},
	{
		header: 'brand_name',
		key: 'brand_name',
		width: 36
	},
	{
		header: 'category_id',
		key: 'category_id',
		width: 36
	},
	{
		header: 'alias',
		key: 'alias',
		width: 36
	},
	{
		header: 'availability',
		key: 'availability',
		width: 36
	},
	{
		header: 'status',
		key: 'status',
		width: 36
	},
	{
		header: 'packaging',
		key: 'packaging',
		width: 36
	},
	{
		header: 'packaging_amount',
		key: 'packaging_amount',
		width: 36
	},
	{
		header: 'basic_harga_normal',
		key: 'basic_harga_normal',
		width: 36
	},
	{
		header: 'basic_harga_diskon',
		key: 'basic_harga_diskon',
		width: 36
	},
	{
		header: 'basic_tanggal_kadaluarsa',
		key: 'basic_tanggal_kadaluarsa',
		width: 36
	}
];
