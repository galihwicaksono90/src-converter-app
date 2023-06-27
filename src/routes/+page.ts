export const ssr = false;

export async function load() {
	const databank = await import('../public/databank.json');
	// const category = await import('../public/category.json');
	// const brand = await import('../public/brand.json');
	return {
		databank: databank.default
		//category: category.default,
		//brand: brand.default
	};
}
