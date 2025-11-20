<script setup>
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";

import { fn_copy_id_for_mongo } from "@/lib/FungsiBasic.js"
import { ref, defineAsyncComponent, computed, onBeforeUnmount, reactive } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import ButtonDelete from "@/components/atoms/ButtonDel.vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "@/components/lib/Toast";
import { useAdminPagesStore } from '@/stores/admin/adminPagesStore'
import C_ujiankhusus_menu from '@/views/ist/C_ujiankhusus_menu.vue'

import useClipboard from 'vue-clipboard3'
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import { useSuperadminStore } from '@/stores/admin/superadminPagesStore';

import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/style.css'

import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, TransitionRoot } from '@headlessui/vue'


// const tipeCitacitaList = ref([
//     { label: 'Kelas 7-8', value: '78' },
//     { label: 'Kelas 9-10', value: '910' },
//     { label: 'Kelas 11-12', value: '1112' },
// ])

// const inputSelectTipeCitacita = ref(null)
const query = ref('')

const filteredOptions = computed(() => {
    if (!query.value) return tipeCitacitaList.value
    const q = query.value.toLowerCase()
    return tipeCitacitaList.value.filter(o => o.label.toLowerCase().includes(q))
})

const superadminStore = useSuperadminStore();
const isSuperadminActive = ref(superadminStore.isSuperadminActive)
moment.updateLocale("id", localization);

const VITE_API_FE_REACT = import.meta.env.VITE_API_FE_REACT
    ? import.meta.env.VITE_API_FE_REACT
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
        label: "Hasil",
        field: "hasil",
        type: "String",
    },

    {
        label: "IQ IST",
        field: "proses_iq_ist",
        type: "String",
    },
    {
        label: "IQ 8KM",
        field: "proses_iq_8km",
        type: "String",
    },
    {
        label: "progres",
        field: "progres_angka",
        type: "number",
    },
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
];

