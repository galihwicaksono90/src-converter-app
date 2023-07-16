<script lang="ts">
	export let options: string[] = [];
	export let value: string | undefined;
	export let label: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let name: string;
</script>

<label class="text-sm font-medium text-gray-900 dark:text-white break-keep" for={name}>
	{label}:
	<select
		bind:value
		{name}
		class="mb-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		{disabled}
		{required}
	>
		<!-- <option value={undefined} /> -->
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</label>
