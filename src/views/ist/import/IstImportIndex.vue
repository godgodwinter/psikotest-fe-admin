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

// --- State & Variables ---
const dataDetail = ref({
    nama: "",
    nomeridentitas: "",
    alamat: "",
    jk: "",
    kelas_id: null,
    sekolah_id: null,
});

const fileExcel = ref(null);
const fileExcelLink = ref(null);
const dataExcel = ref([]);

const searchSekolah = ref("");
const isDropdownOpen = ref(false);

const dataKelas = ref([]);
const dataSekolah = ref([]);
const pilihKelas = ref([]);
const pilihSekolah = ref([]);

const sekolah_id = ref(null);
const kelas_id = ref(null);

const completedSteps = ref(0);
const totalSteps = ref(0);
const prosesBerhasil = ref(0);
const prosesGagal = ref(0);

// --- Computed Properties ---
// Filter sekolah berdasarkan input pencarian
const filteredSekolah = computed(() => {
    if (!searchSekolah.value) return pilihSekolah.value;
    return pilihSekolah.value.filter(item =>
        item.label.toLowerCase().includes(searchSekolah.value.toLowerCase())
    );
});

const selectedSekolahLabel = computed(() => {
    const found = pilihSekolah.value.find(s => s.id === dataDetail.value.sekolah_id);
    return found ? found.label : "Pilih Sekolah...";
});


// --- Methods ---
const selectSekolah = (item) => {
    dataDetail.value.sekolah_id = item.id;
    dataDetail.value.kelas_id = null;
    isDropdownOpen.value = false;
    searchSekolah.value = "";
    getDataKelas(item.id);
};

const onChangefileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        fileExcel.value = file;
        fileExcelLink.value = URL.createObjectURL(file);
        importExcelFile();
    }
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
    var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];

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
        AV: 'citacita_1',
        AW: 'citacita_2',
        AX: 'citacita_3',
        AY: 'iq_ist',
        AZ: 'iq_8km',
        BA: 'tgllahir',
        BB: 'pertimbangan_studi',
        BC: 'pertimbangan_jurusan',
        BD: 'fakultas_1',
        BE: 'prodi_1',
        BF: 'kesimpulan_saran_tambahan',
    };

    var rowData = [];
    var rowIndex = 2;

    while (worksheet['A' + rowIndex]) {
        var row = {};
        let periksaRow = null;
        Object.keys(columns).forEach(function (column) {
            row[columns[column]] = worksheet[column + rowIndex]?.w;
            if (column == 'A' && worksheet[column + rowIndex]?.w) {
                periksaRow = 1;
            }
        });

        if (periksaRow) {
            rowData.push(row);
        }
        rowIndex++;
    }

    dataExcel.value = rowData;
    totalSteps.value = dataExcel.value.length;
}

const importExcelFile = () => {
    makeRequest(
        'GET',
        fileExcelLink.value,
        function (data) {
            var workbook = convertDataToWorkbook(data);
            populateGrid(workbook);
        },
        function (error) {
            throw error;
        }
    );
}

const fnReset = () => {
    completedSteps.value = 0;
    prosesBerhasil.value = 0;
    prosesGagal.value = 0;
    dataExcel.value = [];
    dataDetail.value.kelas_id = null;
    dataDetail.value.sekolah_id = null;
    sekolah_id.value = null;
    kelas_id.value = null;
    totalSteps.value = 0;
};

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
}

// get Sekolah
const getDataSekolah = async () => {
    try {
        const response = await Api.get(`owner/sekolah`);
        dataSekolah.value = response.data;
        pilihSekolah.value = response.data.map((item) => ({
            label: `${item.nama} - ID : (${item.id})`,
            id: item.id,
        }));
    } catch (error) {
        Toast.danger("Warning", "Data Sekolah Gagal dimuat");
        console.error(error);
    }
};

// get Kelas
const getDataKelas = async (s_id) => {
    try {
        pilihKelas.value = [];
        const response = await Api.get(`owner/datasekolah/${s_id}/kelas`);
        dataKelas.value = response.data;
        pilihKelas.value = response.data.map((item) => ({
            label: `${item.nama} - ID KELAS : (${item.id})`,
            id: item.id,
        }));
    } catch (error) {
        Toast.danger("Warning", "Data Kelas Gagal dimuat");
        console.error(error);
    }
};

const doApply = () => {
    if (!dataDetail.value.sekolah_id) return Toast.danger("Pilih sekolah!");
    sekolah_id.value = dataDetail.value.sekolah_id;
    kelas_id.value = dataDetail.value.kelas_id;
    Toast.babeng("Info", `Apply: Sekolah ID ${sekolah_id.value}, Kelas ID ${kelas_id.value || 'None'}`);
}

