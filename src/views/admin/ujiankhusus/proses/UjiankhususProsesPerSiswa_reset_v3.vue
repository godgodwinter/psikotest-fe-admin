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
import { fn_copy_id_for_mongo } from "@/lib/FungsiBasic.js"
import ApiUjianKhusus from "@/axios/axiosIst";

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
        const response = await Api.get(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}`);
        // const response = await Api.get(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}`);
        siswa.value = response.data;
        if (response.data.ujiankhusus) {
            const tempData = response.data.ujiankhusus.aspek_detail;
            data.value = tempData.map(fn_copy_id_for_mongo);
            //  "umum"; //!umum,minat,kr
            response.data.ujiankhusus.minatList.tipe = "minat"
            response.data.ujiankhusus.minatList.desc = "MINAT"
            data.value.push(response.data.ujiankhusus.minatList)

            response.data.ujiankhusus.krList.tipe = "kr"
            response.data.ujiankhusus.krList.desc = "KR"
            data.value.push(response.data.ujiankhusus.krList)
        }
        // data.value = response.data.ujiankhusus.aspek_detail;
        console.log(response.data.ujiankhusus.minatList, data.value);
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
        label: "revisi",
        field: "revisi",
        sortable: false,
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
        label: "Skor Revisi",
        field: "revisi_nilai",
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
        label: "desc",
        field: "desc",
        type: "string",
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
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/reset/${proses_detail_id}/salah`);
            Toast.babeng("Berhasil", 'Reset Salah berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const doResetWaktu = async (proses_detail_id,) => {
    console.log('id mapel', proses_detail_id);
    console.log(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/reset/${proses_detail_id}/waktu`);
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {

        try {
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/reset/${proses_detail_id}/waktu`);
            Toast.babeng("Berhasil", 'Reset Waktu berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const doForceFinish = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mengakhiri proses pada paketsoal ini?")) {

        try {
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/reset/${proses_detail_id}/forceFinish`);
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
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/reset/${proses_detail_id}/semua`);
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
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/minat/reset/waktu`);
            Toast.babeng("Berhasil", 'Reset Waktu Minat berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const minat_doForceFinish = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mengakhiri proses pada paketsoal ini?")) {

        try {
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/minat/reset/forceFinish`);
            Toast.babeng("Berhasil", 'Reset Waktu Minat berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const minat_doResetAll = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {

        try {
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/minat/reset/all`);
            Toast.babeng("Berhasil", 'Reset All Minat berhasil!');
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
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/kr/reset/waktu`);
            Toast.babeng("Berhasil", 'Reset Waktu kr berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const kr_doForceFinish = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mengakhiri proses pada paketsoal ini?")) {

        try {
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/kr/reset/forceFinish`);
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
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/kr/reset/salah`);
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
            const response = await Api.post(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/kr/reset/all`);
            Toast.babeng("Berhasil", 'Reset All kr berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const dataForm = ref({
    desc: null,
    revisi_nilai: 0,
});

