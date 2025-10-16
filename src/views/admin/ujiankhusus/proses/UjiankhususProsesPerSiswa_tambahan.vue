<script setup>
import Api from "@/axios/axiosIst";
import { ref, defineAsyncComponent, computed, onMounted, watch, nextTick } from "vue";
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
import { fn_settings_range_8km, fn_singkatkan_ket } from "@/lib/babengIst8kmGabungan.js"
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
const dataLengkap = ref();
const dataForm = ref({});
const siswa = ref();
const isLoading = ref(true);
const isError = ref(false);
const dataKelas = ref([]);
const dataAspek_ist = ref([]);
const dataAspek_8km = ref([]);

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

function getInterestsByRank(dataMinat, dataArray, ranks) {
    const interests = [];

    const addedIds = new Set(); // Untuk melacak ID yang sudah ditambahkan

    for (const rank of ranks) {
        dataArray.forEach((item) => {
            const minat = item.minat.find((minat) => minat.id === rank);
            if (minat && dataMinat.includes(minat.nama) && !addedIds.has(item.id)) {
                interests.push(item);
                addedIds.add(item.id);
            }
        });
    }

    return interests;
}
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

        // console.log("====================================");
        console.log(`#sebelum masukkan data`, item?.data_8km?.umur, item);
        // console.log("====================================");
        dataLengkap.value = item

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
            // console.log(interestsToCheck, dataIstUniq);
            const ranks = [1, 2, 3];
            const dataIstPrioritas = getInterestsByRank(
                interestsToCheck,
                // item.ist_fakultas
                dataIstUniq,
                ranks
            );
            // console.log("====================================");
            // console.log(dataIstPrioritas);
            // console.log("====================================");

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
            // }
        }
        // console.log(`#dataKelas:`, dataKelas.value);
        let dataPerSiswa = {
            id: item.id,
            kelas: item.kelas?.nama,
            nama: item.nama,
            iq_val: item?.data_8km?.iq,
            minatRank1: item?.minatbakat_detail_sorted[0].nama,
            minatRank2: item?.minatbakat_detail_sorted[1].nama,
            minatRank3: item?.minatbakat_detail_sorted[2].nama,
            cita1: item?.data_8km?.citacita_1,
            cita2: item?.data_8km?.citacita_2,
            cita3: item?.data_8km?.citacita_2,
            fk_1_std: item?.ist_fakultas_Sorted_with_prioritas[0]?.iq_min,
            fk_1_iq: item?.ist_fakultas_Sorted_with_prioritas[0]?.iq,
            fk_1: item?.ist_fakultas_Sorted_with_prioritas[0]?.nama,
            fk_1_prodi: item?.ist_fakultas_Sorted_with_prioritas[0]?.prodi,

            fk_2_std: item?.ist_fakultas_Sorted_with_prioritas[1]?.iq_min,
            fk_2_iq: item?.ist_fakultas_Sorted_with_prioritas[1]?.detail_val,
            fk_2: item?.ist_fakultas_Sorted_with_prioritas[1]?.nama,
            fk_2_prodi: item?.ist_fakultas_Sorted_with_prioritas[1]?.prodi,

            fk_3_std: item?.ist_fakultas_Sorted_with_prioritas[2]?.iq_min,
            fk_3_iq: item?.ist_fakultas_Sorted_with_prioritas[2]?.detail_val,
            fk_3: item?.ist_fakultas_Sorted_with_prioritas[2]?.nama,
            fk_3_prodi: item?.ist_fakultas_Sorted_with_prioritas[2]?.prodi,

            fk_4_std: item?.ist_fakultas_Sorted_with_prioritas[3]?.iq_min,
            fk_4_iq: item?.ist_fakultas_Sorted_with_prioritas[3]?.detail_val,
            fk_4: item?.ist_fakultas_Sorted_with_prioritas[3]?.nama,
            fk_4_prodi: item?.ist_fakultas_Sorted_with_prioritas[3]?.prodi,

            fk_5_std: item?.ist_fakultas_Sorted_with_prioritas[4]?.iq_min,
            fk_5_iq: item?.ist_fakultas_Sorted_with_prioritas[4]?.detail_val,
            fk_5: item?.ist_fakultas_Sorted_with_prioritas[4]?.nama,
            fk_5_prodi: item?.ist_fakultas_Sorted_with_prioritas[4]?.prodi,

            fk_6_std: item?.ist_fakultas_Sorted_with_prioritas[5]?.iq_min,
            fk_6_iq: item?.ist_fakultas_Sorted_with_prioritas[5]?.detail_val,
            fk_6: item?.ist_fakultas_Sorted_with_prioritas[5]?.nama,
            fk_6_prodi: item?.ist_fakultas_Sorted_with_prioritas[5]?.prodi,

            fk_7_std: item?.ist_fakultas_Sorted_with_prioritas[6]?.iq_min,
            fk_7_iq: item?.ist_fakultas_Sorted_with_prioritas[6]?.detail_val,
            fk_7: item?.ist_fakultas_Sorted_with_prioritas[6]?.nama,
            fk_7_prodi: item?.ist_fakultas_Sorted_with_prioritas[6]?.prodi,

            fk_prodi_1_mapel_1:
                item?.ist_fakultas_Sorted_with_prioritas[0]?.mapel_terkuat[0]?.nama,
            fk_prodi_1_mapel_2:
                item?.ist_fakultas_Sorted_with_prioritas[0]?.mapel_terkuat[1]?.nama,
            fk_prodi_1_mapel_3:
                item?.ist_fakultas_Sorted_with_prioritas[0]?.mapel_terkuat[2]?.nama,

            fk_prodi_2_mapel_1:
                item?.ist_fakultas_Sorted_with_prioritas[1]?.mapel_terkuat[0]?.nama,
            fk_prodi_2_mapel_2:
                item?.ist_fakultas_Sorted_with_prioritas[1]?.mapel_terkuat[1]?.nama,
            fk_prodi_2_mapel_3:
                item?.ist_fakultas_Sorted_with_prioritas[1]?.mapel_terkuat[2]?.nama,

            fk_prodi_3_mapel_1:
                item?.ist_fakultas_Sorted_with_prioritas[2]?.mapel_terkuat[0]?.nama,
            fk_prodi_3_mapel_2:
                item?.ist_fakultas_Sorted_with_prioritas[2]?.mapel_terkuat[1]?.nama,
            fk_prodi_3_mapel_3:
                item?.ist_fakultas_Sorted_with_prioritas[2]?.mapel_terkuat[2]?.nama,

            fk_prodi_4_mapel_1:
                item?.ist_fakultas_Sorted_with_prioritas[3]?.mapel_terkuat[0]?.nama,
            fk_prodi_4_mapel_2:
                item?.ist_fakultas_Sorted_with_prioritas[3]?.mapel_terkuat[1]?.nama,
            fk_prodi_4_mapel_3:
                item?.ist_fakultas_Sorted_with_prioritas[3]?.mapel_terkuat[2]?.nama,

            fk_prodi_5_mapel_1:
                item?.ist_fakultas_Sorted_with_prioritas[4]?.mapel_terkuat[0]?.nama,
            fk_prodi_5_mapel_2:
                item?.ist_fakultas_Sorted_with_prioritas[4]?.mapel_terkuat[1]?.nama,
            fk_prodi_5_mapel_3:
                item?.ist_fakultas_Sorted_with_prioritas[4]?.mapel_terkuat[2]?.nama,

            fk_prodi_6_mapel_1:
                item?.ist_fakultas_Sorted_with_prioritas[5]?.mapel_terkuat[0]?.nama,
            fk_prodi_6_mapel_2:
                item?.ist_fakultas_Sorted_with_prioritas[5]?.mapel_terkuat[1]?.nama,
            fk_prodi_6_mapel_3:
                item?.ist_fakultas_Sorted_with_prioritas[5]?.mapel_terkuat[2]?.nama,

            fk_prodi_7_mapel_1:
                item?.ist_fakultas_Sorted_with_prioritas[6]?.mapel_terkuat[0]?.nama,
            fk_prodi_7_mapel_2:
                item?.ist_fakultas_Sorted_with_prioritas[6]?.mapel_terkuat[1]?.nama,
            fk_prodi_7_mapel_3:
                item?.ist_fakultas_Sorted_with_prioritas[6]?.mapel_terkuat[2]?.nama,
        };
        dataKelas.value.push(item);
        // console.log(`data kelas: `, dataKelas.value);
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
        console.log('====================================');
        console.log(`#getData_iq #dataIq`, dataIq.value);
        console.log('====================================');
        console.log(`#getData_Iq #8km:`, dataIq.value?.data_8km?.data_8km_hasil);
        dataAspek_8km.value = dataIq.value?.data_8km?.data_8km_hasil ? dataIq.value?.data_8km?.data_8km_hasil.sort((a, b) => b.persen - a.persen) : [];
        // dataAspek_8km.value = dataIq.value?.data_8km?.data_8km_hasil
        console.log(`#getData_Iq #ist:`, dataIq.value?.fn_get_data_ist?.ist_detail_sorted);
        dataAspek_ist.value = dataIq.value?.fn_get_data_ist?.ist_detail_sorted
        // console.log('====================================');
        // console.log(`data CiTA CITA`, dataIq.value.dataCitacita, dataIq.value?.data_8km?.citacita_1);
        // console.log('====================================');
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
        // !baru
        studi_1_baru: dataForm.value.studi_1_baru,
        jurusan_1_baru: dataForm.value.jurusan_1_baru,
        studi_2_baru: dataForm.value.studi_2_baru,
        jurusan_2_baru: dataForm.value.jurusan_2_baru,
        // !baru-end
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

