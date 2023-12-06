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
const aspek_id = ref(route.params.aspek_id);
const dataForm = ref({
    nama: null,
    urutan: 1,
    status: true,
});

const getDataDetail = async () => {
    try {
        const response = await ApiUjianKhusus.get(`ujiankhusus/banksoal/aspek/${aspek_id.value}`);
        dataForm.value = response.data;
       dataForm.value.status = response.data.status=="Aktif"?true:false;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
getDataDetail();

const onSubmit = async (values) => {
    let dataFormSend = {
        nama: dataForm.value.nama,
        urutan: dataForm.value.urutan || 1,
        status: dataForm.value.status ?"Aktif":"Nonaktif",
    };
    try {
        const response = await ApiUjianKhusus.put(`ujiankhusus/banksoal/aspek/${aspek_id.value}`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil diupdate!");
        router.push({ name: "admin-ujiankhusus-banksoal-aspek" });
        return true;
    } catch (error) {
        console.error(error);
    }
};
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>ASPEK EDIT</h1>
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
                                    <input type="checkbox" class="toggle" v-model="dataForm.status" name="randomSoal" />
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