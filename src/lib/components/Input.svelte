<script>
	import Icon from '@iconify/svelte';

	let {
		label,
        name = "Username",
		showLabel = true,
		maxlength = 10,
        type = "text",
		placeholder = 'John Doe',
		required = true,
		icon = 'heroicons:user-circle',
		value = $bindable()
	} = $props();
</script>

<div class="w-full ">
	{#if label}
		<label for={name.toLowerCase().replace(/\s+/g, '-')} class="mb-1 block text-sm text-left font-medium text-gray-300">{label}</label>
	{/if}
	<div class="relative rounded-md">
		<input
            name={name.toLowerCase().replace(/\s+/g, '-')}
			type={type}
            maxlength={maxlength}
			bind:value
			{placeholder}
			class="block w-full rounded-lg border-gray-500 bg-gray-900 focus:bg-gray-800 px-4 py-3 pr-10 text-gray-100 placeholder-gray-600 sm:text-sm focus:border-gray-300 focus:outline-none focus:ring-0"
		/>
		{#if icon}
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
				<Icon icon={icon} class="h-6 w-fit text-gray-400" />
			</div>
		{/if}
	</div>
</div>