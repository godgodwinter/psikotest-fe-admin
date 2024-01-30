<script setup>
import Api from "@/axios/axiosIst";
import { ref, defineAsyncComponent } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import ButtonDelete from "@/components/atoms/ButtonDel.vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "@/components/lib/Toast";
import { fn_studi_ket, fn_studi_ket_singkatan } from "@/components/lib/Psikotest.js"
import { Field, Form } from "vee-validate";
import fnValidasi from "@/components/lib/babengValidasi";
import {fn_copy_id_for_mongo} from "@/lib/FungsiBasic.js"

import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

const BASE_URL_CETAK = import.meta.env.VITE_API_URL_CETAK
    ? import.meta.env.VITE_API_URL_CETAK
    : "http://localhost:8000/";


const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)


const BASE_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const route = useRoute();

const sekolah_id = ref(route.params.sekolah_id)
const kelas_id = ref(route.params.kelas_id)
const siswa_id = ref(route.params.siswa_id)
const data = ref();
const siswa = ref();
const isLoading = ref(true);
const isError = ref(false);

const getData = async () => {
    try {
        isLoading.value = true;
        const response = await Api.get(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}`);
        siswa.value = response.data;
        if(response.data.ujiankhusus){
        const tempData=response.data.ujiankhusus.aspek_detail;
        data.value = tempData.map(fn_copy_id_for_mongo);
        //  "umum"; //!umum,minat,kr
        response.data.ujiankhusus.minatList.tipe="minat"
        data.value.push(response.data.ujiankhusus.minatList)
        
        response.data.ujiankhusus.krList.tipe="kr"
        data.value.push(response.data.ujiankhusus.krList)
        }
        // data.value = response.data.ujiankhusus.aspek_detail;
        console.log(response.data.ujiankhusus.minatList,data.value);
        // console.log('====================================');
        // console.log(data.value[0]?.soal_jml);
        // console.log('====================================');
        isLoading.value = false;
        return response.data;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
getData();

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
        label: "Status",
        field: "status",
        type: "String",
    },
    {
        label: "Sisa Waktu",
        field: "waktu",
        type: "String",
    },
    {
        label: "Jumlah Soal",
        field: "soal_jml",
        type: "number",
    },
    {
        label: "Skor",
        field: "skor_jml",
        type: "number",
    },
    {
        label: "Terjawab",
        field: "soal_terjawab",
        type: "number",
    },
    {
        label: "Belum Terjawab",
        field: "soal_belum_terjawab",
        type: "number",
    },
    {
        label: "Tipe",
        field: "tipe",
        type: "string",
    },
];

const doRefreshData = () => {
    getData();
}

const doResetSalah = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {
      
        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/reset/${proses_detail_id}/salah`);
            Toast.babeng("Berhasil", 'Reset Salah berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const doResetWaktu = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {
      
        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/reset/${proses_detail_id}/waktu`);
            Toast.babeng("Berhasil", 'Reset Waktu berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const doResetAll = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {
      
        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/reset/${proses_detail_id}/semua`);
            Toast.babeng("Berhasil", 'Reset Waktu dan Semua jawaban berhasil dilakukan!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}

const minat_doResetWaktu = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {
      
        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/minat/reset/waktu`);
            Toast.babeng("Berhasil", 'Reset Waktu Minat berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}

const kr_doResetWaktu = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {
      
        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/kr/reset/waktu`);
            Toast.babeng("Berhasil", 'Reset Waktu kr berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}

const kr_doResetSalah = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {
      
        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/kr/reset/salah`);
            Toast.babeng("Berhasil", 'Reset Salah kr berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}

const kr_doResetAll = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {
      
        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/kr/reset/all`);
            Toast.babeng("Berhasil", 'Reset All kr berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
</script>

<template>
    <div>
        <div class="pt-4 px-10 md:flex justify-between">
            <div>
                <span class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm">MENU RESET UJIANKHUSUS
                </span>
            </div>
            <div class="md:py-0 py-4 space-x-2 space-y-2">

                <!-- <button class="btn btn-sm btn-warning tooltip" data-tip="CETAK Hasil v2 tanpa ttd"
                    @click="doCetakLess_tanpa_ttd()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                </button> -->
                <button class="btn hover:shadow-lg shadow text-white hover:text-gray-100 gap-2"
                    @click="router.go(-1)">Kembali</button>

            </div>
        </div>
        
        <span v-if="isLoading">
            <LoadingNavbar />
        </span>
        <span v-else-if="isError">
            <AlertFailed :message="'Gagal mendapatkan response dari server'" />
        </span>
        
        <span v-else>
          
            <div v-if="siswa">
                <div class="md:py-2 px-4 lg:flex flex-wrap gap-4">
                    <div class="w-full lg:w-full">
                        <div class="bg-white shadow rounded-lg px-4 py-4">
                            <div class="overflow-x-auto">
                                <table class="table table-compact">
                                    <tbody>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12">No Induk</td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12">
                                                {{ siswa.nomeridentitas }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Nama</td>
                                            <td>:</td>
                                            <td>{{ siswa.nama }}</td>
                                        </tr>
                                        <!-- <tr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <td>Umur</td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <td>:</td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <td>{{ siswa.umur }}</td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </tr> -->
                                        <tr>
                                            <td>Jenis Kelamin</td>
                                            <td>:</td>
                                            <td>{{ siswa.jk }}</td>
                                        </tr>
                                        <tr>
                                            <td>Sekolah</td>
                                            <td>:</td>
                                            <td>{{ siswa.sekolah_nama }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="data">
                <div class="w-full lg:w-full">
                    <div class="bg-white shadow rounded-lg px-4 py-4" >

                        <div v-if="data">
                            <vue-good-table :line-numbers="true" :columns="columns" :rows="data" :search-options="{
                                enabled: true,
                            }
                                " :pagination-options="{
        enabled: true,
        perPageDropdown: [50, 100, 150, 200],
    }
        " styleClass="vgt-table striped bordered condensed" class="py-0">
                                <template #table-actions>
                                    <div class="space-x-1 space-y-1 gap-1">
                                        <button class="btn btn-sm btn-secondary tooltip" data-tip="Refresh Data"
                                            @click="doRefreshData()">
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
                                            <div v-if="props.row.tipe=='minat'" class="text-sm font-medium text-center flex justify-center space-x-1">
                                                <button class="btn btn-sm btn-primary tooltip" data-tip="Reset Waktu"
                                                @click="minat_doResetWaktu(props.row.khusus_banksoal_aspek_detail_id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                </svg>
                                            </button>
                                            </div>
                                            <div v-else-if="props.row.tipe=='kr'" class="text-sm font-medium text-center flex justify-center space-x-1">
                                                <button class="btn btn-sm btn-primary tooltip" data-tip="Reset Waktu"
                                                @click="kr_doResetWaktu(props.row.khusus_banksoal_aspek_detail_id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                </svg>
                                            </button>
                                            <button class="btn btn-sm btn-success tooltip" data-tip="Reset Jawaban Salah"
                                                @click="kr_doResetSalah(props.row.khusus_banksoal_aspek_detail_id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                </svg>
                                            </button>
                                            <button class="btn btn-sm btn-error tooltip" data-tip="Reset All"
                                                @click="kr_doResetAll(props.row.khusus_banksoal_aspek_detail_id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                </svg>
                                            </button>
                                            </div>
                                            <div v-else class="text-sm font-medium text-center flex justify-center space-x-1">
                                            <button class="btn btn-sm btn-primary tooltip" data-tip="Reset Waktu"
                                                @click="doResetWaktu(props.row.khusus_banksoal_aspek_detail_id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                </svg>
                                            </button>
                                            <button class="btn btn-sm btn-success tooltip" data-tip="Reset Jawaban Salah"
                                                @click="doResetSalah(props.row.khusus_banksoal_aspek_detail_id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                </svg>
                                            </button>
                                            <button class="btn btn-sm btn-error tooltip" data-tip="Reset All"
                                                @click="doResetAll(props.row.khusus_banksoal_aspek_detail_id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                </svg>
                                            </button>
                                        </div>
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
</template>