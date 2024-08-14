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
import { fn_avg_data, fn_deteksi_sq } from "@/lib/IqHelper.js"
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
const dataIq = ref();
const dataForm = ref({});
const siswa = ref();
const isLoading = ref(true);
const isError = ref(false);
const dataKelas = ref([]);

const getData = async () => {
    try {
        isLoading.value = true;
        const response = await Api.get(`/ist_tambahan/saran/kelas/${kelas_id.value}/siswa/${siswa_id.value}`);
        siswa.value = response.data;
        if (response.data?.tambahan_saran) {
            dataForm.value = response.data?.tambahan_saran?.dataTambahan
        }
        // console.log(dataForm.value);
        isLoading.value = false;
        getData_Iq()
        let do_olah_data_fakultas = await getData_ist_fakultas();
        return response.data;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
const filterUniqueMapel = (data) => {
    const mapelSet = new Set();
    const uniqueMapel = [];

    // console.log("====================================");
    // console.log(data.ist_fakultas_Sorted[0].mapel_terkuat);
    // console.log("====================================");
    // for (const item of data.ist_fakultas_Sorted.slice(0, 3)) {
    for (const item of data.ist_fakultas_Sorted_with_prioritas.slice(0, 3)) {
        for (const mapel of item.mapel_terkuat) {
            if (!mapelSet.has(mapel.nama)) {
                mapelSet.add(mapel.nama);
                if (mapel.nama != "-") {
                    uniqueMapel.push(mapel);
                }
            }
        }
    }

    return uniqueMapel;
};

function arraysEqual(arr1, arr2) {
    return (
        arr1.length === arr2.length &&
        arr1.every((value, index) => value === arr2[index])
    );
}
function findSimilarInterests(interests, dataArray) {
    const dataResult = [];

    const sortedInterests = interests.slice().sort(); // Menyimpan minat dalam urutan yang disortir

    // Prioritas 1: Ketiga minat sama
    for (const obj of dataArray) {
        const objInterests = obj.minat.map((minat) => minat.nama);
        const sortedObjInterests = objInterests.slice().sort();

        if (arraysEqual(sortedObjInterests, sortedInterests)) {
            dataResult.push(obj);
        }
    }

    // Prioritas 2: Dua minat sama
    const prioritas2Result = [];
    for (let i = 0; i < dataArray.length - 1; i++) {
        for (let j = i + 1; j < dataArray.length; j++) {
            const combinedInterests = [
                ...dataArray[i].minat.map((minat) => minat.nama),
                ...dataArray[j].minat.map((minat) => minat.nama),
            ];
            const uniqueCombinedInterests = [...new Set(combinedInterests)];
            const sortedCombinedInterests = uniqueCombinedInterests.slice().sort();

            if (
                uniqueCombinedInterests.length - sortedCombinedInterests.length >=
                2
            ) {
                prioritas2Result.push(dataArray[i], dataArray[j]);
            }
        }
    }

    // Prioritas 3: Satu minat sama
    const prioritas3Result = [];
    for (const obj of dataArray) {
        const objInterests = obj.minat.map((minat) => minat.nama);
        if (objInterests.some((value) => interests.includes(value))) {
            prioritas3Result.push(obj);
        }
    }

    return [...dataResult, ...prioritas2Result, ...prioritas3Result];
}
const fn_sort_dataFakultasTerbaik = (dataDetail) => {
    // console.log("====================================");
    // console.log(dataDetail);
    // console.log("====================================");
    const sortedData = dataDetail.sort((a, b) => b.detail_val - a.detail_val);
    // const sortedData = dataDetail.sort((a, b) => a.detail_val - b.detail_val);
    return sortedData.slice(0, 80);
};
const fn_masukkanData = async (datas) => {
    // console.log("====================================");
    // console.log(datas.minatbakat_detail_sorted);
    // console.log("====================================");
    // !siapkan data kewirausahaan
    datas.forEach((item) => {
        // console.log(
        //   item.minatbakat_detail_sorted[0].nama,
        //   item.minatbakat_detail_sorted[1].nama,
        //   item.minatbakat_detail_sorted[2].nama
        // );

        if (item && item.ist_fakultas) {
            const interestsToCheck = [
                item.minatbakat_detail_sorted[0].nama,
                item.minatbakat_detail_sorted[1].nama,
                item.minatbakat_detail_sorted[2].nama,
            ];
            // console.log("====================================");
            // console.log(interestsToCheck);
            // console.log("====================================");
            // console.log(item.ist_fakultas);
            // jika belum ada maka tambahkan ke dataIstUniq
            const dataIstFakultasSorted = fn_sort_dataFakultasTerbaik(
                item.ist_fakultas
            );

            //! urutkan berdasarkan prioritas dahulu

            const dataIstUniq = [];
            let total_jml = 0;
            const dataLimit = 80; // Batas jumlah data
            const fn_periksaNamaFakultas = (data) => {
                // Periksa apakah data nama fakultas sudah ada di dataIstUniq
                const existingFakultas = dataIstUniq.find(
                    (item) => item.fakultas === data.nama
                );

                if (!existingFakultas && total_jml < dataLimit) {
                    // Jika belum ada dan jumlah data masih kurang dari batas, tambahkan ke dataIstUniq
                    dataIstUniq.push(data);
                    total_jml++;
                }

                return !existingFakultas && total_jml <= dataLimit; // true jika belum ada dan belum mencapai batas, false jika sudah ada atau sudah mencapai batas
            };

            for (const item of dataIstFakultasSorted) {
                fn_periksaNamaFakultas(item);
            }
            // console.log("====================================");
            // console.log(dataIstUniq);
            // console.log("====================================");

            item.ist_fakultas_Sorted = dataIstUniq;
            // item.ist_fakultas_Sorted = dataIstFakultasSorted;
            // console.log("====================================");
            // console.log(dataIstUniq);
            // console.log("====================================");
            const dataIstPrioritas = findSimilarInterests(
                interestsToCheck,
                item.ist_fakultas
                // dataIstUniq
            );

            item.ist_fakultas_Sorted_with_prioritas = dataIstPrioritas;

            const uniqueMapelArray = filterUniqueMapel(item);
            item.mapel_terkuat_uniq = uniqueMapelArray;
            // console.log(dataIstPrioritas);
            // fn_periksaNamaFakultas
            // const periksaDataFakultasSudahAda = fn_periksaNamaFakultas(
            //   item.ist_fakultas.nama
            // );
            // if (periksaDataFakultasSudahAda == false) {
            dataKelas.value.push(item);
            // console.log(`setelah di olah:`, dataKelas);
            // }
        }
        console.log(`data kelas: `, dataKelas.value);
    });
};

const getData_ist_fakultas = async () => {
    try {
        const response = await Api.get(`/ist/ist_jurusan/kelas/${kelas_id.value}/siswa/${siswa_id.value}`);
        // console.log(response.data);
        if (response.data) {
            if (response.data.length > 0) {
                fn_masukkanData(response.data)
            }
        }
    } catch (error) {
        console.error(error);
    }
};
const getData_Iq = async () => {
    try {
        isLoading.value = true;
        const response = await Api.get(`/ist/8km/kelas/${kelas_id.value}/v3/gabungan/siswa/${siswa_id.value}`);
        dataIq.value = response.data;
        isLoading.value = false;
        // return response.data;
    } catch (error) {
        isLoading.value = false;
        // isError.value = true;
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

const onSubmit = async (values) => {
    let dataFormSend = {
        kesimpulan_saran_tambahan: dataForm.value.kesimpulan_saran_tambahan,
        studi_1: dataForm.value.studi_1,
        jurusan_1: dataForm.value.jurusan_1,
        studi_2: dataForm.value.studi_2,
        jurusan_2: dataForm.value.jurusan_2,
        fakultas_1: dataForm.value.fakultas_1,
        prodi_1: dataForm.value.prodi_1,
        fakultas_2: dataForm.value.fakultas_2,
        prodi_2: dataForm.value.prodi_2,
        fakultas_1112: dataForm.value.fakultas_1112,
        fakultas_1112_mapel: dataForm.value.fakultas_1112_mapel,
    };
    // console.log(values, dataFormSend);
    try {
        const response = await ApiUjianKhusus.put(`ist_tambahan/saran/kelas/${kelas_id.value}/siswa/${siswa_id.value}`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil disimpan!");
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
                                <table class="table table-compact" v-if="dataIq">
                                    <tbody>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12">IQ IST</td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                        dataIq?.fn_get_data_ist?.ist.iq_val }}
                                                <!-- {{
                        dataIq?.fn_get_data_ist?.ist.iq_ket }} -->
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>IQ 8KM</td>
                                            <td>:</td>
                                            <td>{{ dataIq?.data_8km.iq }}</td>
                                        </tr>
                                        <tr>
                                            <td>EQ</td>
                                            <td>:</td>
                                            <td>
                                                <span v-if="dataIq.fn_get_hspq_sq">{{ Math.round(
                        fn_avg_data(
                            fn_deteksi_sq(
                                dataIq.fn_get_hspq_sq?.deteksi_untuk_cetak_sqscqeq,
                                "eq"
                            )
                        )
                    ) }}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>ScQ</td>
                                            <td>:</td>
                                            <td><span v-if="dataIq.fn_get_hspq_sq">{{ Math.round(
                        fn_avg_data(
                            fn_deteksi_sq(
                                dataIq.fn_get_hspq_sq?.deteksi_untuk_cetak_sqscqeq,
                                "scq"
                            )
                        )
                    ) }}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- {{ dataKelas }} -->
                                <table class="table table-compact" v-if="dataKelas.length > 0">
                                    <tbody>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12">Fakultas</td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                        dataKelas[0]?.ist_fakultas_Sorted_with_prioritas[0]?.fakultas }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12"></td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                        dataKelas[0]?.ist_fakultas_Sorted_with_prioritas[1]?.fakultas }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12"></td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                                                dataKelas[0]?.ist_fakultas_Sorted_with_prioritas[2]?.fakultas }}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="whitespace-nowrap w-1/12">Mapel</td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                                                dataKelas[0]?.mapel_terkuat_uniq[0]?.nama }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12"></td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                                                dataKelas[0]?.mapel_terkuat_uniq[1]?.nama }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12"></td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                                                dataKelas[0]?.mapel_terkuat_uniq[2]?.nama }}
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="grid-cols-1   md:col-span-2">
                            <Form v-slot="{ errors }" @submit="onSubmit">
                                <div class=" shadow rounded-lg p-1  ">
                                    <div class="grid grid-cols-2 gap-2">
                                        <!-- <div class="grid-cols-1 md:col-span-2">
                                            <label class="form-control">
                                                <div class="label">
                                                    <span class="label-text">Tambahan Kesimpulan -> utk semua
                                                        jenjang</span>
                                                </div>
                                                <textarea v-model="dataForm.kesimpulan_saran_tambahan"
                                                    class="textarea textarea-bordered h-24" placeholder=""></textarea>
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>
                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text">studi_1 -> kelas 9</span>
                                                </div>
                                                <Field v-model="dataForm.studi_1" name="studi_1" type="string"
                                                    class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>
                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text">jurusan_1 -> kelas 9</span>
                                                </div>

                                                <Field v-model="dataForm.jurusan_1" name="jurusan_1" type="string"
                                                    class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>

                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text">studi_2 -> kelas 9</span>
                                                </div>

                                                <Field v-model="dataForm.studi_2" name="studi_2" type="string"
                                                    class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>
                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text">jurusan_2 -> kelas 9</span>
                                                </div>
                                                <Field v-model="dataForm.jurusan_2" name="jurusan_2" type="string"
                                                    class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>


                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text">fakultas_1 -> kelas 10,11,12, umum</span>
                                                </div>
                                                <Field v-model="dataForm.fakultas_1" name="fakultas_1" type="string"
                                                    class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>
                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text"> prodi_1 -> kelas 10,11,12, umum</span>
                                                </div>
                                                <Field v-model="dataForm.prodi_1" name="prodi_1" type="string"
                                                    class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>


                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text">fakultas_2 -> kelas 10,11,12, umum</span>
                                                </div>
                                                <Field v-model="dataForm.fakultas_2" name="fakultas_2" type="string"
                                                    class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>
                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text"> prodi_2 -> kelas 10,11,12, umum</span>
                                                </div>
                                                <Field v-model="dataForm.prodi_2" name="prodi_2" type="string"
                                                    class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div> -->
                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text">fakultas untuk tipe kelas 11,12 (Cetak
                                                        V5)</span>
                                                </div>
                                                <Field v-model="dataForm.fakultas_1112" name="fakultas_1112"
                                                    type="string" class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>
                                        <div class="grid-cols-1">
                                            <label class="form-control w-full max-w-xs">
                                                <div class="label">
                                                    <span class="label-text"> mepel untuk tipe kelas 11,12 (Cetak
                                                        V5)</span>
                                                </div>
                                                <Field v-model="dataForm.fakultas_1112_mapel" name="fakultas_1112_mapel"
                                                    type="string" class="input input-bordered w-full max-w-xs" />
                                                <div class="label">
                                                </div>
                                            </label>
                                        </div>


                                    </div>
                                    <div class="w-full flex justify-end py-10 px-10 gap-4">
                                        <span @click="router.go(-1)">
                                            <span class="btn btn-secondary">Batal</span></span>
                                        <button class="btn btn-primary">Simpan</button>
                                    </div>
                                </div>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
        </span>
    </div>
</template>