// const sortedDataAspek_8km = computed(() => {
//     return dataAspek_8km.value.sort((a, b) => b.persen - a.persen)
// })


const textareaRef = ref(null)

const autoResize = () => {
    const el = textareaRef.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
}

// pastikan tinggi juga menyesuaikan saat pertama kali mount / load data
onMounted(() => nextTick(autoResize))

// jika `dataForm.jurusan_2` berubah dari luar (misalnya edit data lama)
watch(() => dataForm.value.jurusan_2, () => nextTick(autoResize))


const do_generate_data_tambahan = async (values) => {
    try {
        if (confirm("Data sebelumnya akan terhapus. Apakah anda yakin generate data ini?")) {
            const response = await ApiUjianKhusus.post(`update_data/ist_tambahan/fn_get_persiswa/siswa/${siswa_id.value}/generate`);
            // console.log(response);
            Toast.success("Info", "Data berhasil digenerate!");
            // router.push({ name: "admin-ujiankhusus-banksoal-aspek" });
            // return true;
        }
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
                <button class="btn btn-success hover:shadow-lg shadow   hover:text-gray-100 gap-2"
                    @click="do_generate_data_tambahan()">GENERATE
                    DATA TAMBAHAN (REPLACE)</button>
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
                                        <tr>
                                            <td>Umur</td>
                                            <td>:</td>
                                            <td>{{ dataLengkap?.data_8km?.umur }}</td>
                                        </tr>
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
                                <table class="table table-compact" v-if="dataKelas.length > 0">
                                    <tbody>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12">Minat 1</td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                                                dataIq?.get_minatbakat_sorted[0]?.nama }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12">Minat 3</td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                                                dataIq?.get_minatbakat_sorted[1]?.nama }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="whitespace-nowrap w-1/12">Minat 3</td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                                                dataIq?.get_minatbakat_sorted[2]?.nama }}
                                            </td>
                                        </tr>
                                        <!-- <tr>
                                            <td class="whitespace-nowrap w-1/12">Cita-cita</td>
                                            <td class="whitespace-nowrap w-1/12">:</td>
                                            <td class="whitespace-nowrap w-10/12"> {{
                                                dataIq?.dataCitacita[2]?.dataGolongan?.citacita_2 }}
                                            </td>
                                        </tr> -->


                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="md:col-span-2">
                            <Form v-slot="{ errors }" @submit="onSubmit">
                                <div class="shadow rounded-lg p-6 bg-base-100 space-y-6">

                                    <!-- Bagian Kesimpulan -->
                                    <div class="space-y-2">
                                        <h3 class="font-semibold text-lg border-b pb-1">Tambahan Kesimpulan</h3>
                                        <label class="form-control">
                                            <span class="label-text mb-1">Untuk semua jenjang</span>
                                            <textarea v-model="dataForm.kesimpulan_saran_tambahan"
                                                class="textarea textarea-bordered h-28 w-full"
                                                placeholder="Tambahkan kesimpulan umum di sini..."></textarea>
                                        </label>
                                    </div>


                                    <!-- Bagian Kelas 9 & 10 -->
                                    <div class="space-y-4">
                                        <h3 class="font-semibold text-lg border-b pb-1">Kelas 9 & 10</h3>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label class="form-control w-full">
                                                <span class="label-text mb-1">Studi 1</span>
                                                <Field v-model="dataForm.studi_1" name="studi_1" type="text"
                                                    class="input input-bordered w-full" placeholder="contoh: SMA" />
                                            </label>

                                            <label class="form-control w-full md:col-span-2">
                                                <span class="label-text mb-1">Jurusan 1</span>
                                                <textarea v-model="dataForm.jurusan_1"
                                                    class="textarea textarea-bordered h-24 w-full"
                                                    placeholder="contoh : IPA/IPS"></textarea>
                                            </label>

                                            <label class="form-control w-full">
                                                <span class="label-text mb-1">Studi 2</span>
                                                <Field v-model="dataForm.studi_2" name="studi_2" type="text"
                                                    class="input input-bordered w-full" placeholder="contoh: SMK" />
                                            </label>

                                            <label class="form-control w-full md:col-span-2">
                                                <span class="label-text mb-1">Jurusan 2</span>
                                                <textarea v-model="dataForm.jurusan_2" ref="textareaRef"
                                                    @input="autoResize" class="textarea textarea-bordered w-full"
                                                    placeholder="contoh : Teknik Pemesinan, Teknik Otomotif, Teknologi Industri, "></textarea>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Bagian Kelas 9 & 10 -->
                                    <div class="space-y-4">
                                        <h3 class="font-semibold text-lg border-b pb-1">Kelas 9 & 10 // BELUM DIGUNAKAN
                                        </h3>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label class="form-control w-full">
                                                <span class="label-text mb-1">Studi 1 </span>
                                                <Field v-model="dataForm.studi_1_baru" name="studi_1_baru" type="text"
                                                    class="input input-bordered w-full" placeholder="contoh: SMA" />
                                            </label>

                                            <label class="form-control w-full md:col-span-2">
                                                <span class="label-text mb-1">Jurusan 1</span>
                                                <textarea v-model="dataForm.jurusan_1_baru"
                                                    class="textarea textarea-bordered h-24 w-full"
                                                    placeholder="contoh : IPA/IPS"></textarea>
                                            </label>

                                            <label class="form-control w-full">
                                                <span class="label-text mb-1">Studi 2</span>
                                                <Field v-model="dataForm.studi_2_baru" name="studi_2_baru" type="text"
                                                    class="input input-bordered w-full" placeholder="contoh: SMK" />
                                            </label>

                                            <label class="form-control w-full md:col-span-2">
                                                <span class="label-text mb-1">Jurusan 2</span>
                                                <textarea v-model="dataForm.jurusan_2_baru"
                                                    class="textarea textarea-bordered w-full"
                                                    placeholder="contoh : Teknik Pemesinan, Teknik Otomotif, Teknologi Industri, "></textarea>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Bagian Kelas 11 & 12 -->
                                    <div class="space-y-4">
                                        <h3 class="font-semibold text-lg border-b pb-1">Kelas 11 & 12 (Cetak V5)</h3>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label class="form-control w-full">
                                                <span class="label-text mb-1">Fakultas</span>
                                                <Field v-model="dataForm.fakultas_1112" name="fakultas_1112" type="text"
                                                    class="input input-bordered w-full"
                                                    placeholder="contoh: fakultas 11,12" />
                                            </label>

                                            <label class="form-control w-full md:col-span-2">
                                                <span class="label-text mb-1">Mata Pelajaran</span>
                                                <textarea v-model="dataForm.fakultas_1112_mapel"
                                                    class="textarea textarea-bordered h-24 w-full"
                                                    placeholder="mapel untuk tipe kelas 11,12"></textarea>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Tombol -->
                                    <div class="flex justify-end gap-3 pt-6 border-t">
                                        <button type="button" class="btn btn-secondary"
                                            @click="router.go(-1)">Batal</button>
                                        <button class="btn btn-primary" type="submit">Simpan</button>
                                    </div>

                                </div>
                            </Form>
                        </div>


                    </div>
                </div>
            </div>
            <div v-if="siswa" class="2xl:grid 2xl:grid-cols-2">
                <div class="grid-cols-1 2xl:grid-cols-2 border-r-2">
                    <div class="   md:col-span-2">
                        <div class="w-full text-center">
                            <h2 class="font-bold text-md  uppercase"> Aspek IST</h2>
                        </div>
                        <table class="table table-compact" v-if="dataKelas.length > 0">
                            <tbody>

                                <tr v-for="(item, index) in dataAspek_ist" :key="item.id">
                                    <td class="whitespace-nowrap w-1/12">{{ index + 1 }}. {{ item.detail }} ({{
                                        item.kode
                                        }})</td>
                                    <td class="whitespace-nowrap w-1/12">:</td>
                                    <td class="whitespace-nowrap w-10/12"> {{ item.persen }} % - {{
                                        fn_singkatkan_ket(item.ket)
                                        }} - iq = {{ item.val }}
                                    </td>
                                </tr>


                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="grid-cols-1 2xl:grid-cols-2 border-r-2">

                    <div class="grid-cols-1   md:col-span-2">
                        <div class="w-full text-center">
                            <h2 class="font-bold text-md  uppercase"> Aspek 8KM</h2>
                        </div>
                        <table class="table table-compact" v-if="dataKelas.length > 0">
                            <tbody>
                                <tr v-for="(item, index) in dataAspek_8km" :key="item.id">
                                    <td class="whitespace-nowrap w-1/12">{{ index + 1 }}. {{ item.nama_lengkap }} ({{
                                        item.nama
                                        }})</td>
                                    <td class="whitespace-nowrap w-1/12">:</td>
                                    <td class="whitespace-nowrap w-10/12"> {{ item.persen }} % - {{

                                        fn_settings_range_8km(
                                            dataLengkap?.data_8km?.umur,
                                            item.nama,
                                            item.persen
                                        )?.singkatan

                                    }} - iq = {{ item.iq }}
                                        <!-- - nilai = {{ item.nilai }} -->
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="grid-cols-1 xl:grid-cols-2 ">
                    <div class="w-full text-center">
                        <h2 class="font-bold text-md  uppercase">Isian Siswa</h2>
                    </div>
                    <table class="table table-compact" v-if="dataKelas.length > 0">
                        <tbody>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">Cita cita 1</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.citacita_1
                                    || dataIq?.data_8km?.citacita_1 }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">Cita cita 2</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.citacita_2
                                    || dataIq?.data_8km?.citacita_2 }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">Cita cita 3</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.citacita_3
                                    || dataIq?.data_8km?.citacita_3 }}
                                </td>
                            </tr>

                            <tr>
                                <td class="whitespace-nowrap w-1/12">pertimbangan studi</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.pertimbangan_studi }}
                                </td>
                            </tr>


                            <tr>
                                <td class="whitespace-nowrap w-1/12">pertimbangan jurusan</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.pertimbangan_jurusan }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">pertimbangan jurusan diinginkan 1</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.pertimbangan_jurusan_diinginkan_1 }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">pertimbangan jurusan diinginkan 2</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.pertimbangan_jurusan_diinginkan_2 }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">pertimbangan jurusan diinginkan 3</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.pertimbangan_jurusan_diinginkan_3 }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">fakultas 1</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.fakultas_1 }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">prodi 1</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.prodi_1 }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">fakultas 2</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.fakultas_2 }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">prodi 2</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.prodi_2 }}
                                </td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap w-1/12">kedinasan</td>
                                <td class="whitespace-nowrap w-1/12">:</td>
                                <td class="whitespace-nowrap w-10/12"> {{
                                    dataIq?.dataCitacita?.dataGolongan?.kedinasan }}
                                </td>
                            </tr>


                        </tbody>
                    </table>
                </div>
            </div>

        </span>
    </div>
</template>