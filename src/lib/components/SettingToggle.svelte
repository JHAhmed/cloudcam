<script>
	import { Tabs } from 'bits-ui';

	let { label, activeTab, value = $bindable("on"), onToggle = () => {}, options = ["on", "off"] } = $props();


</script>

<div class="">
    <!-- {#if label}
        <Label
            for="toggle-{label.toLowerCase().replace(/\s+/g, '-')}"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

        >{label}</Label>
    {/if} -->
	<Tabs.Root bind:value class="w-full">
		<Tabs.List
			class="flex w-full rounded-md bg-gray-900 p-1.5 text-sm leading-[0.01em] font-semibold"
		>

        {#each options as option}
            <Tabs.Trigger value={option}
                class="h-8 w-full rounded-md capitalize bg-transparent data-[state=active]:shadow-md/20 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black text-white"
            >{option}</Tabs.Trigger>
        {/each}

        <!-- <Tabs.Trigger
				value="on"
				class="h-8 rounded-md bg-transparent data-[state=active]:shadow-md/20 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black text-white"
				>On</Tabs.Trigger
			>
			<Tabs.Trigger
				value="off"
				class="h-8 rounded-md bg-transparent data-[state=active]:shadow-md/20 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black text-white"
				>Off</Tabs.Trigger
			> -->
		</Tabs.List>
	</Tabs.Root>
</div>
