<script setup>
import { ref, defineAsyncComponent } from "vue"
import Api from "@/axios/axiosNode";
import Toast from "@/components/lib/Toast";
import { useRoute, useRouter } from "vue-router";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import RadialProgressBar from "vue3-radial-progress";
import { v4 as uuidv4 } from "uuid";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
// import { XLSX } from "xlsx-style"

moment.updateLocale("id", localization);
const route = useRoute();
const aspek_detail_id = ref(route.params.aspek_detail_id)
const file = ref(null);
const fileExcel = ref(null);
const fileExcelLink = ref(null);
const dataExcel = ref([]);
const onChangefileUpload = (e) => {
    file.value = e.target.files[0];
    fileExcel.value = file.value;
    fileExcelLink.value = URL.createObjectURL(file.value);
    // console.log(file.value, fileExcelLink.value);
    importExcelFile();

};

const completedSteps = ref(0);
const totalSteps = ref(0);
const prosesBerhasil = ref(0);
const prosesGagal = ref(0);

const dataBelumDiGenerate = ref(0);
const dataSudahDiGenerate = ref(0);
const dataAll = ref(0);
const token_import = ref(uuidv4());

const fnReset = (tipe = "baru") => {
    completedSteps.value = 0;
    prosesBerhasil.value = 0;
    prosesGagal.value = 0;
    dataExcel.value = [];
    totalSteps.value = dataExcel.value.length;
    //   if (tipe == "baru") {
    //     totalSteps.value = data.value.length;
    //   } else {
    //     totalSteps.value = data.value.length;
    //   }
};
const fnAlertFinish = () => {
    if (totalSteps.value == completedSteps.value) {
        Toast.babeng("Info", `Proses Selesai!`);
    }
};
const fnPeriksaTotalBelumAda = () => {
    let sudahAda = dataExcel.value.filter(e => e.status === "Sudah Ada" || e.status === "Tersimpan");
    prosesBerhasil.value = sudahAda.length;
    completedSteps.value = sudahAda.length;
}

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
        label: "kode_soal",
        field: "kode_soal",
        type: "String",
    },
    {
        label: "Pertanyaan",
        field: "pertanyaan",
        type: "String",
    },
    {
        label: "Status Simpan",
        field: "status",
        type: "String",
    },
];


// XMLHttpRequest in promise format
function makeRequest(method, url, success, error) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', url, true);
    httpRequest.responseType = 'arraybuffer';

    httpRequest.open(method, url);
    httpRequest.onload = function () {
        success(httpRequest.response);
    };
    httpRequest.onerror = function () {
        error(httpRequest.response);
    };
    httpRequest.send();
}

// read the raw data and convert it to a XLSX workbook
function convertDataToWorkbook(dataRows) {
    /* convert data to binary string */
    var data = new Uint8Array(dataRows);
    var arr = [];

    for (var i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
    }

    var bstr = arr.join('');

    return XLSX.read(bstr, { type: 'binary' });
}

// pull out the values we're after, converting it into an array of rowData

