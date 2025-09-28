<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router";
import { useAdminPagesStore } from '@/stores/admin/adminPagesStore'
import { useSuperadminStore } from '@/stores/admin/superadminPagesStore';
const superadminStore = useSuperadminStore();
const isSuperadminActive = ref(superadminStore.isSuperadminActive)
const adminPagesStore = useAdminPagesStore();
const route = useRoute();
const sekolah_id = ref(route.params.sekolah_id)
const kelas_id = ref(0)
const getSekolahAktif_temp = adminPagesStore.getpages_sekolah_aktif;
const getSekolahAktif = ref({
    sekolah_id: sekolah_id.value,
    kelas_id: getSekolahAktif_temp?.kelas_id
})

if (!getSekolahAktif) {
    adminPagesStore.setpages_sekolah_aktif(sekolahDefault)
}
// console.log(getSekolahAktif.value);
if (getSekolahAktif.value.kelas_id) {
    kelas_id.value = getSekolahAktif.value.kelas_id;
}
adminPagesStore.$subscribe((mutation, state) => {
    getSekolahAktif.value = adminPagesStore.getpages_sekolah_aktif;
    // console.log(getSekolahAktif.value);
    kelas_id.value = getSekolahAktif.value.kelas_id;
});
</script>
<template>
    <div>
        <div class="bg-white p-3 hover:shadow shadow-sm">
            <div class="flex items-center space-x-3 font-semibold text-base-content text-xl leading-8">
                <span class="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </span>
                <span>Mastering</span>
            </div>
            <div class="px-2">
                <ul class="space-y-0 pb-2 lg:flex flex-wrap px-0 gap-0 justify-between">
                    <li class="bg-white lg:w-full py-0 pt-2">
                        <router-link :to="{ name: 'admin-sekolah-submenu-dashboard', params: { sekolah_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Dashboard</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link :to="{ name: 'admin-sekolah-submenu-kelas', params: { sekolah_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Kelas</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link :to="{ name: 'admin-sekolah-submenu-siswa', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1"> Siswa</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bg-white px-2 hover:shadow shadow-sm">
            <!-- <div class="flex items-center space-x-3 font-semibold text-base-content text-xl leading-8">
                <span class="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </span>
                <span>MENU UJIAN</span>
            </div> -->
            <div class="">

                <div class="flex items-center space-x-3 font-semibold text-base-content text-xl leading-8">
                    <span class="text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </span>
                    <span>MENU UJIAN</span>
                </div>
                <ul class="space-y-0 pb-2 lg:flex flex-wrap px-0 gap-0 justify-between">
                    <li class="bg-white lg:w-full py-0 pt-2 ">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujianstudi', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1 capitalize">Ujian Lintas Studi</span>
                        </router-link>
                    </li>


                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujiankhusus-v4', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian IQ V4 / Khusus </span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujianmmpi2-v4', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">UJIAN MMPI 2 </span>
                        </router-link>
                    </li>
                    <!-- <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujianmmpi2-v4-export', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">UJIAN MMPI 2 (PROSES) EXPORT</span>
                        </router-link>
                    </li>

                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujianmmpi2-v4-import', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">UJIAN MMPI 2 (PROSES) - IMPORT</span>
                        </router-link>
                    </li> -->

                    <!-- <li class="bg-white lg:w-full py-0">
                        <router-link :to="{ name: 'admin-sekolah-submenu-dashboard', params: { sekolah_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian Skolastik </span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link :to="{ name: 'admin-sekolah-submenu-dashboard', params: { sekolah_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian KFace</span>
                        </router-link>
                    </li> -->

                    <div class="flex items-center space-x-3 font-semibold text-base-content text-xl leading-8">
                        <span class="text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </span>
                        <span>DATA UJIAN</span>
                    </div>
                    <li class="bg-white lg:w-full py-0">
                        <router-link :to="{ name: 'admin-sekolah-submenu-ist', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Data IST</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-minatbakat', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Data Minat & Bakat</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link :to="{ name: 'admin-sekolah-submenu-hspq', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Data HSPQ Deteksi</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link :to="{ name: 'admin-sekolah-submenu-8km', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Data 8KM</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link :to="{ name: 'admin-sekolah-submenu-cfit', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Data CFIT</span>
                        </router-link>
                    </li>


                    <li class="bg-white lg:w-full py-0">
                        <router-link :to="{ name: 'admin-sekolah-submenu-mmpi', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Data MMPI</span>
                        </router-link>
                    </li>


                    <div class="flex items-center space-x-3 font-semibold text-base-content text-xl leading-8">
                        <span class="text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </span>
                        <span>MENU DEV</span>
                    </div>
                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujiancfit-v4', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian CFIT (PROSES) </span>
                        </router-link>
                    </li>

                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujian-mmpi-v1', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">UJIAN MMPI 1 / A (PROSES)</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujiankhusus-v3', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian Khusus V3 (Versi Sebelumnya)</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujiankhusus-v2', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian Khusus V2 (Cadangan) </span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujiankhusus', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
                            v-if="isSuperadminActive">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian Khusus V1 (Paling Berat / Jangan digunakan ketika ujian
                                berlangsung) </span>
                        </router-link>
                    </li>

                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujiankhusus-v4-progressive', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian IQ V4 Progressive / Basic SSE</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujiankhusus-v4-progressive-v2', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian IQ V4 Progressive v2</span>
                        </router-link>
                    </li>
                    <li class="bg-white lg:w-full py-0">
                        <router-link
                            :to="{ name: 'admin-sekolah-submenu-ujiankhusus-v4b', params: { sekolah_id, kelas_id } }"
                            class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span class="ml-1">Ujian IQ V4B / Khusus (TESTING)</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>