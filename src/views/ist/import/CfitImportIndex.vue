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
        G: 'tgllahir',
        H: 'cfit',
        I: 'sub_1',
        J: 'sub_2',
        K: 'sub_3',
        L: 'sub_4',
        M: 'mb_ou',
        N: 'mb_me',
        O: 'mb_co',
        P: 'mb_sc',
        Q: 'mb_pc',
        R: 'mb_as',
        S: 'mb_li',
        T: 'mb_mu',
        U: 'mb_ss',
        V: 'mb_cl',
        W: 'mb_pr',
        X: 'mb_md',
        Y: 'hspq_a',
        Z: 'hspq_c',
        AA: 'hspq_d',
        AB: 'hspq_e',
        AC: 'hspq_f',
        AD: 'hspq_g',
        AE: 'hspq_h',
        AF: 'hspq_i',
        AG: 'hspq_j',
        AH: 'hspq_o',
        AI: 'hspq_q2',
        AJ: 'hspq_q3',
        AK: 'hspq_q4',
        AL: 'auditif',
        AM: 'visual',
        AN: 'kinestetik',
        AO: 'pohon_1',
        AP: 'pohon_2',
        AQ: 'citacita_1',
        AR: 'citacita_2',
        AS: 'citacita_3',
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
                console.log(worksheet[column + rowIndex]?.w, column + rowIndex);
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
        label: "Nama",
        field: "nama",
        type: "String",
    },
    {
        label: "tgllahir",
        field: "tgllahir",
        type: "String",
    },
    {
        label: "umur",
        field: "umur",
        type: "String",
    },
    {
        label: "cfit",
        field: "cfit",
        type: "Number",
    },
    {
        label: "sub_1",
        field: "sub_1",
        type: "Number",
    },
    {
        label: "sub_2",
        field: "sub_2",
        type: "Number",
    },
    {
        label: "sub_3",
        field: "sub_3",
        type: "Number",
    },
    {
        label: "sub_4",
        field: "sub_4",
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
        label: "auditif",
        field: "auditif",
        type: "Number",
    },
    {
        label: "visual",
        field: "visual",
        type: "Number",
    },
    {
        label: "kinestetik", //visual
        field: "kinestetik",
        type: "Number",
    },
    {
        label: "pohon_1",
        field: "pohon_1",
        type: "Number",
    },
    {
        label: "pohon_2",
        field: "pohon_2",
        type: "Number",
    },
    {
        label: "citacita_1",
        field: "citacita_1",
        type: "String",
    },
    {
        label: "citacita_2",
        field: "citacita_2",
        type: "String",
    },
    {
        label: "citacita_3",
        field: "citacita_3",
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
                `cfit/hasil/import_offline`,
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
    } else {
        Toast.danger("Pilih sekolah terlebih dahulu!")
    }
}
</script>
<template>
    <div class="px-2">
        <article class="prose lg:prose-sm">
            <h1>IMPORT DATA CFIT</h1>
        </article>
        <!-- <div>
            <RouterLink
                :to="{ name: 'admin-sekolah-submenu-ist-import-migration', params: { sekolah_id: 0, kelas_id: 0 } }">
                <button class="btn btn-sm ">
                    Migrasi</button>
            </RouterLink>
        </div> -->

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
                <p class="text-xs font-semibold text-red-600">- Kosongkan field cfit agar type cfit ditentukan dari umur
                    (tahun dan bulan / otomatis)
                </p>
                <p class="text-xs font-semibold text-red-600">- Kosongkan field tgl lahir jika menggunakan field umur
                </p>
                <p class="text-xs font-semibold text-red-600">- Jika Nama , Nomer Induk dan Kelas Sama maka data JK dan
                    tgl lahir akan di update</p>
                <p class="text-xs font-semibold text-red-600">- Jika tgllahir diisi maka field Umur tidak digunakan
                    (otomatis Menghitung dari tgl lahir)</p>
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