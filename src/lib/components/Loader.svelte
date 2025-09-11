<script>
    let { message = "Saving your settings..." } = $props();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
	<div
		class="mx-8 flex flex-col items-center justify-center gap-2 rounded-xl border-2 dark:border border-black dark:bg-gray-800 bg-white p-6 lg:w-1/4"
	>
		<div
			class="h-12 w-12 animate-spin rounded-full border-4 border-slate-900 dark:border-slate-300 dark:border-t-transparent border-t-transparent"
		></div>

		<p class="mt-4 text-black dark:text-white text-center text-sm font-medium md:text-base">{message}</p>

		<p class="text-center text-xs text-gray-600 dark:text-gray-400 md:text-sm">
			Please do not close or refresh the page
		</p>
	</div>
</div>