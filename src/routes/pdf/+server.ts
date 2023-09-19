
import { error } from '@sveltejs/kit';
import genInvoicePdf from '$lib/server/pdf';
import type { RequestHandler } from './$types';

export const GET = (async ({ setHeaders }) => {


	const pdf = await genInvoicePdf();

	setHeaders({
		'Content-Type': 'application/pdf',
		'Content-Length': pdf.size.toString(),
		'Last-Modified': new Date().toUTCString(),
		'Cache-Control': 'public, max-age=600'
	});

	return new Response(pdf);
}) satisfies RequestHandler;