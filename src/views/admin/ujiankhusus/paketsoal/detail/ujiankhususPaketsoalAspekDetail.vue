<script setup>
import { ref, defineAsyncComponent } from "vue"
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import {fn_copy_id_for_mongo} from "@/lib/FungsiBasic.js"
import Toast from "@/components/lib/Toast";
import { useRoute, useRouter } from "vue-router";
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
const paketsoal_id = ref(route.params.paketsoal_id)
const data = ref();
const isLoading = ref(true);
const isError = ref(false);

const dataForm = ref({
    tgl_awal: moment().subtract(1, 'days'),
    tgl_akhir: moment()
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
        label: "Desc",
        field: "desc",
        type: "String",
    },
    {
        label: "Waktu",
        field: "waktu",
        type: "String",
    },
    {
        label: "Random Soal",
        field: "random_soal",
        type: "String",
    },
    {
        label: "Random Pilihanjawaban",
        field: "random_pilihanjawaban",
        type: "String",
    },
    {
        label: "Jumlah Soal",
        field: "soal_jml",
        type: "String",
    },
];

const getData = async () => {
    try {
        const response = await ApiUjianKhusus.get(`ujiankhusus/paketsoal/${paketsoal_id.value}/aspek_detail`);
        const tempData=response.data;
        data.value = tempData.map(fn_copy_id_for_mongo);
        isLoading.value = false;
        return response.data;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
getData();

const formEdit=ref(false);
const doEditMapel = async (id, index,mapel) => {
    formEdit.value=true;
    dataForm.value.id=id;
    dataForm.value.mapel=mapel;
    console.log(id,index);
};

const doEditMapelBatal =()=>{
    formEdit.value=false;
}
const doSimpanEditMapel =async()=>{
   let dataSend={
    id:dataForm.value.id,
    mapel:dataForm.value.mapel,
    tgl_awal:moment(dataForm.value.tgl_awal),
    tgl_akhir:moment(dataForm.value.tgl_akhir),
   }
   console.log(dataSend);
    try {
        const response = await Api.post(`ujiankhusus/paketsoal_edit/mapel_edit`, dataSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil di Update!");
        // router.push({ name: "admin-ujiankhusus-paketsoal" });
    getData();
    formEdit.value=false;
    dataForm.value.id=null;
    dataForm.value.mapel=null;
        return true;
    } catch (error) {
        console.error(error);
    }
}
const doDeleteData = async (id, index) => {
    if (confirm("Apakah anda yakin menghapus data ini?")) {
        try {
            const response = await ApiUjianKhusus.delete(`ujiankhusus/paketsoal/${paketsoal_id.value}/aspek_detail/${id}`);
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
        name: "admin-ujiankhusus-paketsoal-edit",
        params: { paketsoal_id: id },
    });
};
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>ASPEK DETAIL</h1>
            <h5>UJIAN KHUSUS</h5>
        </article>
        <span v-if="isLoading">
            <LoadingNavbar />
        </span>
        <span v-else-if="isError">
            <AlertFailed :message="'Gagal mendapatkan response dari server'" />
        </span>
        <span v-else>
            <div class="card bg-base-100 border border-1 border-slate-500 p-4 max-w-xl" v-if="formEdit">
                    <h2 class="font-bold text-xl">Edit Mapel id: {{ dataForm.id }}</h2>
                    <div>
                        <div class="form-control w-full max-w-md">
  <label class="label">
    <span class="label-text">Nama Mapel : </span>
    <!-- <span class="label-text-alt">Top Right label</span> -->
  </label>
  <input type="text" placeholder="Mapel" class="input input-bordered w-full max-w-md" v-model="dataForm.mapel"/>
  <label class="label">
    <span class="label-text-alt"></span>
    <!-- <span class="label-text-alt">Bottom Right label</span> -->
  </label>
  <div>
    <div class=" flex flex-col">
        <label class="label">
    <span class="label-text">Range Tanggal Generate Paket ke siswa yang akan ikut terupdate : </span>
  </label>
                <div class="flex gap-2 w-full">   
                <div class=" flex flex-col"> 
                    <div>
                        <VueDatePicker v-model="dataForm.tgl_awal"></VueDatePicker>
                    </div>
                </div>
                <div class=" flex flex-col">
                    <div>
                        <VueDatePicker v-model="dataForm.tgl_akhir"></VueDatePicker>
                    </div>
                </div>
                </div>
            </div>
  </div>
  <div class="pt-2 space-x-2">
  <button class="btn btn-secondary btn-sm" @click="doEditMapelBatal()">BATAL</button>
  <button class="btn btn-primary btn-sm" @click="doSimpanEditMapel()">SIMPAN</button>
  </div>
</div>  
</div>

</div>
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
                                            name: 'admin-ujiankhusus-paketsoal-aspek_detail-tambah', params: { paketsoal_id },
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
                                                :to="{ name: 'admin-ujiankhusus-paketsoal-aspek_detail-soal', params: { paketsoal_id, aspek_detail_id: props.row.id, banksoal_aspek_detail_id: props.row.khusus_banksoal_aspek_detail_id } }">
                                                <button class="btn btn-sm btn-primary tooltip" data-tip="Detail Soal">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg></button>
                                            </RouterLink>
                                            <!-- {{ props.row.id }} -->
                                            <RouterLink
                                                :to="{ name: 'admin-ujiankhusus-paketsoal-aspek_detail-edit', params: { paketsoal_id, aspek_detail_id: props.row.id } }">
                                                <button class="btn btn-sm btn-warning tooltip" data-tip="Detail Soal">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                    fill="currentColor">
                                                    <path
                                                        d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path fill-rule="evenodd"
                                                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                        clip-rule="evenodd" />
                                                </svg></button>
                                            </RouterLink>
                                            <!-- <button class="btn btn-sm btn-warning" @click="doEditMapel(props.row.id,props.index,props.row.nama)">EDIT</button> -->
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
                                    <span v-if="props.column.field=='soal_jml'">
                                        {{ props.row.soal?props.row.soal.length:"Tidak ditemukan" }}
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