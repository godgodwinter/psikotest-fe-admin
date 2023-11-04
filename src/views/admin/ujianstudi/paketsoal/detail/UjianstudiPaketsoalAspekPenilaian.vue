<script setup>
import { ref, defineAsyncComponent } from "vue"
import Api from "@/axios/axiosNode";
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
const aspek_id = ref(route.params.aspek_id)
const aspek = ref();
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
        label: "Nama",
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
        const response = await Api.get(`ujianstudi/paketsoal/${paketsoal_id.value}/aspek/penilaian/get/${aspek_id.value}`);
        aspek.value = response.data;
        data.value = response.data?.penilaian;
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
        // console.log(paketsoal_id.value,aspek_id.value,id);
        //! id=studi_v2_paketsoal_aspek_penilaian_id
        try {
            const response = await Api.delete(`ujianstudi/paketsoal/${paketsoal_id.value}/aspek/penilaian/get/${id}`);
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
        name: "admin-ujianstudi-paketsoal-edit",
        params: { paketsoal_id: id },
    });
};
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>PENILAIAN </h1>
            <p>ASPEK : {{ aspek?.nama }}</p>
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
    perPageDropdown: [50, 100, 150, 200],
}" styleClass="vgt-table striped bordered condensed" class="py-0">
                                <template #table-actions>
                                    <div class="space-x-1 space-y-1 gap-1">
                                        <router-link :to="{
                                            name: 'admin-ujianstudi-paketsoal-aspek-penilaian-tambah', params: { paketsoal_id, aspek_id }
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
                                            <RouterLink
                                                :to="{ name: 'admin-ujianstudi-paketsoal-aspek', params: { paketsoal_id: props.row.id } }">
                                                <button class="btn btn-sm btn-primary tooltip" data-tip="Detail Soal">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg></button>
                                            </RouterLink>
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