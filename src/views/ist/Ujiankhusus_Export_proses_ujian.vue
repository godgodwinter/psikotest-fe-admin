<script setup>
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import axiosIst_Qwen from "@/axios/axiosIst_Qwen";
import { fn_copy_id_for_mongo } from "@/lib/FungsiBasic.js"
import { ref, defineAsyncComponent } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import ButtonDelete from "@/components/atoms/ButtonDel.vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "@/components/lib/Toast";
import { useAdminPagesStore } from '@/stores/admin/adminPagesStore'

import useClipboard from 'vue-clipboard3'
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import { useSuperadminStore } from '@/stores/admin/superadminPagesStore';
import C_ujiankhusus_menu from './C_ujiankhusus_menu.vue'
const superadminStore = useSuperadminStore();
const isSuperadminActive = ref(superadminStore.isSuperadminActive)
moment.updateLocale("id", localization);

const VITE_API_FE_REACT = import.meta.env.VITE_API_FE_REACT
    ? import.meta.env.VITE_API_FE_REACT
    : "http://localhost:3500/";

const VITE_API_FE_DASHBOARD = import.meta.env.VITE_API_FE_DASHBOARD
    ? import.meta.env.VITE_API_FE_DASHBOARD
    : "http://localhost:3500/";


const BASE_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const route = useRoute();

const BASE_URL_CETAK = import.meta.env.VITE_API_URL_CETAK
    ? import.meta.env.VITE_API_URL_CETAK
    : "http://localhost:8000/";

const sekolah_id = ref(route.params.sekolah_id)
const kelas_id = ref(route.params.kelas_id)
const adminPagesStore = useAdminPagesStore();
const getSekolahAktif = ref({
    sekolah_id: sekolah_id.value,
    kelas_id: kelas_id.value,
})
const kelas_nama = ref(adminPagesStore.getpages_sekolah_aktif ? adminPagesStore.getpages_sekolah_aktif.kelas_nama : "-")
adminPagesStore.$subscribe((mutation, state) => {
    getSekolahAktif.value = adminPagesStore.getpages_sekolah_aktif;
    // console.log(getSekolahAktif.value);
    kelas_nama.value = getSekolahAktif.value.kelas_nama;
    // inputCariKelas.value = getSekolahAktif.value.kelas_id;
});

const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)

const data = ref();
const isLoading = ref(true);
const isError = ref(false);

const dataKelas = ref([]);
const pilihKelas = ref([]);
const inputCariKelas = ref({ id: kelas_id.value, label: kelas_nama.value })

const getDataKelas = async () => {
    try {
        isLoading.value = true;
        const response = await Api.get(`master/sekolah/${sekolah_id.value}/kelas`);
        // console.log(response);
        dataKelas.value = response.data;
        if (dataKelas.value.length > 0) {
            // console.log(dataKelas.value[0].id);
            if (kelas_id.value == 0) {
                kelas_id.value = dataKelas.value[0].id;
            }
            dataKelas.value.forEach((item) => {
                pilihKelas.value.push({
                    label: item.nama,
                    id: item.id,
                });
            });
        }
        isLoading.value = false;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        Toast.danger("Warning", "Data Gagal dimuat");
        console.error(error);
    }
};
getDataKelas();


const columns = [
    {
        label: "Pilih",
        field: "siswa_id", // <-- field yang akan diambil nilainya saat dipilih
        width: "60px",
        tdClass: "text-center",
        thClass: "text-center",
        type: "checkbox", // <-- penting!
        sortable: false,
    },
    // {
    //     label: "Actions",
    //     field: "actions",
    //     sortable: false,
    //     width: "50px",
    //     tdClass: "text-center",
    //     thClass: "text-center",
    // },
    {
        label: "Nama",
        field: "nama",
        type: "String",
    },
    {
        label: "R:Soal",
        field: "redis_total_jawaban_tersimpan",
        type: "String",
    },
    {
        label: "M:ProsesShort",
        field: "ujiankhusus_proses_short",
        type: "String",
    },
    {
        label: "R:ProsesShort",
        field: "ujiankhusus_proses_redis_short",
        type: "String",
    },
    {
        label: "Tanggal Bisa Memulai",
        field: "tgl_batas_mulai",
        type: "String",
    },

    {
        label: "Batas Tanggal Pengerjaan",
        field: "tgl_batas_terakhir",
        type: "String",
    },
    {
        label: "Siswa Id",
        field: "siswa_id",
        type: "String",
    },
];

const selectedRows = ref([]);

