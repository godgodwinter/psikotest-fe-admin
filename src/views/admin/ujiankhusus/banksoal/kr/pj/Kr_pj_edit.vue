<script setup>
import { ref, defineAsyncComponent } from "vue"
import Toast from "@/components/lib/Toast";
import { useRouter,useRoute } from "vue-router";
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import {fn_copy_id_for_mongo} from "@/lib/FungsiBasic.js"
import { Form, Field } from "vee-validate";
import fnValidasi from "@/components/lib/babengValidasi";

const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)

const router = useRouter();
const route = useRoute();
const data = ref();
const isLoading = ref(true);
const isError = ref(false);
const kr_id = ref(route.params.kr_id)
const pj_id = ref(route.params.pj_id)



const dataForm = ref({
    nama: null,
    skor: 0,
    urutan: 1,
    status: true,
    waktu: 0,
    // status: "Aktif",
});
const dataDetail = ref(null)

const getDataDetail = async () => {
    try {
        const response = await ApiUjianKhusus.get(`ujiankhusus/kr/banksoal/index/${kr_id.value}/pj/${pj_id.value}`);
        dataDetail.value = response.data;
        console.log(dataDetail.value);
        dataForm.value.nama = response.data.nama;
        dataForm.value.urutan = response.data.urutan;
        dataForm.value.waktu = response.data.waktu;
        dataForm.value.status = response.data.status;
        dataForm.value.skor = response.data.skor;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
getDataDetail();
const onSubmit = async (values) => {
    values.nama = dataForm.value.nama;
    values.skor = dataForm.value.skor;
    values.urutan = dataForm.value.urutan;
    values.status = dataForm.value.status
        ? true
        :false;

    let dataFormSend = {
        nama: dataForm.value.nama,
        urutan: dataForm.value.urutan ,
        skor: dataForm.value.skor ,
        status: values.status,
    };
    try {
        const response = await ApiUjianKhusus.put(`ujiankhusus/kr/banksoal/index/${kr_id.value}/pj/${pj_id.value}`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil diupdate!");
        router.push({ name: "admin-ujiankhusus-banksoal-kr-pj",params:{kr_id:kr_id.value} });
        return true;
    } catch (error) {
        console.error(error);
    }
};

</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>PJ EDIT</h1>
            <h5>UJIAN KHUSUS</h5>
        </article> 
           <div class="divider"></div>
    <div class="space-x-2">
        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-kr' }">
            <button class="btn btn-secondary btn-sm">Kembali Beranda KR</button>
        </RouterLink>
        
        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-kr-pj',params:{kr_id:kr_id} }">
            <button class="btn btn-secondary btn-sm">Kembali </button>
        </RouterLink>
    </div>
        
        <div class="divider"></div>

        
        
        <Form v-slot="{ errors }" @submit="onSubmit">
            <div class="py-2 lg:py-4 px-4">
                <div class="space-y-4">
                    <div class="flex flex-col">
                        <label>Judul :</label>
                        <div>
                            <Field :rules="fnValidasi.validateData" v-model="dataForm.nama" name="nama" type="text"
                                class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.nama }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label>Skor :</label>
                        <div>
                            <Field v-model="dataForm.skor" name="skor" type="text"
                                class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.skor }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label>Urutan :</label>
                        <div>
                            <Field v-model="dataForm.urutan" name="urutan" type="text"
                                class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.urutan }}
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col">
                        <div class="max-w-xs py-2">
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <span class="label-text">Status</span>
                                    <input type="checkbox" class="toggle" v-model="dataForm.status" name="status" />
                                </label>
                            </div>
                        </div>
                    </div>
                    </div>
                    </div>

            <div class="w-full flex justify-end py-10 px-10 gap-4">
                <span @click="router.go(-1)">
                    <span class="btn btn-secondary">Batal</span></span>
                <button class="btn btn-primary">Simpan</button>
            </div>
        </Form>
    </div>
</template>