const doStore = async () => {
    if (!sekolah_id.value) return Toast.danger("Klik Apply terlebih dahulu!");

    const dataForm = {
        sekolah_id: sekolah_id.value,
        kelas_id: kelas_id.value,
        data: dataExcel.value
    }

    try {
        const response = await ApiIst.post(
            `ist/import`,
            dataForm
        );
        if (response.data) {
            dataExcel.value = response.data;
        }
        Toast.success("Berhasil", "Data berhasil diproses!");
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => getDataSekolah());

const columns = [
    { label: "Actions", field: "actions", sortable: false, width: "100px", tdClass: "text-center" },
    { label: "Nama", field: "nama", type: "String" },
    { label: "tgllahir", field: "tgllahir", type: "String" },
    { label: "umur", field: "umur", type: "String" },
    {
        label: "siswa_id",
        field: "siswa_id",
        type: "Number",
    },
    { label: "wa", field: "wa", type: "Number" },
    { label: "an", field: "an", type: "Number" },
    { label: "ra", field: "ra", type: "Number" },
    { label: "zr", field: "zr", type: "Number" },
    { label: "fa", field: "fa", type: "Number" },
    { label: "wu", field: "wu", type: "Number" },
    { label: "se", field: "se", type: "Number" },
    { label: "me", field: "me", type: "Number" },
    { label: "ge", field: "ge", type: "Number" },
    { label: "mb_ou", field: "mb_ou", type: "Number" },
    { label: "mb_me", field: "mb_me", type: "Number" },
    { label: "mb_co", field: "mb_co", type: "Number" },
    { label: "mb_sc", field: "mb_sc", type: "Number" },
    { label: "mb_pc", field: "mb_pc", type: "Number" },
    { label: "mb_as", field: "mb_as", type: "Number" },
    { label: "mb_li", field: "mb_li", type: "Number" },
    { label: "mb_mu", field: "mb_mu", type: "Number" },
    { label: "mb_ss", field: "mb_ss", type: "Number" },
    { label: "mb_cl", field: "mb_cl", type: "Number" },
    { label: "mb_pr", field: "mb_pr", type: "Number" },
    { label: "mb_md", field: "mb_md", type: "Number" },
    { label: "hspq_a", field: "hspq_a", type: "Number" },
    { label: "hspq_c", field: "hspq_c", type: "Number" },
    { label: "hspq_d", field: "hspq_d", type: "Number" },
    { label: "hspq_e", field: "hspq_e", type: "Number" },
    { label: "hspq_f", field: "hspq_f", type: "Number" },
    { label: "hspq_g", field: "hspq_g", type: "Number" },
    { label: "hspq_h", field: "hspq_h", type: "Number" },
    { label: "hspq_i", field: "hspq_i", type: "Number" },
    { label: "hspq_j", field: "hspq_j", type: "Number" },
    { label: "hspq_o", field: "hspq_o", type: "Number" },
    { label: "hspq_q2", field: "hspq_q2", type: "Number" },
    { label: "hspq_q3", field: "hspq_q3", type: "Number" },
    { label: "hspq_q4", field: "hspq_q4", type: "Number" },
    { label: "ist_8km_ks_3", field: "ist_8km_ks_3", type: "Number" },
    { label: "ist_8km_km", field: "ist_8km_km", type: "Number" },
    { label: "ist_8km_kk", field: "ist_8km_kk", type: "Number" },
    { label: "ist_8km_ki", field: "ist_8km_ki", type: "Number" },
    { label: "ist_8km_ka", field: "ist_8km_ka", type: "Number" },
    { label: "ist_8km_kn", field: "ist_8km_kn", type: "Number" },
    { label: "ist_8km_kr", field: "ist_8km_kr", type: "Number" },
    { label: "citacita_1", field: "citacita_1", type: "String" },
    { label: "citacita_2", field: "citacita_2", type: "String" },
    { label: "citacita_3", field: "citacita_3", type: "String" },
    { label: "kesimpulan_saran_tambahan", field: "kesimpulan_saran_tambahan", type: "String" },
];
</script>

<template>
    <div class="p-4 bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-4">
                <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Import Data IST</h1>
                <span class="badge badge-info badge-outline">v2.0</span>
            </div>
            <RouterLink
                :to="{ name: 'admin-sekolah-submenu-ist-import-migration', params: { sekolah_id: 0, kelas_id: 0 } }">
                <button class="btn btn-outline btn-primary btn-sm rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Menu Migrasi
                </button>
            </RouterLink>
        </div>

        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div class="lg:col-span-1 space-y-6">
                <div class="card bg-white shadow-sm border border-gray-100">
                    <div class="card-body p-5">
                        <h2 class="card-title text-sm uppercase text-gray-500 mb-4">Konfigurasi Sekolah & Kelas</h2>

                        <div class="form-control w-full relative">
                            <label class="label"><span class="label-text font-semibold">Sekolah</span></label>
                            <div class="dropdown w-full" :class="{ 'dropdown-open': isDropdownOpen }">
                                <div tabindex="0" @click="isDropdownOpen = !isDropdownOpen"
                                    class="input input-bordered flex items-center justify-between cursor-pointer focus:border-primary">
                                    <span :class="{ 'text-gray-400': !dataDetail.sekolah_id }">{{ selectedSekolahLabel
                                        }}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div tabindex="0"
                                    class="dropdown-content z-[100] menu p-2 shadow-xl bg-base-100 rounded-box w-full mt-1 border">
                                    <input type="text" v-model="searchSekolah" placeholder="Cari sekolah..."
                                        class="input input-sm input-ghost w-full mb-2 border-b focus:outline-none"
                                        @click.stop />
                                    <ul class="max-h-60 overflow-y-auto custom-scrollbar">
                                        <li v-for="item in filteredSekolah" :key="item.id">
                                            <a @click="selectSekolah(item)"
                                                :class="{ 'active': dataDetail.sekolah_id === item.id }">{{ item.label
                                                }}</a>
                                        </li>
                                        <li v-if="filteredSekolah.length === 0"
                                            class="text-center py-2 text-gray-400 text-sm">Tidak ditemukan</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="form-control w-full mt-2">
                            <label class="label"><span class="label-text font-semibold">Kelas</span></label>
                            <select class="select select-bordered w-full" v-model="dataDetail.kelas_id">
                                <option :value="null">Pilih Kelas (Opsional)</option>
                                <option v-for="item in pilihKelas" :key="item.id" :value="item.id">{{ item.label }}
                                </option>
                            </select>
                        </div>

                        <button @click="doApply" class="btn btn-primary w-full mt-6 shadow-md shadow-blue-100">
                            Apply Konfigurasi
                        </button>
                    </div>
                </div>

                <div class="alert alert-warning shadow-sm border-none bg-yellow-50 text-yellow-800 text-xs italic">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div class="space-y-1">
                        <p>• Jika Nama, Nomer Induk dan Kelas Sama maka data JK dan tgl lahir akan diupdate.</p>
                        <p>• Jika tgllahir diisi maka field Umur tidak digunakan (otomatis menghitung dari tgl lahir).
                        </p>
                        <p>• Kosongkan field tgl lahir jika menggunakan field umur.</p>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2 space-y-6">
                <div class="card bg-white shadow-sm border border-gray-100">
                    <div class="card-body p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <input type="file" @change="onChangefileUpload"
                            class="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-xs" />
                        <div class="flex gap-2 w-full md:w-auto">
                            <button @click="doStore" class="btn btn-success btn-sm flex-1 md:flex-none text-white">
                                SIMPAN DATA
                            </button>
                            <button @click="fnReset" class="btn btn-ghost btn-sm flex-1 md:flex-none">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-0 overflow-x-auto">
                        <vue-good-table v-if="dataExcel.length > 0" :line-numbers="true" :columns="columns"
                            :rows="dataExcel"
                            :search-options="{ enabled: true, placeholder: 'Cari di hasil import...' }"
                            :pagination-options="{ enabled: true, perPage: 100, perPageDropdown: [100, 200, 500] }"
                            styleClass="vgt-table striped condensed" class="py-0">

                            <template #table-row="props">
                                <span v-if="props.column.field == 'actions'">
                                    <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                        <button class="btn btn-xs btn-error btn-outline"
                                            @click="doDelete(props.index, props.row.nama)">
                                            Delete
                                        </button>
                                    </div>
                                </span>
                                <span v-else-if="props.column.field == 'tgl_import'">
                                    <div class="text-center">
                                        {{ props.row.tgl_import ? moment(props.row.tgl_import).format("DD MMMM YYYY") :
                                            null }}
                                    </div>
                                </span>
                                <span v-else-if="props.column.field == 'data_sertifikat'">
                                    <div class="text-center">
                                        {{ props.row.data_sertifikat ? 'Ada' : "-" }}
                                        <button class="btn btn-xs btn-info"
                                            v-if="props.row.data_sertifikat">Periksa</button>
                                    </div>
                                </span>
                                <span v-else-if="props.column.field == 'data_deteksi'">
                                    <div class="text-center">
                                        {{ props.row.data_deteksi ? "Ada" : "-" }}
                                        <button class="btn btn-xs btn-info"
                                            v-if="props.row.data_deteksi">Periksa</button>
                                    </div>
                                </span>
                                <span v-else>
                                    {{ props.formattedRow[props.column.field] }}
                                </span>
                            </template>
                        </vue-good-table>

                        <div v-else class="py-20 text-center">
                            <div class="flex flex-col items-center opacity-20">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p class="text-xl font-bold">Belum ada data excel</p>
                                <p>Silahkan pilih file untuk memulai</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

/* Menghilangkan scrollbar pada table wrapper agar rapi di mobile */
.vgt-responsive {
    overflow-x: auto !important;
}
</style>