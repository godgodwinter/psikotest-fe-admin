<script setup>
import { ref } from "vue"
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import {fn_copy_id_for_mongo} from "@/lib/FungsiBasic.js"
import Toast from "@/components/lib/Toast";
import { Form, Field } from "vee-validate";
import { useRouter, useRoute } from "vue-router";
import fnValidasi from "@/components/lib/babengValidasi";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

const router = useRouter();
const route = useRoute();
const paketsoal_id = ref(route.params.paketsoal_id);
const inputSelectMinat = ref({ id: null, label: null })
const dataForm = ref({
    nama: null,
    status: true,
});

const getDataDetail = async () => {
    try {
        const response = await ApiUjianKhusus.get(`ujiankhusus/paketsoal/${paketsoal_id.value}`);
        dataForm.value = response.data;
        console.log(response.data);
       dataForm.value.status = response.data.status?true:false;
    //    dataForm.value.minatList=response.data.minatList;
    inputSelectMinat.value={
        id:response.data.minatList._id,
        label:response.data.minatList.nama
       };
    //    dataForm.value.minatList_nama=response.data.minatList.nama;
    //    dataForm.value.minatList_id=response.data.minatList._id;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
getDataDetail();

const onSubmit = async (values) => {
    let dataFormSend = {
        nama: dataForm.value.nama,
        status: dataForm.value.status,
        minat_id:"659f6e3f205ede754f5e527b",
        // minat_id:null,
        kr_id:null
    };
    try {
        const response = await ApiUjianKhusus.put(`ujiankhusus/paketsoal/${paketsoal_id.value}`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil diupdate!");
        router.push({ name: "admin-ujiankhusus-paketsoal" });
        return true;
    } catch (error) {
        console.error(error);
    }
};

const dataMinatList=ref([]);
const minatList=ref([]);
const getDataMinat = async () => {
    try {
        const response = await ApiUjianKhusus.get(`ujiankhusus/minatbakat/banksoal/index`);
    dataMinatList.value=response.data;
    dataMinatList.value.forEach((item) => {
                minatList.value.push({
                    label: item.nama,
                    id: item._id,
                });
            });
    // console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
getDataMinat();
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>PAKETSOAL EDIT</h1>
            <h5>UJIAN KHUSUS</h5>
        </article>

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
                        <div class="max-w-xs py-2">
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <span class="label-text">Tampilkan</span>
                                    <input type="checkbox" class="toggle" v-model="dataForm.status" name="randomSoal" />
                                </label>
                            </div>
                        </div>
                    </div>
                    
<div>
<label className="form-control w-full max-w-xs">
<div className="label">
<span className="label-text">Minat Bakat : {{ dataForm.minatList_nama }}</span>
<span className="label-text"><code class="text-red-600 font-light text-xs">Kosongkan jika tidak ada.</code> </span>
</div>
<div class="w-full bg-base-100 shadow-sm rounded-lg py-4 px-4">
    <div class="flex justify-center">
        <v-select class="py-2 px-3 w-72 mx-auto md:mx-0" :options="minatList" v-model="inputSelectMinat"
            v-bind:class="{ disabled: false }"></v-select>
        <!-- <div class="py-2">
            <button class="btn btn-sm btn-info p-2" @click="doPilihKelas()">
                Cari
            </button>
        </div> -->
    </div>
</div>
<!-- <select className="select select-bordered" v-model="dataForm.minatList">
<option selected >aa</option> 

<option v-for="(item, index) in dataMinatList" :value="item._id">{{ item.nama }}</option>
</select> -->
<div className="label">
<!-- <span className="label-text-alt">Alt label</span> -->
</div>
</label>
</div> 

<div>
<label className="form-control w-full max-w-xs">
<div className="label">
<span className="label-text">KR : </span>
<span className="label-text"><code class="text-red-600 font-light text-xs">Kosongkan jika tidak ada.</code> </span>
</div>
<select className="select select-bordered" v-model="dataForm.krList">
<option selected></option>
<option>KR 1</option>
<option>KR 2</option>
</select>
<div className="label">
<!-- <span className="label-text-alt">Alt label</span> -->
</div>
</label>
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