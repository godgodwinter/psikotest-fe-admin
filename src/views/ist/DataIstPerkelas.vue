<script setup>
import Api from "@/axios/axiosNode";
import { ref, defineAsyncComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "@/components/lib/Toast";
import { useAdminPagesStore } from '@/stores/admin/adminPagesStore'
import ApiIst from "@/axios/axiosIst";

import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import { useSuperadminStore } from '@/stores/admin/superadminPagesStore';
const superadminStore = useSuperadminStore();
const isSuperadminActive = ref(superadminStore.isSuperadminActive)

moment.updateLocale("id", localization);


const BASE_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const route = useRoute();

const BASE_URL_CETAK = import.meta.env.VITE_API_URL_CETAK
    ? import.meta.env.VITE_API_URL_CETAK
    : "http://localhost:8000/";
const VITE_API_FE_REACT = import.meta.env.VITE_API_FE_REACT
    ? import.meta.env.VITE_API_FE_REACT
    : "http://localhost:3500/";

const sekolah_id = ref(route.params.sekolah_id)
const kelas_id = ref(route.params.kelas_id)
const adminPagesStore = useAdminPagesStore();
const getSekolahAktif = ref({
    sekolah_id: sekolah_id.value,
    kelas_id: kelas_id.value,
})
const kelas_nama = ref(adminPagesStore.getpages_sekolah_aktif ? adminPagesStore.getpages_sekolah_aktif.kelas_nama : "-")
adminPagesStore.$subscribe((mutation, state) => {
    getSekolahAktif.value = adminPagesStore.getpages_sekolah_aktif;
    // console.log(getSekolahAktif.value);
    kelas_nama.value = getSekolahAktif.value.kelas_nama;
    // inputCariKelas.value = getSekolahAktif.value.kelas_id;
});

const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)

const data = ref([]);
const isLoading = ref(true);
const isError = ref(false);

const dataKelas = ref([]);
const pilihKelas = ref([]);
const inputCariKelas = ref({ id: kelas_id.value, label: kelas_nama.value })

const getDataKelas = async () => {
    try {
        isLoading.value = true;
        const response = await Api.get(`master/sekolah/${sekolah_id.value}/kelas`);
        // console.log(response);
        dataKelas.value = response.data;
        if (dataKelas.value.length > 0) {
            // console.log(dataKelas.value[0].id);
            if (kelas_id.value == 0) {
                kelas_id.value = dataKelas.value[0].id;
            }
            dataKelas.value.forEach((item) => {
                pilihKelas.value.push({
                    label: item.nama,
                    id: item.id,
                });
            });
        }
        isLoading.value = false;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        Toast.danger("Warning", "Data Gagal dimuat");
        console.error(error);
    }
};
getDataKelas();


const columns = [
    // {
    //     label: "Actions",
    //     field: "actions",
    //     sortable: false,
    //     width: "50px",
    //     tdClass: "text-center",
    //     thClass: "text-center",
    // },
    {
        label: "Nama",
        field: "nama",
        type: "String",
    },
    {
        label: "tambahan",
        field: "tambahan",
        type: "String",
    },
    {
        label: "Umur",
        field: "umur",
        type: "Number",
    },
    {
        label: "IQ",
        field: "iq",
        type: "Number",
    },
    {
        label: "Ist",
        field: "ist",
        type: "Number",
    },
    {
        label: "wa",
        field: "wa",
        type: "Number",
    },
    {
        label: "an",
        field: "an",
        type: "Number",
    },
    {
        label: "ra",
        field: "ra",
        type: "Number",
    },
    {
        label: "zr",
        field: "zr",
        type: "Number",
    },
    {
        label: "fa",
        field: "fa",
        type: "Number",
    },
    {
        label: "wu",
        field: "wu",
        type: "Number",
    },
    {
        label: "se",
        field: "se",
        type: "Number",
    },
    {
        label: "me",
        field: "me",
        type: "Number",
    },
    {
        label: "ge",
        field: "ge",
        type: "Number",
    },
];

