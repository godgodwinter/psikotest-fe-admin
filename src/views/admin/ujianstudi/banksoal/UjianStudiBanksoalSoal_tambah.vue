<script setup>
import { ref } from "vue"
import Api from "@/axios/axiosNode";
import Toast from "@/components/lib/Toast";
import { Form, Field } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import fnValidasi from "@/components/lib/babengValidasi";
import fnCampur from "@/components/lib/FungsiCampur";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

const router = useRouter();
const route = useRoute();
const aspek_detail_id = ref(route.params.aspek_detail_id)
const dataForm = ref({
    pertanyaan: "",
    nomer_urut: 0,
    aspek_detail_id,
    pilihanJawaban: [],
});
const onSubmit = async (values) => {
    let doSubmit = 1;
    values.fileAudio = fileAudio.value ? fileAudio.value : null;
    // console.log(values.fileAudio, fileAudio.value);
    values.pertanyaan = dataForm.value.pertanyaan;
    values.kode = dataForm.value.kode;
    values.nomer_urut = dataForm.value.nomer_urut ? dataForm.value.nomer_urut : 0;
    values.pilihanJawaban = dataPilihanJawaban.value;
    dataPilihanJawaban.value.forEach((item, index) => {
        if (item.jawaban === null) {
            Toast.danger(
                "Info",
                `Jawaban ${fnCampur.fnNumberToAlphabet(index + 1)} harus diisi!`
            );
            doSubmit = 0;
            return false;
        }
        // if (item.status == null && item.status == "") {
        //   Toast.danger(
        //     "Info",
        //     `Status Jawaban  ${fnCampur.fnNumberToAlphabet(index + 1)} harus diisi!`
        //   );
        //   doSubmit = 0;
        //   return false;
        // }
        if (item.skor == null) {
            Toast.danger(
                "Info",
                `Skor Jawaban  ${fnCampur.fnNumberToAlphabet(index + 1)} harus diisi!`
            );
            doSubmit = 0;
            return false;
        }
    });
    // console.log(dataPilihanJawaban.value[0].jawaban);
    // console.log(dataForm.value.ujian_kategori_id);
    // console.log(values);
    // ----------------------------------------------------------------
    if (doSubmit > 0) {
        let inputForm = {
            studi_v2_banksoal_aspek_detail_id: aspek_detail_id.value,
            pertanyaan: values.pertanyaan,
            pilihanJawaban: values.pilihanJawaban,
            kode: values.kode,
            nomer_urut: values.nomer_urut,
        }
        console.log(inputForm);
        const response = await Api.post(
            `ujianstudi/banksoal/aspek_detail/${aspek_detail_id.value}/soal`,
            inputForm
        );
        console.log(response);
        Toast.success("Info", "Data berhasil ditambahkan!");
        // router.push({
        //     name: "admin.skolastik.banksoal.soal.index",
        //     params: { aspek_id: values.skolastik_banksoal_aspek_id },
        // });

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

const dataPilihanJawaban = ref([
    {
        // id: 1,
        jawaban: "-",
        // status: "Benar",
        skor: 1,
    },
    {
        // id: 2,
        jawaban: "-",
        skor: 0,
    },
]);

const doTambahPilihanJawaban = () => {
    dataPilihanJawaban.value.push({
        // id: dataPilihanJawaban.value.length+1,
        jawaban: "-",
        // status: "Salah",
        skor: 0,
    });
};

const doHapusPilihanJawaban = () => {
    dataPilihanJawaban.value.pop();
};

let embedImgPertanyaan = ref(null);
const fileAudio = ref(null);
function handleImgPertanyaan(e) {
    let type = e.target.files[0].type;
    fileAudio.value = e.target.files[0];
    // console.log('====================================');
    // console.log(fileAudio.value);
    // console.log('====================================');
    if (type == "audio/wav" || type == "audio/mpeg" || type == "audio/ogg") {
        console.log("File " + type);

        embedImgPertanyaan.value = URL.createObjectURL(e.target.files[0]);
        console.log(embedImgPertanyaan.value, e.target.files[0].type);
    } else {
        Toast.danger("File harus audio (.mp3/.wav)");
    }
}
const doClearImgPertanyaan = () => {
    embedImgPertanyaan.value = null;
}
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>TAMBAH SOAL</h1>
        </article>

        <QuillEditor theme="snow" />

        <Form v-slot="{ errors }" @submit="onSubmit">
            <div class="py-2 lg:py-4 px-4">

                <div class="flex flex-col">
                    <label>Nomer Urut : </label>
                    <div>
                        <Field :rules="fnValidasi.validateDataNumber" v-model="dataForm.nomer_urut" name="nomer_urut"
                            type="number" class="py-2 px-3 w-full lg:w-1/2 mx-auto md:mx-0 input input-bordered" />
                        <div class="text-xs text-red-600 mt-1">
                            {{ errors.nomer_urut }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col">
                    <label>Kode : </label>
                    <div>
                        <Field v-model="dataForm.kode" name="kode" type="text"
                            class="py-2 px-3 w-full lg:w-1/2 mx-auto md:mx-0 input input-bordered" />
                        <div class="text-xs text-red-600 mt-1">
                            {{ errors.kode }}
                        </div>
                    </div>
                </div>

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
                    <QuillEditor theme="snow" :toolbar="toolbarOptions" v-model:content="dataForm.pertanyaan"
                        contentType="html" class="ql-editor2">

                    </QuillEditor>

                </div>

                <div class="shadow-sm py-4 px-4 space-y-4" v-else>
                    <label for="" class="underline">Preview : </label>
                    <div class="w-full border-2 min-h-16 p-10" v-html="dataForm.pertanyaan"></div>
                </div>

                <!-- AUDIO -->
                <div>
                    <div class="grid grid-cols-2">
                        <div class="px-4 py-2 font-semibold">Audio <code
                                class="text-red-500 text-xs"> *) kosongkan jika tidak diperlukan</code></div>
                        <div class="px-4 py-2">
                            <input @change="handleImgPertanyaan($event)" type="file" />
                            <button class="btn btn-danger" @click="doClearImgPertanyaan">Clear</button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1">
                        <!-- <div class="px-4 py-2 font-semibold">Preview </div> -->
                        <!-- <div class="avatar">
                                                                                <div class="w-48 rounded">
                                                                                  <img :src="embedImgPertanyaan" v-if="embedImgPertanyaan" class="" />
                                                                                  <div class="shadow shadow-lg h-48" id="previewpdf" v-else />
                                                                                </div>
                                                                              </div> -->
                    </div>
                </div>


                <!-- PILIHAN JAWABAN -->

                <div v-if="dataPilihanJawaban.length > 0">
                    <div v-for="(item, index) in dataPilihanJawaban" :key="index">
                        <div class="py-10 px-4 space-y-4">
                            <div class="space-y-4 shadow-lg">
                                <div class="py-4 px-4">
                                    <label for="">Pilihan Jawaban {{ fnCampur.fnNumberToAlphabet(index + 1) }} :
                                    </label>

                                    <QuillEditor theme="snow" :toolbar="toolbarOptions"
                                        v-model:content="dataPilihanJawaban[index].jawaban" contentType="html">
                                    </QuillEditor>
                                </div>
                                <div class="space-y-4 py-4 px-4">
                                    <div class="flex flex-col">
                                        <label>Skor :
                                            <code class="text-red-500 text-sm font-semibold">{{ dataPilihanJawaban[index].skor }}
                                                                                      </code></label>
                                        <div>
                                            <input :rules="fnValidasi.validateDataSkor"
                                                v-model="dataPilihanJawaban[index].skor"
                                                :name="dataPilihanJawaban + '[' + index + ']'" type="number" max="100"
                                                class="input input-bordered w-11/12" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Pilihan Jawaban -->
                <div class="px-4">
                    <div class="space-x-2">
                        <span class="btn btn-danger btn-sm btn-outline" @click="doHapusPilihanJawaban()">
                            Hapus
                        </span>
                        <span class="btn btn-primary btn-sm btn-outline" @click="doTambahPilihanJawaban()">
                            Tambah
                        </span>
                    </div>
                </div>


                <!-- ---------------------------------------------------------------- -->
                <!-- PENUTUP -->
                <!-- ---------------------------------------------------------------- -->
            </div>

            <div class="w-full flex justify-end py-10 px-10 gap-4">
                <!-- <button class="btn btn-warning">Draft</button> -->
                <span class="btn btn-secondary" @click="router.go(-1)">Batal</span>
                <button class="btn btn-primary">Simpan</button>
            </div>
        </Form>
    </div>
</template>