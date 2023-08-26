<script lang="ts">
	import { onMount } from 'svelte';
	import Select from '$components/Select.svelte';
	import ColumnsForm from '$components/ColumnsForm.svelte';
	import FileSelect from '$components/FileSelect.svelte';
	import { templateType } from '$utils/dict';
	import { databank, type DataBank } from '../stores/databankStore.js';
	import { converter } from '../stores/converterStore.js';
	import { form } from '../stores/formStore.js';

	export let data;
	let file: File | null;

	onMount(() => {
		const d: Record<string, DataBank> = {};
		data.databank.forEach((x) => {
			d[x.barcode] = x;
		});
		databank.set(d);
	});

	const processFile = async () => {
		if (!$converter.converter) {
			return;
		}
		await $converter.converter.convert(
			$databank,
			{
				startRow: $converter.startRow,
				sheetName: 'product',
				mappings: $form
			},
			$converter.templateType
		);
		form.resetForm();
		converter.clearConverter();
		file = null;
	};
</script>

<svelte:head>
	<title>Converter</title>
	<meta name="description" content="Xlsx template converter" />
</svelte:head>

<section class="py-12 px-4 space-y-8">
	<h1 class="text-3xl font-black text-center">SRC Template Converter</h1>
	<div class="grid grid-cols-2 gap-8">
		<div class="space-y-8">
			<FileSelect bind:file />
			<button
				on:click={processFile}
				disabled={$converter.isLoading || $converter.converter === null}
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 w-full"
			>
				{$converter.isLoading ? 'Loading file...' : 'Convert'}
			</button>
		</div>

		<div class="w-full basis-2/4">
			<ColumnsForm />
		</div>
	</div>
</section>
