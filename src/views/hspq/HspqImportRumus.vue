<script setup>
import { reactive, onMounted, ref, watch, computed } from "vue";
import Api from "@/axios/axios";
import ApiIst from "@/axios/axiosIst";
import Toast from "@/components/lib/Toast";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import { Field, Form } from "vee-validate";

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
    kode: "",
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
        A: 'score',
        B: 'kn_persen',
        C: 'kn_keterangan_singkatan',
        D: 'kn_keterangan_aspek_positif',
        E: 'kn_keterangan_aspek_negatif',
        F: 'kn_keterangan_sikap_positif',
        G: 'kn_keterangan_sikap_negatif',
        // H: '',
        I: 'kr_persen',
        J: 'kr_keterangan_singkatan',
        K: 'kr_keterangan_aspek_positif',
        L: 'kr_keterangan_aspek_negatif',
        M: 'kr_keterangan_sikap_positif',
        N: 'kr_keterangan_sikap_negatif',
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
        label: "score",
        field: "score",
        type: "String",
    },
    {
        label: "kn_persen",
        field: "kn_persen",
        type: "Number",
    },
    {
        label: "kn_keterangan_singkatan",
        field: "kn_keterangan_singkatan",
        type: "String",
    },
    {
        label: "kn_keterangan_aspek_positif",
        field: "kn_keterangan_aspek_positif",
        type: "String",
    },
    {
        label: "kn_keterangan_aspek_negatif",
        field: "kn_keterangan_aspek_negatif",
        type: "String",
    },
    {
        label: "kn_keterangan_sikap_positif",
        field: "kn_keterangan_sikap_positif",
        type: "String",
    },
    {
        label: "kn_keterangan_sikap_negatif",
        field: "kn_keterangan_sikap_negatif",
        type: "String",
    },
    {
        label: "kr_persen",
        field: "kr_persen",
        type: "Number",
    },
    {
        label: "kr_keterangan_singkatan",
        field: "kr_keterangan_singkatan",
        type: "String",
    },
    {
        label: "kr_keterangan_aspek_positif",
        field: "kr_keterangan_aspek_positif",
        type: "String",
    },
    {
        label: "kr_keterangan_aspek_negatif",
        field: "kr_keterangan_aspek_negatif",
        type: "String",
    },
    {
        label: "kr_keterangan_sikap_positif",
        field: "kr_keterangan_sikap_positif",
        type: "String",
    },
    {
        label: "kr_keterangan_sikap_negatif",
        field: "kr_keterangan_sikap_negatif",
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
    const dataForm = {
        data: dataExcel.value
    }
    console.log(dataForm);

}
</script>
<template>
    <div class="px-2">
        <article class="prose lg:prose-sm">
            <h1>HSPQ Rumus Generator</h1>
        </article>


        <div>
            <div class="pt-0 px-0">
                <div class="w-full mx-0 lg:w-10/12">
                    <Form v-slot="{ errors }" @submit="onSubmit">
                        <div class="bg-white rounded-lg p-0 sm:p-6 xl:p-0">
                            <div class="grid md:grid-cols-3 gap-2">
                                <div>
                                    <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Kode : misal
                                        hspq_a
                                    </label>
                                    <Field v-model="dataDetail.kode" type="text" name="kode" ref="kode"
                                        class="input input-bordered md:w-full max-w-xs" required />
                                    <div class="text-xs text-red-600 mt-1">
                                        {{ errors.kode }}
                                    </div>

                                </div>
                                <div>
                                    <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Kode Asli : misal
                                        a,
                                        c, d
                                        dll
                                    </label>
                                    <Field v-model="dataDetail.kode_asli" type="text" name="kode_asli" ref="kode_asli"
                                        class="input input-bordered md:w-full max-w-xs" required />
                                    <div class="text-xs text-red-600 mt-1">
                                        {{ errors.kode_asli }}
                                    </div>
                                </div>
                                <div>
                                    <label for="name" class="text-sm font-medium text-gray-900 block mb-2">jk : misal L/P
                                    </label>
                                    <Field v-model="dataDetail.jk" type="text" name="jk" ref="jk"
                                        class="input input-bordered md:w-full max-w-xs" required />
                                    <div class="text-xs text-red-600 mt-1">
                                        {{ errors.jk }}
                                    </div>

                                </div>


                            </div>

                            <!-- <div class="w-full flex justify-end mt-4 px-20">
                                <button class="btn btn-active btn-lg btn-primary" @click="doApply()">
                                    Apply
                                </button>
                            </div> -->
                        </div>
                    </Form>
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