<template>
    <div class="p-4">
        <ul class="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box shadow-md p-2 gap-1 lg:gap-2">
            <!-- Menu Proses -->

            <li>
                <router-link :to="{ name: 'admin-sekolah-submenu-ujiankhusus-v4', params: { sekolah_id, kelas_id } }"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base-content hover:bg-primary hover:text-primary-content transition-all duration-200 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V9z"
                            clip-rule="evenodd" />
                    </svg>
                    Proses Ujian IQ
                </router-link>
            </li>

            <!-- Menu Export -->
            <li>
                <router-link
                    :to="{ name: 'admin-sekolah-submenu-ujiankhusus-v4-export', params: { sekolah_id, kelas_id } }"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base-content hover:bg-primary hover:text-primary-content transition-all duration-200 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v9a1 1 0 11-2 0V4a1 1 0 011-1z"
                            clip-rule="evenodd" />
                    </svg>
                    Export
                </router-link>
            </li>

            <!-- Menu Import -->
            <li>
                <router-link
                    :to="{ name: 'admin-sekolah-submenu-ujiankhusus-v4-restore', params: { sekolah_id, kelas_id } }"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base-content hover:bg-primary hover:text-primary-content transition-all duration-200 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                    Restore
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'admin-sekolah-submenu-8km', params: { sekolah_id, kelas_id } }"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base-content hover:bg-primary hover:text-primary-content transition-all duration-200 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                    </svg>

                    Data Ujian IQ IST / 8KM (CETAK)
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
// Jika kamu pakai Vue 3 Composition API (script setup)
defineProps({
    sekolah_id: {
        type: [String, Number],
        required: true
    },
    kelas_id: {
        type: [String, Number],
        required: true
    }
});
</script>

<style scoped>
/* Optional: Tambahkan sedikit animasi hover */
.menu li a {
    position: relative;
}

.menu li a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: currentColor;
    transition: width 0.3s ease, left 0.3s ease;
}

.menu li a:hover::after {
    width: 80%;
    left: 10%;
}
</style>