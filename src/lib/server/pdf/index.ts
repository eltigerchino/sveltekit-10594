import PdfPrinter from 'pdfmake';
import blobStream, { type IBlobStream } from 'blob-stream';
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import futuraNormal from '$lib/fonts/FuturaPTBook.otf';
import futuraBold from '$lib/fonts/FuturaPTCondBold.otf';
import path from 'path';
import { building } from '$app/environment';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

let dir = process.cwd();
if (building) {
	dir += '/.netlify/server';
}

const fonts: TFontDictionary = {
	Futura: {
		normal: path.join(dir, futuraNormal),
		bold: path.join(dir, futuraBold)
	}
};

const printer = new PdfPrinter(fonts);

async function genInvoicePdf(): Promise<Blob> {
	const file: TDocumentDefinitions = {
		pageMargins: [40, 40, 40, 60],
		content: ['Hello, World!!'],
		defaultStyle: {
			font: 'Futura'
		}
	};

	return new Promise((resolve, reject) => {
		const pdf = printer.createPdfKitDocument(file);

		pdf
			.pipe(blobStream())
			.on('finish', function (this: IBlobStream) {
				console.log('Finished generating PDF');
				resolve(this.toBlob('application/pdf'));
			})
			.on('error', (err) => {
				console.error('err', err);
				reject(err);
			});

		pdf.end();
	});
}

export default genInvoicePdf;
