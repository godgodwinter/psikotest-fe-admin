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
const studi_v2_banksoal_aspek_detail_id = ref(null);
const dataForm = ref({
    nama: null,
    urutan: null,
});
const onSubmit = async (values) => {
    values.nama = dataForm.value.nama;
    values.random_soal = dataForm.value.randomSoal
        ? "Aktif"
        : "Nonaktif";
    values.random_pilihanjawaban = dataForm.value.randomPilihanJawaban
        ? "Aktif"
        : "Nonaktif";
    values.instruksi_status = dataForm.value.instruksiStatus
        ? "Aktif"
        : "Nonaktif";
    values.lembar_prasoal_status = dataForm.value.lembar_prasoalStatus
        ? "Aktif"
        : "Nonaktif";
    values.instruksi_pengerjaan_status = dataForm.value.instruksi_pengerjaanStatus
        ? "Aktif"
        : "Nonaktif";
    // console.log(values);
    values.instruksi = dataForm.value.instruksi;
    values.lembar_prasoal = dataForm.value.lembar_prasoal;
    values.instruksi_pengerjaan = dataForm.value.instruksi_pengerjaan;
    // console.log(values);

    let dataFormSend = {
        nama: values.nama,
        waktu: values.waktu,
        instruksi: values.instruksi,
        instruksi_status: values.instruksi_status,
        lembar_prasoal: values.lembar_prasoal,
        random_soal: values.random_soal,
        random_pilihanjawaban: values.random_pilihanjawaban,
        lembar_prasoal_status: values.lembar_prasoal_status,
        instruksi_pengerjaan: values.instruksi_pengerjaan,
        instruksi_pengerjaan_status: values.instruksi_pengerjaan_status,
        studi_v2_banksoal_aspek_detail_id: studi_v2_banksoal_aspek_detail_id.value,
        kode: dataForm.value.kode
    };
    // console.log('====================================');
    // console.log(dataFormSend);
    // console.log('====================================');
    try {
        const response = await Api.post(`ujianstudi/paketsoal/${paketsoal_id.value}/aspek_detail`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil ditambahkan!");
        router.push({ name: "admin-ujianstudi-paketsoal-aspek_detail", params: { paketsoal_id: paketsoal_id.value } });
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
        const response = await Api.get(`ujianstudi/banksoal/aspek_detail`);

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
    studi_v2_banksoal_aspek_detail_id.value = banksoal_aspek_id;
    dataForm.value.nama = dataForm.value.banksoal_aspek_id.label;
    let cari = dataAspek.value.filter((x) => x.id === banksoal_aspek_id)
    console.log(cari[0]);
    dataForm.value.waktu = cari[0].waktu || 10;
    dataForm.value.instruksi = cari[0].instruksi;
    dataForm.value.instruksiStatus = cari[0].instruksi_status == "Aktif" ? true : false;
    dataForm.value.lembar_prasoal = cari[0].lembar_prasoal;
    dataForm.value.lembar_prasoalStatus = cari[0].lembar_prasoal_status == "Aktif" ? true : false;
    dataForm.value.instruksi_pengerjaan = cari[0].instruksi_pengerjaan;
    dataForm.value.instruksi_pengerjaanStatus = cari[0].instruksi_pengerjaan_status == "Aktif" ? true : false;
    dataForm.value.randomSoal = cari[0].random_soal == "Aktif" ? true : false;
    dataForm.value.randomPilihanJawaban = cari[0].random_pilihanjawaban == "Aktif" ? true : false;
    dataForm.value.kode = cari[0].kode || null;
}
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>MAPEL TAMBAH</h1>
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
                    <label>Waktu : (menit)</label>
                    <div>
                        <Field :rules="fnValidasi.validateDataNumber" v-model="dataForm.waktu" name="waktu" type="text"
                            max="1000" min="0" class="input input-bordered w-11/12" />
                        <div class="text-xs text-red-600 mt-1">
                            {{ errors.waktu }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col">
                    <div class="max-w-xs py-2">
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Random Soal</span>
                                <input type="checkbox" class="toggle" v-model="dataForm.randomSoal" name="randomSoal" />
                            </label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="max-w-xs py-2">
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Random Pilihan Jawaban</span>
                                <input type="checkbox" class="toggle" v-model="dataForm.randomPilihanJawaban"
                                    name="randomPilihanJawaban" />
                            </label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="max-w-xs py-2">
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Instruksi</span>
                                <input type="checkbox" class="toggle" v-model="dataForm.instruksiStatus"
                                    name="instruksiStatus" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <!-- <Field v-if="dataForm.instruksiStatus" :rules="fnValidasi.validateData" v-model="dataForm.instruksi"
                                                                                                                                                                                          name="instruksi" type="text" placeholder="Instruksi" class="input input-bordered w-11/12" /> -->

                        <textarea v-if="dataForm.instruksiStatus" v-model="dataForm.instruksi"
                            :rules="fnValidasi.validateData" name="instruksi" ref="instruksi"
                            class="textarea textarea-bordered md:w-full  w-11/12" placeholder="">
                                                                                                                                                                                        </textarea>
                        <div class="text-xs text-red-600 mt-1">
                            {{ errors.instruksi }}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="max-w-xs py-2">
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Lembar Prasoal </span>
                                <input type="checkbox" class="toggle" v-model="dataForm.lembar_prasoalStatus"
                                    name="lembar_prasoalStatus" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <!-- <Field v-if="dataForm.lembar_prasoalStatus" :rules="fnValidasi.validateData"
                                                                                                                                                                                          v-model="dataForm.lembar_prasoal" name="lembar_prasoal" type="text"
                                                                                                                                                                                          class="input input-bordered w-11/12" /> -->

                        <textarea v-if="dataForm.lembar_prasoalStatus" v-model="dataForm.lembar_prasoal"
                            :rules="fnValidasi.validateData" name="lembar_prasoal" ref="lembar_prasoal"
                            class="textarea textarea-bordered md:w-full  w-11/12" placeholder="">
                                                                                                                                                                                        </textarea>
                        <div class="text-xs text-red-600 mt-1">
                            {{ errors.lembar_prasoal }}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="max-w-xs py-2">
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Instruksi Pengerjaan</span>
                                <input type="checkbox" class="toggle" v-model="dataForm.instruksi_pengerjaanStatus"
                                    name="instruksi_pengerjaanStatus" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <!-- <Field v-if="dataForm.instruksi_pengerjaanStatus" :rules="fnValidasi.validateData"
                                                                                                                                                                                          v-model="dataForm.instruksi_pengerjaan" name="instruksi_pengerjaan" type="text"
                                                                                                                                                                                          class="input input-bordered w-11/12" /> -->

                        <textarea v-if="dataForm.instruksi_pengerjaanStatus" v-model="dataForm.instruksi_pengerjaan"
                            :rules="fnValidasi.validateData" name="instruksi_pengerjaan" ref="instruksi_pengerjaan"
                            class="textarea textarea-bordered md:w-full  w-11/12" placeholder="">
                                                                                                                                                                                        </textarea>
                        <div class="text-xs text-red-600 mt-1">
                            {{ errors.instruksi_pengerjaan }}
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