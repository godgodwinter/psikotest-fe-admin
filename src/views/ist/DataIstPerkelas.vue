<script setup>
import Api from "@/axios/axiosNode";
import { ref, defineAsyncComponent } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import ButtonDelete from "@/components/atoms/ButtonDel.vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "@/components/lib/Toast";
import { useAdminPagesStore } from '@/stores/admin/adminPagesStore'

import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);


const BASE_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const route = useRoute();

const BASE_URL_CETAK = import.meta.env.VITE_API_URL_CETAK
    ? import.meta.env.VITE_API_URL_CETAK
    : "http://localhost:8000/";

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

const data = ref();
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
    {
        label: "Actions",
        field: "actions",
        sortable: false,
        width: "50px",
        tdClass: "text-center",
        thClass: "text-center",
    },
    {
        label: "Nama",
        field: "nama",
        type: "String",
    },
    {
        label: "Kelas",
        field: "kelas_nama",
        type: "String",
    },
    {
        label: "Hasil",
        field: "hasil",
        type: "String",
    },
    {
        label: "Paket",
        field: "paketsoal_nama",
        type: "String",
    },
    {
        label: "Batas Tanggal Ujian",
        field: "tgl_ujian",
        type: "String",
    },
    {
        label: "Status",
        field: "status",
        type: "String",
    },
    {
        label: "progres",
        field: "progres_status",
        type: "String",
    },
    {
        label: "progres",
        field: "progres_angka",
        type: "number",
    },
    {
        label: "Username",
        field: "username",
        type: "String",
    },
    {
        label: "Password Default",
        field: "passworddefault",
        type: "String",
    },
];