const getDataDetail = async () => {
    try {
        const response = await ApiUjianKhusus.get(`ujiankhusus/banksoal/aspek/${aspek_id.value}`);
        dataForm.value = response.data;
        dataForm.value.status = response.data.status == "Aktif" ? true : false;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
getDataDetail();
const onRevisi = async (desc, skor_jml, revisi_nilai) => {
    dataForm.value.desc = desc;
    dataForm.value.skor_jml = skor_jml;
    dataForm.value.revisi_nilai = revisi_nilai || skor_jml;
}
const onSubmit = async (values) => {
    let dataFormSend = {
        desc: dataForm.value.desc,
        revisi_nilai: dataForm.value.revisi_nilai,
    };
    try {
        const response = await ApiUjianKhusus.post(`ujiankhusus/revisi/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil diupdate!");
        // router.push({ name: "admin-ujiankhusus-banksoal-aspek" });
        // return true;
        getData()
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <div>
        <div class="pt-4 px-10 md:flex justify-between">
            <div>
                <span class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm">MENU RESET
                    UJIANKHUSUS V3
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
                <button class="btn hover:shadow-lg shadow   hover:text-gray-100 gap-2"
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
                <div>
                    <p class="text-sm font-bold">Catatan : Tombol Reset waktu , reset salah dan Force Finish bisa
                        digunakan ketika ada
                        data
                        dari redis / ujian
                        aktif sesuai tanggal batas ujian</p>
                </div>
            </div>
            <!-- <div v-if="dataForm.desc" class="w-96 lg:w-4/6">
        <Form v-slot="{ errors }" @submit="onSubmit">
                    REVISI NILAI {{ dataForm.desc }}
                    <div>
                    <div class="flex flex-col">
                        <label>Nilai Asli :</label>
                        <div>
                            <input v-model="dataForm.skor_jml" name="skor_jml" type="text"
                                class="input input-bordered w-11/12" />
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label>Nilai Baru :</label>
                        <div>
                            <Field v-model="dataForm.revisi_nilai" name="revisi_nilai" type="text"
                                class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.revisi_nilai }}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="flex justify-end w-96 space-x-1">
                    <button class="btn btn-secondary">Batal</button>
                    <button class="btn btn-primary">Update Nilai</button></div>
                </Form>
                </div> -->
            <!-- The button to open modal -->
            <input type="checkbox" id="my_modal_6" class="modal-toggle" />
            <div class="modal" role="dialog">
                <div class="modal-box">
                    <Form v-slot="{ errors }" @submit="onSubmit" class="space-y-1">

                        <div>
                            <h2 class="font-bold">
                                REVISI NILAI {{ dataForm.desc }}
                            </h2>
                            <div class="flex flex-col space-y-1">
                                <label>Nilai Asli :</label>
                                <div>
                                    <input v-model="dataForm.skor_jml" name="skor_jml" type="text"
                                        class="input input-bordered w-11/12" />
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <label>Nilai Baru :</label>
                                <div>
                                    <Field v-model="dataForm.revisi_nilai" name="revisi_nilai" type="text"
                                        class="input input-bordered w-11/12" />
                                    <div class="text-xs text-red-600 mt-1">
                                        {{ errors.revisi_nilai }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end w-96 space-x-1">
                            <button class="btn btn-primary" v-if="dataForm.desc">Update Nilai</button>
                        </div>
                    </Form>
                    <div class="modal-action">
                        <label for="my_modal_6" class="btn">Close!</label>
                    </div>
                </div>
            </div>
            <div v-if="data">
                <div class="w-full lg:w-full">
                    <div class="bg-white shadow rounded-lg px-4 py-4">

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
                                            <div v-if="props.row.tipe == 'minat'"
                                                class="text-sm font-medium text-center flex justify-center space-x-1">

                                                <button class="btn btn-sm btn-warning tooltip" data-tip="Finish V3"
                                                    @click="minat_doForceFinish(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-primary tooltip" data-tip="Reset Waktu V3"
                                                    @click="minat_doResetWaktu(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-error tooltip" data-tip="Reset All V3"
                                                    @click="minat_doResetAll(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div v-else-if="props.row.tipe == 'kr'"
                                                class="text-sm font-medium text-center flex justify-center space-x-1">

                                                <button class="btn btn-sm btn-warning tooltip" data-tip="Finish V3"
                                                    @click="kr_doForceFinish(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-primary tooltip" data-tip="Reset Waktu V3"
                                                    @click="kr_doResetWaktu(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-success tooltip"
                                                    data-tip="Reset Jawaban Salah V3"
                                                    @click="kr_doResetSalah(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-error tooltip" data-tip="Reset All V3"
                                                    @click="kr_doResetAll(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div v-else
                                                class="text-sm font-medium text-center flex justify-center space-x-1">
                                                <button class="btn btn-sm btn-warning tooltip" data-tip="Finish V3"
                                                    @click="doForceFinish(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-primary tooltip" data-tip="Reset Waktu V3"
                                                    @click="doResetWaktu(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-success tooltip"
                                                    data-tip="Reset Jawaban Salah V3"
                                                    @click="doResetSalah(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-error tooltip" data-tip="Reset All V3"
                                                    @click="doResetAll(props.row.khusus_banksoal_aspek_detail_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </span>
                                    <span v-if="props.column.field == 'revisi'">
                                        <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                            <!-- {{ props.row.status }} -->
                                            <div class="text-sm font-medium text-center flex justify-center space-x-1"
                                                v-if="props.row.status == 'Selesai' || props.row.waktu <= 0">
                                                <!-- <button class="btn btn-sm btn-secondary tooltip" data-tip="Revisi Nilai" @click="onRevisi(props.row.desc,props.row.skor_jml)"
                                                >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

                                            </button> -->
                                                <label for="my_modal_6" class="btn"
                                                    @click="onRevisi(props.row.desc, props.row.skor_jml, props.row.revisi_nilai)"
                                                    v-if="props.row.revisi">Revisi</label>
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