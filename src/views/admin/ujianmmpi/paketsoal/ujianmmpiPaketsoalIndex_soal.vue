<script setup>
import { ref, defineAsyncComponent } from "vue"
import Toast from "@/components/lib/Toast";
import { useRouter, useRoute } from "vue-router";
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import { fn_copy_id_for_mongo } from "@/lib/FungsiBasic.js"
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)

const router = useRouter();
const route = useRoute();
const paketsoal_id = ref(route.params.paketsoal_id);
const data = ref();
const paketsoal_aktif = ref();
const isLoading = ref(true);
const isError = ref(false);
const parrent = ref({})


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
        label: "Pertanyaan",
        field: "pertanyaan",
        type: "String",
    },
    {
        label: "Jumlah Jawaban Benar",
        field: "jml_skor_jawaban_benar",
        type: "String",
    },
    {
        label: "KODE",
        field: "no",
        type: "String",
    },
];

const getData = async () => {
    try {
        const response = await ApiUjianKhusus.get(`mmpi/paketsoal/${paketsoal_id.value}/get_soal`);
        const tempData = response.data;
        data.value = tempData.map(fn_copy_id_for_mongo);
        parrent.value = response.parrent
        isLoading.value = false;
        return response.data;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
getData();
const getDataPaketsoalAktif = async () => {
    let getDataPaket = localStorage.getItem("ujiancfit_paketsoal_aktif");
    paketsoal_aktif.value = getDataPaket ? JSON.parse(getDataPaket) : null;
    // console.log(paketsoal_aktif.value);
};
getDataPaketsoalAktif();

const doDeleteData = async (id, index) => {
    if (confirm("Apakah anda yakin menghapus data ini?")) {
        try {
            const response = await ApiUjianKhusus.delete(`mmpi/paketsoal/${paketsoal_id.value}/remove_soal/${id}`);
            if (response.status) {
                Toast.warning("Berhasil", response.message);
                // Toast.success("Info", "Data berhasil dihapus!");
            } else {
                Toast.warning("Gagal", response.message);
            }
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
};
const doDeleteDataAll = async (id, index) => {
    if (confirm("Apakah anda yakin menghapus data ini?")) {
        try {
            const response = await ApiUjianKhusus.delete(`mmpi/paketsoal/${paketsoal_id.value}/add_soal/clear`);
            if (response.status) {
                Toast.warning("Berhasil", response.message);
                // Toast.success("Info", "Data berhasil dihapus!");
            } else {
                Toast.warning("Gagal", response.message);
            }
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
};

const doEditData = async (id, index) => {
    router.push({
        name: "admin-ujianmmpi-paketsoal-edit",
        params: { paketsoal_id: id },
    });
};

const doAktifkanPaket = async (id, nama) => {
    if (confirm("Apakah anda yakin aktifkan paketsoal ini?")) {
        let paketsoal_aktif = {
            id,
            nama,
            tgl_batas_mulai: moment(),
            tgl_batas_terakhir: moment().add(7, 'days')
        }
        // console.log(paketsoal_aktif);
        localStorage.setItem("ujianmmpi_paketsoal_aktif", JSON.stringify(paketsoal_aktif))
        getDataPaketsoalAktif()
    }
};

</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>PAKETSOAL MMPI {{ parrent?.nama }} - SOAL </h1>
            <h5>UJIAN MMPI </h5>
            <div v-if="paketsoal_aktif">
                <h4>PAKETSOAL AKTIF : {{ paketsoal_aktif?.nama }}</h4>
            </div>
        </article>
        <span v-if="isLoading">
            <LoadingNavbar />
        </span>
        <span v-else-if="isError">
            <AlertFailed :message="'Gagal mendapatkan response dari server'" />
        </span>
        <span v-else>
            <div class="md:py-2 px-4 lg:flex flex-wrap gap-4" v-if="data">
                <div class="w-full lg:w-full">
                    <div class="bg-white shadow rounded-lg px-4 py-4">
                        <div v-if="data">
                            <vue-good-table :line-numbers="true" :columns="columns" :rows="data" :search-options="{
                enabled: true,
            }" :pagination-options="{
                enabled: true,
                perPageDropdown: [500, 1000],
            }" styleClass="vgt-table striped bordered condensed" class="py-0">
                                <template #table-actions>
                                    <div class="space-x-1 space-y-1 gap-1">
                                        <button class="btn btn-sm btn-warning tooltip" data-tip="Clear"
                                            @click="doDeleteDataAll()">
                                            CLEAR ALL
                                        </button>
                                        <router-link :to="{
                name: 'admin-ujianmmpi-paketsoal-soal-add',
            }">
                                            <button class="btn btn-sm btn-primary tooltip" data-tip="Tambah">
                                                TAMBAH
                                            </button>
                                        </router-link>


                                    </div>
                                </template>
                                <template #table-row="props">
                                    <span v-if="props.column.field == 'actions'">
                                        <div class="text-sm font-medium text-center flex justify-center space-x-1">


                                            <button class="btn btn-sm btn-danger"
                                                @click="doDeleteData(props.row.no, props.index)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>



                                        </div>
                                    </span>
                                    <span v-else-if="props.column.field == 'soal_jml'">
                                        {{ props.row.soal_jml ? props.row.soal_jml : "-" }}</span>
                                    <span v-else-if="props.column.field == 'aspek_multijawaban'">
                                        {{ props.row.aspek_multijawaban?.length > 0 ? "Ada" : "-"
                                        }}</span>

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
</template>