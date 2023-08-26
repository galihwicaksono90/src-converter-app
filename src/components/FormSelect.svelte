<script lang="ts">
	import { converter } from '$stores/converterStore';
	import Select from '$components/Select.svelte';
	import { form } from '$stores/formStore';

	export let value: string | undefined;
	export let label: string;
	export let name: string;
	export let required: boolean = false;

	$: options = ($converter.converter?.getHeaders($converter.startRow) ?? []).filter(
		(x) => !Object.values($form).includes(x) || x == value
	);
</script>

<div class="flex flex-col">
	<Select {label} {options} bind:value disabled={!$converter.converter} {name} {required} />
</div>