const isDownloading = ref(false);
const showConfirmModal = ref(false); // ← untuk konfirmasi (opsional)
const confirmMessage = ref("");

const onRowSelected = (params) => {
    selectedRows.value = params.selectedRows;
    console.log("Baris terpilih:", selectedRows.value); // <-- cek di console browser
};

// Untuk mendapatkan semua siswa_id yang dipilih:
const getSelectedSiswaIds = () => {
    return selectedRows.value.map(row => row.siswa_id);
};

const isAllSelected = ref(false);

const toggleSelectAll = () => {
    const table = document.querySelector('.vgt-table');
    if (!table) return;

    const checkboxes = table.querySelectorAll('input[type="checkbox"]:not(:disabled)');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);

    checkboxes.forEach(cb => {
        cb.checked = !anyChecked;
        cb.dispatchEvent(new Event('change')); // penting agar vue-good-table mendeteksi perubahan
    });

    isAllSelected.value = !anyChecked;
};

const getData = async () => {
    try {
        console.log('====================================');
        console.log('#getData V3');
        console.log('====================================');
        isLoading.value = true;
        const response = await ApiUjianKhusus.post(`ujiankhusus/backup/multi/file/detail/kelas/${kelas_id.value}`);
        data.value = response.data?.restoredData;

        // const tempData=response.data;
        // data.value = tempData.map(fn_copy_id_for_mongo);
        console.log(`#getdata:`, data.value);
        isLoading.value = false;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
getData();

const doDeleteData = async (id, index) => {
    if (confirm("Apakah anda yakin menghapus data ini?")) {
        try {
            isLoading.value = true;
            const response = await Api.delete(`ujianstudi/paketsoal/${id}`);
            if (response.status) {
                Toast.warning("Berhasil", response.message);
                // Toast.success("Info", "Data berhasil dihapus!");
            } else {
                Toast.warning("Gagal", response.message);
            }
            getData();
            return true;
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};

const doEditData = async (id, index) => {
    router.push({
        name: "admin-ujianstudi-paketsoal-edit",
        params: { paketsoal_id: id },
    });
};

// const doCopyClipboard = (item) => {
//     navigator.clipboard.writeText(item);
//     Toast.babeng("Info", `${item} berhasil disalin`);
// };

const unsecuredCopyToClipboard = (text) => { const textArea = document.createElement("textarea"); textArea.value = text; document.body.appendChild(textArea); textArea.focus(); textArea.select(); try { document.execCommand('copy') } catch (err) { console.error('Unable to copy to clipboard', err) } document.body.removeChild(textArea) };

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
*/
// const doCopyClipboard = (content) => {
//     // if (window.isSecureContext && navigator.clipboard) {
//     //     navigator.clipboard.writeText(content);
//     //     Toast.babeng("Info 2", `${content} berhasil disalin`);
//     // } else {
//     unsecuredCopyToClipboard(content);
//     Toast.babeng("Info 2", `${content} berhasil disalin`);
//     // }
// };

const { toClipboard } = useClipboard()
const doCopyClipboard = async (item) => {
    try {
        await toClipboard(item)
        Toast.babeng("Info", `${item} berhasil disalin`);
        console.log('Copied to clipboard')
    } catch (e) {

        Toast.babeng("Error", `${item} Gagal disalin`);
        console.error(e)
    }
    // navigator.clipboard.writeText(item);
    // Toast.babeng("Info", `${item} berhasil disalin`);
};


const doPilihKelas = async () => {
    let newDataSekolahAktif = {
        sekolah_id: sekolah_id.value,
        kelas_id: inputCariKelas.value.id ? inputCariKelas.value.id : kelas_id.value,
        kelas_nama: inputCariKelas.value.label ? inputCariKelas.value.label : kelas_nama.value,
    }
    await adminPagesStore.setpages_sekolah_aktif(newDataSekolahAktif)
    // console.log('====================================');
    // console.log(getSekolahAktif.value, inputCariKelas.value.id);
    // console.log('====================================');
    await getData()
    // console.log(inputCariKelas.value.id);
    await router.push({
        name: "admin-sekolah-submenu-ujiankhusus-v4-export",
        params: {
            sekolah_id: sekolah_id.value,
            kelas_id: inputCariKelas.value.id ? inputCariKelas.value.id : kelas_id.value,
        },
    });

    // fnSetToTempSekolah(id, inputCariKelas.value.id, inputCariKelas.value.label);
    // getData(inputCariKelas.value.id);
};

// !PENGATURAN
const paketTerpilih = ref({})
const dataForm = ref({
    tgl_batas_mulai: moment(),
    tgl_batas_terakhir: moment().add(7, 'days')
    // tglBatasPengerjaan: adminPagesStore.get_ujianstudi_pengaturan.tgl_ujian
})
const pilihPaket = ref([])
// const inputCariPaket = ref()
const inputCariPaket = ref({
    id: adminPagesStore.get_ujianstudi_pengaturan.paketsoal_id,
    label: adminPagesStore.get_ujianstudi_pengaturan.paketsoal_nama,
})
const dataPaket = ref([])

const paketsoal_aktif = ref(null);
const getPaketAktif = async (id) => {
    // !ambil data dari localstorage
    let getDataPaket = localStorage.getItem("ujianmmpi2_paketsoal_aktif");
    paketsoal_aktif.value = getDataPaket ? JSON.parse(getDataPaket) : null;
    dataForm.value.tgl_batas_mulai = paketsoal_aktif.value.tgl_batas_mulai || moment();
    dataForm.value.tgl_batas_terakhir = paketsoal_aktif.value.tgl_batas_terakhir || moment().add(7, 'days');
    console.log(paketsoal_aktif.value);
    // console.log(paketsoal_aktif.value);
};
getPaketAktif();

const doPilihPaket = () => {
    let tempDataSave = {
        id: null,
        // nama: paketsoal_aktif.value.nama,
        tgl_batas_mulai: dataForm.value.tgl_batas_mulai,
        tgl_batas_terakhir: dataForm.value.tgl_batas_terakhir,
        tipeCitacita: inputSelectTipeCitacita.value,
        tipeMmpi2: inputSelectTipeMmpi2.value,
    }
    localStorage.setItem("ujianmmpi2_paketsoal_aktif", JSON.stringify(tempDataSave))
    // console.log('====================================');
    console.log(tempDataSave);
    // console.log('====================================');
    // adminPagesStore.set_ujianstudi_pengaturan(tempDataSave)
}


const doGenerateSiswa = async (id, index) => {
    if (confirm("Apakah anda yakin generate data ini (v3)?")) {
        // console.log('====================================');
        // console.log(paketsoal_aktif.value.id);
        // console.log('====================================');
        let dataFormSend = {
            paketsoal_id: null,
            // nama: paketsoal_aktif.value.nama,
            tgl_batas_mulai: dataForm.value.tgl_batas_mulai,
            tgl_batas_terakhir: dataForm.value.tgl_batas_terakhir,
            // tipeCitacita: inputSelectTipeCitacita.value,
            // tipeMmpi2: inputSelectTipeMmpi2.value,
        }
        console.log('====================================');
        console.log(`#dataFormSend:`, dataFormSend);
        console.log('====================================');
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`mmpi2/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}`, dataFormSend);
            console.log(response?.data);

            Toast.babeng("Berhasil", 'Data berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const mmpi2_do_reset_waktu = async (id) => {
    console.log('====================================');
    console.log(`#siswa_id`, id);
    console.log('====================================');
    if (confirm("Apakah anda yakin reset waktu data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`mmpi2/v4/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/reset/umum/waktu`);
            Toast.babeng("Berhasil", 'Reset Berhasil!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const mmpi2_do_force_finish = async (id) => {
    console.log('====================================');
    console.log(`#siswa_id`, id);
    console.log('====================================');
    if (confirm("Apakah anda yakin finish data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`mmpi2/v4/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/reset/umum/finish`);
            Toast.babeng("Berhasil", 'force finish Berhasil!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const mmpi2_do_reset_all = async (id, mapel_id) => {
    console.log('====================================');
    console.log(`#siswa_id#mapel_id`, id, mapel_id);
    console.log('====================================');
    if (confirm("Apakah anda yakin reset all data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`mmpi2/v4/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/reset/umum/all`, { mapel_id: mapel_id });
            Toast.babeng("Berhasil", 'Reset Berhasil!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const mmpi2_doGenerateHasilPersiswa = async (id, mapel_id) => {
    console.log('====================================');
    console.log(`#siswa_id#mapel_id`, id, mapel_id);
    console.log('====================================');
    if (confirm("Apakah anda yakin generate data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`mmpi2/v4/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/hasil/do_generate`);
            Toast.babeng("Berhasil", 'Proses Generate Hasil Selesai!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doDeleteProsesSiswa = async (id, proses_id) => {
    if (confirm("Apakah anda yakin menghapus data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.delete(`mmpi2/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}`);
            Toast.babeng("Berhasil", 'Data berhasil di hapus!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};


const doGenerateSiswaPerkelas = async (id, index) => {
    if (confirm("Apakah anda yakin generate data ini?")) {
        let dataFormSend = {
            paketsoal_id: null,
            // nama: paketsoal_aktif.value.nama,
            tgl_batas_mulai: dataForm.value.tgl_batas_mulai,
            tgl_batas_terakhir: dataForm.value.tgl_batas_terakhir,
            tipeCitacita: inputSelectTipeCitacita.value,
            tipeMmpi2: inputSelectTipeMmpi2.value,
        }
        console.log('====================================');
        console.log(dataFormSend);
        console.log('====================================');
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`mmpi2/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}`, dataFormSend);
            Toast.babeng("Berhasil", 'Data berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doDeleteProsesSiswaPerkelas = async (id) => {
    if (confirm("Apakah anda yakin menghapus data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.delete(`mmpi2/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}`);
            Toast.babeng("Berhasil", 'Data berhasil di hapus!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};

// HASIL-UJIAN
const doGenerateHasilSiswa = async (id, index) => {
    if (confirm("Apakah anda yakin generate data ini?")) {
        // let dataFormSend = {}
        // try {
        //     isLoading.value = true;
        //     const response = await Api.post(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/generate`, dataFormSend);
        //     Toast.babeng("Berhasil", 'Hasil Ujian berhasil digenerate!');
        //     getData();
        // } catch (error) {
        //     isLoading.value = false;
        //     isError.value = true;
        //     console.error(error);
        // }
    }
};
const doDeleteHasilSiswa = async (id, proses_id) => {
    if (confirm("Apakah anda yakin menghapus data ujian ini?")) {
        // try {
        //     isLoading.value = true;
        //     const response = await Api.delete(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/delete`);
        //     Toast.babeng("Berhasil", 'Hasil Ujian berhasil di hapus!');
        //     getData();
        // } catch (error) {
        //     isLoading.value = false;
        //     isError.value = true;
        //     console.error(error);
        // }
    }
};
const doGenerateHasilSiswaPerkelas = async (id) => {
    if (confirm("Apakah anda yakin generate data ini?")) {
        // let dataFormSend = {}
        // try {
        //     isLoading.value = true;
        //     const response = await Api.post(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/generate`, dataFormSend);
        //     Toast.babeng("Berhasil", 'Hasil Ujian berhasil digenerate!');
        //     getData();
        // } catch (error) {
        //     isLoading.value = false;
        //     isError.value = true;
        //     console.error(error);
        // }
    }
};
const doGenerateHasilSiswaPerkelasComplete = async (id) => {
    // Toast.danger("Info", "Menu belum tersedia!");
    if (confirm("Apakah anda yakin generate data yang sudah complete saja ini?")) {
        // let dataFormSend = {}
        // try {
        //     isLoading.value = true;
        //     const response = await Api.post(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/generate/complete`, dataFormSend);
        //     Toast.babeng("Berhasil", 'Hasil Ujian berhasil digenerate!');
        //     getData();
        // } catch (error) {
        //     isLoading.value = false;
        //     isError.value = true;
        //     console.error(error);
        // }
    }
};
const doDeleteHasilSiswaPerkelas = async (id) => {
    if (confirm("Apakah anda yakin menghapus data ujian ini?")) {
        // try {
        //     isLoading.value = true;
        //     const response = await Api.delete(`ujianstudi/hasil/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/delete`);
        //     Toast.babeng("Berhasil", 'Hasil Ujian berhasil di hapus!');
        //     getData();
        // } catch (error) {
        //     isLoading.value = false;
        //     isError.value = true;
        //     console.error(error);
        // }
    }
};
// HASIL-UJIAN-END

const doCetak = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    //     Toast.danger("Warning", "Data tidak valid!");
    // } else {
    // window.open(
    //     `${BASE_URL_CETAK}api/guest/ujianstudi/v2/cetak/kelas/${getSekolahAktif.value.kelas_id}`
    // );
    // }
};
const doCetakLess = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    // Toast.danger("Info", "Menu belum tersedia!");
    // } else {
    window.open(
        `${BASE_URL_CETAK}api/guest/ujianstudi/v2/cetak/kelas/${getSekolahAktif.value.kelas_id}/less`
    );
    // }
};
const doCetakLess_tanpa_ttd = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    // Toast.danger("Info", "Menu belum tersedia!");
    // } else {
    window.open(
        `${BASE_URL_CETAK}api/guest/ujianstudi/v2/cetak/kelas/${getSekolahAktif.value.kelas_id}/less/tanpa_ttd`
    );
    // }
};
const doExportJawabanSiswa = (id = null, token = moment().format("YYYY-MM-DD")) => {
    // if (id === null) {
    // Toast.danger("Info", "Menu belum tersedia!");
    // } else {
    window.open(
        `${BASE_URL_CETAK}api/guest/ujianstudi/v2/exportjawaban/kelas/${getSekolahAktif.value.kelas_id}`
    );
    // }
};


const doCachingRedisPerSiswa = async (id, index) => {
    if (confirm("Apakah anda yakin caching data ini?")) {
        let dataFormSend = {}
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`mmpi2/v4/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/caching`);
            Toast.babeng("Berhasil", 'Cacing proses Ujian berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doCachingRedisPerSiswa_v4 = async (id, index) => {
    if (confirm("Apakah anda yakin caching data ini?")) {
        let dataFormSend = {}
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`mmpi2/v4/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/caching`, { optional_skip_jika_sudah_ada: true });
            Toast.babeng("Berhasil", 'Cacing proses Ujian berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};

const doCachingRedisPerKelas = async () => {
    if (confirm("Apakah anda yakin caching data ini?")) {
        let dataFormSend = {}
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`mmpi2/v4/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/caching`);
            // const response = await Api.get(`redis/studiv2/proses_kelas/${getSekolahAktif.value.kelas_id}/store`, dataFormSend);
            Toast.babeng("Berhasil", 'Cacing proses Ujian berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};
const doCachingRedisPerKelas_v4 = async () => {
    if (confirm("Apakah anda yakin caching data ini?")) {
        let dataFormSend = {}
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`ujiankhusus/v4/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/caching`,
                { optional_skip_jika_sudah_ada: false });
            // const response = await Api.get(`redis/studiv2/proses_kelas/${getSekolahAktif.value.kelas_id}/store`, dataFormSend);
            Toast.babeng("Berhasil", 'Cacing proses Ujian berhasil digenerate!');
            getData();
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
};

const doCetakReact = (ttd) => {
    window.open(
        `${VITE_API_FE_REACT}lintasstudi/v1/a/data/cetak/${getSekolahAktif.value.kelas_id}/${ttd}`
    );
}
const doCetakReactV2 = (ttd = "true") => {
    window.open(
        `${VITE_API_FE_REACT}lintasstudi/v2/cetak/${getSekolahAktif.value.kelas_id}/${ttd}`
    );
}

const doGenerateHasilPerkelas = async (ttd) => {
    if (confirm("Apakah anda yakin generate Hasil Kelas Ini?")) {
        console.log(`generate hasil kelas_id:${getSekolahAktif.value.kelas_id} sekolah_id ${getSekolahAktif.value.sekolah_id}`);
        // kelas_id.value 
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`/ujiankhusus/hasil/generate/v3/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}`);
            Toast.babeng("Berhasil", 'Generate Hasil Ujian telah berhasil!');
            getData();
            return true;
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
}
const doGenerateHasilPerkelas_v4 = async (replace = true) => {
    if (confirm("Apakah anda yakin generate Hasil Kelas Ini?")) {
        console.log(`generate hasil kelas_id:${getSekolahAktif.value.kelas_id} sekolah_id ${getSekolahAktif.value.sekolah_id},replace:${replace}`);
        // kelas_id.value 
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`/mmpi2/v4/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/hasil/do_generate_hasil_perkelas`, { replace: replace });
            Toast.babeng("Berhasil", 'Generate Hasil Ujian telah berhasil!');
            getData();
            return true;
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
}
const doGenerateHasilPersiswa_v4 = async (siswa_id) => {
    if (confirm("Apakah anda yakin generate Hasil Siswa Ini?")) {
        console.log(`generate hasil kelas_id:${getSekolahAktif.value.kelas_id} sekolah_id ${getSekolahAktif.value.sekolah_id}`);
        // kelas_id.value 
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`/mmpi2/hasil/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${siswa_id}/do_generate_hasil`, { replace: true });
            Toast.babeng("Berhasil", 'Generate Hasil Ujian telah berhasil!');
            getData();
            return true;
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
}
const doGenerateHasilPerkelas_false = async (ttd) => {
    if (confirm("Apakah anda yakin generate Hasil Kelas Ini?")) {

        try {
            isLoading.value = true;
            let dataFormSend = {
                replace: false
            };
            const response = await ApiUjianKhusus.post(`/ujiankhusus/hasil/generate/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}`, dataFormSend);
            Toast.babeng("Berhasil", 'Generate Hasil Ujian telah berhasil!');
            getData();
            return true;
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
}

const do_Sinkron_dataRedis = async (ttd) => {
    if (confirm("Apakah anda yakin sinkron data Redis  Kelas Ini?")) {

        try {
            isLoading.value = true;
            // let dataFormSend = {
            //     replace: false
            // };
            const response = await ApiUjianKhusus.post(`/ujiankhusus/hasil/sinkron_redis/v3/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}`);
            Toast.babeng("Berhasil", 'Sinkron Ujian telah berhasil!');
            getData();
            return true;
        } catch (error) {
            isLoading.value = false;
            isError.value = true;
            console.error(error);
        }
    }
}
const do_GenerateDataMentah = async (ttd) => {
    window.open(
        `${VITE_API_FE_REACT}ujiankhusus/v3/export_data_mentah/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}`
    );
    // if (confirm("Apakah anda yakin generate export data mentah  Kelas Ini?")) {

    //     try {
    //         isLoading.value = true;
    //         // let dataFormSend = {
    //         //     replace: false
    //         // };
    //         const response = await ApiUjianKhusus.post(`/ujiankhusus/hasil/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/generate_export_data_mentah`);
    //         // Toast.babeng("Berhasil", 'E Data Mentah berhasil!');
    //         getData();
    //         return true;
    //     } catch (error) {
    //         isLoading.value = false;
    //         isError.value = true;
    //         console.error(error);
    //     }
    // }
}

const do_GenerateDataMentah_v4 = async (ttd) => {
    window.open(
        `${VITE_API_FE_REACT}ujiankhusus/v4/export_data_mentah/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}`
    );
    // if (confirm("Apakah anda yakin generate export data mentah  Kelas Ini?")) {

    //     try {
    //         isLoading.value = true;
    //         // let dataFormSend = {
    //         //     replace: false
    //         // };
    //         const response = await ApiUjianKhusus.post(`/ujiankhusus/hasil/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}/generate_export_data_mentah`);
    //         // Toast.babeng("Berhasil", 'E Data Mentah berhasil!');
    //         getData();
    //         return true;
    //     } catch (error) {
    //         isLoading.value = false;
    //         isError.value = true;
    //         console.error(error);
    //     }
    // }
}
const doExportExcel = (ttd) => {
    window.open(
        `${VITE_API_FE_REACT}ujiankhusus/v1/export/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}`
    );
    // console.log("belum");
}
const doExportExcel_v2 = (ttd) => {
    window.open(
        `${VITE_API_FE_REACT}ujiankhusus/v1/export/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/v2`
    );
    // console.log("belum");
}
const doExportExcel_v2_fakultas = (ttd) => {
    window.open(
        `${VITE_API_FE_REACT}ujiankhusus/v1/export/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/v2/fakultas`
    );
    // console.log("belum");
}
const doExportExcel_v4 = (ttd) => {
    window.open(
        `${VITE_API_FE_REACT}ujiankhusus/v4/export_rekap/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}`
    );
    // console.log("belum");
}
const doExportExcel_v4_fakultas = (ttd) => {
    window.open(
        `${VITE_API_FE_REACT}ujiankhusus/v4/export_rekap/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/fakultas`
    );
    // console.log("belum");
}
const doExport1010 = (ttd) => {
    console.log(paketsoal_aktif.value.id);
    window.open(
        `${VITE_API_FE_REACT}ujiankhusus/v3/export_rekap_jawaban_siswa/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/paketsoal_id/${paketsoal_aktif.value.id}`
    );
    // console.log("belum");
}
const doExport1010_v4 = (ttd) => {
    console.log(paketsoal_aktif.value.id);
    // window.open(
    //     `${VITE_API_FE_REACT}ujiankhusus/v3/export_rekap_jawaban_siswa/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/paketsoal_id/${paketsoal_aktif.value.id}`
    // );

    window.open(
        `${VITE_API_FE_REACT}ujiankhusus/v4/export_rekap_jawaban_siswa/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/paketsoal_id/${paketsoal_aktif.value.id}`
    );
    // console.log("belum");
}

// const dataTipeCitacita=ref([]);
const tipeCitacitaList = ref([
    {
        id: 1,
        label: "Kelas 1-8",
    },
    {
        id: 2,
        label: "Kelas 9-10",
    },
    {
        id: 3,
        label: "Kelas 11-12",
    },
    {
        id: 4,
        label: "Dewasa ( Diploma,Sarjana, Umum)",
    },
]);
const dataTemp = JSON.parse(localStorage.getItem("ujianmmpi2_paketsoal_aktif"));
const inputSelectTipeCitacita = ref(dataTemp?.tipeCitacita || {
    id: 2,
    label: "Kelas 9-10",
},)

const tipeMmpi2List = ref([
    {
        id: 1,
        label: "HSPQ",
    },
    {
        id: 2,
        label: "Pohon",
    },
]);
const inputSelectTipeMmpi2 = ref(dataTemp?.tipeMmpi2 || {
    id: 1,
    label: "HSPQ",
},)

const formatTanggal = "DD MMMM YYYY HH:mm:ss";



const dashboard_doCetak_mmpi = () => {
    window.open(
        `${VITE_API_FE_DASHBOARD}admin/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/mmpi`
    );
}
const fn_download_file = async (skipConfirm = false) => {
    const selectedSiswaIds = getSelectedSiswaIds();

    if (selectedSiswaIds.length === 0) {
        return Toast.danger("Error", "Pilih minimal satu siswa untuk download backup.");
    }

    if (!skipConfirm) {
        confirmMessage.value = `Anda akan mendownload backup untuk ${selectedSiswaIds.length} siswa. Lanjutkan?`;
        showConfirmModal.value = true;
        return;
    }

    isDownloading.value = true;

    try {
        const response = await axiosIst_Qwen.post(
            "ujiankhusus/backup/multi/file",
            {
                list_siswa_id: selectedSiswaIds,
            },
            {
                responseType: 'blob',
                timeout: 60000,
                headers: {
                    'Accept-Encoding': 'identity', // ← JANGAN DEKOMPRESI!
                },
            }
        );

        // Debug
        console.log("📥 Ukuran file:", response.data.size, "bytes");
        console.log("🏷️  Content-Type:", response.headers['content-type']);
        console.log("📦 Content-Encoding:", response.headers['content-encoding']);
        const sekolahNama = data.value[0]?.sekolah_nama || 'unknown_sekolah';
        const kelasNama = data.value[0]?.kelas_nama || 'unknown_kelas';
        const formatDateForFilename = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}${month}${day}_${hours}${minutes}${seconds}`;
        };
        const jmlSiswa = selectedSiswaIds.length;
        const dateFormatted = formatDateForFilename();
        // Ambil nama file dari header jika ada
        // let filename = `backup_${Date.now()}.json.zst`;

        let filename = `zst_ujiankhusus_backup_${sekolahNama}_${kelasNama}_total_siswa_${jmlSiswa}_${dateFormatted}.json.zst`;
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (match && match[1]) {
                filename = match[1].replace(/['"]/g, '');
            }
        }

        // Trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        Toast.success("Success", `${selectedSiswaIds.length} file backup berhasil diunduh`);

    } catch (error) {
        console.error("Download error:", error);
        let message = "Gagal mengunduh file";
        if (error.response?.data?.message) {
            message = error.response.data.message;
        } else if (error.message) {
            message = error.message;
        }
        Toast.danger("Download Gagal", message);
    } finally {
        isDownloading.value = false;
        showConfirmModal.value = false;
    }
};

console.log('====================================');
console.log(`#getSekolahAktif:`, getSekolahAktif.value);
console.log('====================================');
</script>
<template>
    <span v-if="isLoading">
        <LoadingNavbar />
    </span>
    <span v-else-if="isError">
        <AlertFailed :message="'Gagal mendapatkan response dari server'" />
    </span>
    <span v-else>

        <div>
            <C_ujiankhusus_menu :sekolah_id="getSekolahAktif?.sekolah_id" :kelas_id="getSekolahAktif?.kelas_id" />
        </div>
        <div>
            <article class="prose lg:prose-sm">
                <h1>UJIAN IQ : KELAS {{ kelas_nama }} </h1>
                <h5>UJIAN KHUSUS - V4</h5>
            </article>

            <div class="w-full bg-base-100 shadow-sm rounded-lg py-4 px-4">
                <div class="flex justify-center">
                    <v-select class="py-2 px-3 w-72 mx-auto md:mx-0" :options="pilihKelas" v-model="inputCariKelas"
                        v-bind:class="{ disabled: false }"></v-select>
                    <div class="py-2">
                        <button class="btn btn-sm btn-info p-2" @click="doPilihKelas()">
                            Cari
                        </button>
                    </div>
                </div>
            </div>

            <div class="space-x-2 space-y-2 shadow-sm py-1">
                <button v-if="selectedRows.length > 0" :disabled="isDownloading"
                    class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-tip="Download Backup .json.zst" @click="fn_download_file(false)">
                    <!-- Icon Download (Heroicon) -->
                    <svg v-if="!isDownloading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>

                    <!-- Loading Spinner -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>

                    <!-- Text -->
                    <span>{{ isDownloading ? 'Mengunduh...' : 'Download Backup' }}</span>
                </button>
            </div>
            <!-- !PENGATURAN-END -->
            <span v-if="isLoading">
                <LoadingNavbar />
            </span>
            <span v-else-if="isError">
                <AlertFailed :message="'Gagal mendapatkan response dari server'" />
            </span>
            <span v-else>
                <div class="md:py-2 px-4 lg:flex flex-wrap gap-4" v-if="data">
                    <div class="w-full">
                        <div class="bg-white shadow rounded-lg px-4 py-4">
                            <div v-if="data">
                                <vue-good-table :line-numbers="true" :columns="columns" :rows="data" :search-options="{
                                    enabled: true,
                                }" @selected-rows-change="onRowSelected" :select-options="{
                                    enabled: true,
                                    selectionInfoClass: 'table-alert',
                                    selectionText: 'baris terpilih',
                                    clearSelectionText: 'Bersihkan',
                                    selectAllByPageText: 'Pilih halaman ini',
                                    selectAllText: 'Pilih semua',
                                }" :pagination-options="{
                                    enabled: true,
                                    perPageDropdown: [50, 100, 150, 200],

                                }" styleClass="vgt-table striped bordered condensed" class="py-0">
                                    <template #table-actions>
                                        <div class="space-x-1 space-y-1 gap-1">
                                            <!-- Tombol Select All -->
                                            <button class="btn btn-sm btn-primary tooltip"
                                                data-tip="Pilih Semua di Halaman Ini" @click="toggleSelectAll">
                                                <span v-if="!isAllSelected">
                                                    <!-- Heroicon: Check Circle (Outline) -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </span>
                                                <span v-else>
                                                    <!-- Heroicon: X Circle (Outline) -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button class="btn btn-sm btn-secondary tooltip" data-tip="Refresh Data"
                                                @click="getData()">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </template>
                                    <template #table-row="props">
                                        <span v-if="props.column.field == 'actions'">
                                        </span>
                                        <!-- <span v-else-if="props.column.field == 'mmpi2_proses'">
                                            {{ props.row?.mmpi2_proses ? 'Ada' : 'Tidak Ada' }}
                                        </span> -->
                                        <span
                                            v-else-if="props.column.field == 'v4_ujian_mmpi2_getJawabanBySiswaMapel_multi'"
                                            class="flex items-center gap-1">
                                            <svg v-if="props.row?.v4_ujian_mmpi2_getJawabanBySiswaMapel_multi"
                                                xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{{ props.row?.v4_ujian_mmpi2_getJawabanBySiswaMapel_multi ?
                                                props.row?.v4_ujian_mmpi2_getJawabanBySiswaMapel_multi :
                                                "-" }}</span>
                                        </span>
                                        <span v-else-if="props.column.field == 'ujiankhusus_proses_short'"
                                            class="flex items-center gap-1">
                                            <svg v-if="props.row?.ujiankhusus_proses_short"
                                                xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                        <span v-else-if="props.column.field == 'ujiankhusus_proses_redis_short'"
                                            class="flex items-center gap-1">
                                            <svg v-if="props.row?.ujiankhusus_proses_redis_short"
                                                xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                        <span v-else-if="props.column.field == 'tgl_batas_mulai'">
                                            {{ moment(props.row?.tgl_batas_mulai).format(formatTanggal) }}
                                        </span>
                                        <span v-else-if="props.column.field == 'tgl_batas_terakhir'">
                                            {{ moment(props.row?.tgl_batas_terakhir).format(formatTanggal) }}
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

            </span>
        </div>
    </span>
    <!-- Modal Konfirmasi Download -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
            <h3 class="text-lg font-bold mb-4">Konfirmasi Download</h3>
            <p class="mb-6">{{ confirmMessage }}</p>
            <div class="flex justify-end space-x-3">
                <button class="btn btn-sm btn-secondary" @click="showConfirmModal = false">
                    Batal
                </button>
                <button class="btn btn-sm btn-success" @click="fn_download_file(true)">
                    Ya, Download
                </button>
            </div>
        </div>
    </div>
</template>
