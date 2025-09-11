<script>
	let { children, isAuthenticated } = $props();
	import Icon from '@iconify/svelte';
	
	
</script>

{#if !isAuthenticated}
	<div class="relative z-10 size-full">
		<div class="absolute top-0 left-0 z-10 flex h-3/4 w-full flex-col items-center justify-center">
			<div class="z-20 flex w-full items-center justify-center px-4 md:px-8">
				<div class="h-0.5 w-full rounded-full bg-gray-700/50 dark:bg-gray-300/50"></div>
				<Icon icon="heroicons:lock-closed" class="mx-2 size-16 text-black dark:text-white" />
				<div class="h-0.5 w-full rounded-full bg-gray-700/50 dark:bg-gray-300/50"></div>
			</div>
			<p class="text-gray-400">You must be logged in to access this page.</p>
			<p class="text-gray-400">Please log in or sign up to continue.</p>
			<a href="/api/auth/login?post_login_redirect_url=/" class="mt-4 rounded-2xl bg-white/10 px-6 py-3 text-sm font-light text-white hover:bg-white/20">Log In / Sign Up</a>
		</div>

		<!-- <div class="absolute top-0 left-0 w-full h-full z-20 my-8 rounded-2xl backdrop-blur-3xl"> -->
		<!-- </div>     -->

		<div class="z-0 blur-3xl">
			<div class="columns-2 gap-2 rounded-lg md:columns-3 md:gap-2 my-12">
				{#each Array(6) as _}
					<div class="mb-2 h-48 animate-pulse break-inside-avoid rounded-lg bg-gray-200 dark:bg-gray-700"></div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	{@render children?.()}
{/if}
