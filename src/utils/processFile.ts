import { Converter } from './converter.ts_';
import { dict, TemplateTypes } from './dict';
import { RetailPro } from './retailPro';
import { Converter, type DataBank } from './converter.ts_';
import Exceljs from 'exceljs';

export const convert = async (
  file: File,
  templateName: TemplateTypes,
  databank: Record<string, DataBank>
) => {
  if (!file) {
    alert('No file selected');
    return;
  }

  const wb = new Exceljs.Workbook();
  const readFile = await Converter.readFile(file);
  await wb.xlsx.load(readFile);

  const template = dict[templateName];
  const ws = wb.getWorksheet(template.sheetName);
  const newwb = Converter.createWorkbook();

  const converter = new RetailPro(wb, newwb, ws, template, databank, filename);

  try {
    const converter = await RetailPro.build(file, templateName, databank);
    await converter.convert();
  } catch (e) {
    throw 'error converting data';
  }
};
