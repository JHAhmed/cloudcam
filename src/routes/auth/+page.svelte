<script>
	import { supabase } from '$lib/supabaseClient';
	import { env } from '$env/dynamic/public';

    import Icon from '@iconify/svelte';
    import Input from '$components/Input.svelte';
    import SettingToggle from '$components/SettingToggle.svelte';

	let username = $state('');
	let email = $state('');
	let password = $state('');

	async function signUp() {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					username: username
				},

				emailRedirectTo: env.PUBLIC_URL
			}
		});
	}
</script>

<form
    class="my-8 p-4"
	onsubmit={(e) => {
		e.preventDefault();
		signUp();
	}}
>
    <div class="bg-gradient-to-br from-slate-900 to-gray-900 shadow-lg border border-gray-600 rounded-2xl p-4 space-y-2 ">

        <Icon icon="heroicons:arrow-right-end-on-rectangle-solid" class="h-12 w-12 p-2 my-6 text-gray-200 mx-auto bg-gray-600 rounded-xl shadow-md/10" />

        <h2 class="text-2xl font-medium tracking-tight text-center text-gray-200">Sign Up With Email</h2>
        <p class="text-center text-gray-400 w-2/3 mx-auto">Please enter your email address and password to create an account.</p>

        <div class="flex flex-col px-4 md:px-8 items-center justify-center space-y-4 mt-8">
            <Input width="w-full md:w-2/3" type="text" bind:value={username} icon="heroicons:user-circle" placeholder="Username" required />
            <Input width="w-full md:w-2/3" type="email" bind:value={email} icon="heroicons:envelope" placeholder="Email" required />
            <Input width="w-full md:w-2/3" type="password" bind:value={password} icon="heroicons:lock-closed" placeholder="Password" required />
        </div>
        <button class="w-1/2 py-3 mt-6 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500" type="submit">Sign Up</button>
    </div>


</form>
