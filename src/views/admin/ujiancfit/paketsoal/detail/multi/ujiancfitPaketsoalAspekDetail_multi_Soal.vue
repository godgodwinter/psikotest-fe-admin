<script setup>
import { ref, defineAsyncComponent } from "vue"
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import { fn_copy_id_for_mongo } from "@/lib/FungsiBasic.js"
import Toast from "@/components/lib/Toast";
import { useRoute, useRouter } from "vue-router";

const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)

const router = useRouter();
const route = useRoute();
const paketsoal_id = ref(route.params.paketsoal_id)
const aspek_detail_id = ref(route.params.aspek_detail_id)
const aspek_detail = ref()
const banksoal_aspek_detail_id = ref(route.params.banksoal_aspek_detail_id)
const data = ref();
const isLoading = ref(true);
const isError = ref(false);


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
        label: "Jumlah Pilihan jawaban",
        field: "jml_pilihanjawaban",
        type: "Number",
    },
    {
        label: "jawaban benar",
        field: "jml_jawaban_benar",
        type: "Number",
    },
    {
        label: "#cfit_banksoal_aspek_detail_id",
        field: "cfit_banksoal_aspek_detail_id",
        type: "Number",
    },

];

const hitungJumlahSkorPositif = (pilihanJawaban) => {
    // console.log('====================================');
    // console.log(pilihanJawaban);
    // console.log('====================================');
    let result = 0;
    for (const [index, item] of pilihanJawaban.entries()) {
        if (item.status_jawaban == true) {
            result++;
        }
    }
    return result;
};
const getData = async () => {
    try {
        console.log('====================================');
        console.log(`#getdata : aspek_detail_id:`, aspek_detail_id.value);
        console.log('====================================');
        const response = await ApiUjianKhusus.get(`cfit/paketsoal/${paketsoal_id.value}/multi/${aspek_detail_id.value}/soal`);
        const tempData = response.data?.soal;
        console.log(response.data);
        if (tempData) {
            data.value = tempData.map(fn_copy_id_for_mongo);
            aspek_detail.value = tempData.map(fn_copy_id_for_mongo);

            // data.value = response.data?.soal;
            // aspek_detail.value= response.data;
            // console.log(aspek_detail.value);

            // let jml_jawaban_benar = 0
            // console.log('====================================');
            // console.log(`aa`);
            // console.log('====================================');
            for (const [index, item] of data.value.entries()) {
                const jumlahSkorPositif = hitungJumlahSkorPositif(item.pilihan_jawaban);
                // console.log(jumlahSkorPositif);
                item.jml_jawaban_benar = jumlahSkorPositif;
                // console.log('====================================');
                // console.log(item);
                // console.log('====================================');
            }
        } else {
            data.value = []
        }
        isLoading.value = false;
        return response.data;
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
            console.log(`cfit/paketsoal/${paketsoal_id.value}/multi/${aspek_detail_id.value}/soal/banksoal/${banksoal_aspek_detail_id.value}/delete/${id}`);
            const response = await ApiUjianKhusus.delete(`cfit/paketsoal/${paketsoal_id.value}/multi/${aspek_detail_id.value}/soal/banksoal/${banksoal_aspek_detail_id.value}/delete/${id}`);
            // if (response.status) {
            Toast.warning("Berhasil", response.message);
            // Toast.success("Info", "Data berhasil dihapus!");
            // } else {
            //     Toast.warning("Gagal", response.message);
            // }
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
};

const doEditData = async (id, index) => {
    router.push({
        name: "admin-ujiankhusus-paketsoal-edit",
        params: { paketsoal_id: id },
    });
};
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>SOAL</h1>
            <h5>UJIAN CFIT</h5>
        </article>

        <div>
            <RouterLink :to="{ name: 'admin-ujiancfit-paketsoal-aspek_detail-multi', params: { paketsoal_id } }">
                <button class="btn btn-info btn-sm">Kembali ke ASPEK DETAIL</button>
            </RouterLink>
        </div>
        <span v-if="isLoading">
            <LoadingNavbar />
        </span>
        <span v-else-if="isError">
            <AlertFailed :message="'Gagal mendapatkan response dari server'" />
        </span>
        <span v-else>
            <div class="md:py-2 px-4 lg:flex flex-wrap gap-4">
                <div class="w-full lg:w-full">
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
                                        <router-link :to="{
                                            name: 'admin-ujiancfit-paketsoal-aspek_detail-multi-soal-tambah', params: { paketsoal_id, aspek_detail_id, banksoal_aspek_detail_id },
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
                                            <!-- <RouterLink
                                                                                                                        :to="{ name: 'admin-ujiankhusus-paketsoal-aspek', params: { paketsoal_id: props.row.id } }">
                                                                                                                        <button class="btn btn-sm btn-primary tooltip" data-tip="Detail Soal">
                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                                                                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                                                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                                                                                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                                                            </svg></button>
                                                                                                                    </RouterLink> -->
                                            <!-- <button class="btn btn-sm btn-warning tooltip" data-tip="Edit"
                                                                                                                                                                                            @click="doEditData(props.row.id, props.index)">
                                                                                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                                                                                                                                                                fill="currentColor">
                                                                                                                                                                                                <path
                                                                                                                                                                                                    d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                                                                                                                                                <path fill-rule="evenodd"
                                                                                                                                                                                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                                                                                                                                                                    clip-rule="evenodd" />
                                                                                                                                                                                            </svg></button> -->
                                            <button class="btn btn-sm btn-danger"
                                                @click="doDeleteData(props.row.id, props.index)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </span>

                                    <span v-else-if="props.column.field == 'pertanyaan'"><span
                                            v-html="props.row.pertanyaan"></span>
                                    </span>
                                    <span v-else-if="props.column.field == 'jml_pilihanjawaban'">
                                        <span>{{ props.row.pilihan_jawaban.length }}</span>
                                    </span>
                                    <span v-else-if="props.column.field == 'jml_jawaban_benar'"><span>
                                            {{ props.row.jml_jawaban_benar }}
                                        </span>
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
</template>