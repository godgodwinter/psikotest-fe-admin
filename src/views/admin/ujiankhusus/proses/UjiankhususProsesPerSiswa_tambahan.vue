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
        const response = await Api.get(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}`);
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
const doForceFinish = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {

        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/reset/${proses_detail_id}/forceFinish`);
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
const minat_doForceFinish = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {

        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/minat/reset/forceFinish`);
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
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/minat/reset/all`);
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
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/kr/reset/waktu`);
            Toast.babeng("Berhasil", 'Reset Waktu kr berhasil!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const kr_doForceFinish = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {

        try {
            const response = await Api.post(`/ujiankhusus/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}/kr/reset/forceFinish`);
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
        const response = await ApiUjianKhusus.post(`ujiankhusus/revisi/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}`, dataFormSend);
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
                <span class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm">MENU TAMBAHAN
                    KESIMPULAN DAN SARAN
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
                <div class="md:py-2 px-1 lg:flex flex-wrap gap-4">
                    <div class="w-full grid grid-cols-1 lg:grid-cols-3 space-x-4 space-y-2">
                        <div class=" shadow rounded-lg p-1 grid-cols-1">
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
                        <div class="grid-cols-1   md:col-span-2">
                            <div class=" shadow rounded-lg p-1  ">
                                <div class="grid grid-cols-2 gap-2">
                                    <div class="grid-cols-1 md:col-span-2">
                                        <label class="form-control">
                                            <div class="label">
                                                <span class="label-text">Tambahan Kesimpulan -> utk semua jenjang</span>
                                            </div>
                                            <textarea class="textarea textarea-bordered h-24" placeholder=""></textarea>
                                            <div class="label">
                                                <!-- <span class="label-text-alt">Your bio</span> -->
                                            </div>
                                        </label>
                                    </div>
                                    <div class="grid-cols-1">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text">studi_1 -> kelas 9</span>
                                            </div>
                                            <input type="text" placeholder=""
                                                class="input input-bordered w-full max-w-xs" />
                                            <div class="label">
                                                <!-- <span class="label-text-alt">Bottom Left label</span> -->
                                            </div>
                                        </label>
                                    </div>
                                    <div class="grid-cols-1">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text">jurusan_1 -> kelas 9</span>
                                            </div>
                                            <input type="text" placeholder=""
                                                class="input input-bordered w-full max-w-xs" />
                                            <div class="label">
                                                <!-- <span class="label-text-alt">Bottom Left label</span> -->
                                            </div>
                                        </label>
                                    </div>

                                    <div class="grid-cols-1">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text">studi_2 -> kelas 9</span>
                                            </div>
                                            <input type="text" placeholder=""
                                                class="input input-bordered w-full max-w-xs" />
                                            <div class="label">
                                                <!-- <span class="label-text-alt">Bottom Left label</span> -->
                                            </div>
                                        </label>
                                    </div>
                                    <div class="grid-cols-1">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text">jurusan_2 -> kelas 9</span>
                                            </div>
                                            <input type="text" placeholder=""
                                                class="input input-bordered w-full max-w-xs" />
                                            <div class="label">
                                                <!-- <span class="label-text-alt">Bottom Left label</span> -->
                                            </div>
                                        </label>
                                    </div>


                                    <div class="grid-cols-1">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text">fakultas_1 -> kelas 10,11,12, umum</span>
                                            </div>
                                            <input type="text" placeholder=""
                                                class="input input-bordered w-full max-w-xs" />
                                            <div class="label">
                                                <!-- <span class="label-text-alt">Bottom Left label</span> -->
                                            </div>
                                        </label>
                                    </div>
                                    <div class="grid-cols-1">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text"> prodi_1 -> kelas 10,11,12, umum</span>
                                            </div>
                                            <input type="text" placeholder=""
                                                class="input input-bordered w-full max-w-xs" />
                                            <div class="label">
                                                <!-- <span class="label-text-alt">Bottom Left label</span> -->
                                            </div>
                                        </label>
                                    </div>


                                    <div class="grid-cols-1">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text">fakultas_2 -> kelas 10,11,12, umum</span>
                                            </div>
                                            <input type="text" placeholder=""
                                                class="input input-bordered w-full max-w-xs" />
                                            <div class="label">
                                                <!-- <span class="label-text-alt">Bottom Left label</span> -->
                                            </div>
                                        </label>
                                    </div>
                                    <div class="grid-cols-1">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text"> prodi_2 -> kelas 10,11,12, umum</span>
                                            </div>
                                            <input type="text" placeholder=""
                                                class="input input-bordered w-full max-w-xs" />
                                            <div class="label">
                                                <!-- <span class="label-text-alt">Bottom Left label</span> -->
                                            </div>
                                        </label>
                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="md:py-2 px-1 lg:flex flex-wrap gap-4">
                    <div class="w-full grid grid-cols-1 lg:grid-cols-3 space-x-4 space-y-2">
                        <div class=" shadow rounded-lg p-1 grid-cols-1">
                            <div class="overflow-x-auto">
                                <table class="table table-compact">
                                    <tbody>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12">IQ IST</td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>IQ 8KM</td>
                                            <td>:</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>SQ</td>
                                            <td>:</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>ScQ</td>
                                            <td>:</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </span>
    </div>
</template>