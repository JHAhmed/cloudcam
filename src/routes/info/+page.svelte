<script>
    import Icon from "@iconify/svelte";
</script>

<div class="container mx-auto px-4 py-8 text-white">

    <!-- Header -->
    <div class="flex flex-col mb-6 md:mb-12 items-start justify-start font-light">
        <h1 class="text-3xl md:text-4xl font-normal text-left">Install CloudCam</h1>
        <p class="mt-2 text-lg text-gray-300 text-left">Get a native app experience on any device.</p>
    </div>

    <!-- What is a PWA Section -->
    <div class="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 class="text-2xl font-normal mb-3">What is a Progressive Web App (PWA)?</h2>
        <p class="text-gray-300 leading-relaxed">
            A PWA is a modern web application that can be "installed" on your device directly from the browser. It gives you an app-like experience with features like offline access and a home screen icon, without needing an app store. It’s fast, lightweight, and always up-to-date.
        </p>
    </div>

    <!-- Installation Instructions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">



        <!-- Card 2: Android (Chrome) -->
        <div class="bg-slate-800 rounded-xl p-6 flex flex-col">
            <div class="flex items-center mb-4">
                <Icon icon="mdi:android" class="text-3xl text-green-400 mr-4" />
                <h3 class="text-xl font-semibold">Android</h3>
            </div>
            <p class="text-gray-400 mb-4 flex-grow">Using Chrome or a supported browser.</p>
            <ol class="list-decimal list-inside space-y-3 text-gray-300">
                <li>
                    Tap the three-dot menu 
                    <Icon icon="mdi:dots-vertical" class="inline" /> in the top-right corner.
                </li>
                <li>
                    Scroll down and tap <span class="font-semibold text-green-300">"Add to home screen"</span>.
                </li>
                <li>Follow the on-screen instructions to add it to your home screen.</li>
            </ol>
        </div>

        <!-- Card 3: iOS/iPadOS (Safari) -->
        <div class="bg-slate-800 rounded-xl p-6 flex flex-col">
            <div class="flex items-center mb-4">
                <Icon icon="mdi:apple" class="text-3xl text-gray-200 mr-4" />
                <h3 class="text-xl font-semibold">iOS & iPadOS</h3>
            </div>
            <p class="text-gray-400 mb-4 flex-grow">Using the Safari browser.</p>
            <ol class="list-decimal list-inside space-y-3 text-gray-300">
                <li>
                    Tap the <span class="font-semibold text-gray-100">"Share"</span> button 
                    <Icon icon="mdi:share-variant" class="inline" /> in the browser toolbar.
                </li>
                <li>Scroll down in the share sheet.</li>
                <li>
                    Tap on <span class="font-semibold text-gray-100">"Add to Home Screen"</span>.
                </li>
                <li>Confirm the name and tap "Add".</li>
            </ol>
        </div>

        <!-- Card 1: Desktop (Chrome, Edge) -->
        <div class="bg-slate-800 rounded-xl p-6 flex flex-col">
            <div class="flex items-center mb-4">
                <Icon icon="mdi:monitor" class="text-3xl text-sky-400 mr-4" />
                <h3 class="text-xl font-semibold">Desktop</h3>
            </div>
            <p class="text-gray-400 mb-4 flex-grow">For Chrome, Edge, and other Chromium browsers.</p>
            <ol class="list-decimal list-inside space-y-3 text-gray-300">
                <li>
                    Look for the <span class="font-semibold text-sky-400">Install icon</span> 
                    <Icon icon="mdi:download-circle" class="inline" /> in the address bar.
                </li>
                <li>
                    If you don't see it, click the three-dot menu 
                    <Icon icon="mdi:dots-vertical" class="inline" />.
                </li>
                <li>
                    Select <span class="font-semibold text-sky-400">"Install CloudCam"</span>.
                </li>
                <li>Confirm the installation.</li>
            </ol>
        </div>

    </div>
</div>
