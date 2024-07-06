<script setup>
import { reactive, onMounted, ref, watch, computed } from "vue";
import Api from "@/axios/axios";
import ApiIst from "@/axios/axiosIst";
import Toast from "@/components/lib/Toast";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import { fn_removeLeadingPipeAndSpaces } from "@/lib/FungsiBasic.js"

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
        A: 'No',
        B: 'B',
        C: 'C',
        D: 'D',
        E: 'E',
        F: 'F',
        G: 'G',
        H: 'H',
        I: 'I',
        J: 'J',
        K: 'K',
        L: 'L',
        M: 'M',
        N: 'N',
        O: 'O',
        P: 'P',
        Q: 'Q',
        R: 'R',
        S: 'S',
        T: 'T',
        U: 'U',
        V: 'V',
        W: 'W',
        X: 'X',
        Y: 'Y',
        Z: 'Z',
        AA: 'AA',
        AB: 'AB',
        AC: 'AC',
        AD: 'AD',
        AE: 'AE',
        AF: 'AF',
        AG: 'AG',
        AH: 'AH',
        AI: 'AI',
        AJ: 'AJ',
        AK: 'AK',
        AL: 'AL',
        AM: 'AM',
        AN: 'AN',
        AO: 'AO',
        AP: 'AP',
        AQ: 'AQ',
        AR: 'AR',
        AS: 'AS',
        AT: 'AT',
        AU: 'AU',
        AV: 'AV',
        AW: 'AW',
        AX: 'AX',
        AY: 'AY',
        AZ: 'AZ',

        BA: 'BA',
        BB: 'BB',
        BC: 'BC',
        BD: 'BD',
        BE: 'BE',
        BF: 'BF',
        BG: 'BG',
        BH: 'BH',
        BI: 'BI',
        BJ: 'BJ',
        BK: 'BK',
        BL: 'BL',
        BM: 'BM',
        BN: 'BN',
        BO: 'BO',
        BP: 'BP',
        BQ: 'BQ',
        BR: 'BR',
        BS: 'BS',
        BT: 'BT',
        BU: 'BU',
        BV: 'BV',
        BW: 'BW',
        BX: 'BX',
        BY: 'BY',
        BZ: 'BZ',

        CA: 'CA',
        CB: 'CB',
        CC: 'CC',
        CD: 'CD',
        CE: 'CE',
        CF: 'CF',
        CG: 'CG',
        CH: 'CH',
        CI: 'CI',
        CJ: 'CJ',
        CK: 'CK',
        CL: 'CL',
        CM: 'CM',

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
        label: "#1#2",
        field: "B",
        type: "String",
    },
    {
        label: "#1#3",
        field: "C",
        type: "String",
    },
    {
        label: "CM",
        field: "CM",
        type: "String",
    },
];

const doStore = async () => {
    // console.log(dataExcel.value);
    // console.log(dataExcel.value);
    let dataAsli = dataExcel.value;
    let dataImport = [];
    for (let i = 0; i < dataAsli.length; i++) {
        let Element = dataAsli[i].CM;
        if (Element) {
            dataImport.push(fn_removeLeadingPipeAndSpaces(Element));
        }
    }
    console.log("CM", dataImport);
}

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

const changedValue = (value) => {
    dataDetail.value.kelas_id = null;
    if (dataDetail.value.sekolah_id) {
        getDataKelas(dataDetail.value.sekolah_id);
    } else {
        pilihKelas.value = [];
    }
};

const doApply = (sekolah, kelas) => {
    console.log(sekolah, kelas);
    Toast.babeng("Info", `sekolah ${sekolah} , kelas ${kelas}`)
    sekolah_id.value = sekolah;
    kelas_id.value = kelas
}


</script>
<template>
    <div class="px-2">
        <article class="prose lg:prose-sm">
            <h1>IMPORT DATA CFIT RUMUS POHON GENERATOR</h1>
        </article>
        <!-- <div>
            <RouterLink
                :to="{ name: 'admin-sekolah-submenu-ist-import-migration', params: { sekolah_id: 0, kelas_id: 0 } }">
                <button class="btn btn-sm ">
                    Migrasi</button>
            </RouterLink>
        </div> -->

        <!-- <div>
            <div class="pt-0 px-0">
                <div class="w-full mx-0 lg:w-10/12">
                    <div class="bg-white rounded-lg p-0 sm:p-6 xl:p-0">
                        <div class="grid md:grid-cols-2 gap-2">
                            <div>
                                <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Pilih Sekolah
                                </label>
                                <select class="select select-info w-full max-w-xs" v-model="dataDetail.sekolah_id"
                                    @change="changedValue" @selected="changedLabel">
                                    <option selected :value="null">
                                        NULL
                                    </option>
                                    <option v-for="(item, index) in pilihSekolah" :value="item.id">
                                        {{ item.label }}
                                    </option>
                                </select>

                            </div>

                            <div>
                                <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Pilih Kelas
                                </label>
                                <select class="select select-info w-full max-w-xs" v-model="dataDetail.kelas_id">
                                    <option selected :value="null">
                                        NULL
                                    </option>
                                    <option v-for="(item, index) in pilihKelas" :value="item.id">
                                        {{ item.label }}
                                    </option>
                                </select>

                            </div>
                        </div>

                        <div class="w-full flex justify-end mt-4 px-20">
                            <button class="btn btn-active btn-lg btn-primary"
                                @click="doApply(dataDetail.sekolah_id, dataDetail.kelas_id)">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
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
        <!-- <div>
            <span>
                <p class="text-xs font-semibold text-red-600">- Jika Nama , Nomer Induk dan Kelas Sama maka data JK dan
                    tgl lahir akan di update</p>
                <p class="text-xs font-semibold text-red-600">- Jika tgllahir diisi maka field Umur tidak digunakan
                    (otomatis Menghitung dari tgl lahir)</p>

                <p class="text-xs font-semibold text-red-600">- Kosongkan field tgl lahir jika menggunakan field umur
                </p>
            </span>
        </div> -->
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