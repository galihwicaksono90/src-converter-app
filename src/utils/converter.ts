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
	wb: Exceljs.Workbook;
	newwb: Exceljs.Workbook;
	template: DictionaryMapProperties;
	ws: Exceljs.Worksheet;
	databank: Record<string, DataBank>;
	filename: string;

	private constructor(
		wb: Exceljs.Workbook,
		newwb: Exceljs.Workbook,
		ws: Exceljs.Worksheet,
		template: DictionaryMapProperties,
		databank: Record<string, DataBank>,
		filename: string
	) {
		this.template = template;
		this.wb = wb;
		this.ws = ws;
		this.databank = databank;
		this.newwb = newwb;
		this.filename = filename;
	}

	public static build = async (
		file: File,
		templateName: TemplateTypes,
		databank: Record<string, DataBank>
	) => {
		const wb = new Exceljs.Workbook();
		const readFile = await this.readFile(file);
		await wb.xlsx.load(readFile);

		const template = dict[templateName];
		const ws = wb.getWorksheet(template.sheetName);
		const newwb = Converter.createWorkbook();

		return new Converter(wb, newwb, ws, template, databank, file.name);
	};

	convert = async () => {
		const { startRow, mappings } = this.template;
		const newws = this.newwb.worksheets[0];
		await this.addExtraSheets();

		this.ws.eachRow((row, idx) => {
			if (idx < startRow) {
				return;
			}

			let barcode = '';
			let data: any;

			if (mappings.barcode) {
				barcode = row.getCell(mappings.barcode).toString();
			}

			data = this.databank[barcode];

			if (!data) {
				data = this.mapRow(row);
			} else {
				this.addCustomData(data, row);
			}

			data.sku_id = null;
			data.availability = '1';
			data.status = 'active';
			data.basic_harga_diskon = null;

			newws.addRow(data);
		});

		this.setColumnsFormat();

		await this.saveFile();
	};

	setColumnsFormat = () => {
		this.newwb.getWorksheet('product').eachColumnKey((col) => {
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

	addCustomData = (data: any, row: Exceljs.Row) => {
		const { mappings } = this.template;
		data.packaging = mappings.packaging ? row.getCell(mappings.packaging).value : null;
		data.packaging_amount = mappings.packaging_amount
			? row.getCell(mappings.packaging_amount).value
			: 1;
		data.basic_harga_normal = mappings.basic_harga_normal
			? row.getCell(mappings.basic_harga_normal).value
			: 1;
		data.basic_harga_diskon = mappings.basic_harga_diskon
			? row.getCell(mappings.basic_harga_diskon).value
			: 1;
	};

	private saveFile = async () => {
		const buffer = await this.newwb.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `${this.filename.split('.')[0]}(converted).xlsx`;
		link.click();
		URL.revokeObjectURL(link.href);
	};

	static readFile = (file: File): Promise<ArrayBuffer> => {
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

	static createWorkbook = (sheetName = 'product') => {
		const newwb = new Exceljs.Workbook();

		newwb.addWorksheet(sheetName);
		const newws = newwb.getWorksheet(sheetName);
		Converter.addHeader(newws);

		return newwb;
	};

	addExtraSheets = async () => {
		const { default: brand } = await import('../public/brand.json');
		const { default: category } = await import('../public/category.json');

		this.newwb.addWorksheet('brand');
		this.newwb.addWorksheet('category');

		const brandws = this.newwb.getWorksheet('brand');
		const categoryws = this.newwb.getWorksheet('category');

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

	private static addHeader = (ws: Exceljs.Worksheet) => {
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

	mapRow = (row: Exceljs.Row): Row => {
		const { mappings } = this.template;
		return {
			sku_id: mappings.sku_id ? row.getCell(mappings.sku_id).value : null,
			name: mappings.name ? row.getCell(mappings.name).value : null,
			other_name: mappings.other_name ? row.getCell(mappings.other_name).value : null,
			barcode: mappings.barcode ? row.getCell(mappings.barcode).value : null,
			brand_id: mappings.brand_id ? row.getCell(mappings.brand_id).value : null,
			brand_name: mappings.brand_name ? row.getCell(mappings.brand_name).value : 'Others',
			category_id: '7',
			alias: mappings.alias ? row.getCell(mappings.alias).value : null,
			availability: mappings.availability ? row.getCell(mappings.availability).value : null,
			status: mappings.status ? row.getCell(mappings.status).value : null,
			packaging: mappings.packaging ? row.getCell(mappings.packaging).value : null,
			packaging_amount: mappings.packaging_amount
				? row.getCell(mappings.packaging_amount).value
				: null,
			basic_harga_normal: mappings.basic_harga_normal
				? row.getCell(mappings.basic_harga_normal).value
				: null,
			basic_harga_diskon: mappings.basic_harga_diskon
				? row.getCell(mappings.basic_harga_diskon).value
				: null,
			basic_tanggal_kadaluarsa: mappings.basic_tanggal_kadaluarsa
				? row.getCell(mappings.basic_tanggal_kadaluarsa).value
				: null,
			gold_harga_normal: mappings.gold_harga_normal
				? row.getCell(mappings.gold_harga_normal).value
				: null,
			gold_harga_diskon: mappings.gold_harga_diskon
				? row.getCell(mappings.gold_harga_diskon).value
				: null,
			gold_tanggal_kadaluarsa: mappings.gold_tanggal_kadaluarsa
				? row.getCell(mappings.gold_tanggal_kadaluarsa).value
				: null,
			src_harga_normal: mappings.src_harga_normal
				? row.getCell(mappings.src_harga_normal).value
				: null,
			src_harga_diskon: mappings.src_harga_diskon
				? row.getCell(mappings.src_harga_diskon).value
				: null,
			src_tanggal_kadaluarsa: mappings.src_tanggal_kadaluarsa
				? row.getCell(mappings.src_tanggal_kadaluarsa).value
				: null
		};
	};
}
