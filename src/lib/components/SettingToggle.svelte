<script>
	import { Tabs } from 'bits-ui';

	let { label, activeTab, disabled = false, value = $bindable("on"), onToggle = () => {}, options = ["on", "off"] } = $props();


</script>

<div class="">
    <!-- {#if label}
        <Label
            for="toggle-{label.toLowerCase().replace(/\s+/g, '-')}"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

        >{label}</Label>
    {/if} -->
	<Tabs.Root {disabled} onValueChange={onToggle} bind:value class="w-full">
		<Tabs.List
			class="flex w-full rounded-md bg-gray-200 dark:bg-gray-900 {disabled ? 'opacity-50 cursor-not-allowed' : ''} p-1.5 text-sm leading-[0.01em] font-semibold space-x-1"
		>

        {#each options as option}
            <Tabs.Trigger value={option}
                class="h-8 w-full rounded-md capitalize bg-transparent data-[state=active]:shadow-md/10 dark:data-[state=active]:shadow-md/20 py-2 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white data-[state=active]:bg-slate-100 data-[state=active]:text-black text-gray-400"
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
