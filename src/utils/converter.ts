import type { DataBank } from '$stores/databankStore';
import { excelColumns, header } from '$utils/dict';
import Exceljs from 'exceljs';
import type { DictionaryMapProperties, DictionaryRow, Row, TemplateType } from './dict';

export class Converter {
	_sourceWb?: Exceljs.Workbook;
	_targetWb?: Exceljs.Workbook;
	_sourceWs?: Exceljs.Worksheet;
	_filename = '';

	build = async (file: File) => {
		this._filename = file.name.split('.')[0];
		// initialize source worbook
		this._sourceWb = new Exceljs.Workbook();
		const readFile = await this._readFile(file);
		await this._sourceWb.xlsx.load(readFile);

		//initialize source worksheet
		this._sourceWs = this._sourceWb.worksheets[0];

		//initialize target workbook
		await this._createWorkbook();
	};

	convert = async (
		databank: Record<string, DataBank>,
		template: DictionaryMapProperties,
		templateType: TemplateType
	) => {
		if (!this._targetWb || !this._sourceWs) {
			return;
		}

		const { startRow, mappings } = template;

		this._convertRows(startRow, databank, mappings, templateType);

		this._setColumnsFormat();

		await this._saveFile();
	};

	_convertRows = (
		startRow: number,
		databank: Record<string, DataBank>,
		mappings: DictionaryRow
	) => {
		if (!this._targetWb || !this._sourceWs) {
			return;
		}
		const headers = this._getWorksheetHeaders(startRow);

		const targetWs = this._targetWb.getWorksheet('product');

		this._sourceWs.eachRow((row, idx) => {
			if (idx < startRow + 1 || !mappings.packaging || !mappings.basic_harga_normal) {
				return;
			}

			const packaging = row.getCell(headers[mappings.packaging]).value;
			let harga = row.getCell(headers[mappings.basic_harga_normal]).value;

			let barcode = '';
			let data: Record<string, any>;

			if (mappings.barcode) {
				barcode = row.getCell(headers[mappings.barcode]).value as string;
			}

			data = this._getDataFromBarcode(barcode, databank);

			if (!!packaging && harga) {
				if (typeof harga === 'string') {
					harga = parseInt(harga);
				}
				if ((harga as number) < 0) {
					return;
				}
				if (!data) {
					data = this._mapRow(row, mappings, headers);
				}

				data.sku_id = null;
				data.availability = '1';
				data.status = 'active';
				data.basic_harga_diskon = null;
				data.packaging = packaging;
				data.basic_harga_normal = harga;
				data.packaging_amount = 1;

				targetWs.addRow(data);

				if (
					mappings.packaging2 &&
					mappings.basic_harga_normal2 &&
					mappings.packaging2 !== '' &&
					mappings.basic_harga_normal2 !== ''
				) {
					const packaging2 = row.getCell(headers[mappings.packaging2]).value;
					let harga2 = row.getCell(headers[mappings.basic_harga_normal2]).value;

					if (!packaging2 || !harga2) {
						return;
					}

					if (typeof harga2 === 'string') {
						harga2 = parseInt(harga2);
					}

					if ((harga2 as number) < 0) {
						return;
					}

					data.packaging = packaging2;
					data.basic_harga_normal = harga2;
					targetWs.addRow(data);
				}

				if (
					mappings.packaging3 &&
					mappings.basic_harga_normal3 &&
					mappings.packaging3 !== '' &&
					mappings.basic_harga_normal3 !== ''
				) {
					const packaging3 = row.getCell(headers[mappings.packaging3]).value;
					let harga3 = row.getCell(headers[mappings.basic_harga_normal3]).value;

					if (!packaging3 || !harga3) {
						return;
					}

					if (typeof harga3 === 'string') {
						harga3 = parseInt(harga3);
					}

					if ((harga3 as number) < 0) {
						return;
					}

					data.packaging = packaging3;
					data.basic_harga_normal = harga3;
					targetWs.addRow(data);
				}
			}
		});
	};

	_getDataFromBarcode = (barcode: string, databank: Record<string, DataBank>) => {
		return databank[barcode];
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
		link.download = `${this._filename}(converted).xlsx`;
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

	_getWorksheetHeaders = (headerRow = 1): Record<string, number> => {
		const d: Record<string, number> = {};
		if (!this._sourceWs) {
			return d;
		}

		const firstRow = this._sourceWs.getRow(headerRow);

		firstRow.eachCell((cell, index) => {
			if (!cell.value) {
				return;
			}
			d[cell.value?.toString()] = index;
		});

		return d;
	};

	getHeaders = (rowNumber = 1) => {
		const h = this._getWorksheetHeaders(rowNumber);
		return Object.keys(h);
	};

	_mapRow = (row: Exceljs.Row, mappings: DictionaryRow, headers: Record<string, number>): Row => {
		return {
			sku_id: mappings.sku_id ? row.getCell(headers[mappings.sku_id]).value : null,
			name: mappings.name ? row.getCell(headers[mappings.name]).value : null,
			other_name: mappings.other_name ? row.getCell(headers[mappings.other_name]).value : null,
			barcode: mappings.barcode ? row.getCell(headers[mappings.barcode]).value : null,
			brand_id: mappings.brand_id ? row.getCell(headers[mappings.brand_id]).value : null,
			brand_name: mappings.brand_name ? row.getCell(headers[mappings.brand_name]).value : 'Others',
			category_id: '7',
			packaging: mappings.packaging ? row.getCell(headers[mappings.packaging]).value : null,
			packaging_amount: mappings.packaging_amount
				? row.getCell(headers[mappings.packaging_amount]).value
				: null,
			basic_harga_normal: mappings.basic_harga_normal
				? row.getCell(headers[mappings.basic_harga_normal]).value
				: null
		};
	};
}
