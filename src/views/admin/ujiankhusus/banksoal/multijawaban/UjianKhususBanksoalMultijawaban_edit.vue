<script setup>
import { ref } from "vue"
import Toast from "@/components/lib/Toast";
import { Form, Field } from "vee-validate";
import { useRouter, useRoute } from "vue-router";
import fnValidasi from "@/components/lib/babengValidasi";
import moment from "moment/min/moment-with-locales";
import Api from "@/axios/axiosNode";
import ApiUjianKhusus from "@/axios/axiosIst";
import { fn_copy_id_for_mongo } from "@/lib/FungsiBasic.js"
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

const router = useRouter();
const route = useRoute();
const aspek_detail_id = ref(route.params.multijawaban_id);
const dataForm = ref({
    nama: "",
    desc: " ",
    urutan: 1,
    waktu: 600,
    status: "Aktif",
    instruksi: "",
    lembar_prasoal: "",
    lembar_prasoal_timer: 0,
    instruksi_pengerjaan: "",
    instruksiStatus: false,
    lembar_prasoalStatus: false,
    instruksi_pengerjaanStatus: false,
    random_soal: false,
    random_pilihanjawaban: false,
});

const getDataDetail = async () => {
    try {
        const response = await ApiUjianKhusus.get(`cfit/banksoal/aspek_detail/${aspek_detail_id.value}`);
        // console.log(response);
        // dataDetail.value = response.data;
        dataForm.value.nama = response.data.nama;
        dataForm.value.desc = response.data.desc;
        dataForm.value.urutan = response.data.urutan;
        dataForm.value.waktu = response.data.waktu;
        dataForm.value.status = response.data.status;
        dataForm.value.instruksiStatus = response.data.instruksi_status == true ? true : false;
        dataForm.value.lembar_prasoalStatus = response.data.lembar_prasoal_status == true ? true : false;
        dataForm.value.instruksi_pengerjaanStatus = response.data.instruksi_pengerjaan_status == true ? true : false;
        dataForm.value.instruksi = response.data.instruksi;
        dataForm.value.lembar_prasoal = response.data.lembar_prasoal;
        dataForm.value.lembar_prasoal_timer = response.data.lembar_prasoal_timer;
        dataForm.value.instruksi_pengerjaan = response.data.instruksi_pengerjaan;
        dataForm.value.randomSoal = response.data.random_soal == true ? true : false;
        dataForm.value.randomPilihanJawaban = response.data.random_pilihanjawaban == true ? true : false;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
getDataDetail();
const onSubmit = async (values) => {
    values.nama = dataForm.value.nama;
    values.random_soal = dataForm.value.randomSoal
        ? true
        : false;
    values.status = dataForm.value.status
        ? "Aktif"
        : "Nonaktif";
    values.random_pilihanjawaban = dataForm.value.randomPilihanJawaban
        ? true
        : false;
    values.instruksi_status = dataForm.value.instruksiStatus
        ? true
        : false;
    values.lembar_prasoal_status = dataForm.value.lembar_prasoalStatus
        ? true
        : false;
    values.instruksi_pengerjaan_status = dataForm.value.instruksi_pengerjaanStatus
        ? true
        : false;
    // console.log(values);
    values.instruksi = dataForm.value.instruksi;
    values.lembar_prasoal = dataForm.value.lembar_prasoal;
    values.instruksi_pengerjaan = dataForm.value.instruksi_pengerjaan;
    values.lembar_prasoal_timer = dataForm.value.lembar_prasoal_timer;
    // console.log(values);

    dataForm.value = {
        nama: values.nama,
        desc: values.desc,
        urutan: values.urutan,
        waktu: values.waktu,
        status: values.status,
        instruksi: values.instruksi,
        instruksi_status: values.instruksi_status,
        lembar_prasoal: values.lembar_prasoal,
        lembar_prasoal_status: values.lembar_prasoal_status,
        lembar_prasoal_timer: values.lembar_prasoal_timer,
        instruksi_pengerjaan: values.instruksi_pengerjaan,
        instruksi_pengerjaan_status: values.instruksi_pengerjaan_status,
        random_soal: values.random_soal,
        random_pilihanjawaban: values.random_pilihanjawaban,
    };
    // console.log(dataForm.value);
    try {
        const response = await ApiUjianKhusus.put(`cfit/banksoal/aspek_detail/${aspek_detail_id.value}`, dataForm.value);
        // console.log(response);
        Toast.success("Info", "Data berhasil ditambahkan!");
        router.push({ name: "admin-ujiankhusus-banksoal-multijawaban" });
        return true;
    } catch (error) {
        console.error(error);
    }
};


const toolbarOptions = [['image'],
["bold", "italic", "underline", "strike"], // toggled buttons
["blockquote", "code-block"],

[{ header: 1 }, { header: 2 }], // custom button values
[{ list: "ordered" }, { list: "bullet" }],
[{ script: "sub" }, { script: "super" }], // superscript/subscript
[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
[{ direction: "rtl" }], // text direction

[{ size: ["small", false, "large", "huge"] }], // custom dropdown
[{ header: [1, 2, 3, 4, 5, 6, false] }],

[{ color: [] }, { background: [] }], // dropdown with defaults from theme
[{ font: [] }],
[{ align: [] }],

["clean"], // remove formatting button
];

const editorPertanyaan = ref("<b>tes123</b>");

const pagesActive = ref("tulis");

</script>
<template>
    <div>

        <article class="prose lg:prose-sm">
            <h1>ASPEK DETAIL EDIT</h1>
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
                        <label>Deskripsi :</label>
                        <div>
                            <Field :rules="fnValidasi.validateData" v-model="dataForm.desc" name="desc" type="text"
                                class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.desc }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label>Urutan :</label>
                        <div>
                            <Field :rules="fnValidasi.validateDataNumber" v-model="dataForm.urutan" name="urutan"
                                type="text" max="1000" min="0" class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.urutan }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label>Waktu : (detik)</label>
                        <div>
                            <Field :rules="fnValidasi.validateDataNumber" v-model="dataForm.waktu" name="waktu"
                                type="text" max="1000" min="0" class="input input-bordered w-11/12" />
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
                                    <input type="checkbox" class="toggle" v-model="dataForm.randomSoal"
                                        name="randomSoal" />
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
                        <div v-if="dataForm.lembar_prasoalStatus">
                            <div class="py-10 w-full bg-base-100 shadow-sm">
                                <div class="tabs">
                                    <a class="tab tab-bordered" @click="pagesActive = 'tulis'"
                                        :class="{ 'tab-active': pagesActive == 'tulis' }">Tulis</a>
                                    <a class="tab tab-bordered" @click="pagesActive = 'preview'"
                                        :class="{ 'tab-active': pagesActive == 'preview' }">Preview</a>
                                </div>
                            </div>
                            <div v-if="pagesActive == 'tulis'">
                                <label>Pertanyaan :</label>
                                <QuillEditor theme="snow" :toolbar="toolbarOptions"
                                    v-model:content="dataForm.lembar_prasoal" contentType="html" class="ql-editor2">

                                </QuillEditor>

                            </div>

                            <div class="shadow-sm py-4 px-4 space-y-4" v-else>
                                <label for="" class="underline">Preview : </label>
                                <div class="w-full border-2 min-h-16 p-10" v-html="dataForm.lembar_prasoal"></div>
                            </div>

                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.lembar_prasoal }}
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col" v-if="dataForm.lembar_prasoalStatus">
                        <label>Waktu Lembar Prasoal : (detik)</label>
                        <div>
                            <Field :rules="fnValidasi.validateDataNumber" v-model="dataForm.lembar_prasoal_timer"
                                name="lembar_prasoal_timer" type="text" max="1000" min="0"
                                class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.lembar_prasoal_timer }}
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
            </div>

            <div class="w-full flex justify-end py-10 px-10 gap-4">
                <span @click="router.go(-1)">
                    <span class="btn btn-secondary">Batal</span></span>
                <button class="btn btn-primary">Simpan</button>
            </div>
        </Form>
    </div>
</template>