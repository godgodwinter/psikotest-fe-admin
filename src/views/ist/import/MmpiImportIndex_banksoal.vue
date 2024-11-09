<script setup>
import { reactive, onMounted, ref, watch, computed } from "vue";
import Api from "@/axios/axios";
import ApiIst from "@/axios/axiosIst";
import Toast from "@/components/lib/Toast";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";

const VITE_API_TS_IST_BASE_URL_ = import.meta.env.VITE_API_TS_IST_BASE_URL_
    ? import.meta.env.VITE_API_TS_IST_BASE_URL_
    : "http://localhost:11001/";

const VITE_API_TS_IST_SECRET_CODE = import.meta.env.VITE_API_TS_IST_SECRET_CODE
    ? import.meta.env.VITE_API_TS_IST_SECRET_CODE
    : "secret_code";

moment.updateLocale("id", localization);
const linkDeteksi = ref(null);
const linkSertifikat = ref(null);


const dataDetail = ref({
    nama: "",
    nomeridentitas: "",
    alamat: "",
    jk: "",
    kelas_id: "",
    sekolah_id: "",
});


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
        A: 'no',
        B: 'pertanyaan',
        C: 'kunci_jawaban_1',
        D: 'kode_aspek_1',
        E: 'kunci_jawaban_2',
        F: 'kode_aspek_2',
    };

    var rowData = [];

    // start at the 2nd row - the first row are the headers
    var rowIndex = 2;

    // iterate over the worksheet pulling out the columns we're expecting
    while (worksheet['A' + rowIndex]) {
        var row = {};
        let periksaRow = null;
        Object.keys(columns).forEach(function (column) {
            row[columns[column]] = worksheet[column + rowIndex]?.w;
            if (column == 'A' && worksheet[column + rowIndex]?.w) {
                periksaRow = 1;
                // console.log(worksheet[column + rowIndex]?.w, column + rowIndex);
            }
        });

        if (periksaRow) {
            rowData.push(row);
        }

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

const completedSteps = ref(0);
const totalSteps = ref(0);
const prosesBerhasil = ref(0);
const prosesGagal = ref(0);

const dataBelumDiGenerate = ref(0);
const dataSudahDiGenerate = ref(0);
const dataAll = ref(0);

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
        label: "No",
        field: "no",
        type: "String",
    },
    {
        label: "Pertanyaan",
        field: "pertanyaan",
        type: "String",
    },
    {
        label: "status_simpan",
        field: "status_simpan",
        type: "String",
    },
    {
        label: "kunci_jawaban_1",
        field: "kunci_jawaban_1",
        type: "String",
    },
    {
        label: "kode_aspek_1",
        field: "kode_aspek_1",
        type: "String",
    },
    {
        label: "kunci_jawaban_2",
        field: "kunci_jawaban_2",
        type: "String",
    },
    {
        label: "kode_aspek_2",
        field: "kode_aspek_2",
        type: "String",
    },
];

const doDelete = (index, nama) => {
    if (dataExcel.value[index].status == 'Baru') {
        prosesBerhasil.value--;
        completedSteps.value--;
    } else if (dataExcel.value[index].status == 'Sudah Ada') {
        prosesGagal.value--;
        completedSteps.value--;
    }

    let result = dataExcel.value.filter(e => e.nama != nama);
    dataExcel.value = result;
    totalSteps.value = dataExcel.value.length;
    // console.log(result);
}
const kelas_id = ref(null);
const sekolah_id = ref(null);

const id = null;
const idTemp = ref(id);

const dataKelas = ref([]);
const dataSekolah = ref([]);
const pilihKelas = ref([]);
const pilihSekolah = ref([]);


const doStore = async () => {

    const dataForm = {
        data: dataExcel.value
    }
    console.log(`#data:`, dataForm);
    try {
        const response = await ApiIst.post(
            `mmpi/banksoal/mmpi_import_banksoal`,
            dataForm
        );
        // dataExcel.value = []
        console.log(response.data);
        if (response.data) {
            dataExcel.value = response.data;
        }

    } catch (error) {
        // Toast.danger("Warning", "Data gagal ditambahkan!");
        console.error(error);
    }

}
</script>
<template>
    <div class="px-2">
        <article class="prose lg:prose-sm">
            <h1>IMPORT DATA MMPI BANKSOAL</h1>
        </article>
        <!-- <div>
            <RouterLink
                :to="{ name: 'admin-sekolah-submenu-ist-import-migration', params: { sekolah_id: 0, kelas_id: 0 } }">
                <button class="btn btn-sm ">
                    Migrasi</button>
            </RouterLink>
        </div> -->

        <div>

        </div>
        <div class="space-x-2 py-1 space-y-2">
            <input name="fileUpload" @change="onChangefileUpload($event)" type="file"
                class="file-input file-input-bordered file-input-info w-full max-w-xs" />
            <!-- <button @click="doPeriksaDariApiWebUjianLama()" class="btn btn-sm btn-primary">
                PERIKSA DATA
            </button> -->
            <button @click="doStore()" class="btn btn-sm btn-success">
                SIMPAN DATA
            </button>
            <button @click="fnReset()" class="btn btn-sm btn-secondary">
                Reset
            </button>
        </div>
        <div>
            <span>
                <p class="text-xs font-semibold text-red-600">- Jika Nomer sudah ada data maka akan di Update (Replace)
                </p>
                <p class="text-xs font-semibold text-red-600">- Kosongkan Kunci dan Kode aspek jika tidak dibutuhkan
                </p>
            </span>
        </div>
        <!-- <div class="w-full flex flex-wrap justify-center">
            <div class="w-1/2 flex justify-center gap-10">
                <div>
                    <radial-progress-bar :diameter="200" :completed-steps="completedSteps" :total-steps="totalSteps"
                        :start-color="'#0500ff'" :stop-color="'#00b7ff'">
                        <h2 class="font-bold text-2xl">
                            {{ completedSteps }} / {{ totalSteps }}
                        </h2>
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
        </div> -->
        <div class="md:py-2 lg:flex flex-wrap gap-4 ">
            <div class="w-full lg:w-10/12">
                <div class="bg-white shadow rounded-lg px-4 py-4 ">
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
                                        <button class="btn btn-sm btn-warning" @click="
                doDelete(props.index, props.row.nama)
                ">
                                            Delete
                                        </button>
                                    </div>
                                </span>

                                <span v-else-if="props.column.field == 'tgl_import'">
                                    <div class="text-center">
                                        {{
                props.row.tgl_import ? moment(props.row.tgl_import).format("DD MMMM YYYY") :
                    null
            }}
                                    </div>
                                </span>
                                <span v-else-if="props.column.field == 'data_sertifikat'">
                                    <div class="text-center">
                                        {{
                props.row.data_sertifikat ? 'Ada' : "-"
            }}
                                        <button class="btn btn-sm btn-info"
                                            @click="fnPeriksaDataSertifikat(props.index)"
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
                                <!-- <span v-else-if="props.column.field == 'status'">
                                    <div class="text-center" v-if="props.row.username != '' && props.row.username != null">
                                        Sudah
                                    </div>
                                    <div class="text-center" v-else>Belum</div>
                                </span> -->

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