function populateGrid(workbook) {
    // our data is in the first sheet
    var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];

    // we expect the following columns to be present
    var columns = {
        D: 'kode_soal',
        B: 'pertanyaan',
        E: 'kode',
        F: 'nomer_urut',
        G: 'desc',
        // pilihanjawaban
        H: 'pilihan_1_kode_jawaban',
        I: 'pilihan_1_skor',
        J: 'pilihan_1_jawaban',

        L: 'pilihan_2_kode_jawaban',
        M: 'pilihan_2_skor',
        N: 'pilihan_2_jawaban',

        P: 'pilihan_3_kode_jawaban',
        Q: 'pilihan_3_skor',
        R: 'pilihan_3_jawaban',

        T: 'pilihan_4_kode_jawaban',
        U: 'pilihan_4_skor',
        V: 'pilihan_4_jawaban',

        X: 'pilihan_5_kode_jawaban',
        Y: 'pilihan_5_skor',
        Z: 'pilihan_5_jawaban',

        AB: 'pilihan_6_kode_jawaban',
        AC: 'pilihan_6_skor',
        AD: 'pilihan_6_jawaban',
    };

    var rowData = [];

    // start at the 2nd row - the first row are the headers
    var rowIndex = 2;

    // iterate over the worksheet pulling out the columns we're expecting
    while (worksheet['A' + rowIndex]) {
        var row = {};
        Object.keys(columns).forEach(function (column) {
            // console.log(column);
            row[columns[column]] = worksheet[column + rowIndex] ? worksheet[column + rowIndex].w : null;
        });
        row.pilihanJawaban = [];
        if (row.pilihan_1_kode_jawaban) {
            let tempPilihanjawaban = {
                jawaban: row?.pilihan_1_jawaban || null,
                skor: row?.pilihan_1_skor || 0.
            }
            row.pilihanJawaban.push(tempPilihanjawaban);
        }
        if (row.pilihan_2_kode_jawaban) {
            let tempPilihanjawaban = {
                jawaban: row?.pilihan_2_jawaban || null,
                skor: row?.pilihan_2_skor || 0.
            }
            row.pilihanJawaban.push(tempPilihanjawaban);
        }
        if (row.pilihan_3_kode_jawaban) {
            let tempPilihanjawaban = {
                jawaban: row?.pilihan_3_jawaban || null,
                skor: row?.pilihan_3_skor || 0.
            }
            row.pilihanJawaban.push(tempPilihanjawaban);
        }
        if (row.pilihan_4_kode_jawaban) {
            let tempPilihanjawaban = {
                jawaban: row?.pilihan_4_jawaban || null,
                skor: row?.pilihan_4_skor || 0.
            }
            row.pilihanJawaban.push(tempPilihanjawaban);
        }
        if (row.pilihan_5_kode_jawaban) {
            let tempPilihanjawaban = {
                jawaban: row?.pilihan_5_jawaban || null,
                skor: row?.pilihan_5_skor || 0.
            }
            row.pilihanJawaban.push(tempPilihanjawaban);
        }
        if (row.pilihan_6_kode_jawaban) {
            let tempPilihanjawaban = {
                jawaban: row?.pilihan_6_jawaban || null,
                skor: row?.pilihan_6_skor || 0.
            }
            row.pilihanJawaban.push(tempPilihanjawaban);
        }

        rowData.push(row);

        rowIndex++;
    }

    // finally, set the imported rowData into the grid
    // gridOptions.api.setRowData(rowData);
    // console.log('====================================');
    // console.log(rowData);
    // console.log('====================================');
    dataExcel.value = rowData;
    totalSteps.value = dataExcel.value.length;
}
const importExcelFile = () => {
    // console.log('====================================');
    // console.log(fileExcelLink.value);
    // console.log('====================================');
    makeRequest(
        'GET',
        fileExcelLink.value,
        // success
        function (data) {
            // console.log('====================================');
            // console.log(data);
            // console.log('====================================');
            var workbook = convertDataToWorkbook(data);

            populateGrid(workbook);
        },
        // error
        function (error) {
            throw error;
        }
    );
}

const doDelete = (index, kode_soal) => {
    if (dataExcel.value[index].status == 'Baru') {
        prosesBerhasil.value--;
        completedSteps.value--;
    } else if (dataExcel.value[index].status == 'Sudah Ada') {
        prosesGagal.value--;
        completedSteps.value--;
    }

    // console.log(index, username);
    // let a = dataExcel.value,
    //     b = a.filter(e => e.name === "tc_001");
    // b.forEach(f => a.splice(a.findIndex(e => e.name === f.name), 1));
    // console.log(a);
    let result = dataExcel.value.filter(e => e.kode_soal != kode_soal);
    dataExcel.value = result;
    totalSteps.value = dataExcel.value.length;
    // console.log(result);
}