const getData = async () => {
    try {
        isLoading.value = true;
        const response = await Api.get(`/ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}`);
        data.value = response.data;
        isLoading.value = false;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
getData();

const doDeleteData = async (id, index) => {
    if (confirm("Apakah anda yakin menghapus data ini?")) {
        try {
            isLoading.value = true;
            const response = await Api.delete(`ujianstudi/paketsoal/${id}`);
            if (response.status) {
                Toast.warning("Berhasil", response.message);
                // Toast.success("Info", "Data berhasil dihapus!");
            } else {
                Toast.warning("Gagal", response.message);
            }
            getData();
            return true;
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};

const doEditData = async (id, index) => {
    router.push({
        name: "admin-ujianstudi-paketsoal-edit",
        params: { paketsoal_id: id },
    });
};

// const doCopyClipboard = (item) => {
//     navigator.clipboard.writeText(item);
//     Toast.babeng("Info", `${item} berhasil disalin`);
// };

const unsecuredCopyToClipboard = (text) => { const textArea = document.createElement("textarea"); textArea.value = text; document.body.appendChild(textArea); textArea.focus(); textArea.select(); try { document.execCommand('copy') } catch (err) { console.error('Unable to copy to clipboard', err) } document.body.removeChild(textArea) };

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
*/
const doCopyClipboard = (content) => {
    // if (window.isSecureContext && navigator.clipboard) {
    //     navigator.clipboard.writeText(content);
    //     Toast.babeng("Info 2", `${content} berhasil disalin`);
    // } else {
    unsecuredCopyToClipboard(content);
    Toast.babeng("Info 2", `${content} berhasil disalin`);
    // }
};


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
        name: "admin-sekolah-submenu-ujianstudi",
        params: {
            sekolah_id: sekolah_id.value,
            kelas_id: inputCariKelas.value.id ? inputCariKelas.value.id : kelas_id.value,
        },
    });

    // fnSetToTempSekolah(id, inputCariKelas.value.id, inputCariKelas.value.label);
    // getData(inputCariKelas.value.id);
};

// !PENGATURAN
const paketTerpilih = ref({})
const dataForm = ref({
    tglBatasPengerjaan: adminPagesStore.get_ujianstudi_pengaturan.tgl_ujian
})
const pilihPaket = ref([])
// const inputCariPaket = ref()
const inputCariPaket = ref({
    id: adminPagesStore.get_ujianstudi_pengaturan.paketsoal_id,
    label: adminPagesStore.get_ujianstudi_pengaturan.paketsoal_nama,
})
const dataPaket = ref([])

const getDataPaket = async () => {
    try {
        const response = await Api.get(`ujianstudi/paketsoal`);
        // console.log(response);
        dataPaket.value = response.data;
        if (dataPaket.value.length > 0) {
            // console.log(dataKelas.value[0].id);
            dataPaket.value.forEach((item) => {
                pilihPaket.value.push({
                    label: item.nama,
                    id: item.id,
                });
            });
            // console.log(kelas_id.value);
            // getData(kelas_id.value);
        }
        return response;
    } catch (error) {
        Toast.danger("Warning", "Data Gagal dimuat");
        console.error(error);
    }
};
getDataPaket();


const doPilihPaket = () => {
    // console.log('====================================');
    // console.log(inputCariPaket.value.label, dataForm.value.tglBatasPengerjaan);
    // console.log('====================================');
    let tempDataSave = {
        paketsoal_id: inputCariPaket.value.id,
        paketsoal_nama: inputCariPaket.value.label,
        tgl_ujian: moment(dataForm.value.tglBatasPengerjaan).add(0, 'days'),
    }
    adminPagesStore.set_ujianstudi_pengaturan(tempDataSave)
}



const doGenerateSiswa = async (id, index) => {
    if (confirm("Apakah anda yakin generate data ini?")) {
        // console.log('====================================');
        // console.log(moment(adminPagesStore.get_ujianstudi_pengaturan.tgl_ujian).format("YYYY-MM-DD HH:mm:ss"));
        // console.log('====================================');
        let dataFormSend = {
            tgl_ujian: moment(adminPagesStore.get_ujianstudi_pengaturan.tgl_ujian).format("YYYY-MM-DD HH:mm:ss"),
        }
        try {
            isLoading.value = true;
            const response = await Api.post(`ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/generate/${adminPagesStore.get_ujianstudi_pengaturan.paketsoal_id}`, dataFormSend);
            console.log('====================================');
            console.log(response?.data);
            console.log('====================================');
            Toast.babeng("Berhasil", 'Data berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doDeleteProsesSiswa = async (id, proses_id) => {
    if (confirm("Apakah anda yakin menghapus data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await Api.delete(`ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/delete/${proses_id}`);
            Toast.babeng("Berhasil", 'Data berhasil di hapus!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};


const doGenerateSiswaPerkelas = async (id, index) => {
    if (confirm("Apakah anda yakin generate data ini?")) {
        let dataFormSend = {
            tgl_ujian: moment(adminPagesStore.get_ujianstudi_pengaturan.tgl_ujian).format("YYYY-MM-DD HH:mm:ss"),
        }
        try {
            isLoading.value = true;
            const response = await Api.post(`ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/generate/${adminPagesStore.get_ujianstudi_pengaturan.paketsoal_id}`, dataFormSend);
            Toast.babeng("Berhasil", 'Data berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doDeleteProsesSiswaPerkelas = async (id) => {
    if (confirm("Apakah anda yakin menghapus data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await Api.delete(`ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/delete`);
            Toast.babeng("Berhasil", 'Data berhasil di hapus!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};

// HASIL-UJIAN
const doGenerateHasilSiswa = async (id, index) => {
    if (confirm("Apakah anda yakin generate data ini?")) {
        let dataFormSend = {}
        try {
            isLoading.value = true;
            const response = await Api.post(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/generate`, dataFormSend);
            Toast.babeng("Berhasil", 'Hasil Ujian berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doDeleteHasilSiswa = async (id, proses_id) => {
    if (confirm("Apakah anda yakin menghapus data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await Api.delete(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/delete`);
            Toast.babeng("Berhasil", 'Hasil Ujian berhasil di hapus!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doGenerateHasilSiswaPerkelas = async (id) => {
    if (confirm("Apakah anda yakin generate data ini?")) {
        let dataFormSend = {}
        try {
            isLoading.value = true;
            const response = await Api.post(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/generate`, dataFormSend);
            Toast.babeng("Berhasil", 'Hasil Ujian berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doGenerateHasilSiswaPerkelasComplete = async (id) => {
    // Toast.danger("Info", "Menu belum tersedia!");
    if (confirm("Apakah anda yakin generate data yang sudah complete saja ini?")) {
        let dataFormSend = {}
        try {
            isLoading.value = true;
            const response = await Api.post(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/generate/complete`, dataFormSend);
            Toast.babeng("Berhasil", 'Hasil Ujian berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doDeleteHasilSiswaPerkelas = async (id) => {
    if (confirm("Apakah anda yakin menghapus data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await Api.delete(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/delete`);
            Toast.babeng("Berhasil", 'Hasil Ujian berhasil di hapus!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
// HASIL-UJIAN-END

const doCetak = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    //     Toast.danger("Warning", "Data tidak valid!");
    // } else {
    window.open(
        `${BASE_URL_CETAK}api/guest/ujianstudi/v2/cetak/kelas/${getSekolahAktif.value.kelas_id}`
    );
    // }
};
const doCetakLess = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    // Toast.danger("Info", "Menu belum tersedia!");
    // } else {
    window.open(
        `${BASE_URL_CETAK}api/guest/ujianstudi/v2/cetak/kelas/${getSekolahAktif.value.kelas_id}/less`
    );
    // }
};
const doExportJawabanSiswa = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    // Toast.danger("Info", "Menu belum tersedia!");
    // } else {
    window.open(
        `${BASE_URL_CETAK}api/guest/ujianstudi/v2/exportjawaban/kelas/${getSekolahAktif.value.kelas_id}`
    );
    // }
};


const doCachingRedisPerSiswa = async (id, index) => {
    if (confirm("Apakah anda yakin caching data ini?")) {
        let dataFormSend = {}
        try {
            isLoading.value = true;
            const response = await Api.get(`redis/studiv2/proses/${id}/store`, dataFormSend);
            Toast.babeng("Berhasil", 'Cacing proses Ujian berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};

const doCachingRedisPerKelas = async () => {
    if (confirm("Apakah anda yakin caching data ini?")) {
        let dataFormSend = {}
        try {
            isLoading.value = true;
            const response = await Api.get(`redis/studiv2/proses_kelas/${getSekolahAktif.value.kelas_id}/store`, dataFormSend);
            Toast.babeng("Berhasil", 'Cacing proses Ujian berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};

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
                <h1>UJIAN STUDI KELAS {{ kelas_nama }}</h1>
            </article>

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
            <div class="flex justify-start w-full space-x-2 content-center py-2">
                <!-- <div class="w-64">
                    <div class="flex justify-center">
                        <v-select class=" px-0 w-full mx-auto md:mx-0" :options="pilihPaket" v-model="inputCariPaket"
                            v-bind:class="{ disabled: false }"></v-select>

                    </div>
                </div> -->
                <div class="w-64 flex flex-col">
                    <div>
                        <VueDatePicker v-model="dataForm.tglBatasPengerjaan"></VueDatePicker>
                    </div>
                </div>
                <div>
                    <div class="py-0">
                        <button class="btn btn-sm btn-info p-2" @click="doPilihPaket()">
                            Apply</button>
                    </div>
                </div>
            </div>
            <div class="space-x-2 shadow-sm">
                <router-link :to="{ name: 'admin-sekolah-submenu-ist-import', params: { sekolah_id, kelas_id } }"><button
                        class="btn btn-sm btn-info p-2">
                        Import Data from excel
                    </button></router-link>
            </div>
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
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                    fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </template>
                                    <template #table-row="props">
                                        <span v-if="props.column.field == 'actions'">
                                            <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                                <button class="btn btn-sm btn-danger tooltip" data-tip="Caching UJIANSTUDI"
                                                    @click="doCachingRedisPerSiswa(props.row.id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                                                    </svg>

                                                </button>
                                            </div>
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
