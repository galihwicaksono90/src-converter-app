import { Converter, type DataBank } from './converter';
import type { TemplateTypes } from './dict';
import type Exceljs from 'exceljs';

export class RetailProHargaToko extends Converter {
	constructor(databank: Record<string, DataBank>, templateType: TemplateTypes, file: File) {
		super(databank, templateType, file);
	}

	_convertRows = () => {
		if (!this._targetWb || !this._sourceWs) {
			return;
		}
		const headers = this._headers;

		const { startRow, mappings } = this._template;
		const targetWs = this._targetWb.getWorksheet('product');

		this._sourceWs.eachRow((row, idx) => {
			if (idx < startRow || !mappings.packaging || !mappings.basic_harga_normal) {
				return;
			}

			const packaging1 = row.getCell(headers[mappings.packaging]).value;
			const packaging2 = row.getCell(headers[mappings.packaging] + 1).value;
			const harga1 = row.getCell(headers[mappings.basic_harga_normal]).value;
			const harga2 = row.getCell(headers[mappings.basic_harga_normal] + 1).value;

			let barcode = '';
			let data: Record<string, any>;

			if (mappings.barcode) {
				barcode = row.getCell(headers[mappings.barcode]).value as string;
			}

			data = this._databank[barcode];

			if (!!packaging1 && harga1 && (harga1 as number) > 0) {
				if (!data) {
					data = this._mapRow(row);
				} else {
					this._addCustomData(data, row);
				}

				data.sku_id = null;
				data.availability = '1';
				data.status = 'active';
				data.basic_harga_diskon = null;
				data.packaging = packaging1;
				data.basic_harga_normal = harga1;
				data.packaging_amount = 1;

				targetWs.addRow(data);
				if (!!packaging2 && harga2 && (harga2 as number) > 0) {
					data.packaging = packaging2;
					data.basic_harga_normal = harga2;
					targetWs.addRow(data);
				}
			}
		});
	};

	// __convertRows = () => {
	// 	if (!this._targetWb || !this._sourceWs) {
	// 		return;
	// 	}
	//
	// 	const { startRow, mappings } = this._template;
	// 	const targetWs = this._targetWb.getWorksheet('product');
	//
	// 	this._sourceWs.eachRow((row, idx) => {
	// 		if (idx < startRow) {
	// 			return;
	// 		}
	// 		if (!mappings.packaging || !mappings.basic_harga_normal) {
	// 			return;
	// 		}
	//
	// 		const packaging1 = row.getCell(mappings.packaging).value;
	// 		const packaging2 = row.getCell(mappings.packaging + 1).value;
	// 		const harga1 = row.getCell(mappings.basic_harga_normal).value;
	// 		const harga2 = row.getCell(mappings.basic_harga_normal + 1).value;
	//
	// 		let barcode = '';
	// 		let data: Record<string, any>;
	//
	// 		if (mappings.barcode) {
	// 			barcode = row.getCell(mappings.barcode).value as string;
	// 		}
	//
	// 		data = this._databank[barcode];
	//
	// 		if (!!packaging1 && harga1 && (harga1 as number) > 0) {
	// 			if (!data) {
	// 				data = this._mapRow(row);
	// 			} else {
	// 				this._addCustomData(data, row);
	// 			}
	//
	// 			data.sku_id = null;
	// 			data.availability = '1';
	// 			data.status = 'active';
	// 			data.basic_harga_diskon = null;
	// 			data.packaging = packaging1;
	// 			data.basic_harga_normal = harga1;
	// 			data.packaging_amount = 1;
	//
	// 			targetWs.addRow(data);
	// 			if (!!packaging2 && harga2 && (harga2 as number) > 0) {
	// 				data.packaging = packaging2;
	// 				data.basic_harga_normal = harga2;
	// 				targetWs.addRow(data);
	// 			}
	// 		}
	// 	});
	// };

	private _addCustomData = (data: Record<string, any>, row: Exceljs.Row) => {
		const { mappings } = this._template;
		const headers = this._headers;

		data.packaging = mappings.packaging ? row.getCell(headers[mappings.packaging]).value : null;
		data.packaging_amount = mappings.packaging_amount
			? row.getCell(headers[mappings.packaging_amount]).value
			: 1;
		data.basic_harga_normal = mappings.basic_harga_normal
			? row.getCell(headers[mappings.basic_harga_normal]).value
			: 1;
		data.basic_harga_diskon = mappings.basic_harga_diskon
			? row.getCell(headers[mappings.basic_harga_diskon]).value
			: 1;
	};
}
