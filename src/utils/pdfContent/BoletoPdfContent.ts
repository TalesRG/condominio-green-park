import TDocumentDefinitions from 'pdfmake';
import { BoletoEntity } from '../../entity/BoletoEntity';

const pdfTemplate: TDocumentDefinitions = {
  defaultStyle: { font: 'Helvetica' },
  pageSize: 'A4',
  content: [],
  styles: {
    header: {
      fontSize: 22,
      bold: true,
      margin: [0, 0, 0, 10],
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5],
    },
    text: {
      fontSize: 12,
      margin: [0, 5, 0, 5],
    },
  },
};

export function preencherBoletoPdf(
  boletos: BoletoEntity[],
): TDocumentDefinitions {
  const tableBody = [
    ['ID', 'Nome Sacado', 'ID Lote', 'Valor', 'Linha Digitável'],
    ...boletos.map((boleto) => [
      boleto.id.toString(),
      boleto.nome_sacado,
      boleto.lote.id,
      boleto.valor,
      boleto.linha_digitavel,
    ]),
  ];

  pdfTemplate.content = [
    {
      text: 'Relatório de Boletos',
      style: 'header',
    },
    {
      text: 'Este é um exemplo de conteúdo para o PDF.',
      style: 'subheader',
    },
    {
      text: 'Abaixo segue a tabela de boletos:',
      style: 'text',
    },
    {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto'],
        body: tableBody,
      },
    },
  ];

  return pdfTemplate;
}
