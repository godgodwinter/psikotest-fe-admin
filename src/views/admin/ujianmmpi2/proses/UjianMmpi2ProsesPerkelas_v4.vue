<script setup>
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
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
        label: "Reset",
        field: "reset",
        type: "String",
    },
    {
        label: "Hasil",
        field: "hasil",
        type: "String",
    },

    // {
    //     label: "IQ ",
    //     field: "proses_iq_ist",
    //     type: "String",
    // },
    // {
    //     label: "IQ 8KM",
    //     field: "proses_iq_8km",
    //     type: "String",
    // },
    // {
    //     label: "progres",
    //     field: "progres_angka",
    //     type: "number",
    // },
    {
        label: "Progres Status",
        field: "progres_status",
        type: "String",
    },
    {
        label: "Username",
        field: "username",
        type: "String",
    },
    {
        label: "Password Default",
        field: "passworddefault",
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
    // {
    //     label: "Status",
    //     field: "status",
    //     type: "String",
    // },
    {
        label: "Paket",
        field: "paketsoal_nama",
        type: "String",
    },
    {
        label: "Kelas",
        field: "kelas_nama",
        type: "String",
    },

    {
        label: "Siswa Id",
        field: "id",
        type: "String",
    },
    {
        label: "mapel_id First",
        field: "mapel_id",
        type: "String",
    },
];

