<script setup>
import { ref, defineAsyncComponent } from "vue"
import Api from "@/axios/axios";
import { useQuery } from '@tanstack/vue-query'

const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)


const getTodos = (page) =>
    fetch(
        `https://jsonplaceholder.typicode.com/posts`,
    ).then((response) => response.json())

const getData = async () => {
    try {
        const response = await Api.get(`v2/ujianstudi/banksoal/aspek`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
// getData()
// Query
const { isLoading, isError, data, error } = useQuery({
    queryKey: ['item'],
    queryFn: getData,
})

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
        label: "Status",
        field: "status",
        type: "String",
    },
];

</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>ASPEK</h1>
        </article>
        <span v-if="isLoading">
            <LoadingNavbar />
        </span>
        <span v-else-if="isError">
            <AlertFailed :message="error?.message" />
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
    perPageDropdown: [10, 20, 50],
}" styleClass="vgt-table striped bordered condensed" class="py-0">
                                <template #table-actions>
                                    <div class="space-x-1 space-y-1 gap-1">
                                        <!-- <button class="btn btn-sm btn-secondary tooltip" data-tip="Refresh Data"
                                                                                                                                                                                    @click="getData()">
                                                                                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                                                                                                                                                        fill="currentColor">
                                                                                                                                                                                        <path fill-rule="evenodd"
                                                                                                                                                                                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                                                                                                                                                            clip-rule="evenodd" />
                                                                                                                                                                                    </svg>
                                                                                                                                                                                </button> -->
                                        <!-- <router-link :to="{
                                                                                                                                                                                        name: 'admin.ujian.create',
                                                                                                                                                                                    }"> -->
                                        <button class="btn btn-sm btn-primary tooltip" data-tip="Tambah SOAL">
                                            TAMBAH
                                        </button>
                                        <!-- </router-link> -->
                                    </div>
                                </template>
                                <template #table-row="props">
                                    <span v-if="props.column.field == 'actions'">
                                        <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                            <!-- <router-link :to="{
                                                                                                                                                                                    name: 'admin.ujian.kelas',
                                                                                                                                                                                    params: { ujian_proses_id: props.row.id },
                                                                                                                                                                                }"> -->
                                            <button class="btn btn-sm btn-primary tooltip" data-tip="Detail">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                                </svg></button>
                                            <!-- </router-link> -->
                                            <!-- <router-link :to="{
                                                                                                                                                                                name: 'admin.ujian.edit',
                                                                                                                                                                                params: { id: props.row.id },
                                                                                                                                                                            }"> -->
                                            <button class="btn btn-sm btn-warning tooltip" data-tip="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                    fill="currentColor">
                                                    <path
                                                        d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path fill-rule="evenodd"
                                                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                        clip-rule="evenodd" />
                                                </svg></button>
                                            <!-- </router-link> -->
                                            <!-- <button class="btn btn-sm btn-danger"
                                                                                                                                                                            @click="doDeleteData(props.row.id, props.index)">
                                                                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                                                                                                                                                fill="currentColor">
                                                                                                                                                                                <path fill-rule="evenodd"
                                                                                                                                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                                                                                                                    clip-rule="evenodd" />
                                                                                                                                                                            </svg>
                                                                                                                                                                        </button> -->
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