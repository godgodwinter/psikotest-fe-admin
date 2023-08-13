<script setup>
import Api from "@/axios/axiosNode";
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
        const response = await Api.get(`/ujianstudi/proses/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}`);
        siswa.value = response.siswa;
        data.value = response.data;
        // console.log('====================================');
        // console.log(data.value[0]?.soal_jml);
        // console.log('====================================');
        await getDataHasil();
        isLoading.value = false;
        return response.data;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
getData();
const dataUjian = ref(null)
const dataMinatbidangstudi = ref(null)
const dataJurusan = ref([])
const getDataHasil = async () => {
    try {
        // isLoading.value = true;
        const response = await Api.get(`/ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/siswa/${siswa_id.value}`);
        dataUjian.value = response.data;
        if (dataUjian.value) {
            for (const [index, item] of dataUjian.value.entries()) {
                if (item.tipe == "Semua") {
                    dataMinatbidangstudi.value = item.aspek_detail;
                }
                else {
                    dataJurusan.value.push(item)
                }
            }

            dataJurusan.value.sort(function (a, b) {
                return b.aspek_avg - a.aspek_avg;
            });
        }
        // isLoading.value = false;
        // return response.data;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};

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
        field: "aspek_detail_nama",
        type: "String",
    },
    {
        label: "Status",
        field: "status",
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
];

const doResetWaktu = async (proses_detail_id) => {
    if (confirm("Apakah anda yakin mereset waktu data ini?")) {

        let dataFormSend = {
            siswa_id: siswa_id.value,
        }
        try {
            const response = await Api.post(`ujianstudi/proses/reset/${proses_detail_id}/waktu`, dataFormSend);
            Toast.babeng("Berhasil", 'Data berhasil update!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}
const doResetSalah = async (proses_detail_id,) => {
    if (confirm("Apakah anda yakin mereset jawban salah dan waktu data ini?")) {
        let dataFormSend = {
            siswa_id: siswa_id.value,
        }
        try {
            const response = await Api.post(`ujianstudi/proses/reset/${proses_detail_id}/salah`, dataFormSend);
            Toast.babeng("Berhasil", 'Data berhasil update!');
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
}

const revisi_dataForm = ref({
    id: null,
    nilai_akhir_revisi: 0,
    aspek_detail_nama: "-"
})
const revisi_form = ref(false)

const doOpenForm = (id, nilai_akhir_revisi, aspek_detail_nama) => {
    revisi_dataForm.value = {
        id,
        nilai_akhir_revisi,
        aspek_detail_nama
    }
}

const onSubmitRevisi = async (values) => {
    let dataStore = {
        nilai_akhir_revisi: revisi_dataForm.value.nilai_akhir_revisi,
    };
    // console.log(dataForm);
    try {
        const response = await Api.put(`ujianstudi/hasil/revisi/hasil_aspek_detail_id/${revisi_dataForm.value.id}`, dataStore);
        console.log(response);
        // data.id = response.id;
        Toast.success("Info", "Data berhasil revisi!");
        // router.push({ name: "admin-pengumuman-index" });
        getData();

        return true;
    } catch (error) {
        console.error(error);
    }
};


const doCetak = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    //     Toast.danger("Warning", "Data tidak valid!");
    // } else {
    window.open(
        `${BASE_URL_CETAK}api/guest/ujianstudi/v2/cetak/siswa/${siswa_id.value}`
    );
    // }
};
const doCetakLess = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    //     Toast.danger("Warning", "Data tidak valid!");
    // } else {
    window.open(
        `${BASE_URL_CETAK}api/guest/ujianstudi/v2/cetak/siswa/${siswa_id.value}/less`
    );
    // }
};
const doCetakLess_tanpa_ttd = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    //     Toast.danger("Warning", "Data tidak valid!");
    // } else {
    window.open(
        `${BASE_URL_CETAK}api/guest/ujianstudi/v2/cetak/siswa/${siswa_id.value}/less/tanpa_ttd`
    );
    // }
};

const doRefreshData = () => {
    getData();
    getDataHasil();
}
</script>
<template>
    <div>
        <div class="pt-4 px-10 md:flex justify-between">
            <div>
                <span class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm">Hasil Ujian
                    Lintas Bidang
                    Studi
                </span>
            </div>
            <div class="md:py-0 py-4 space-x-2 space-y-2">

                <button class="btn btn-sm btn-primary tooltip" data-tip="CETAK Hasil" @click="doCetak()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                </button>
                <button class="btn btn-sm btn-warning tooltip" data-tip="CETAK Hasil v2" @click="doCetakLess()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                </button>
                <button class="btn btn-sm btn-warning tooltip" data-tip="CETAK Hasil v2 tanpa ttd"
                    @click="doCetakLess_tanpa_ttd()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                </button>
                <!-- <button class="btn btn-sm btn-primary tooltip" data-tip="Generate Hasil">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
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
                    <div class="bg-white shadow rounded-lg px-4 py-4" v-if="data[0]?.soal_jml">

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
                                            <button class="btn btn-sm btn-primary tooltip" data-tip="Reset Waktu"
                                                @click="doResetWaktu(props.row.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                </svg>
                                            </button>
                                            <button class="btn btn-sm btn-success tooltip" data-tip="Reset Jawaban Salah"
                                                @click="doResetSalah(props.row.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
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
            <div v-if="dataUjian">
                <div class="w-full lg:w-full py-2">
                    <div class="bg-white shadow rounded-lg px-4 py-4">

                        <div class="md:py-2 px-4 lg:flex flex-wrap gap-4" v-for=" item, index  in  dataUjian "
                            :key="item.id">

                            <p class="font-bold "> {{ index + 1 }}. {{ item.aspek_nama }}
                                : {{ item.aspek_avg }} - {{ fn_studi_ket(item.aspek_avg) }} ( {{
                                    fn_studi_ket_singkatan(item.aspek_avg)
                                }})
                            </p>
                            <div class="w-full lg:w-full">
                                <div class="bg-white shadow rounded-lg px-4 py-4">
                                    <div class="overflow-x-auto">
                                        <table class="table table-compact">
                                            <tbody>
                                                <span v-for=" mapel, i  in  item.aspek_detail  " :key="mapel.id">
                                                    <tr v-if="mapel.status_tampil === 'Aktif'">
                                                        <td class="whitespace-nowrap w-1/12">
                                                            <label for="modal-revisi" class="btn"
                                                                @click="doOpenForm(mapel.id, mapel.nilai_akhir, mapel?.aspek_detail_nama)">
                                                                Revisi Nilai
                                                            </label>
                                                        </td>
                                                        <td class="whitespace-nowrap w-1/12">{{ parseInt(i) + 1 }}</td>
                                                        <td class="whitespace-nowrap w-3/12">
                                                            {{ mapel?.aspek_detail_nama }}
                                                        </td>
                                                        <td class="whitespace-nowrap w-1/12">:</td>
                                                        <td class="whitespace-nowrap w-3/12">


                                                            {{ mapel.nilai_akhir }}
                                                            -
                                                            {{ fn_studi_ket(mapel.nilai_akhir) }} ( {{
                                                                fn_studi_ket_singkatan(mapel.nilai_akhir)
                                                            }})
                                                            <!-- {{ mapel.nilai_akhir }}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    -
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    {{ fn_studi_ket(mapel.nilai_akhir) }} ( {{
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        fn_studi_ket_singkatan(mapel.nilai_akhir)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }}) -->

                                                        </td>
                                                    </tr>

                                                </span>

                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="md:py-2 px-4 lg:flex flex-wrap gap-4">
                    <!-- <h2 class="font-bold uppercase">JURUSAN </h2> -->
                    <div>
                        <h2 class="font-bold uppercase">KESIMPULAN DAN SARAN </h2>
                        <!-- <h4 class="font-bold capitalize">Penguasaan Peminatan Jurusan </h4> -->
                    </div>

                    <p class="indent-8">
                        Potensi kemampuan Akademik Subyek saat ini terkuat dibidang studi yang terkait dengan <span
                            class="font-bold">{{
                                dataJurusan[0].aspek_nama
                            }}</span>,
                        maka dalam mengambil jurusan cenderung disarankan bidang <span class="font-bold">{{
                            dataJurusan[0].aspek_nama
                        }}</span>,
                        dan dipertimbangkan untuk mengambil jurusan dibidang <span class="font-bold">{{
                            dataJurusan[1].aspek_nama
                        }}</span>,
                        serta tidak disarankan untuk mengambil jurusan dibidang <span class="font-bold">{{
                            dataJurusan[2].aspek_nama
                        }}</span>
                    </p>
                </div>


                <div class="md:py-2 px-4 lg:flex flex-wrap gap-4">
                    <h2 class="font-bold uppercase">Minat Bidang Studi Terkuat </h2>
                    <div class="w-full lg:w-full">
                        <div class="bg-white  rounded-lg px-4 py-4">
                            <div class="overflow-x-auto">
                                <table class="table table-compact">
                                    <tbody>
                                        <tr v-for=" item, i  in  dataMinatbidangstudi.slice(0, 5) " :key="item.id">
                                            <td class="whitespace-nowrap w-1/12">{{ i + 1 }}</td>
                                            <td class="whitespace-nowrap w-3/12 text-left"> {{
                                                item?.aspek_detail_nama
                                            }} </td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-3/12">
                                                {{ item.nilai_akhir }}
                                            </td>
                                            <td class="whitespace-nowrap w-3/12">
                                                {{
                                                    item.nilai_akhir ?
                                                    `${fn_studi_ket(item.nilai_akhir)}
                                                                                                (${fn_studi_ket_singkatan(item.nilai_akhir)})` :
                                                    `${fn_studi_ket(item.nilai_akhir)}
                                                                                                (${fn_studi_ket_singkatan(item.nilai_akhir)})`
                                                }}
                                            </td>

                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


                <p class="indent-8 py-4">Sedangkan minat Subyek untuk mempelajari dibidang studi yang disukai dan
                    terkuat yaitu
                    <span class="font-bold"> {{ dataMinatbidangstudi[0]?.aspek_detail_nama }},
                        {{
                            dataMinatbidangstudi[1]?.aspek_detail_nama
                        }}, {{
    dataMinatbidangstudi[2]?.aspek_detail_nama
}}, {{
    dataMinatbidangstudi[3]?.aspek_detail_nama
}}, dan {{
    dataMinatbidangstudi[4]?.aspek_detail_nama
}}</span>

                    sebagai
                    penunjang dari kelancaran studi lanjud dan keberhasilan pencapaian cita-cita dalam menempuh profesi
                    yang dinginkan. Selain itu juga Subyek harus belajar membiasakan menyukai mata pelajaran bidang
                    studi yang nilainya kurang dan tidak disukai terutama :

                    <span class="font-bold"> 1.{{
                        dataMinatbidangstudi.at(-1)?.aspek_detail_nama
                    }} 2.{{
    dataMinatbidangstudi[dataMinatbidangstudi.length - 2]?.aspek_detail_nama
}} 3.{{
    dataMinatbidangstudi[dataMinatbidangstudi.length - 3]?.aspek_detail_nama
}}</span>
                </p>

            </div>


            <input type="checkbox" id="modal-revisi" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box relative">
                    <label for="modal-revisi" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 class="text-lg font-bold">{{ revisi_dataForm?.aspek_detail_nama }}</h3>
                    <!-- <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for
                                                                                                                                                                                                                                                                                                                                                                                                            free!</p> -->

                    <Form v-slot="{ errors }" @submit="onSubmitRevisi">
                        <div class="py-2 lg:py-4 px-4">
                            <div class="space-y-4">
                                <div class="flex flex-col">
                                    <label>Nilai Baru <span class="font-bold">{{ nama }}</span> :</label>
                                    <div>
                                        <Field :rules="fnValidasi.validateDataNumber"
                                            v-model="revisi_dataForm.nilai_akhir_revisi" name="nilai_akhir_revisi"
                                            type="text" max="100" min="0" class="input input-bordered w-11/12" />
                                        <div class="text-xs text-red-600 mt-1">
                                            {{ errors.nilaiAkhir_revisi }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-full flex justify-end py-10 px-10 gap-4">
                            <!-- <button class="btn btn-warning">Draft</button> -->
                            <button class="btn btn-primary">Simpan</button>
                        </div>
                    </Form>
                </div>
            </div>

        </span>
    </div>
</template>