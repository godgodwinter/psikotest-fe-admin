<script setup>
import { reactive, onMounted, ref, watch, computed } from "vue";
import Api from "@/axios/axios";
import ApiIst from "@/axios/axiosIst";
import Toast from "@/components/lib/Toast";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";

// --- State & Variables ---
moment.updateLocale("id", localization);
const dataDetail = ref({ nama: "", nomeridentitas: "", alamat: "", jk: "", kelas_id: null, sekolah_id: null });
const fileExcel = ref(null);
const fileExcelLink = ref(null);
const dataExcel = ref([]);
const searchSekolah = ref(""); // Untuk fitur pencarian sekolah
const isDropdownOpen = ref(false);

const pilihKelas = ref([]);
const pilihSekolah = ref([]);
const sekolah_id = ref(null);
const kelas_id = ref(null);

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

// XMLHttpRequest Logic (Tetap sama)
function makeRequest(method, url, success, error) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open(method, url, true);
    httpRequest.responseType = 'arraybuffer';
    httpRequest.onload = () => success(httpRequest.response);
    httpRequest.onerror = () => error(httpRequest.response);
    httpRequest.send();
}

function convertDataToWorkbook(dataRows) {
    var data = new Uint8Array(dataRows);
    var arr = Array.from(data, byte => String.fromCharCode(byte));
    var bstr = arr.join('');
    return XLSX.read(bstr, { type: 'binary' });
}

function populateGrid(workbook) {
    var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];
    var columnsMapping = {
        A: 'no', B: 'kelas', C: 'no_induk', D: 'nama', E: 'jk', F: 'umur', G: 'tgllahir',
        //HSPQ
        H: 'hspq_a',
        I: 'hspq_c',
        J: 'hspq_d',
        K: 'hspq_e',
        L: 'hspq_f',
        M: 'hspq_g',
        N: 'hspq_h',
        O: 'hspq_i',
        P: 'hspq_j',
        Q: 'hspq_o',
        R: 'hspq_q2',
        S: 'hspq_q3',
        T: 'hspq_q4',
        //MINAT
        U: 'mb_ou',
        V: 'mb_me',
        W: 'mb_co',
        X: 'mb_sc',
        Y: 'mb_pc',
        Z: 'mb_as',
        AA: 'mb_li',
        AB: 'mb_mu',
        AC: 'mb_ss',
        AD: 'mb_cl',
        AE: 'mb_pr',
        AF: 'mb_md',
        // cita-cita
        AG: 'citacita_1',
        AH: 'citacita_2',
        AI: 'citacita_3',
        // tiki_m
        AZ: 'm_ba', BA: 'm_gb', BB: 'm_hk', BC: 'm_eg', BD: 'm_bs', BE: 'm_m', BF: 'm_mbd', BG: 'm_ek', BH: 'm_bc', BI: 'm_bh', BJ: 'm_mb', BK: 'm_pk', BW: `tipe_kelas_rumus`,
        //
    };

    var rowData = [];
    var rowIndex = 2;
    while (worksheet['A' + rowIndex]) {
        var row = {};
        Object.keys(columnsMapping).forEach(col => {
            row[columnsMapping[col]] = worksheet[col + rowIndex]?.w;
        });
        rowData.push(row);
        rowIndex++;
    }
    dataExcel.value = rowData;
}

const importExcelFile = () => {
    makeRequest('GET', fileExcelLink.value, (data) => {
        var workbook = convertDataToWorkbook(data);
        populateGrid(workbook);
    }, (err) => { throw err; });
};

const getDataSekolah = async () => {
    try {
        const response = await Api.get(`owner/sekolah`);
        pilihSekolah.value = response.data.map(item => ({ label: item.nama, id: item.id }));
    } catch (error) {
        Toast.danger("Warning", "Data Sekolah Gagal dimuat");
    }
};

const getDataKelas = async (s_id) => {
    try {
        const response = await Api.get(`owner/datasekolah/${s_id}/kelas`);
        pilihKelas.value = response.data.map(item => ({ label: item.nama, id: item.id }));
    } catch (error) {
        Toast.danger("Warning", "Data Kelas Gagal dimuat");
    }
};

const doApply = () => {
    if (!dataDetail.value.sekolah_id) return Toast.danger("Pilih sekolah!");
    sekolah_id.value = dataDetail.value.sekolah_id;
    kelas_id.value = dataDetail.value.kelas_id;
    Toast.babeng("Info", `Terapan: Sekolah ID ${sekolah_id.value}`);
};

const doStore = async () => {
    if (!sekolah_id.value) return Toast.danger("Klik Apply terlebih dahulu!");
    try {
        console.log({
            sekolah_id: sekolah_id.value,
            kelas_id: kelas_id.value,
            data: dataExcel.value
        });

        const response = await ApiIst.post(`tiki_m/import`, {
            sekolah_id: sekolah_id.value,
            kelas_id: kelas_id.value,
            data: dataExcel.value
        });
        console.log(response);
        if (response.data) dataExcel.value = response.data;
        Toast.success("Berhasil", "Data berhasil disimpan");
    } catch (error) {
        console.error(error);
    }
};

const fnReset = () => {
    dataExcel.value = [];
    dataDetail.value = { sekolah_id: null, kelas_id: null };
};

onMounted(() => getDataSekolah());

const columns = [
    { label: "Actions", field: "actions", sortable: false, width: "100px", tdClass: "text-center" },
    { label: "Nama", field: "nama" },
    { label: "Tgl Lahir", field: "tgllahir" },
    { label: "Umur", field: "umur" },
    { label: "Status Import", field: "siswa_id", type: "String" },
    { label: "m_ba", field: "m_ba" },
    { label: "m_gb", field: "m_gb" },
    // ... tambahkan kolom lain sesuai kebutuhan ...
];
</script>

<template>
    <div class="p-4 bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-4">
                <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Import Data TIKI M</h1>
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
                    <div>
                        <p>• Jika Nama , Nomer Induk dan Kelas Sama maka data JK dan tgl lahir akan di update.</p>
                        <p>• Jika tgllahir diisi maka field Umur tidak digunakan (otomatis Menghitung dari tgl lahir).
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
                        <vue-good-table v-if="dataExcel.length > 0" :columns="columns" :rows="dataExcel"
                            :search-options="{ enabled: true, placeholder: 'Cari di hasil import...' }"
                            :pagination-options="{ enabled: true, perPage: 100, perPageDropdown: [100, 500, 1000] }"
                            styleClass="vgt-table striped">
                            <template #table-row="props">
                                <span v-if="props.column.field == 'actions'">
                                    <button class="btn btn-xs btn-error btn-outline"
                                        @click="doDelete(props.index, props.row.nama)">
                                        Hapus
                                    </button>
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