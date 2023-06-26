<script lang="ts">
	import type { templateTypes } from '$utils/dict';

	export let options: (typeof templateTypes)[number][] = [];
	export let value: (typeof templateTypes)[number] | undefined;
	export let title: string = '';
</script>

<label
	>{title}:
	<select bind:value name="templateType">
		<!-- <option value={undefined} /> -->
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select></label
>

<style>
	select {
		width: 300px;
		margin-bottom: 2rem;
	}
</style>
