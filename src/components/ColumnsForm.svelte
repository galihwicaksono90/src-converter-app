<script lang="ts">
	import FormSelect from '$components/FormSelect.svelte';
	import { converter } from '$stores/converterStore';
	import { form } from '$stores/formStore';

	const onChange = () => {
		form.resetForm();
	};
</script>

<div class="flex flex-col w-full gap-4">
	<label for="startRow" class="text-sm font-medium text-gray-900 dark:text-white break-keep">
		Start Row
		<input
			type="number"
			bind:value={$converter.startRow}
			on:input={onChange}
			min={1}
			class="mb-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			name="startRow"
		/>
	</label>
	<FormSelect bind:value={$form.barcode} label="Barcode" name="barcode" required />
	<FormSelect bind:value={$form.name} label="Nama" name="name" required />
	<FormSelect bind:value={$form.packaging} label="Packaging" name="packaging" required />
	<FormSelect
		bind:value={$form.basic_harga_normal}
		label="Basic Harga Normal"
		name="basic_harga_normal"
		required
	/>
	<FormSelect bind:value={$form.packaging2} label="Packaging 2" name="packaging2" />
	<FormSelect
		bind:value={$form.basic_harga_normal2}
		label="Basic Harga Normal 2"
		name="basic_harga_normal2"
	/>
	<FormSelect bind:value={$form.packaging3} label="Packaging 3" name="packaging3" />
	<FormSelect
		bind:value={$form.basic_harga_normal3}
		label="Basic Harga Normal 3"
		name="basic_harga_normal3"
	/>
</div>
