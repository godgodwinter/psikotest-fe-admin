<script setup>
import { ref } from "vue"
import Api from "@/axios/axiosNode";
import Toast from "@/components/lib/Toast";
import { Form, Field } from "vee-validate";
import { useRouter, useRoute } from "vue-router";
import fnValidasi from "@/components/lib/babengValidasi";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

const router = useRouter();
const route = useRoute();
const paketsoal_id = ref(route.params.paketsoal_id)
const dataForm = ref({
    nama: null,
});
const getDataDetail = async () => {
    try {
        const response = await Api.get(`ujianstudi/paketsoal/${paketsoal_id.value}`);
        dataForm.value = response.data;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
getDataDetail();
const onSubmit = async (values) => {
    let dataFormSend = {
        nama: dataForm.value.nama,
    };
    try {
        const response = await Api.put(`ujianstudi/paketsoal/${paketsoal_id.value}`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil ditambahkan!");
        router.push({ name: "admin-ujianstudi-paketsoal" });
        return true;
    } catch (error) {
        console.error(error);
    }
};
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>PAKETSOAL EDIT</h1>
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