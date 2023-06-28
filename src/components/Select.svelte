<script lang="ts">
	import type { templateTypes } from '$utils/dict';

	export let options: (typeof templateTypes)[number][] = [];
	export let value: (typeof templateTypes)[number] | undefined;
	export let title: string = '';
</script>

<label class="text-sm font-medium text-gray-900 dark:text-white break-keep" for="templateType">
	{title}:
	<select
		bind:value
		name="templateType"
		class="mb-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
	>
		<!-- <option value={undefined} /> -->
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</label>
