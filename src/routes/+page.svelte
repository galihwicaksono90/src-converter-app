<script lang="ts">
	import { onMount } from 'svelte';
	import Select from '$components/Select.svelte';
	import { templateTypes } from '$utils/dict';
	import type { TemplateTypes } from '$utils/dict';
	import { Converter } from '$utils/converter.js';
	import type { DataBank } from '$utils/converter.js';

	export let data;

	let templateName: TemplateTypes;
	let files: FileList | null = null;
	let file: File | null = null;
	let inputRef: HTMLInputElement | null = null;
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
		try {
			const converter = await Converter.build(file, templateName, databank);
			await converter.convert();
		} catch (e) {
			console.log(e);
		} finally {
			loading = false;
		}
	};

	$: if (files) {
		file = files[0];
	}
</script>

<svelte:head>
	<title>Converter</title>
	<meta name="description" content="Xlsx template converter" />
</svelte:head>

<section class="main">
	{#if loading}
		<h1>Loading....</h1>
	{/if}

	<Select options={[...templateTypes]} bind:value={templateName} title="Nama template" />

	<input
		type="file"
		name="excel"
		accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		bind:files
		bind:this={inputRef}
	/>
</section>

<button on:click={processFile}>Convert</button>

<style>
	.main {
		display: flex;
		flex-direction: column;
	}
</style>
