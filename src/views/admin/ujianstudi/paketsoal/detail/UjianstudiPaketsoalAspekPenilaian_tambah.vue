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
const aspek_id = ref(route.params.aspek_id)
const studi_v2_paketsoal_aspek_detail_id = ref(null);
const dataForm = ref({
    nama: null,
    status: "Aktif",
});
const onSubmit = async (values) => {
    let dataFormSend = {
        studi_v2_paketsoal_aspek_id: parseInt(aspek_id.value),
        studi_v2_paketsoal_aspek_detail_id: studi_v2_paketsoal_aspek_detail_id.value,
        status: dataForm.value.status,
    };
    // console.log('====================================');
    // console.log(dataFormSend);
    // console.log('====================================');
    try {
        const response = await Api.post(`ujianstudi/paketsoal/${paketsoal_id.value}/aspek/penilaian/get`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil ditambahkan!");
        router.push({ name: "admin-ujianstudi-paketsoal-aspek-penilaian", params: { paketsoal_id: paketsoal_id.value, aspek_id: aspek_id.value } });
        return true;
    } catch (error) {
        console.error(error);
    }
};
const dataDetail = ref([])
const pilihAspekDetail = ref([])
const dataAspekDetail = ref(null)
// get Kelas
const getDataBanksoalAspek = async (sekolah_id) => {
    try {
        const response = await Api.get(`ujianstudi/paketsoal/${paketsoal_id.value}/aspek_detail`);

        dataAspekDetail.value = response.data;
        dataAspekDetail.value.forEach((item) => {
            pilihAspekDetail.value.push({
                label: item.nama,
                id: item.id,
            });
        });

        dataForm.value.paketsoal_aspek_detail_id = {
            id: pilihAspekDetail.value[0].id,
            label: pilihAspekDetail.value[0].label,
        };
        studi_v2_paketsoal_aspek_detail_id.value = pilihAspekDetail.value[0].id;
        return response;
    } catch (error) {
        Toast.danger("Warning", "Data Gagal dimuat");
        console.error(error);
    }
};
getDataBanksoalAspek();
const doPilihAspekDetail = (paketsoal_aspekDetail_id) => {
    studi_v2_paketsoal_aspek_detail_id.value = paketsoal_aspekDetail_id;
    dataForm.value.nama = dataForm.value.paketsoal_aspek_detail_id.label;
    let cari = dataAspekDetail.value.filter((x) => x.id === paketsoal_aspekDetail_id)
    dataForm.value.urutan = cari[0].urutan;
}
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>PENILAIAN TAMBAH</h1>
        </article>

        <Form v-slot="{ errors }" @submit="onSubmit">
            <div class="py-2 lg:py-4 px-4">
                <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-900 block mb-2"> Pilih Mapel : </label>
                    <div class="flex space-x-2 w-full">
                        <v-select class="py-2 px-3 w-full lg:w-1/2 mx-auto md:mx-0" :options="pilihAspekDetail"
                            v-model="dataForm.paketsoal_aspek_detail_id" v-bind:class="{ disabled: false }"></v-select>

                        <div class="text-xs text-red-600 mt-1">
                            {{ errors.select }}
                        </div>
                        <span class="btn" @click="doPilihAspekDetail(dataForm.paketsoal_aspek_detail_id.id)">Pilih</span>
                    </div>
                </div>
                <div>
                    <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Pilih Status
                    </label>
                    <div class="px-3">
                        <select class="select select-info w-full max-w-xs" v-model="dataForm.status">
                            <option selected value="Aktif">
                                Aktif
                            </option>
                            <option value="Hidden">
                                Hidden
                            </option>
                        </select>

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