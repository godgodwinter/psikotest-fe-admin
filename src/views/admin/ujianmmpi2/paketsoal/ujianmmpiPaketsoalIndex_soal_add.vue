<script setup>
import { ref } from "vue"
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import { fn_copy_id_for_mongo } from "@/lib/FungsiBasic.js"
import Toast from "@/components/lib/Toast";
import { Form, Field } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import fnValidasi from "@/components/lib/babengValidasi";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

const router = useRouter();
const route = useRoute();
const paketsoal_id = ref(route.params.paketsoal_id)
const aspek_detail_id = ref(route.params.aspek_detail_id)
const banksoal_aspek_detail_id = ref(route.params.banksoal_aspek_detail_id)
// const banksoal_aspek_detail_id = route.params.banksoal_aspek_detail_id

const dataAsli = ref([]);
const data = ref([]);
const aspek = ref([]);
const dataForm = ref({});

const columns = [
    {
        label: "Pertanyaan",
        field: "pertanyaan",
        type: "String",
    },
    // {
    //     label: "Jumlah Pilihan Jawaban",
    //     field: "pilihanjawaban_jml",
    //     type: "Number",
    // },
    // {
    //     label: "Jumlah Pilihan Jawaban Benar",
    //     field: "pilihanjawaban_jml_benar",
    //     type: "Number",
    // },
    {
        label: "Jumlah Pilihan jawaban",
        field: "jml_pilihanjawaban",
        type: "Number",
    },
    {
        label: "jawaban benar",
        field: "jml_jawaban_benar",
        type: "Number",
    },
    {
        label: "KODE",
        field: "no",
        type: "String",
    },
];

const hitungJumlahSkorPositif = (pilihanJawaban) => {
    // console.log('====================================');
    // console.log(pilihanJawaban);
    // console.log('====================================');
    let result = 0;
    for (const [index, item] of pilihanJawaban.entries()) {
        if (item.skor > 0) {
            result++;
        }
    }
    return result;
};

const getData = async () => {
    try {
        const response = await ApiUjianKhusus.get(`mmpi/banksoal/mmpi2`);
        const tempData = response.data;
        data.value = tempData.map(fn_copy_id_for_mongo);
        dataAsli.value = tempData.map(fn_copy_id_for_mongo);
        // data.value = response.data;
        let jml_jawaban_benar
        for (const [index, item] of data.value.entries()) {
            const jumlahSkorPositif = item?.skor_jawaban_benar.length;
            // console.log(jumlahSkorPositif);
            item.jml_jawaban_benar = jumlahSkorPositif;
            // console.log('====================================');
            // console.log(item);
            // console.log('====================================');
        }

        return response.data;
    } catch (error) {
        console.error(error);
    }
};
getData();

// const getDataAspek = async () => {
//     try {
//         const response = await Api.get(`admin/ujian/skolastik/paketsoal/null/aspek/${aspek_id}/getSoaL`);
//         aspek.value = response.aspek;

//         return response.data;
//     } catch (error) {
//         console.error(error);
//     }
// };
// getDataAspek();


const myTable = ref(null);
const rowSelection = ref([]);
const doAdd = async () => {
    // selectionChanged();
    // get id and filter unique
    const dataId = myTable.value.selectedRows.map((item) => item.no);
    // console.log(dataId);
    dataForm.value = { mmpi_soal: dataId };
    console.log('====================================');
    console.log(dataForm.value, "11");
    console.log('====================================');
    // dataForm.value = { listId: dataId };
    // console.log(aspek_id);
    const response = await ApiUjianKhusus.post(`mmpi2/paketsoal/${paketsoal_id.value}/add_soal`, dataForm.value);
    // const response = await ApiPaketsoalKategori.doStoreDataSoal(
    //     kategori_id,
    //     dataId
    // );
    // console.log('====================================');
    // console.log(response.data);
    // console.log('====================================');

    Toast.babeng("Data berhasil ditambahkan", "Berhasil");
    router.push({
        name: "admin-ujianmmpi2-paketsoal-soal",
        params: { paketsoal_id: paketsoal_id.value, },
    });

    // console.log(myTable.value.selectedRows, dataId);
};
const selectionChanged = (selection) => {
    // rowSelection.value = selection;
    console.log(rowSelection.value, selection);
};
const doAddAll = () => {
    // console.log(props);
};
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h3> Pilih Soal yang akan dimasukkan ke dalam paket soal</h3>
            <h5>UJIAN MMPI 2</h5>
        </article>

        <div class="py-2 lg:py-4 px-4">
            <div class="md:py-2 px-4 lg:flex flex-wrap gap-4">
                <div class="w-full lg:w-full">
                    <div class="bg-white shadow rounded-lg px-4 py-4">
                        <div v-if="data">
                            <vue-good-table ref="myTable" theme="polar-bear" :line-numbers="true" compactMode
                                :columns="columns" :rows="data" @on-selected-rows-change="selectionChanged"
                                :select-options="{ enabled: true }" :search-options="{
                                    enabled: true,
                                }" :pagination-options="{
                                    enabled: true,
                                    perPageDropdown: [1000, 1500, 2000],
                                }" styleClass="vgt-table striped bordered condensed" class="py-0">
                                <template #table-actions>
                                    <div class="space-x-1  gap-1"> <span @click="router.go(-1)">
                                            <button class="btn btn-secondary btn-sm tooltip" data-tip="Kembali"><svg
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
                                                </svg>
                                            </button></span>
                                        <button @click="doAdd()" class="btn btn-sm btn-success tooltip"
                                            data-tip="Tambah Terpilih">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </template>
                                <!-- <template #table-actions-bottom>
                                                                                                                  This will show up on the bottom of the table.
                                                                                                                </template> -->
                                <template #table-row="props">
                                    <span v-if="props.column.field == 'actions'">
                                        <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                            <button class="btn btn-sm btn-danger"
                                                @click="doDeleteData(props.row.id, props.index)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </span>

                                    <span v-else-if="props.column.field == 'pertanyaan'"><span
                                            v-html="props.row.pertanyaan"></span>
                                    </span>
                                    <span v-else-if="props.column.field == 'jml_pilihanjawaban'">
                                        <span>{{ props.row.pilihan_jawaban.length }}</span>
                                    </span>
                                    <span v-else-if="props.column.field == 'jml_jawaban_benar'"><span>
                                            {{ props.row.jml_jawaban_benar }}
                                        </span>
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
        </div>
    </div>
</template>