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
        field: "progres",
        type: "String",
    },
    {
        label: "progres",
        field: "progres_angka",
        type: "String",
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

const doCopyClipboard = (item) => {
    navigator.clipboard.writeText(item);
    Toast.babeng("Info", `${item} berhasil disalin`);
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
        let dataFormSend = {
            tgl_ujian: adminPagesStore.get_ujianstudi_pengaturan.tgl_ujian,
        }
        try {
            isLoading.value = true;
            const response = await Api.post(`ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${id}/generate/${adminPagesStore.get_ujianstudi_pengaturan.paketsoal_id}`, dataFormSend);
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
            const response = await Api.delete(`ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${id}/delete/${proses_id}`);
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
            tgl_ujian: adminPagesStore.get_ujianstudi_pengaturan.tgl_ujian,
        }
        try {
            isLoading.value = true;
            const response = await Api.post(`ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/generate/${adminPagesStore.get_ujianstudi_pengaturan.paketsoal_id}`, dataFormSend);
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
            const response = await Api.delete(`ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/delete`);
            Toast.babeng("Berhasil", 'Data berhasil di hapus!');
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
                <div class="w-64">
                    <div class="flex justify-center">
                        <v-select class=" px-0 w-full mx-auto md:mx-0" :options="pilihPaket" v-model="inputCariPaket"
                            v-bind:class="{ disabled: false }"></v-select>

                    </div>
                </div>
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
                <button class="btn btn-sm btn-error p-2" @click="doDeleteProsesSiswaPerkelas()">
                    Delete Per Kelas
                </button>
                <button class="btn btn-sm btn-info p-2" @click="doGenerateSiswaPerkelas()">
                    Generate UJIANSTUDI Per Kelas
                </button>
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
                                            <!-- <router-link :to="{
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            name: 'admin-ujianstudi-paketsoal-tambah',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <button class="btn btn-sm btn-primary tooltip" data-tip="Tambah">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                TAMBAH
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </router-link> -->
                                        </div>
                                    </template>
                                    <template #table-row="props">
                                        <span v-if="props.column.field == 'actions'">
                                            <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                                <button class="btn btn-sm btn-warning tooltip"
                                                    data-tip="Generate UJIANSTUDI" @click="doGenerateSiswa(props.row.id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                                    </svg>
                                                </button>

                                                <button class="btn btn-sm btn-primary tooltip" data-tip="Generate Hasil"
                                                    @click="doGenerateSiswaHasil(props.row.id)"
                                                    v-if="props.row.paketsoal_nama">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                                    </svg>

                                                </button>
                                                <RouterLink
                                                    :to="{ name: 'admin-sekolah-submenu-ujianstudi-persiswa', params: { sekolah_id, kelas_id, siswa_id: props.row.id } }">
                                                    <button class="btn btn-sm btn-primary tooltip" data-tip="Detail">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg></button>
                                                </RouterLink>
                                                <button class="btn btn-sm btn-error tooltip" data-tip="Delete Ujianstudi"
                                                    @click="doDeleteProsesSiswa(props.row.id, props.row.proses_id)"
                                                    v-if="props.row.paketsoal_nama">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </span>


                                        <span v-else-if="props.column.field == 'progres'">
                                            {{ props.row.progres?.status }}
                                        </span>
                                        <span v-else-if="props.column.field == 'progres_angka'">
                                            {{ props.row.progres?.selesai }}/{{
                                                props.row.progres?.total }}
                                        </span>
                                        <span v-else-if="props.column.field == 'username'">
                                            <div class="flex justify-center gap-2">
                                                <div class="text-center">{{ props.row.username }}</div>
                                                <span v-if="props.row.username" @click="doCopyClipboard(props.row.username)"
                                                    class="hover:text-primary cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </span>
                                        <span v-else-if="props.column.field == 'passworddefault'">
                                            <div class="flex justify-center gap-2">
                                                <div class="text-center">{{ props.row.passworddefault }}</div>
                                                <span v-if="props.row.passworddefault"
                                                    @click="doCopyClipboard(props.row.passworddefault)"
                                                    class="hover:text-primary cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </span>
                                        <span v-else-if="props.column.field == 'tgl_ujian'">
                                            <div class="flex justify-center gap-2" v-if="props.row.tgl_ujian">
                                                {{ moment(props.row.tgl_ujian).format("DD MMMM YYYY H:m:ss") }}
                                            </div>
                                            <div v-else>-</div>
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
