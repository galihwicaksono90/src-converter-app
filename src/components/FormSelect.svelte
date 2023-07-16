<script lang="ts">
	import { converter } from '$stores/converterStore';
	import Select from '$components/Select.svelte';

	export let value: string;
	export let label: string;
	export let name: string;
	export let required: boolean = false;
</script>

<div class="flex flex-col">
	<Select
		{label}
		bind:value
		options={$converter.converter?.getHeaders($converter.startRow) ?? []}
		disabled={!$converter.converter}
		{name}
		{required}
	/>
</div>
