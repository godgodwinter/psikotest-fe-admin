<script setup>
import { ref, defineAsyncComponent } from "vue"
import Toast from "@/components/lib/Toast";
import { useRoute, useRouter } from "vue-router";
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import {fn_copy_id_for_mongo} from "@/lib/FungsiBasic.js"

const BreadCrumb = defineAsyncComponent(() =>
    import('@/components/atoms/BreadCrumb.vue')
)
const BreadCrumbSpace = defineAsyncComponent(() =>
    import('@/components/atoms/BreadCrumbSpace.vue')
)
const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)

const router = useRouter();
const route = useRoute();
const aspek_detail_id = ref(route.params.aspek_detail_id)
const aspek_detail = ref();
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
        label: "Jumlah Pilihan",
        field: "pilihanjawaban_jml",
        type: "String",
    },
    {
        label: "Aspek",
        field: "aspek_nama",
        type: "String",
    },
    {
        label: "Sub",
        field: "aspek_detail_nama",
        type: "String",
    },
    {
        label: "Status",
        field: "status",
        type: "String",
    },
];

const getData = async () => {
    try {
        const response = await ApiUjianKhusus.get(`ujiankhusus/banksoal/aspek_detail/${aspek_detail_id.value}/soal`);
        // data.value = response.data;
        
        const tempData=response.data;
        data.value = tempData.map(fn_copy_id_for_mongo);
        console.log(data.value);
        aspek_detail.value = response.aspek_detail;
        // console.log(aspek_detail.value);
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
            const response = await ApiUjianKhusus.delete(`ujiankhusus/banksoal/aspek_detail/${aspek_detail_id.value}/soal/${id}`);
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
        name: "admin-ujiankhusus-banksoal-aspek_detail-soal-edit",
        params: { aspek_detail_id: aspek_detail_id.value, soal_id: id },
    });
};
</script>
<template>
    <div>
        <div class="pt-4 px-10 md:flex justify-between">
            <div>
                <article class="prose lg:prose-sm">
                    <h1>SOAL</h1>
                    <h2>ASPEK DETAIL : {{ aspek_detail ? aspek_detail.aspek_detail : aspek_detail_id }}</h2>
                </article>
            </div>
            <div class="md:py-0 py-4">
                <BreadCrumb>
                    <template v-slot:content>
                        <li>
                            <router-link :to="{ name: 'admin-ujiankhusus-banksoal-aspek_detail' }"><span
                                    class="font-semibold underline uppercase">Aspek</span></router-link>
                        </li>
                        <BreadCrumbSpace /> SOAL
                    </template>
                </BreadCrumb>
            </div>
        </div>
        <!-- <div class="pt-4 px-10 md:flex justify-between">
            <div class="space-x-2">
                <router-link
                    :to="{ name: 'admin-ujianstudi-banksoal-aspek_detail-soal-import', params: { aspek_detail_id } }">
                    <button class="btn btn-sm btn-warning tooltip">
                        IMPORT
                    </button></router-link>
            </div>
            <div class="md:py-0 py-4">
            </div>
        </div> -->
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
    perPageDropdown: [50, 100, 150, 200],
}" styleClass="vgt-table striped bordered condensed" class="py-0">
                                <template #table-actions>
                                    <div class="space-x-1 space-y-1 gap-1">
                                        <router-link :to="{
                                            name: 'admin-ujiankhusus-banksoal-aspek_detail-soal-tambah',
                                        }">
                                            <button class="btn btn-sm btn-primary tooltip" data-tip="Tambah SOAL">
                                                TAMBAH SOAL
                                            </button>
                                        </router-link>
                                    </div>
                                </template>
                                <template #table-row="props">
                                    <span v-if="props.column.field == 'actions'">
                                        <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                            <button class="btn btn-sm btn-warning tooltip" data-tip="Edit"
                                                @click="doEditData(props.row.id, props.index)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                    fill="currentColor">
                                                    <path
                                                        d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path fill-rule="evenodd"
                                                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                        clip-rule="evenodd" />
                                                </svg></button>
                                            <button class="btn btn-sm btn-danger"
                                                @click="doDeleteData(props.row.id, props.index)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                    fill="currentColor">
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