const getData = async () => {
    try {
        console.log('====================================');
        console.log('#getData V3');
        console.log('====================================');
        isLoading.value = true;
        const response = await ApiUjianKhusus.get(`/ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}`);
        data.value = response.data;

        // const tempData=response.data;
        // data.value = tempData.map(fn_copy_id_for_mongo);
        // console.log(data.value);
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
        name: "admin-sekolah-submenu-ujiankhusus-v4b",
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
    let getDataPaket = localStorage.getItem("ujiankhusus_paketsoal_aktif");
    paketsoal_aktif.value = getDataPaket ? JSON.parse(getDataPaket) : null;
    dataForm.value.tgl_batas_mulai = paketsoal_aktif.value.tgl_batas_mulai || moment();
    dataForm.value.tgl_batas_terakhir = paketsoal_aktif.value.tgl_batas_terakhir || moment().add(7, 'days');
    console.log(paketsoal_aktif.value);
    // console.log(paketsoal_aktif.value);
};
getPaketAktif();

const doPilihPaket = () => {
    let tempDataSave = {
        id: paketsoal_aktif.value.id,
        nama: paketsoal_aktif.value.nama,
        tgl_batas_mulai: dataForm.value.tgl_batas_mulai,
        tgl_batas_terakhir: dataForm.value.tgl_batas_terakhir,
        tipeCitacita: inputSelectTipeCitacita.value,
    }
    localStorage.setItem("ujiankhusus_paketsoal_aktif", JSON.stringify(tempDataSave))
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
            paketsoal_id: paketsoal_aktif.value.id,
            tgl_batas_mulai: dataForm.value.tgl_batas_mulai,
            tgl_batas_terakhir: dataForm.value.tgl_batas_terakhir,
            tipeCitacita: inputSelectTipeCitacita.value
        }
        console.log('====================================');
        console.log(dataFormSend);
        console.log('====================================');
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}`, dataFormSend);
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
const doDeleteProsesSiswa = async (id, proses_id) => {
    if (confirm("Apakah anda yakin menghapus data ujian ini?")) {
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.delete(`ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}`);
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
            paketsoal_id: paketsoal_aktif.value.id,
            tgl_batas_mulai: dataForm.value.tgl_batas_mulai,
            tgl_batas_terakhir: dataForm.value.tgl_batas_terakhir,
            tipeCitacita: inputSelectTipeCitacita.value
        }
        console.log('====================================');
        console.log(dataFormSend);
        console.log('====================================');
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}`, dataFormSend);
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
            const response = await ApiUjianKhusus.delete(`ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}`);
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
            const response = await ApiUjianKhusus.post(`ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/caching`);
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
            const response = await ApiUjianKhusus.post(`ujiankhusus/v4/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${id}/caching`, { optional_skip_jika_sudah_ada: true });
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
            const response = await ApiUjianKhusus.post(`ujiankhusus/proses/v3/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/caching`);
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
            const response = await ApiUjianKhusus.post(`/ujiankhusus/v4/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/do_generate_hasil_perkelas`, { replace: replace });
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
    if (confirm("Apakah anda yakin generate Hasil Kelas Ini?")) {
        console.log(`generate hasil kelas_id:${getSekolahAktif.value.kelas_id} sekolah_id ${getSekolahAktif.value.sekolah_id}`);
        // kelas_id.value 
        try {
            isLoading.value = true;
            const response = await ApiUjianKhusus.post(`/ujiankhusus/v4/sekolah/${getSekolahAktif.value.sekolah_id}/kelas/${getSekolahAktif.value.kelas_id}/siswa/${siswa_id}/do_generate_hasil_persiswa`);
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
const do_Sinkron_dataRedis_v4 = async (ttd) => {
    if (confirm("Apakah anda yakin sinkron data Redis  Kelas Ini?")) {

        try {
            isLoading.value = true;
            // let dataFormSend = {
            //     replace: false
            // };
            const response = await ApiUjianKhusus.post(`/ujiankhusus/hasil/sinkron_redis/v4/sekolah/${sekolah_id.value}/kelas/${kelas_id.value}`);
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
const dataTemp = JSON.parse(localStorage.getItem("ujiankhusus_paketsoal_aktif"));
const inputSelectTipeCitacita = ref(dataTemp?.tipeCitacita || {
    id: 2,
    label: "Kelas 9-10",
},)

const formatTanggal = "DD MMMM YYYY HH:mm:ss";

// const sse_doGenerate_perkelas = () => {
//     const kelas_id = getSekolahAktif.value.kelas_id
//     console.log('====================================');
//     console.log(`#sse_doGenerate_perkelas:`, kelas_id);
//     console.log('====================================');

// }


// 🔧 reset SEMUA jejak run sebelumnya
function resetStreamStates() {
    logs.value = [];
    counts.value = { success: 0, failed: 0 };
    rawEvents.value = [];
    detailMap.clear();
    lastStep.value = null;
    lastMax.value = null;
}

// --- UI STATE
const isStreaming = ref(false);
const isBusy = ref(false);
const showModal = ref(false);
const status = ref("-");
const progress = ref(0);
const logs = ref([]);
const jobId = ref(null);
const eventSourceRef = ref(null);
const modalRef = ref(null);

// state baru (opsional)
const counts = ref({ success: 0, failed: 0 });
const jobKey = ref(null); // kalau backend pakai ?key=..., isi dari respons generate

function clamp(n, a = 0, b = 100) { return Math.max(a, Math.min(b, n)); }
function jparse(s) { try { return JSON.parse(s); } catch { return null; } }


const kelasIdShown = computed(() => getSekolahAktif.value?.kelas_id ?? "-");

function logPush(msg) {
    const t = moment().format("HH:mm:ss");
    logs.value.push(`[${t}] ${msg}`);
}
function resetUi() { status.value = "idle"; progress.value = 0; logs.value = []; jobId.value = null; }
function openModal() { showModal.value = true; }

// ❗ Close kini memutus SSE + menutup modal, walau masih streaming
function closeModal() {
    detachSSE();
    showModal.value = false;
}

function detachSSE() {
    if (eventSourceRef.value) {
        eventSourceRef.value.close?.();
        eventSourceRef.value = null;
    }
    isStreaming.value = false;
}

onBeforeUnmount(() => detachSSE());

function withTrailingSlash(s) {
    if (!s) return "/";
    return s.endsWith("/") ? s : s + "/";
}

const RAW_BASE = import.meta.env.VITE_API_TS_IST_BASE_URL_; // contoh: http://127.0.0.1:11001/
const BASE_PATH = withTrailingSlash(RAW_BASE);               // -> pastikan ada trailing slash

// --- Core: attach SSE
function attachSSE(kelas_id, theJobId) {
    resetStreamStates();      // <-- penting
    detachSSE();
    isStreaming.value = true;

    // endpoint SSE persis seperti Postman-mu: /api/v1/ujiankhusus/sse/example/kelas/:id/jobs/events?jobId=...
    const qs = new URLSearchParams({ jobId: theJobId });
    if (jobKey.value) qs.append("key", jobKey.value); // opsional, kalau backend butuh
    const url = `${BASE_PATH}api/v1/ujiankhusus/sse/example/kelas/${encodeURIComponent(kelas_id)}/jobs/events?${qs.toString()}`;

    logPush(`Attach SSE => ${url}`);

    const es = new EventSource(url, { withCredentials: true });
    eventSourceRef.value = es;

    es.onopen = () => {
        status.value = "streaming";
        logPush("SSE connected");
    };


    // --- EVENT: snapshot
    es.addEventListener("snapshot", (evt) => {
        const p = jparse(evt.data) || {};
        if (typeof p.percent === "number") progress.value = clamp(p.percent);
        if (p.status) status.value = p.status;
        if (p.counts) counts.value = p.counts;

        pushRaw('snapshot', p);        // <— RAW JSON
        upsertDetail(p);               // <— DETAIL

        const s = [
            `snapshot: step ${p.step ?? "-"} / ${p.max ?? "-"}`,
            `${progress.value ?? 0}%`,
            `success:${p.counts?.success ?? 0}`,
            `failed:${p.counts?.failed ?? 0}`,
        ].join(" • ");
        logPush(s);
    });

    // --- EVENT: progress
    es.addEventListener("progress", (evt) => {
        const p = jparse(evt.data) || {};
        if (p.counts) counts.value = p.counts;

        const { stepNow, maxNow } = getStepAndMax(p);
        const est = Math.floor((stepNow / maxNow) * 100);

        progress.value = Math.max(progress.value, clamp(est));
        lastStep.value = stepNow;
        lastMax.value = maxNow;

        pushRaw("progress", p);
        upsertDetail(p);

        const phase = p.meta?.phase ? `phase:${p.meta.phase}` : "";
        const siswa = p.meta?.nama_siswa || p.meta?.siswa_id ? ` • ${p.meta?.nama_siswa ?? p.meta?.siswa_id}` : "";
        logPush(`progress: [${stepNow} / ${maxNow}] ${p.stepStatus ?? ""} ${phase}${siswa}`);
    });


    // --- EVENT: done
    es.addEventListener("done", (evt) => {
        const p = jparse(evt.data) || {};
        const { stepNow, maxNow } = getStepAndMax(p);

        lastStep.value = maxNow; // pastikan tampil n/n
        lastMax.value = maxNow;
        progress.value = 100;
        status.value = "completed";

        if (p.result?.data) counts.value = p.result.data;
        pushRaw("done", p);
        upsertDetail({ ...p, stepStatus: "success", step: stepNow });

        logPush(`done: success:${p.result?.data?.success ?? 0} failed:${p.result?.data?.failed ?? 0} (${p.result?.success ? "OK" : "NOT OK"})`);
        detachSSE();
    });


    // optional: message/error juga dorong ke RAW
    es.onmessage = (evt) => {
        const p = jparse(evt.data);
        pushRaw('message', p ?? evt.data);
        if (p) upsertDetail(p);
        // ...sisanya tetap seperti punyamu
    };
    es.onerror = () => {
        pushRaw('error', { note: 'SSE error/disconnected' });
        // ...sisanya tetap
    };


    // --- fallback: pesan tanpa event name (optional dari server)
    es.onmessage = (evt) => {
        // kalau server kadang kirim "message" biasa
        const p = jparse(evt.data);
        if (p) {
            if (typeof p.percent === "number") progress.value = clamp(p.percent);
            if (p.status) status.value = p.status;
            logPush(`message: ${evt.data}`);
            if (p.done === true || p.status === "completed") {
                progress.value = 100;
                detachSSE();
            }
        } else {
            logPush(evt.data || "(event tanpa data)");
        }
    };

    es.onerror = () => {
        logPush("SSE error / disconnected");
        if (status.value !== "completed") status.value = "disconnected";
        detachSSE();
    };
}


// --- Cek job current
async function fetchCurrentJob(kelas_id) {
    const url = `${BASE_PATH}api/v1/ujiankhusus/proses/v3/sekolah/${getSekolahAktif.value?.sekolah_id}/kelas/${encodeURIComponent(kelas_id)}/sse/v2/current`;
    // Berdasarkan info Anda: method = POST
    const { data } = await ApiUjianKhusus.post(url, {}); // payload bisa kosong/sesuaikan server
    // Normalisasi output:
    // ekspektasi: { data: { jobId, status, key? } } atau { jobId, status }
    const out = data?.data || data;
    return out?.jobId ? out : null;
}

// --- Do generate job baru
async function doGenerateJob(kelas_id) {

    let dataFormSend = {
        paketsoal_id: paketsoal_aktif.value.id,
        tgl_batas_mulai: dataForm.value.tgl_batas_mulai,
        tgl_batas_terakhir: dataForm.value.tgl_batas_terakhir,
        tipeCitacita: inputSelectTipeCitacita.value
    }
    console.log(`#doGenerateJob:`, dataFormSend, getSekolahAktif.value?.sekolah_id, getSekolahAktif.value?.kelas_id);
    const url = `${BASE_PATH}api/v1/ujiankhusus/proses/v3/sekolah/${getSekolahAktif.value?.sekolah_id}/kelas/${encodeURIComponent(kelas_id)}/sse/v2`;
    // const url = `${BASE_PATH}api/v1/ujiankhusus/sse/example/kelas/${encodeURIComponent(kelas_id)}/jobs`;
    const body = {
        ...dataFormSend,
        // tanggal: moment().format("YYYY-MM-DD"),
        // max: 20,
    };
    const { data } = await ApiUjianKhusus.post(url, body);
    const out = data?.data || data;
    if (!out?.jobId) throw new Error("jobId tidak ditemukan pada respons generate");

    jobKey.value = out.key || out.serviceKey || null; // kalau server butuh ?key=
    return out; // { jobId, status, max, ... }
}

// --- Public: dipanggil dari tombol
const sse_doGenerate_perkelas = async () => {
    const kelas_id = getSekolahAktif.value?.kelas_id;
    if (!kelas_id) {
        return alert("kelas_id tidak ditemukan");
    }

    resetUi();
    resetStreamStates();      // <-- penting
    openModal();
    isBusy.value = true;
    status.value = "checking";

    try {
        logPush(`Cek job current untuk kelas #${kelas_id}…`);
        // 1) cek job current
        const current = await fetchCurrentJob(kelas_id);

        if (current) {
            // ada job -> langsung attach SSE
            jobId.value = current.jobId;
            status.value = current.status || "queued";
            logPush(`Ditemukan job aktif: ${jobId.value} (status: ${status.value})`);
            attachSSE(kelas_id, jobId.value);
        } else {
            // tidak ada job -> create/generate
            status.value = "creating";
            logPush("Tidak ada job aktif. Membuat job baru…");
            const created = await doGenerateJob(kelas_id);
            jobId.value = created.jobId;
            status.value = created.status || "queued";
            logPush(`Job baru dibuat: ${jobId.value}`);
            attachSSE(kelas_id, jobId.value);
        }
    } catch (e) {
        console.error(e);
        status.value = "failed";
        logPush(`Error: ${e?.message || e}`);
        detachSSE();
    } finally {
        isBusy.value = false;
    }
};

// --- UX util

// 🔗 Copy util
async function copyLogs() {
    try { await navigator.clipboard.writeText(logs.value.join("\n")); logPush("Log disalin ke clipboard."); }
    catch { logPush("Gagal menyalin log."); }
}
async function copyJobId() {
    if (!jobId.value) return;
    try { await navigator.clipboard.writeText(jobId.value); logPush("Job ID disalin ke clipboard."); }
    catch { logPush("Gagal menyalin Job ID."); }
}


// Tabs
const activeTab = ref("detail");

// simpan raw event: {type, ts, pretty}
const rawEvents = ref([]);

// simpan detail terstruktur (di-update per step/siswa)
const detailMap = reactive(new Map()); // key unik, val = item terstruktur
const detailItems = computed(() =>
    Array.from(detailMap.values()).sort((a, b) => (a.step ?? 0) - (b.step ?? 0))
);

// last step/max (buat header)
const lastStep = ref(null);
const lastMax = ref(null);

// badge class
function statusBadgeClass(s) {
    if (s === 'success') return 'badge-success';
    if (s === 'failed') return 'badge-error';
    if (s === 'processing') return 'badge-warning';
    return 'badge-ghost';
}

// util push raw pretty
function pushRaw(type, payload) {
    rawEvents.value.push({
        type,
        ts: moment().format("HH:mm:ss"),
        pretty: JSON.stringify(payload, null, 2),
    });
}

// buat ID unik per baris detail
function detailKey(p) {
    // prioritas gabungan step + siswa_id + phase agar tidak tabrakan
    return [
        p.step ?? '-',
        p.meta?.siswa_id ?? '-',
        p.meta?.phase ?? '-'
    ].join(':');
}


function getStepAndMax(p) {
    const stepNow = p?.step ?? detailItems.value?.length ?? 0;
    const maxNow = (data.value?.length ?? 0) + 3;
    return { stepNow, maxNow };
}


function upsertDetail(p) {
    const key = detailKey(p);
    const prev = detailMap.get(key) || {};

    const { stepNow, maxNow } = getStepAndMax(p);

    const est = maxNow > 0
        ? Math.max(0, Math.min(100, Math.floor((stepNow / maxNow) * 100)))
        : 0;

    detailMap.set(key, {
        _id: key,
        ts: moment().format("HH:mm:ss"),
        step: stepNow,
        max: maxNow,
        phase: p.meta?.phase ?? prev.phase,
        nama: p.meta?.nama_siswa ?? p.meta?.siswa_id ?? prev.nama,
        status: p.stepStatus ?? p.status ?? prev.status ?? "processing",
        estimated: est,
    });

    lastStep.value = stepNow;
    lastMax.value = maxNow;
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
            <div>
                <C_ujiankhusus_menu :sekolah_id="getSekolahAktif?.sekolah_id" :kelas_id="getSekolahAktif?.kelas_id" />
            </div>

            <div class="w-full bg-base-100 shadow-sm rounded-lg py-3 px-4">
                <div class="flex items-center justify-between">
                    <!-- Judul -->
                    <div>
                        <h1 class="text-lg font-bold">UJIAN IQ : KELAS {{ kelas_nama }}</h1>
                        <h5 class="text-sm text-gray-500">UJIAN KHUSUS - V4b</h5>
                    </div>

                    <!-- Dropdown + Tombol -->
                    <div class="flex items-center gap-2">
                        <v-select class="w-64" :options="pilihKelas" v-model="inputCariKelas"
                            v-bind:class="{ disabled: false }">
                        </v-select>
                        <button class="btn btn-sm btn-info px-4" @click="doPilihKelas()">
                            Cari
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-base-100 shadow-sm rounded-lg p-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Tipe Cita cita
                                <!-- {{ data?.length }} -->
                                :</span>
                        </label>

                        <div class="relative">
                            <!-- Select disamakan seperti input -->
                            <select v-model="inputSelectTipeCitacita"
                                class="input input-bordered w-full h-11 pr-10 appearance-none">
                                <option :value="null" disabled selected>Pilih tipe…</option>
                                <option v-for="o in tipeCitacitaList" :key="o.value" :value="o">
                                    {{ o.label }}
                                </option>
                            </select>

                            <!-- Ikon chevron (visual dropdown) -->
                            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                        clip-rule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    <!-- Kolom 2: Tanggal Mulai -->
                    <div class="form-control">
                        <label class="label"><span class="label-text">Tanggal Mulai:</span></label>
                        <VDatePicker v-model="dataForm.tgl_batas_mulai" mode="dateTime" is24hr
                            :popover="{ placement: 'bottom-start' }" :masks="{ input: 'DD/MM/YYYY HH:mm' }">
                            <template #default="slot">
                                <input class="input input-bordered w-full h-11" :value="slot.inputValue"
                                    v-on="slot.inputEvents" placeholder="DD/MM/YYYY HH:mm" />
                            </template>
                        </VDatePicker>
                    </div>

                    <!-- Kolom 3: Tanggal Selesai -->
                    <div class="form-control">
                        <label class="label"><span class="label-text">Tanggal Selesai:</span></label>
                        <VDatePicker v-model="dataForm.tgl_batas_terakhir" mode="dateTime" is24hr
                            :popover="{ placement: 'bottom-start' }" :masks="{ input: 'DD/MM/YYYY HH:mm' }">
                            <template #default="slot">
                                <input class="input input-bordered w-full h-11" :value="slot.inputValue"
                                    v-on="slot.inputEvents" placeholder="DD/MM/YYYY HH:mm" />
                            </template>
                        </VDatePicker>
                    </div>
                </div>

                <!-- Baris 2: Info kiri, Apply kanan -->
                <div class="flex items-center justify-between">
                    <p class="text-sm">
                        <span class="font-medium">Ujian Psikologi</span>
                        <span class="ml-2">{{ paketsoal_aktif?.nama }}</span>
                    </p>
                    <button class="btn btn-info btn-sm md:btn-md px-5" @click="doPilihPaket()">Apply</button>
                </div>

                <!-- Catatan -->
                <div class="rounded-lg bg-base-200 p-4 text-sm leading-relaxed">
                    <p class="font-medium mb-2">Catatan:</p>
                    <ul class="list-disc ml-5 space-y-1">
                        <li>Sebelum mulai, pastikan paket sudah diaktifkan di menu <b>Paketsoal</b>.</li>
                        <li>Kalau ada ujian susulan, jangan gunakan fitur <b>generate perkelas</b>.</li>
                        <li>Untuk ujian susulan, gunakan opsi <b>generate persiswa</b> agar lebih aman.</li>
                    </ul>
                </div>

            </div>


            <!-- === ACTION SECTIONS (rapi & urut) === -->
            <div class="space-y-3">
                <!-- PROSES BARU-->
                <div class="flex items-start gap-3">
                    <div class="w-28 shrink-0 text-xs uppercase font-semibold text-base-content/60 pt-2">
                        Proses
                    </div>
                    <div class="flex flex-wrap items-center gap-2 grow">
                        <div class="flex items-center gap-2">
                            <button class="btn btn-sm btn-primary" @click="sse_doGenerate_perkelas" :disabled="isBusy">
                                <span v-if="!isStreaming">btn-generate</span>
                                <span v-else class="loading loading-spinner loading-xs mr-2" /> <span
                                    v-if="isStreaming">Memproses…</span>
                            </button>

                            <!-- Modal Progres -->
                            <dialog ref="modalRef" class="modal modal-open" v-if="showModal">
                                <div class="modal-box max-w-4xl">
                                    <div class="flex items-center justify-between mb-3">
                                        <h3 class="font-bold text-lg">Proses Generate Per Kelas</h3>
                                        <button class="btn btn-ghost btn-sm" @click="closeModal">✕</button>
                                    </div>

                                    <!-- Ringkasan -->
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                        <div class="p-3 rounded-xl bg-base-200">
                                            <div class="text-xs opacity-70">Kelas</div>
                                            <div class="font-semibold truncate">#{{ kelasIdShown }}</div>
                                        </div>
                                        <div class="p-3 rounded-xl bg-base-200">
                                            <div class="text-xs opacity-70 flex items-center justify-between">
                                                <span>Job ID</span>
                                                <button class="btn btn-ghost btn-xs" @click="copyJobId"
                                                    :disabled="!jobId">Copy</button>
                                            </div>
                                            <div class="font-mono text-xs break-all select-all">
                                                {{ jobId || '-' }}
                                            </div>
                                        </div>
                                        <div class="p-3 rounded-xl bg-base-200">
                                            <div class="text-xs opacity-70">Status</div>
                                            <div class="font-semibold capitalize">{{ status }}</div>
                                        </div>
                                        <div class="p-3 rounded-xl bg-base-200">
                                            <div class="text-xs opacity-70">Progress</div>
                                            <div class="font-semibold">{{ progress }}%</div>
                                        </div>
                                    </div>

                                    <!-- Progress bar -->
                                    <progress class="progress progress-primary w-full mb-3" :value="progress"
                                        max="100"></progress>

                                    <!-- Tabs -->
                                    <div role="tablist" class="tabs tabs-bordered mb-3">
                                        <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 'ringkas' }"
                                            @click="activeTab = 'ringkas'">Ringkas</a>
                                        <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 'detail' }"
                                            @click="activeTab = 'detail'">
                                            Detail Step
                                            <span v-if="detailItems.length" class="badge badge-ghost ml-2">{{
                                                detailItems.length
                                                }}</span>
                                        </a>
                                        <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 'raw' }"
                                            @click="activeTab = 'raw'">Raw JSON</a>
                                    </div>

                                    <!-- RINGKAS -->
                                    <div v-if="activeTab === 'ringkas'"
                                        class="h-48 overflow-auto rounded-xl border border-base-300 p-3 bg-base-100 text-sm font-mono whitespace-pre-wrap">
                                        <div v-if="logs.length === 0" class="opacity-60">Menunggu event…</div>
                                        <template v-else>
                                            <div v-for="(line, idx) in logs" :key="idx" class="mb-1">{{ line }}</div>
                                        </template>
                                    </div>

                                    <!-- DETAIL STEP (berwarna + ikon) -->
                                    <div v-if="activeTab === 'detail'" class="space-y-3">
                                        <!-- ringkasan count -->
                                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            <div class="stat border rounded-xl">
                                                <div class="stat-title">Sukses</div>
                                                <div class="stat-value text-success">{{ counts.success }}</div>
                                            </div>
                                            <div class="stat border rounded-xl">
                                                <div class="stat-title">Gagal</div>
                                                <div class="stat-value text-error">{{ counts.failed }}</div>
                                            </div>
                                            <div class="stat border rounded-xl">
                                                <div class="stat-title">Step</div>
                                                <div class="stat-value">{{ (lastStep || 0) }} / {{ (lastMax || '-') }}
                                                </div>
                                            </div>
                                            <div class="stat border rounded-xl">
                                                <div class="stat-title">Status</div>
                                                <div class="stat-value capitalize">{{ status }}</div>
                                            </div>
                                        </div>

                                        <!-- daftar step -->
                                        <div
                                            class="h-56 overflow-auto rounded-xl border border-base-300 p-2 bg-base-100">
                                            <div v-if="detailItems.length === 0" class="p-4 opacity-60">Belum ada
                                                detail.
                                            </div>

                                            <div v-for="it in detailItems" :key="it._id"
                                                class="card card-compact border mb-2">
                                                <div class="card-body py-3">
                                                    <div class="flex items-center gap-2">
                                                        <div class="font-mono text-xs opacity-70">#{{ it.step }}/{{
                                                            it.max }}</div>

                                                        <!-- badge status -->
                                                        <div :class="['badge', statusBadgeClass(it.status)]">
                                                            <span v-if="it.status === 'success'">✔️</span>
                                                            <span v-else-if="it.status === 'failed'">✖️</span>
                                                            <span v-else>⏳</span>
                                                            <span class="ml-1 capitalize">{{ it.status }}</span>
                                                        </div>

                                                        <div class="divider divider-horizontal my-0"></div>

                                                        <!-- info siswa / phase -->
                                                        <div class="truncate">
                                                            <span class="opacity-70">phase:</span>
                                                            <span class="font-medium">{{ it.phase || '-' }}</span>
                                                            <span v-if="it.nama" class="opacity-70"> • </span>
                                                            <span v-if="it.nama" class="font-medium">{{ it.nama
                                                                }}</span>
                                                        </div>

                                                        <div class="ml-auto text-xs opacity-60 font-mono">{{ it.ts }}
                                                        </div>
                                                    </div>

                                                    <!-- progress kecil per item (opsional) -->
                                                    <progress v-if="it.status === 'processing'"
                                                        class="progress progress-info w-full mt-2" :value="it.estimated"
                                                        max="100">
                                                    </progress>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- RAW JSON -->
                                    <div v-if="activeTab === 'raw'"
                                        class="h-56 overflow-auto rounded-xl border border-base-300 p-3 bg-base-100 text-xs font-mono">
                                        <div v-if="rawEvents.length === 0" class="opacity-60">Belum ada data.</div>
                                        <details v-for="(r, idx) in rawEvents" :key="idx" class="mb-2">
                                            <summary class="cursor-pointer">
                                                <span class="badge badge-ghost mr-2">#{{ idx + 1 }}</span>
                                                {{ r.ts }} — <span class="capitalize">{{ r.type }}</span>
                                            </summary>
                                            <pre class="mt-2">{{ r.pretty }}</pre>
                                        </details>
                                    </div>


                                    <!-- Action -->
                                    <div class="modal-action">
                                        <button class="btn btn-outline btn-sm" @click="copyLogs"
                                            :disabled="logs.length === 0">Copy
                                            log</button>
                                        <button class="btn btn-sm" @click="closeModal">Tutup</button>
                                    </div>
                                </div>
                                <form method="dialog" class="modal-backdrop" @click="closeModal"><button>close</button>
                                </form>
                            </dialog>
                        </div>
                        <!-- Destructive: taruh paling kanan & hanya superadmin -->
                        <div class="ms-auto" v-if="isSuperadminActive">
                            <button class="btn btn-sm btn-outline btn-error" @click="doDeleteProsesSiswaPerkelas()">
                                Delete Per Kelas V3
                            </button>
                        </div>
                    </div>
                </div>
                <!-- PROSES -->
                <div class="flex items-start gap-3">
                    <div class="w-28 shrink-0 text-xs uppercase font-semibold text-base-content/60 pt-2">
                        Proses
                    </div>
                    <div class="flex flex-wrap items-center gap-2 grow">
                        <button class="btn btn-sm btn-primary" @click="doGenerateSiswaPerkelas()">
                            Generate UJIAN KHUSUS (Per Kelas V3)
                        </button>

                        <button class="btn btn-sm btn-warning text-white" @click="doCachingRedisPerKelas()">
                            Caching #1 Per Kelas
                        </button>

                        <button class="btn btn-sm btn-error text-white" @click="doCachingRedisPerKelas_v4()">
                            Caching #2 Per Kelas
                        </button>

                        <!-- Destructive: taruh paling kanan & hanya superadmin -->
                        <div class="ms-auto" v-if="isSuperadminActive">
                            <button class="btn btn-sm btn-outline btn-error" @click="doDeleteProsesSiswaPerkelas()">
                                Delete Per Kelas V3
                            </button>
                        </div>
                    </div>
                </div>

                <!-- HASIL -->
                <div class="flex items-start gap-3">
                    <div class="w-28 shrink-0 text-xs uppercase font-semibold text-base-content/60 pt-2">
                        Hasil
                    </div>
                    <div class="flex flex-wrap items-center gap-2 grow">
                        <button class="btn btn-sm btn-primary" @click="doGenerateHasilPerkelas_v4(true)">
                            Generate Hasil V4
                        </button>

                        <button class="btn btn-sm btn-outline" @click="doGenerateHasilPerkelas_v4(false)">
                            Generate Hasil V4 (No Replace)
                        </button>
                    </div>
                </div>

                <!-- DATA & EXPORT -->
                <div class="flex items-start gap-3">
                    <div class="w-28 shrink-0 text-xs uppercase font-semibold text-base-content/60 pt-2">
                        Data & Export
                    </div>
                    <div class="flex flex-wrap items-center gap-2 grow">
                        <!-- Old exports dibuat lebih “low emphasis” -->
                        <button class="btn btn-sm btn-outline btn-success" @click="doExportExcel_v2()">
                            Export Rekap V3 (.xlsx) / Old
                        </button>

                        <button class="btn btn-sm btn-outline btn-success" @click="doExportExcel_v2_fakultas()">
                            Export Rekap V3 (.xlsx) + Fakultas / Old
                        </button>

                        <!-- Baru/sering dipakai → lebih menonjol -->
                        <button class="btn btn-sm btn-info" @click="doExport1010_v4()">
                            Export Excel 1010 v4 (.xlsx)
                        </button>

                        <button class="btn btn-sm btn-accent" @click="do_Sinkron_dataRedis()">
                            Sinkron Data Redis V3
                        </button>

                        <button class="btn btn-sm btn-secondary" @click="do_GenerateDataMentah_v4()">
                            Export Data Mentah Hasil Ujian V4
                        </button>
                    </div>
                </div>

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
                                                        #1
                                                        <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                                                    </svg> -->
                                                    </button>

                                                    <button class="btn btn-sm tooltip  bg-red-500 text-white 
         hover:bg-red-600 " data-tip="Caching #2 Persiswa" @click="doCachingRedisPerSiswa_v4(props.row.id)">
                                                        Caching #2
                                                        <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                                                    </svg> -->
                                                        <!-- aa -->
                                                    </button>
                                                </div>
                                                <button class="btn btn-sm  bg-cyan-500 text-white 
         hover:bg-blue-600  tooltip" data-tip="Generate hasil v4" @click="doGenerateHasilPersiswa_v4(props.row.id)"
                                                    v-if="isSuperadminActive">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                                                    </svg>

                                                </button>
                                                <button class="btn btn-sm  bg-emerald-500 text-white 
         hover:bg-emerald-600  tooltip" data-tip="Generate UJIAN KHUSUS v3" @click="doGenerateSiswa(props.row.id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-error tooltip"
                                                    data-tip="Delete UJIAN KHUSUS v3"
                                                    @click="doDeleteProsesSiswa(props.row.id)"
                                                    v-if="isSuperadminActive">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="h-6 w-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>

                                                </button>


                                                <!-- <RouterLink
                                                    :to="{ name: 'admin-sekolah-submenu-ujianstudi-persiswa', params: { sekolah_id, kelas_id, siswa_id: props.row.id } }">
                                                    <button class="btn btn-sm btn-primary tooltip" data-tip="Detail">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg></button>
                                                </RouterLink> -->
                                                <button class="btn btn-sm btn-error tooltip"
                                                    data-tip="Delete UJIAN KHUSUS v3"
                                                    @click="doDeleteProsesSiswa(props.row.id, props.row.proses_id)"
                                                    v-if="props.row.paketsoal_nama">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </span>

                                        <span v-else-if="props.column.field == 'hasil'">
                                            <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                                <RouterLink
                                                    :to="{ name: 'admin-sekolah-submenu-ujiankhusus-persiswa-reset-v4', params: { sekolah_id, kelas_id, siswa_id: props.row.id } }">
                                                    <button class="btn btn-sm btn-warning tooltip"
                                                        data-tip="MENU RESET v4">
                                                        V4

                                                    </button>
                                                </RouterLink>
                                            </div>
                                        </span>

                                        <span v-else-if="props.column.field == 'paketsoal_nama'">
                                            <!-- {{ props.row.progres?.created_at }} -->
                                            {{ props.row.ujiankhusus ? props.row.ujiankhusus?.khusus_paketsoal_nama
                                                :
                                                "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'kelas_nama'">
                                            <!-- {{ props.row.progres?.created_at }} -->
                                            {{ props.row.kelas ? props.row.kelas?.nama : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'tgl_batas_mulai'">
                                            <!-- {{ props.row.progres?.created_at }} -->
                                            {{ props.row.ujiankhusus?.tgl_batas_mulai ?
                                                moment(props.row.ujiankhusus?.tgl_batas_mulai).format(formatTanggal)
                                                : "-" }}
                                        </span>
                                        <span v-else-if="props.column.field == 'tgl_batas_terakhir'">
                                            {{ props && props.row && props.row.ujiankhusus &&
                                                props.row.ujiankhusus.tgl_batas_terakhir
                                                ?
                                                moment(props.row.ujiankhusus?.tgl_batas_terakhir).format(formatTanggal)
                                                : " - " }}

                                            <!-- {{ props.row.ujiankhusus?.tgl_batas_terakhir }} -->

                                            <!-- {{ props.row.ujiankhusus?.tgl_batas_terakhir
                                                ? moment(props.row.ujiankhusus?.tgl_batas_terakhir).format("DD MMMM YYYY
                                                                                        HH: mm: ss"):" - " }} -->
                                        </span>
                                        <span v-else-if="props.column.field == 'progres_status'">
                                            {{ props.row.progres_status }}
                                        </span>
                                        <span v-else-if="props.column.field == 'progres_angka'">
                                            {{ props.row.progres_angka?.progres }}/{{
                                                props.row.progres_angka?.total }}
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


<style scoped>
/* Opsional: haluskan scrollbar area log */
div[class*="overflow-auto"]::-webkit-scrollbar {
    height: 8px;
    width: 8px;
}

div[class*="overflow-auto"]::-webkit-scrollbar-thumb {
    border-radius: 9999px;
}
</style>