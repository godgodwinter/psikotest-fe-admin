<script setup>
import { ref } from "vue"
import Api from "@/axios/axiosNode";
import Toast from "@/components/lib/Toast";
import { Form, Field } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import fnValidasi from "@/components/lib/babengValidasi";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

const router = useRouter();
const route = useRoute();
const paketsoal_id = ref(route.params.paketsoal_id)
const studi_v2_banksoal_aspek_id = ref(null);
const dataForm = ref({
    nama: null,
    urutan: null,
});
const onSubmit = async (values) => {
    let dataFormSend = {
        nama: dataForm.value.nama,
        urutan: dataForm.value.urutan || null,
        studi_v2_banksoal_aspek_id: studi_v2_banksoal_aspek_id.value
    };
    // console.log('====================================');
    // console.log(dataFormSend);
    // console.log('====================================');
    try {
        const response = await Api.post(`ujianstudi/paketsoal/${paketsoal_id.value}/aspek`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil ditambahkan!");
        router.push({ name: "admin-ujianstudi-paketsoal-aspek", params: { paketsoal_id: paketsoal_id.value } });
        return true;
    } catch (error) {
        console.error(error);
    }
};
const dataDetail = ref([])
const pilihAspek = ref([])
const dataAspek = ref(null)
// get Kelas
const getDataBanksoalAspek = async (sekolah_id) => {
    try {
        const response = await Api.get(`ujianstudi/banksoal/aspek`);

        dataAspek.value = response.data;
        dataAspek.value.forEach((item) => {
            pilihAspek.value.push({
                label: item.nama,
                id: item.id,
            });
        });

        dataForm.value.banksoal_aspek_id = {
            id: pilihAspek.value[0].id,
            label: pilihAspek.value[0].label,
        };
        return response;
    } catch (error) {
        Toast.danger("Warning", "Data Gagal dimuat");
        console.error(error);
    }
};
getDataBanksoalAspek();
const doPilihAspek = (banksoal_aspek_id) => {
    studi_v2_banksoal_aspek_id.value = banksoal_aspek_id;
    dataForm.value.nama = dataForm.value.banksoal_aspek_id.label;
    let cari = dataAspek.value.filter((x) => x.id === banksoal_aspek_id)
    dataForm.value.urutan = cari[0].urutan;
    // console.log('====================================');
    // console.log(cari[0], cari[0].urutan);
    // console.log('====================================');
    // dataForm.value.urutan = dataForm.value.banksoal_aspek_id.label;
}
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>ASPEK TAMBAH</h1>
        </article>

        <Form v-slot="{ errors }" @submit="onSubmit">
            <div class="py-2 lg:py-4 px-4">
                <div class="flex flex-col">
                    <label> Pilih Aspek : </label>
                    <div class="flex space-x-2 w-full">
                        <v-select class="py-2 px-3 w-full lg:w-1/2 mx-auto md:mx-0" :options="pilihAspek"
                            v-model="dataForm.banksoal_aspek_id" v-bind:class="{ disabled: false }"></v-select>

                        <div class="text-xs text-red-600 mt-1">
                            {{ errors.select }}
                        </div>
                        <span class="btn" @click="doPilihAspek(dataForm.banksoal_aspek_id.id)">Pilih</span>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="flex flex-col">
                        <label>Nama :</label>
                        <div>
                            <Field :rules="fnValidasi.validateData" v-model="dataForm.nama" name="nama" type="text"
                                class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.nama }}
                            </div>
                        </div>
                    </div>

                </div>
                <div class="flex flex-col">
                    <label>Urutan :</label>
                    <div>
                        <Field v-model="dataForm.urutan" name="urutan" type="text" class="input input-bordered w-11/12" />
                        <div class="text-xs text-red-600 mt-1">
                            {{ errors.urutan }}
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