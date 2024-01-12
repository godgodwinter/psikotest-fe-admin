<script setup>
import { ref, defineAsyncComponent } from "vue"
import Toast from "@/components/lib/Toast";
import { useRouter,useRoute } from "vue-router";
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import {fn_copy_id_for_mongo} from "@/lib/FungsiBasic.js"

const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)

const router = useRouter();
const route = useRoute();
const banksoal_minatbakat_id = ref(route.params.banksoal_minatbakat_id)
const kelompok_id = ref(route.params.kelompok_id)
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
        field: "profesi_nama",
        type: "String",
    },
    {
        label: "KODE",
        field: "profesi_kode",
        type: "String",
    },
    {
        label: "urutan",
        field: "urutan",
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
        const response = await ApiUjianKhusus.get(`ujiankhusus/minatbakat/banksoal/index/${banksoal_minatbakat_id.value}/kelompok/${kelompok_id.value}/profesi`);
        // console.log(response);
        const tempData=response.data;
        data.value = tempData.map(fn_copy_id_for_mongo);
        // data.value=tempData;
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
            const response = await ApiUjianKhusus.delete(`ujiankhusus/minatbakat/banksoal/index/${banksoal_minatbakat_id.value}/kelompok/${id}`);
                Toast.warning("Berhasil", response.message);
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
};

const doEditData = async (id, index) => {
    // router.push({
    //     name: "admin-ujiankhusus-banksoal-minat-kelompok-edit",
    //     params: { banksoal_minatbakat_id: banksoal_minatbakat_id.value,kelompok_id:id },
    // });
};
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>EDIT PROFESI </h1>
            <h5>UJIAN KHUSUS</h5>
        </article>
        
        <div class="divider"></div>
    </div>
</template>