const doPilihKelas = async () => {
    let newDataSekolahAktif = {
        sekolah_id: sekolah_id.value,
        kelas_id: inputCariKelas.value.id ? inputCariKelas.value.id : kelas_id.value,
        kelas_nama: inputCariKelas.value.label ? inputCariKelas.value.label : kelas_nama.value,
    }
    await adminPagesStore.setpages_sekolah_aktif(newDataSekolahAktif)
    // console.log('====================================');
    // console.log(getSekolahAktif.value, inputCariKelas.value.id);
    // console.log('====================================');
    await getData()
    // console.log(inputCariKelas.value.id);
    await router.push({
        name: "admin-sekolah-submenu-ist",
        params: {
            sekolah_id: sekolah_id.value,
            kelas_id: inputCariKelas.value.id ? inputCariKelas.value.id : kelas_id.value,
        },
    });

    // fnSetToTempSekolah(id, inputCariKelas.value.id, inputCariKelas.value.label);
    // getData(inputCariKelas.value.id);
};


const getData = async () => {
    try {
        data.value = []
        isLoading.value = true;
        const response = await ApiIst.get(`/ist/kelas/${getSekolahAktif.value.kelas_id}`);
        // data.value = response.data;
        const res = [];
        for (const item of response.data) {
            if (item) {
                data.value.push(item);
            }
        }
        // console.log(data.value);
        isLoading.value = false;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
getData();

const doCetakIst = () => {
    window.open(
        `${VITE_API_FE_REACT}ist/data/cetak/${getSekolahAktif.value.kelas_id}`
    );
}
const doCetakIstJurusan = (ttd) => {
    window.open(
        `${VITE_API_FE_REACT}ist/jurusan/v3/cetak/${getSekolahAktif.value.kelas_id}/${ttd}`
    );
}

const doCetak_ist_8km_gabungan = () => {
    window.open(
        `${VITE_API_FE_REACT}ist_8km/v_ist8km_gabungan/cetak/${getSekolahAktif.value.kelas_id}/true`
    );
}
const doCetakIstLengkap_v4 = () => {
    window.open(
        `${VITE_API_FE_REACT}ist_8km/v_ist_lengkap_v4/cetak/${getSekolahAktif.value.kelas_id}/true`
    );
}
const doCetakIstLengkap_v4_tanpa_aspek = () => {
    window.open(
        `${VITE_API_FE_REACT}ist_8km/v_ist_lengkap_v4/cetak/${getSekolahAktif.value.kelas_id}/true/tanpa_aspek`
    );
}
</script>
<template>
    <span v-if="isLoading">
        <LoadingNavbar />
    </span>
    <span v-else-if="isError">
        <AlertFailed :message="'Gagal mendapatkan response dari server'" />
    </span>
    <span v-else>
        <div>
            <article class="prose lg:prose-sm">
                <h1>DATA IST KELAS {{ kelas_nama }}</h1>
            </article>
            <!-- !hidden superadmin -->
            <div class="space-x-2 space-y-2" v-if="isSuperadminActive">
                <RouterLink
                    :to="{ name: 'admin-sekolah-submenu-ist-import-migration', params: { sekolah_id: 0, kelas_id: 0 } }">
                    <button class="btn btn-sm ">
                        IMPORT DATA IST</button>
                </RouterLink>
                <button class="btn btn-sm btn-success" @click="doCetakIst()">
                    Cetak</button>
                <button class="btn btn-sm btn-secondary" @click="doCetakIstJurusan('true')">
                    Cetak FAKULTAS v3</button>
                <!-- <button class="btn btn-sm btn-secondary" @click="doCetakIstJurusan('false')">
                    Cetak FAKULTAS tanpa TTD</button> -->
                <button class="btn btn-sm btn-success" @click="doCetak_ist_8km_gabungan()">
                    Cetak 8KM+IST Gabungan</button>

            </div>
            <div class="space-x-2 space-y-2">

                <button class="btn btn-sm btn-secondary" @click="doCetakIstLengkap_v4()">
                    Cetak V4 Ist+8KM Lengkap Versi Lama Lengkap (ASPEK)</button>

                <button class="btn btn-sm btn-secondary" @click="doCetakIstLengkap_v4_tanpa_aspek()">
                    Cetak V4 Ist Lengkap Versi Lama ( Tanpa Aspek )</button>
            </div>

            <div class="w-full bg-base-100 shadow-sm rounded-lg py-4 px-4">
                <div class="flex justify-center">
                    <v-select class="py-2 px-3 w-72 mx-auto md:mx-0" :options="pilihKelas" v-model="inputCariKelas"
                        v-bind:class="{ disabled: false }"></v-select>
                    <div class="py-2">
                        <button class="btn btn-sm btn-info p-2" @click="doPilihKelas()">
                            Cari
                        </button>
                    </div>
                </div>
            </div>
            <!-- !PENGATURAN -->

            <!-- !PENGATURAN-END -->
            <span v-if="isLoading">
                <LoadingNavbar />
            </span>
            <span v-else-if="isError">
                <AlertFailed :message="'Gagal mendapatkan response dari server'" />
            </span>
            <span v-else>
                <div class="md:py-2 px-4 lg:flex flex-wrap gap-4" v-if="data">
                    <div class="w-full lg:w-full">
                        <div class="bg-white shadow rounded-lg px-4 py-4">
                            <div v-if="data">
                                <vue-good-table :line-numbers="true" :columns="columns" :rows="data" :search-options="{
        enabled: true,
    }" :pagination-options="{
        enabled: true,
        perPageDropdown: [50, 100, 150, 200],
    }" styleClass="vgt-table striped bordered condensed" class="py-0">
                                    <template #table-actions>
                                        <div class="space-x-1 space-y-1 gap-1">
                                            <button class="btn btn-sm btn-secondary tooltip" data-tip="Refresh Data"
                                                @click="getData()">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </template>
                                    <template #table-row="props">
                                        <span v-if="props.column.field == 'actions'">
                                            <!-- <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                                <button class="btn btn-sm btn-danger tooltip" data-tip="Caching UJIANSTUDI"
                                                    @click="doCachingRedisPerSiswa(props.row.id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                                                    </svg>

                                                </button>
                                            </div> -->
                                        </span>
                                        <span v-else-if="props.column.field == 'tambahan'">

                                            <RouterLink
                                                :to="{ name: 'admin-sekolah-submenu-ujiankhusus-persiswa-tambahan', params: { sekolah_id, kelas_id, siswa_id: props.row.id } }">
                                                <button class="btn btn-sm btn-warning tooltip" data-tip="MENU TAMBAHAN">
                                                    <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="m9 9 6-6m0 0 6 6m-6-6v12a6 6 0 0 1-12 0v-3" />
                                                    </svg> -->

                                                    <v-icon name="io-apps" />

                                                </button>
                                            </RouterLink>
                                        </span>
                                        <span v-else-if="props.column.field == 'ist'">
                                            {{ props.row.ist ? "Ada" : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'umur'">
                                            {{ props.row.ist ? props.row.ist.umur : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'iq'">
                                            {{ props.row.ist ? props.row.ist.iq_val : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'wa'">
                                            {{ props.row.ist ? props.row.ist.wa_val : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'an'">
                                            {{ props.row.ist ? props.row.ist.an_val : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'ra'">
                                            {{ props.row.ist ? props.row.ist.ra_val : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'zr'">
                                            {{ props.row.ist ? props.row.ist.zr_val : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'fa'">
                                            {{ props.row.ist ? props.row.ist.fa_val : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'wu'">
                                            {{ props.row.ist ? props.row.ist.wu_val : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'se'">
                                            {{ props.row.ist ? props.row.ist.se_val : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'me'">
                                            {{ props.row.ist ? props.row.ist.me_val : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'ge'">
                                            {{ props.row.ist ? props.row.ist.ge_val : "-" }}
                                        </span>

                                        <span v-else>
                                            {{ props.formattedRow[props.column.field] }}
                                        </span>
                                    </template>
                                </vue-good-table>
                            </div>
                        </div>
                    </div>
                </div>

            </span>
        </div>
    </span>
</template>