const doPeriksaPerSoal = async (index, kode_soal) => {
    try {
        const response = await Api.get(`ujianstudi/banksoal/aspek_detail/${aspek_detail_id.value}/import/periksa/${kode_soal}`);
        // console.log('====================================');
        // console.log(response);
        // console.log('====================================');
        if (response.data) {
            dataExcel.value[index].status = "Sudah Ada";
        } else {
            dataExcel.value[index].status = "Belum Ada";
        }
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const doPeriksaAll = async () => {
    for (const [index, item] of dataExcel.value.entries()) {
        doPeriksaPerSoal(index, item.kode_soal);
    }
}

const doSimpanPerSoal = async (index, kode_soal) => {
    try {
        if (dataExcel.value[index].status === "Belum Ada") {
            let dataFormSend = {
                studi_v2_banksoal_aspek_detail_id: aspek_detail_id.value,
                kode_soal: dataExcel.value[index].kode_soal,
                pertanyaan: dataExcel.value[index].pertanyaan,
                kode: dataExcel.value[index].kode,
                nomer_urut: dataExcel.value[index].nomer_urut,
                desc: dataExcel.value[index].desc,
                pilihanJawaban: dataExcel.value[index].pilihanJawaban,
            }
            // console.log('====================================');
            // console.log(dataFormSend, dataExcel.value[index]);
            // console.log('====================================');

            const response = await Api.post(
                `ujianstudi/banksoal/aspek_detail/${aspek_detail_id.value}/soal`,
                dataFormSend
            );
            console.log(response);
            dataExcel.value[index].status = "Tersimpan",
                Toast.babeng("Info", "Data berhasil disimpan")
        } else if (dataExcel.value[index].status === "Sudah Ada" || dataExcel.value[index].status === "Tersimpan") {
            Toast.danger(`Gagal `, `${kode_soal} : Data Sudah Ada!`)
        }
        else {
            Toast.danger(`Gagal `, `${kode_soal} : Belum diperiksa!`)
        }
        fnPeriksaTotalBelumAda();
    } catch (error) {
        console.error(error);
    }
}

const doSimpanAll = async () => {
    for (const [index, item] of dataExcel.value.entries()) {
        doSimpanPerSoal(index, item.kode_soal);
    }
}
</script>
<template>
    <div>
        <div>
            random code : <code>{{ token_import }}</code>
        </div>
        <div class="space-x-2">
            <input name="fileUpload" @change="onChangefileUpload($event)" type="file"
                class="file-input file-input-bordered file-input-info w-full max-w-xs" />
            <button @click="doPeriksaAll()" class="btn btn-sm btn-info">
                PERIKSA SEMUA
            </button>
            <button @click="doSimpanAll()" class="btn btn-sm btn-success">
                SIMPAN DATA BARU
            </button>
            <button @click="fnReset()" class="btn btn-sm btn-secondary">
                Reset
            </button>
        </div>

        <div class="w-full flex flex-wrap justify-center">
            <div class="w-1/2 flex justify-center gap-10">
                <div>
                    <radial-progress-bar :diameter="200" :completed-steps="completedSteps" :total-steps="totalSteps"
                        :start-color="'#0500ff'" :stop-color="'#00b7ff'">
                        <h2 class="font-bold text-2xl">
                            {{ completedSteps }} / {{ totalSteps }}
                        </h2>
                        <!-- Your inner content here -->
                    </radial-progress-bar>
                </div>
                <div>
                    <div class="py-4 font-bold">
                        <h1>Proses Stats :</h1>
                        <h4># Total Steps : {{ totalSteps }}</h4>
                        <h4># Completed Steps :{{ completedSteps }}</h4>
                        <h4># Proses Berhasil : {{ prosesBerhasil }}</h4>
                        <h4># Proses Gagal :{{ prosesGagal }}</h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="md:py-2 lg:flex flex-wrap gap-4">
            <div class="w-full lg:w-full">
                <div class="bg-white shadow rounded-lg px-4 py-4">
                    <div v-if="dataExcel">
                        <vue-good-table :line-numbers="true" :columns="columns" :rows="dataExcel" :search-options="{
                            enabled: true,
                        }" :pagination-options="{
    enabled: true,
    perPageDropdown: [100, 200, 500],
}" styleClass="vgt-table striped bordered condensed" class="py-0">
                            <template #table-row="props">
                                <span v-if="props.column.field == 'actions'">
                                    <div class="text-sm font-medium text-center flex justify-center space-x-1">

                                        <button class="btn btn-sm btn-info" @click="
                                            doPeriksaPerSoal(props.index, props.row.kode_soal)
                                        ">
                                            Periksa
                                        </button>
                                        <button class="btn btn-sm btn-primary" @click="
                                            doSimpanPerSoal(props.index, props.row.kode_soal)
                                        ">
                                            Simpan
                                        </button>
                                        <button class="btn btn-sm btn-warning" @click="
                                            doDelete(props.index, props.row.kode_soal)
                                        ">
                                            Delete
                                        </button>
                                    </div>
                                </span>

                                <span v-else-if="props.column.field == 'tgl_import'">
                                    <div class="text-center">
                                        {{
                                            props.row.tgl_import ? moment(props.row.tgl_import).format("DD MMMM YYYY") : null
                                        }}
                                    </div>
                                </span>
                                <span v-else-if="props.column.field == 'data_sertifikat'">
                                    <div class="text-center">
                                        {{
                                            props.row.data_sertifikat ? 'Ada' : "-"
                                        }}
                                        <button class="btn btn-sm btn-info" @click="fnPeriksaDataSertifikat(props.index)"
                                            v-if="props.row.data_sertifikat">Periksa</button>
                                    </div>
                                </span>
                                <span v-else-if="props.column.field == 'data_deteksi'">
                                    <div class="text-center">
                                        {{
                                            props.row.data_deteksi ? "Ada" : "-"
                                        }}
                                        <button class="btn btn-sm btn-info" @click="fnPeriksaDataDeteksi(props.index)"
                                            v-if="props.row.data_deteksi">Periksa</button>
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
    </div>
</template>