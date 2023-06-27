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
	<Select options={[...templateTypes]} bind:value={templateName} title="Nama template" />

	<input
		type="file"
		name="excel"
		accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		bind:files
		bind:this={inputRef}
	/>
	<button on:click={processFile} disabled={loading} class="submit-button">Convert</button>
	{#if loading}
		<h1>Loading....</h1>
	{/if}
</section>

<style>
	.main {
		display: flex;
		flex-direction: column;
	}
	.submit-button {
		width: 70px;
	}
</style>
