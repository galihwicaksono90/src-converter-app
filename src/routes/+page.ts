/** @type {import('./$types').PageLoad} */
export const ssr: boolean = false;

export async function load() {
	const res = await import('../public/databank.json');
	console.log('readyyyyy');
	return {
		databank: res.default
	};
}
