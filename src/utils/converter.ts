import type { DictionaryMapProperties, Row, TemplateTypes } from './dict';
import Exceljs from 'exceljs';
import { dict, excelColumns, header } from '$utils/dict';

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

export class Converter {
	_sourceWb?: Exceljs.Workbook;
	_targetWb?: Exceljs.Workbook;
	_sourceWs?: Exceljs.Worksheet;
	_template: DictionaryMapProperties;
	_databank: Record<string, DataBank>;
	_file: File;
	_headers: Record<string, number> = {};

	constructor(databank: Record<string, DataBank>, templateType: TemplateTypes, file: File) {
		this._databank = databank;
		this._template = dict[templateType];
		this._file = file;
	}

	build = async () => {
		// initialize source worbook
		this._sourceWb = new Exceljs.Workbook();
		const readFile = await this._readFile(this._file);
		await this._sourceWb.xlsx.load(readFile);

		//initialize source worksheet
		this._sourceWs = this._sourceWb.getWorksheet(this._template.sheetName);

		//initialize target workbook
		await this._createWorkbook();
		this._headers = this._getWorksheetHeaders();
	};

	convert = async () => {
		if (!this._targetWb || !this._sourceWs) {
			return;
		}

		this._convertRows();

		this._setColumnsFormat();

		await this._saveFile();
	};

	_convertRows = () => {
		console.log('not implementnd');
	};

	_setColumnsFormat = () => {
		if (!this._targetWb) {
			return;
		}

		this._targetWb.getWorksheet('product').eachColumnKey((col) => {
			col.eachCell((cell) => {
				switch (col.key) {
					case 'basic_harga_normal':
						cell.numFmt = '#,##0.00';
						break;
					case 'basic_harga_diskon':
						cell.numFmt = '#,##0.00';
						break;
					default:
						cell.numFmt = '@';
						break;
				}
			});
		});
	};

	_saveFile = async () => {
		if (!this._targetWb) {
			return;
		}
		const buffer = await this._targetWb.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `${this._file.name.split('.')[0]}(converted).xlsx`;
		link.click();
		URL.revokeObjectURL(link.href);
	};

	_readFile = (file: File): Promise<ArrayBuffer> => {
		return new Promise((resolve, reject) => {
			if (!file) {
				reject();
			}
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload = () => {
				resolve(reader.result as ArrayBuffer);
			};
		});
	};

	_createWorkbook = async () => {
		// initialize target workbook workseets
		this._targetWb = new Exceljs.Workbook();

		this._targetWb.addWorksheet('product');
		await this._addExtraSheets();

		//add header to product sheet
		this._addHeader();
	};

	_addExtraSheets = async () => {
		if (!this._targetWb) {
			return;
		}

		const { default: brand } = await import('../public/brand.json');
		const { default: category } = await import('../public/category.json');

		this._targetWb.addWorksheet('brand');
		this._targetWb.addWorksheet('category');

		const brandws = this._targetWb.getWorksheet('brand');
		const categoryws = this._targetWb.getWorksheet('category');

		brandws.columns = [
			{ header: 'id', key: 'id', width: 10 },
			{ header: 'name', key: 'name', width: 70 }
		];
		categoryws.columns = [
			{ header: 'id', key: 'id', width: 10 },
			{ header: 'name', key: 'name', width: 70 }
		];

		brand.forEach((b) => {
			brandws.addRow(b);
		});

		['A', 'B'].forEach((x) => {
			brandws.getCell(`${x}1`).fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'ffffa3' }
			};
			brandws.getCell(`${x}1`).font = { bold: true };
			categoryws.getCell(`${x}1`).fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'ffffa3' }
			};
			categoryws.getCell(`${x}1`).font = { bold: true };
		});

		category.forEach((c) => {
			categoryws.addRow(c);
		});
	};

	_addHeader = () => {
		const ws = this._targetWb?.getWorksheet('product');
		if (!ws) {
			return;
		}

		ws.columns = excelColumns;
		ws.addRow(header);

		const t = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'] as const;
		const r = ['B', 'C', 'F', 'G', 'I', 'J', 'K', 'L', 'M'];

		t.forEach((x) => {
			const c1 = ws.getCell(`${x}1`);
			const c2 = ws.getCell(`${x}2`);

			c1.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'ffffa3' }
			};
			c1.font = { bold: true };

			c2.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: r.includes(x) ? '99beff' : 'b7d2ff' }
			};
			c2.font = { bold: true };
			c2.alignment = { wrapText: true };
		});
		ws.getRow(2).height = 100;
	};

	_mapRow = (row: Exceljs.Row): Row => {
		const { mappings } = this._template;
		const headers = this._headers;
		return {
			sku_id: mappings.sku_id ? row.getCell(headers[mappings.sku_id]).value : null,
			name: mappings.name ? row.getCell(headers[mappings.name]).value : null,
			other_name: mappings.other_name ? row.getCell(headers[mappings.other_name]).value : null,
			barcode: mappings.barcode ? row.getCell(headers[mappings.barcode]).value : null,
			brand_id: mappings.brand_id ? row.getCell(headers[mappings.brand_id]).value : null,
			brand_name: mappings.brand_name ? row.getCell(headers[mappings.brand_name]).value : 'Others',
			category_id: '7',
			// alias: mappings.alias ? row.getCell(headers[mappings.alias]).value : null,
			// availability: mappings.availability
			// 	? row.getCell(headers[mappings.availability]).value
			// 	: null,
			// status: mappings.status ? row.getCell(headers[mappings.status]).value : null,
			packaging: mappings.packaging ? row.getCell(headers[mappings.packaging]).value : null,
			packaging_amount: mappings.packaging_amount
				? row.getCell(headers[mappings.packaging_amount]).value
				: null,
			basic_harga_normal: mappings.basic_harga_normal
				? row.getCell(headers[mappings.basic_harga_normal]).value
				: null,
			basic_harga_diskon: mappings.basic_harga_diskon
				? row.getCell(headers[mappings.basic_harga_diskon]).value
				: null,
			basic_tanggal_kadaluarsa: mappings.basic_tanggal_kadaluarsa
				? row.getCell(headers[mappings.basic_tanggal_kadaluarsa]).value
				: null
		};
	};

	_getWorksheetHeaders = (): Record<string, number> => {
		const d: Record<string, number> = {};
		if (!this._sourceWs) {
			return d;
		}

		const firstRow = this._sourceWs.getRow(1);

		firstRow.eachCell((cell, index) => {
			if (!cell.value) {
				return;
			}
			d[cell.value?.toString()] = index;
		});

		return d;
	};
}
