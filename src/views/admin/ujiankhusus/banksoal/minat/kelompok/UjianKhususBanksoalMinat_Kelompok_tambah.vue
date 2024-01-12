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
const banksoal_minatbakat_id = ref(route.params.banksoal_minatbakat_id)
const data = ref();
const isLoading = ref(true);
const isError = ref(false);


const dataForm = ref({
    kelompok_nama: null,
    kelompok_desc: null,
    urutan: 1,
    status: true,
});
const onSubmit = async (values) => {
    values.kelompok_nama = dataForm.value.kelompok_nama;
    values.kelompok_desc = dataForm.value.kelompok_desc;
    values.status = dataForm.value.status
        ?true
        : false;
    values.urutan = dataForm.value.urutan;

    let dataFormSend = {
        kelompok_nama: dataForm.value.kelompok_nama,
        kelompok_desc: dataForm.value.kelompok_desc,
        urutan: dataForm.value.urutan || 1,
        status: values.status,
    };
    try {
        const response = await ApiUjianKhusus.post(`ujiankhusus/minatbakat/banksoal/index/${banksoal_minatbakat_id.value}/kelompok`, dataFormSend);
        // console.log(response);
        Toast.success("Info", "Data berhasil ditambahkan!");
        router.push({ name: "admin-ujiankhusus-banksoal-minat-kelompok",params:{banksoal_minatbakat_id:banksoal_minatbakat_id.value} });
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
            <h1>TAMBAH KELOMPOK </h1>
            <h5>UJIAN KHUSUS</h5>
        </article>
        
        <div class="divider"></div>

        
        <Form v-slot="{ errors }" @submit="onSubmit">
            <div class="py-2 lg:py-4 px-4">
                <div class="space-y-4">
                    <div class="flex flex-col">
                        <label>Nama Kelompok :</label>
                        <div>
                            <Field :rules="fnValidasi.validateData" v-model="dataForm.kelompok_nama" name="kelompok_nama" type="text"
                                class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.nama }}
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
                    <label>Deskripsi Kelompok :</label>
                    <QuillEditor theme="snow" :toolbar="toolbarOptions" v-model:content="dataForm.kelompok_desc"
                        contentType="html" class="ql-editor2">

                    </QuillEditor>

                </div>
                
                <div class="shadow-sm py-4 px-4 space-y-4" v-else>
                    <label for="" class="underline">Preview : </label>
                    <div class="w-full border-2 min-h-16 p-10" v-html="dataForm.kelompok_desc"></div>
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