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
        B: 'kelas',
        C: 'no_induk',
        D: 'nama',
        E: 'jk',
        F: 'umur',
        G: 'wa',
        H: 'an',
        I: 'ra',
        J: 'zr',
        K: 'fa',
        L: 'wu',
        M: 'se',
        N: 'me',
        O: 'ge',
        P: 'mb_ou',
        Q: 'mb_me',
        R: 'mb_co',
        S: 'mb_sc',
        T: 'mb_pc',
        U: 'mb_as',
        V: 'mb_li',
        W: 'mb_mu',
        X: 'mb_ss',
        Y: 'mb_cl',
        Z: 'mb_pr',
        AA: 'mb_md',
        AB: 'hspq_a',
        AC: 'hspq_c',
        AD: 'hspq_d',
        AE: 'hspq_e',
        AF: 'hspq_f',
        AG: 'hspq_g',
        AH: 'hspq_h',
        AI: 'hspq_i',
        AJ: 'hspq_j',
        AK: 'hspq_o',
        AL: 'hspq_q2',
        AM: 'hspq_q3',
        AN: 'hspq_q4',
        AO: 'ist_8km_ks_3',
        AP: 'ist_8km_km',
        AQ: 'ist_8km_kk',
        AR: 'ist_8km_ki',
        AS: 'ist_8km_ka',
        AT: 'ist_8km_kn',
        AU: 'ist_8km_kr',
    };

    var rowData = [];

    // start at the 2nd row - the first row are the headers
    var rowIndex = 2;

    // iterate over the worksheet pulling out the columns we're expecting
    while (worksheet['A' + rowIndex]) {
        var row = {};
        Object.keys(columns).forEach(function (column) {
            row[columns[column]] = worksheet[column + rowIndex]?.w;
        });

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
        label: "Nama",
        field: "nama",
        type: "String",
    },
    {
        label: "wa",
        field: "wa",
        type: "Number",
    },
    {
        label: "an",
        field: "an",
        type: "Number",
    },
    {
        label: "ra",
        field: "ra",
        type: "Number",
    },
    {
        label: "zr",
        field: "zr",
        type: "Number",
    },
    {
        label: "fa",
        field: "fa",
        type: "Number",
    },
    {
        label: "wu",
        field: "wu",
        type: "Number",
    },
    {
        label: "se",
        field: "se",
        type: "Number",
    },
    {
        label: "me",
        field: "me",
        type: "Number",
    },
    {
        label: "ge",
        field: "ge",
        type: "Number",
    },
    {
        label: "siswa_id",
        field: "siswa_id",
        type: "Number",
    },
    {
        label: "mb_ou",
        field: "mb_ou",
        type: "Number",
    },
    {
        label: "mb_me",
        field: "mb_me",
        type: "Number",
    },
    {
        label: "mb_co",
        field: "mb_co",
        type: "Number",
    },
    {
        label: "mb_sc",
        field: "mb_sc",
        type: "Number",
    },
    {
        label: "mb_pc",
        field: "mb_pc",
        type: "Number",
    },
    {
        label: "mb_as",
        field: "mb_as",
        type: "Number",
    },
    {
        label: "mb_li",
        field: "mb_li",
        type: "Number",
    },
    {
        label: "mb_mu",
        field: "mb_mu",
        type: "Number",
    },
    {
        label: "mb_ss",
        field: "mb_ss",
        type: "Number",
    },
    {
        label: "mb_cl",
        field: "mb_cl",
        type: "Number",
    },
    {
        label: "mb_pr",
        field: "mb_pr",
        type: "Number",
    },
    {
        label: "mb_md",
        field: "mb_md",
        type: "Number",
    },
    {
        label: "hspq_a",
        field: "hspq_a",
        type: "Number",
    },
    {
        label: "hspq_c",
        field: "hspq_c",
        type: "Number",
    },
    {
        label: "hspq_d",
        field: "hspq_d",
        type: "Number",
    },
    {
        label: "hspq_e",
        field: "hspq_e",
        type: "Number",
    },
    {
        label: "hspq_f",
        field: "hspq_f",
        type: "Number",
    },
    {
        label: "hspq_g",
        field: "hspq_g",
        type: "Number",
    },
    {
        label: "hspq_h",
        field: "hspq_h",
        type: "Number",
    },
    {
        label: "hspq_i",
        field: "hspq_i",
        type: "Number",
    },
    {
        label: "hspq_j",
        field: "hspq_j",
        type: "Number",
    },
    {
        label: "hspq_o",
        field: "hspq_o",
        type: "Number",
    },
    {
        label: "hspq_q2",
        field: "hspq_q2",
        type: "Number",
    },
    {
        label: "hspq_q3",
        field: "hspq_q3",
        type: "Number",
    },
    {
        label: "hspq_q4",
        field: "hspq_q4",
        type: "Number",
    },
    {
        label: "ist_8km_ks_3",
        field: "ist_8km_ks_3",
        type: "Number",
    },
    {
        label: "ist_8km_km",
        field: "ist_8km_km",
        type: "Number",
    },
    {
        label: "ist_8km_kk",
        field: "ist_8km_kk",
        type: "Number",
    },
    {
        label: "ist_8km_kl",
        field: "ist_8km_kl",
        type: "Number",
    },
    {
        label: "ist_8km_ka",
        field: "ist_8km_ka",
        type: "Number",
    },
    {
        label: "ist_8km_kn",
        field: "ist_8km_kn",
        type: "Number",
    },
    {
        label: "ist_8km_kr",
        field: "ist_8km_kr",
        type: "Number",
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

// get Sekolah
const getDataSekolah = async () => {
    try {
        const response = await Api.get(`owner/sekolah`);
        // console.log(response);
        dataSekolah.value = response.data;
        dataSekolah.value.forEach((item) => {
            pilihSekolah.value.push({
                label: item.nama,
                id: item.id,
            });
        });
        return response;
    } catch (error) {
        Toast.danger("Warning", "Data Gagal dimuat");
        console.error(error);
    }
};
getDataSekolah();
// get Kelas
const getDataKelas = async (sekolah_id) => {
    try {
        pilihKelas.value = [];
        const response = await Api.get(`owner/datasekolah/${sekolah_id}/kelas`);
        // console.log(response);
        dataKelas.value = response.data;
        dataKelas.value.forEach((item) => {
            pilihKelas.value.push({
                label: item.nama,
                id: item.id,
            });
        });
        return response;
    } catch (error) {
        Toast.danger("Warning", "Data Gagal dimuat");
        console.error(error);
    }
};
// getDataKelas(idTemp.value);

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


const doStore = async () => {
    if (sekolah_id.value) {

        const dataForm = {
            sekolah_id: sekolah_id.value,
            kelas_id: kelas_id.value,
            data: dataExcel.value
        }
        console.log(dataForm);
        try {
            const response = await ApiIst.post(
                `ist/import`,
                dataForm
            );
            // dataExcel.value = []
            // console.log(response.data);
            if (response.data) {
                dataExcel.value = response.data;
            }

        } catch (error) {
            // Toast.danger("Warning", "Data gagal ditambahkan!");
            console.error(error);
        }
    } else {
        Toast.danger("Pilih sekolah terlebih dahulu!")
    }
}
</script>
<template>
    <div class="px-2">
        <article class="prose lg:prose-sm">
            <h1>IMPORT DATA IST</h1>
        </article>
        <div>
            <RouterLink
                :to="{ name: 'admin-sekolah-submenu-ist-import-migration', params: { sekolah_id: 0, kelas_id: 0 } }">
                <button class="btn btn-sm ">
                    Migrasi</button>
            </RouterLink>
        </div>

        <div>
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
        </div>
        <div class="space-x-2">
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