const getData = async () => {
    try {
        console.log('====================================');
        console.log('#getData V3');
        console.log('====================================');
        isLoading.value = true;
        const response = await ApiUjianKhusus.get(`/mmpi2/proses/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}`);
        data.value = response.data;

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
        name: "admin-sekolah-submenu-ujianmmpi2-v4",
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
            <article class="prose lg:prose-sm">
                <h1>UJIAN MMPI 2 KELAS {{ kelas_nama }} </h1>
                <h5>UJIAN MMPI 2 - V4</h5>
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
            <!-- !PENGATURAN -->

            <div class="flex justify-start w-full space-x-2 content-center py-2">


                <div class="w-1/2 md:flex  space-x-2 space-y-2 md:space-y-0">
                    <div>
                        <VueDatePicker v-model="dataForm.tgl_batas_mulai"></VueDatePicker>
                    </div>
                    <div>
                        <VueDatePicker v-model="dataForm.tgl_batas_terakhir"></VueDatePicker>
                    </div>

                    <!-- <div>
                        <p class="py-2"> Paket Aktif : Auto
                            {{ paketsoal_aktif?.nama }}
                        </p>
                    </div> -->
                </div>
                <div>
                    <div class="py-0">
                        <button class="btn btn-sm btn-info p-2" @click="doPilihPaket()">
                            Apply</button>
                    </div>
                </div>
            </div>
            <!-- <div>
                <p>Catatan : Paket Aktif Otomatis </p>
            </div> -->
            <div class="space-x-2 shadow-sm">
                <!-- !hidden superadmin -->
                <button class="btn btn-sm btn-error p-2" @click="doDeleteProsesSiswaPerkelas()"
                    v-if="isSuperadminActive">
                    Delete Per Kelas
                </button>
                <button class="btn btn-sm  bg-emerald-500 text-white 
         hover:bg-emerald-600  p-2" @click="doGenerateSiswaPerkelas()">
                    Generate UJIAN MMPI 2 Per Kelas (V4)
                </button>
                <button class="btn btn-sm p-2 
         bg-amber-500 text-white 
         hover:bg-amber-600 
         focus:outline-none focus:ring-2 focus:ring-amber-400 
         active:bg-amber-700 
         rounded" @click="doCachingRedisPerKelas()">
                    Caching Perkelas
                    <!-- UJIAN KHUSUS Per Kelas V3 -->
                </button>
            </div>
            <div class="space-x-2 space-y-0 shadow-sm flex justify-start ">
                <div class="space-x-2 space-y-2 shadow-sm py-1">
                    <button class="btn btn-sm   bg-cyan-500 text-white 
         hover:bg-cyan-600  tooltip" data-tip="Generate Hasil Ujian V4" @click="doGenerateHasilPerkelas_v4(true)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                        </svg>


                    </button>
                    <!-- <button class="btn btn-sm btn-warning tooltip" data-tip="Generate Hasil Ujian V3"
                        @click="doGenerateHasilPerkelas()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                        </svg>


                    </button> -->
                    <button class="btn btn-sm btn-secondary tooltip" data-tip="Generate Hasil Ujian Tanpa Replace V4"
                        @click="doGenerateHasilPerkelas_v4(false)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                        </svg>


                    </button>
                </div>
                <div class="space-x-2 space-y-2 shadow-sm py-1">
                    <!-- <button class="btn btn-sm btn-info tooltip" data-tip="Export Excel Format IST V3"
                        @click="doExportExcel()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>

                    </button> -->


                </div>
            </div>

            <div class="space-x-2 space-y-0 shadow-sm flex justify-start ">
                <button class="btn btn-sm btn-success tooltip" data-tip="Export Excel Format IST"
                    @click="doExportExcel_v2()">
                    EXPORT REKAP V3 (.xlsx) / OLD
                </button>
                <button class="btn btn-sm btn-success tooltip" data-tip="Export Excel Format IST + fakultas"
                    @click="doExportExcel_v2_fakultas()">
                    EXPORT REKAP V3 (.xlsx) + fakultas / OLD
                </button>
                <!-- <button class="btn btn-sm btn-success tooltip" data-tip="Export Excel Format IST"
                    @click="doExportExcel_v4()">
                    EXPORT REKAP V4 (.xlsx)
                </button>

                <button class="btn btn-sm btn-success tooltip" data-tip="Export Excel Format IST (fakultas)"
                    @click="doExportExcel_v4_fakultas()">

                    EXPORT REKAP V4 + FAKULTAS (.xlsx)
                </button> -->
                <button class="btn btn-sm btn-info tooltip"
                    data-tip="Export Excel 1010  v4 (export_rekap_jawaban_siswa)" @click="doExport1010_v4()">
                    Export Excel 1010 v4 (.xlsx)
                </button>
            </div>

            <div class="space-x-2 space-y-2 shadow-sm py-1">

                <button class="btn btn-sm btn-info tooltip" data-tip=" Sinkron Data Redis v3"
                    @click="do_Sinkron_dataRedis()">
                    Sinkron Data Redis V3
                </button>
                <button class="btn btn-sm btn-info tooltip" data-tip=" Export Data Mentah Hasil Ujian"
                    @click="do_GenerateDataMentah_v4()">
                    Export Data Mentah Hasil Ujian V4
                </button>
                <!-- <button class="btn btn-sm btn-info tooltip" data-tip=" Export Data Mentah Hasil Ujian"
                    @click="do_GenerateDataMentah()">
                    Export Data Mentah Hasil Ujian V3
                </button> -->

            </div>
            <div class="space-x-2 space-y-2 shadow-sm py-1">

                <button class="btn btn-sm btn-success" @click="dashboard_doCetak_mmpi()">
                    Dashboard - Cetak MMPI</button>
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
                                }" :pagination-options="{
                                    enabled: true,
                                    perPageDropdown: [50, 100, 150, 200],
                                }" styleClass="vgt-table striped bordered condensed" class="py-0">
                                    <template #table-actions>
                                        <div class="space-x-1 space-y-1 gap-1">
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
                                            <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                                <div>
                                                    <button class="btn btn-sm  tooltip   bg-amber-500 text-white 
         hover:bg-amber-600 " data-tip="Caching #1 Persiswa " @click="doCachingRedisPerSiswa(props.row.id)">Caching

                                                        <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                                                    </svg> -->
                                                    </button>

                                                    <!-- <button class="btn btn-sm tooltip  bg-red-500 text-white 
         hover:bg-red-600 " data-tip="Caching #2 Persiswa" @click="doCachingRedisPerSiswa_v4(props.row.id)">
                                                        Caching #2
                                                    </button> -->
                                                </div>
                                                <button class="btn btn-sm  bg-cyan-500 text-white 
         hover:bg-blue-600  tooltip" data-tip="Generate hasil v4 " @click="mmpi2_doGenerateHasilPersiswa(props.row.id)"
                                                    v-if="isSuperadminActive">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                                                    </svg>

                                                </button>
                                                <button class="btn btn-sm  bg-emerald-500 text-white 
         hover:bg-emerald-600  tooltip" data-tip="Generate UJIAN MMPI 2 v4 " @click="doGenerateSiswa(props.row.id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-error tooltip"
                                                    data-tip="Delete UJIAN MMPI 2 v4 "
                                                    @click="doDeleteProsesSiswa(props.row.id, props.row.proses_id)"
                                                    v-if="isSuperadminActive">
                                                    <!-- v-if="props.row.paketsoal_nama"> -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </span>


                                        <span v-else-if="props.column.field == 'reset'">
                                            <!-- Tombol Reset Waktu -->
                                            <button class="btn btn-sm btn-warning tooltip" data-tip="Reset Waktu"
                                                v-if="props.row.mmpi2" @click="mmpi2_do_reset_waktu(props.row.id)">
                                                <!-- Icon: Clock Arrow -->
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0Z" />
                                                </svg>
                                            </button>

                                            <!-- Tombol Force Finish -->
                                            <button class="btn btn-sm btn-primary tooltip" data-tip="Force Finish"
                                                v-if="props.row.mmpi2 && isSuperadminActive"
                                                @click="mmpi2_do_force_finish(props.row.id)">
                                                <!-- Icon: Flag Checkered -->
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M4.5 4.5l15 15M4.5 19.5l15-15" />
                                                </svg>
                                            </button>

                                            <!-- Tombol Reset All -->
                                            <button class="btn btn-sm btn-error tooltip" data-tip="Reset All"
                                                @click="mmpi2_do_reset_all(props.row.id, props.row.mmpi2?.mmpi2List?._id)"
                                                v-if="isSuperadminActive">
                                                <!-- Icon: Trash -->
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                                                </svg>
                                            </button>
                                        </span>

                                        <span v-else-if="props.column.field == 'hasil'">
                                            <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                                <!-- <RouterLink
                                                    :to="{ name: 'admin-sekolah-submenu-ujiankhusus-persiswa-reset-v3', params: { sekolah_id, kelas_id, siswa_id: props.row.id } }"> -->
                                                <button class="btn btn-sm btn-primary tooltip"
                                                    data-tip="Generate Hasil " v-if="props.row.mmpi2"
                                                    @click="mmpi2_doGenerateHasilPersiswa(props.row.id)">

                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                                    </svg>



                                                </button>
                                                <div v-else>-</div>
                                                <!-- </RouterLink> -->
                                            </div>
                                        </span>

                                        <span v-else-if="props.column.field == 'paketsoal_nama'">
                                            {{ props.row.mmpi2 ? props.row.mmpi2?.paket_nama :
                                                "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'kelas_nama'">
                                            {{ props.row.kelas ? props.row.kelas?.nama : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'tgl_batas_mulai'">
                                            {{ props.row.mmpi2?.tgl_batas_mulai ?
                                                moment(props.row.mmpi2?.tgl_batas_mulai).format(formatTanggal)
                                                : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'tgl_batas_terakhir'">

                                            {{ props && props.row && props.row.mmpi2 &&
                                                props.row.mmpi2.tgl_batas_terakhir
                                                ?
                                                moment(props.row.mmpi2?.tgl_batas_terakhir).format(formatTanggal)
                                                : " - " }}
                                        </span>

                                        <!-- <span v-else-if="props.column.field == 'progres_status'">
                                            <div v-if="props.row.progres_status">{{ props.row.progres_status }}</div>
                                            <div v-else>
                                                <div
                                                    v-if="props.row?.mmpi2?.mmpi2List?.status == 'true' || props.row?.mmpi2?.mmpi2List?.status == 'Aktif'">
                                                    Aktif</div>
                                                <div v-else-if="props.row?.mmpi2?.mmpi2List?.status == 'Proses'">Proses
                                                </div>
                                                <div v-else-if="props.row?.mmpi2?.mmpi2List?.status == 'Selesai'">
                                                    Selesai
                                                </div>
                                                <div v-else>-</div>
                                            </div>
                                        </span> -->

                                        <span v-else-if="props.column.field == 'progres_status'">
                                            {{ props.row.progres_status }}
                                        </span>
                                        <span v-else-if="props.column.field == 'mapel_id'">
                                            <div v-if="props.row.mmpi2">{{ props.row.mmpi2?.mmpi2List?._id }}</div>
                                        </span>
                                        <span v-else-if="props.column.field == 'progres_angka'">
                                            <div v-if="props.row.mmpi2">{{ props.row.progres_angka?.progres }}/{{
                                                props.row.progres_angka?.total }}</div>
                                            <div v-else>-</div>
                                        </span>

                                        <span v-else-if="props.column.field == 'username'">
                                            <div class="flex justify-center gap-2">
                                                <div class="text-center">{{ props.row.username }}</div>
                                                <span v-if="props.row.username"
                                                    @click="doCopyClipboard(props.row.username)"
                                                    class="hover:text-primary cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </span>

                                        <span v-else-if="props.column.field == 'passworddefault'">
                                            <div class="flex justify-center gap-2">
                                                <div class="text-center">{{ props.row.passworddefault }}</div>
                                                <span v-if="props.row.passworddefault"
                                                    @click="doCopyClipboard(props.row.passworddefault)"
                                                    class="hover:text-primary cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </span>

                                        <!-- <span v-else-if="props.column.field == 'tgl_ujian'">
                                            <div class="flex justify-center gap-2" v-if="props.row.tgl_ujian">
                                                {{ moment(props.row.tgl_ujian).format("DD MMMM YYYY H:m:ss") }}
                                            </div>
                                            <div v-else>-</div>
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

            </span>
        </div>
    </span>
</template>
