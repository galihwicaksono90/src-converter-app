<script lang="ts">
	import { onMount } from 'svelte';
	import Select from '$components/Select.svelte';
	import FileSelect from '$components/FileSelect.svelte';
	import { templateTypes } from '$utils/dict';
	import type { TemplateTypes } from '$utils/dict';
	import type { Converter } from '$utils/converter.js';
	import type { DataBank } from '$utils/converter.js';
	import { RetailProHargaToko } from '$utils/retailProHargaToko.js';
	import { RetailProHargaPartai } from '$utils/retailProHargaPartai.js';

	export let data;

	let templateName: TemplateTypes;
	let file: File | null = null;
	let databank: Record<string, DataBank> = {};
	let loading = false;

	onMount(() => {
		data.databank.forEach((x) => {
			databank[x.barcode] = x;
		});
	});

	const processFile = async () => {
		if (!file) {
			alert('No file selected');
			return;
		}
		loading = true;

		let converter: Converter | null = null;

		switch (templateName) {
			case 'SID Retail PRO (Harga Toko)':
				converter = new RetailProHargaToko(databank, templateName, file);
				break;
			case 'SID Retail PRO (Harga Partai)':
				converter = new RetailProHargaPartai(databank, templateName, file);
				break;
			default:
				break;
		}

		if (!converter) {
			return;
		}

		try {
			await converter.build();
			converter.convert();
		} catch (e) {
			console.log(e);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Converter</title>
	<meta name="description" content="Xlsx template converter" />
</svelte:head>

<section class="flex flex-col justify-center container mx-auto gap-8 max-w-[700px] pt-12 px-4">
	<h1 class="text-3xl font-black text-center">SRC Template Converter</h1>
	<Select options={[...templateTypes]} bind:value={templateName} title="Nama template" />

	<FileSelect bind:file {loading} />
	<button
		on:click={processFile}
		disabled={loading || !file}
		class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
	>
		{loading ? 'Converting...' : 'Convert'}
	</button>
</section>
