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
        label: "Kode",
        field: "_id",
        type: "String",
    },
    {
        label: "Tanggal",
        field: "tgl",
        type: "String",
    },
    {
        label: "Data IST",
        field: "ist",
        type: "Number",
    },
    {
        label: "Siswa Baru",
        field: "siswabaru",
        type: "Number",
    },
];


const data = ref([]);
const getData = async () => {
    try {
        const response = await ApiIst.get(`/ist/import/migrasi`);
        data.value = response.data;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
getData();
const doRollback = async (id) => {
    if (confirm("Apakah anda yakin ROLLBACK data ini? Data yang akan dihapus tidak bisa dikembalikan!")) {
        try {
            const dataForm = {
                ist_migration_id: id
            }
            const response = await ApiIst.post(`/ist/import/rollback`, dataForm);
            getData()
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
};
getData();
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>MIGRASI IMPORT DATA IST</h1>
        </article>
        <p>Catatan: #Rollback akan menghapus data ist. menghapus siswa (jika siswa dibuat saat migrasi)</p>

        <div>
            <RouterLink :to="{ name: 'admin-sekolah-submenu-ist-import', params: { sekolah_id: 0, kelas_id: 0 } }">
                <button class="btn btn-sm ">
                    Import Data IST</button>
            </RouterLink>
        </div>

        <div class="md:py-2 lg:flex flex-wrap gap-4">
            <div class="w-full lg:w-full">
                <div class="bg-white shadow rounded-lg px-4 py-4">
                    <div>
                        <vue-good-table :line-numbers="true" :columns="columns" :rows="data" :search-options="{
                            enabled: true,
                        }" :pagination-options="{
    enabled: true,
    perPageDropdown: [100, 200, 500],
}" styleClass="vgt-table striped bordered condensed" class="py-0">
                            <template #table-row="props">
                                <span v-if="props.column.field == 'actions'">
                                    <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                        <button class="btn btn-sm btn-warning" @click="
                                            doRollback(props.row, _id)
                                            ">
                                            Rollback
                                        </button>
                                    </div>
                                </span>

                                <span v-else-if="props.column.field == 'tgl'">
                                    <div class="text-center">
                                        {{
                                            props.row.tgl ? moment(props.row.tgl).format("DD MMMM YYYY HH:mm:ss") : null
                                        }}
                                    </div>
                                </span>
                                <span v-else-if="props.column.field == 'ist'">
                                    <div class="text-center">
                                        {{
                                            props.row.detail ? props.row.detail.ist : 0
                                        }}
                                    </div>
                                </span>
                                <span v-else-if="props.column.field == 'siswabaru'">
                                    <div class="text-center">
                                        {{
                                            props.row.detail ? props.row.detail.siswabaru : 0
                                        }}
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
    </div>
</template>