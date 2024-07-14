<script setup>
import { ref } from "vue"
import Api_tanpa_v from "@/axios/axiosNode_tanpa_v";
import Api from "@/axios/axiosNode";
import axiosLaravel from "@/axios/axiosLaravel";
import ApiUjianKhusus from "@/axios/axiosIst";
import { fn_copy_id_for_mongo } from "@/lib/FungsiBasic.js"
import Toast from "@/components/lib/Toast";
import { Form, Field } from "vee-validate";
import { useRouter } from "vue-router";
import fnValidasi from "@/components/lib/babengValidasi";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

const router = useRouter();
const dataForm = ref({
    nama: null,
    alamat: null,
    status: null,
    kepsek_nama: null,
    tahunajaran_nama: null,
    semester_nama: null,
    kecamatan: null,
    kabupaten: null,
    provinsi: null,
    paket_id: null,
});

const dataPaket = ref([]);
const getPaket = async () => {
    try {
        const response = await Api_tanpa_v.get(`admin/paket`);
        // console.log(response);
        // dataDetail.value = response.data;
        dataPaket.value = response.data;

        return response;
    } catch (error) {
        Toast.danger("Warning", "Data Gagal dimuat");
        console.error(error);
    }
};

getPaket();
const inputSelectMinat = ref({ id: null, label: null })
const inputSelectKr = ref({ id: null, label: null })
const onSubmit = async (values) => {
    let dataStore = {
        nama: dataForm.value.nama,
        alamat: dataForm.value.alamat,
        status: dataForm.value.status,
        kepsek_nama: dataForm.value.kepsek_nama,
        tahunajaran_nama: dataForm.value.tahunajaran_nama,
        semester_nama: dataForm.value.semester_nama,
        kecamatan: dataForm.value.kecamatan,
        kabupaten: dataForm.value.kabupaten,
        provinsi: dataForm.value.provinsi,
        paket_id: dataForm.value.paket_id,
    };
    try {
        const response = await Api.post(`master/sekolah`, dataStore);
        console.log(response);
        Toast.success("Info", "Data berhasil ditambahkan!");
        router.push({ name: "admin-sekolah" });
        return true;
    } catch (error) {
        console.error(error);
    }
};

//! daerah 

const listProvinsi = ref([]);

const listKabupaten = ref([]);

const listKecamatan = ref([]);

// https://dev.farizdotid.com/api/daerahindonesia/provinsi
const getProvinsi = async () => {
    try {
        const response = await Api.get(
            `https://dev.farizdotid.com/api/daerahindonesia/provinsi`
        );
        response.provinsi.forEach((element) => {
            let tempDAta = {
                code: element.id,
                label: element.nama,
            };
            listProvinsi.value.push(tempDAta);
        });
        // console.log(response, listProvinsi.value);
        return response.provinsi;
    } catch (error) {
        console.error(error);
    }
};

const fnGetLabelProvinci = (id) => {
    let label = "";
    listProvinsi.value.forEach((element) => {
        if (element.code == id) {
            label = element.label;
        }
    });
    return label;
};
const fnGetLabelKabupaten = (id) => {
    let label = "";
    listKabupaten.value.forEach((element) => {
        if (element.code == id) {
            label = element.label;
        }
    });
    return label;
};
const fnGetLabelKecamatan = (id) => {
    let label = "";
    listKecamatan.value.forEach((element) => {
        if (element.code == id) {
            label = element.label;
        }
    });
    return label;
};

const getKabupaten = async (e) => {
    dataForm.value.provinsi = fnGetLabelProvinci(e.target.value);
    //   console.log(fnGetLabelProvinci(e.target.value));
    //   console.log(e.target.value);
    let id = e.target.value;
    try {
        const response = await Api.get(
            `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id}`
        );
        // console.log(response.kota_kabupaten);
        listKabupaten.value = [
            {
                code: "0",
                label: "-",
            },
        ];

        response.kota_kabupaten.forEach((element) => {
            let tempDAta = {
                code: element.id,
                label: element.nama,
            };
            listKabupaten.value.push(tempDAta);
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};
// https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${id}
const getKecamatan = async (e) => {
    dataForm.value.kabupaten = fnGetLabelKabupaten(e.target.value);
    //   console.log(fnGetLabelKabupaten(e.target.value));
    //   console.log(e.target.value);
    let id = e.target.value;
    try {
        const response = await Api.get(
            `https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${id}`
        );
        // console.log(response.kecamatan);

        listKecamatan.value = [
            {
                code: "0",
                label: "-",
            },
        ];

        response.kecamatan.forEach((element) => {
            let tempDAta = {
                code: element.id,
                label: element.nama,
            };
            listKecamatan.value.push(tempDAta);
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

const setKecamatan = async (e) => {
    dataForm.value.kecamatan = fnGetLabelKecamatan(e.target.value);
    //   console.log(dataDetail.value.kecamatan, fnGetLabelKecamatan(e.target.value));
    //   console.log(e.target.value, listKecamatan.value);
    //   let id = e.target.value;
};

getProvinsi();
//! daerah-emd 
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>TAMBAH SEKOLAH</h1>
        </article>

        <Form v-slot="{ errors }" @submit="onSubmit">
            <div class="pt-5 px-5">
                <div class="w-full mx-0">
                    <div class="bg-white rounded-lg p-0 sm:p-6 xl:p-0">
                        <div class="grid md:grid-cols-2 gap-2">
                            <div>
                                <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Nama</label>
                                <Field :rules="fnValidasi.validateData" v-model="dataForm.nama" name="nama" type="text"
                                    class="input input-bordered w-11/12" />
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.nama }}
                                </div>
                            </div>
                            <div>
                                <label for="name" class="text-sm font-medium text-gray-900 block mb-2">alamat</label>
                                <Field :rules="fnValidasi.validateData" v-model="dataForm.alamat" name="alamat"
                                    type="text" class="input input-bordered w-11/12" />
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.alamat }}
                                </div>
                            </div>

                            <div>
                                <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Status</label>
                                <select class="select select-bordered w-full max-w-xs" v-model="dataForm.status">
                                    <option disabled selected>Pilih Status ?</option>
                                    <option>Aktif</option>
                                    <option>Nonaktif</option>
                                </select>
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.status }}
                                </div>
                            </div>

                            <div>
                                <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Paket</label>
                                <select class="select select-bordered w-full max-w-xs" v-model="dataForm.paket_id">
                                    <option disabled selected>Pilih Paket ?</option>
                                    <option v-for="item in dataPaket" :value="item.id">
                                        {{ item.nama }}
                                    </option>
                                </select>
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.paket_id }}
                                </div>
                            </div>

                            <div>
                                <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Nama Kepala
                                    Sekolah</label>
                                <Field :rules="fnValidasi.validateData" v-model="dataForm.kepsek_nama"
                                    name="kepsek_nama" type="text" class="input input-bordered w-11/12" />
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.kepsek_nama }}
                                </div>
                            </div>

                            <div>
                                <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Tahun
                                    Ajaran</label>
                                <Field :rules="fnValidasi.validateData" v-model="dataForm.tahunajaran_nama"
                                    name="tahunajaran_nama" type="text" class="input input-bordered w-11/12" />
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.tahunajaran_nama }}
                                </div>
                            </div>

                            <div>
                                <label for="name" class="text-sm font-medium text-gray-900 block mb-2">Semester</label>
                                <Field :rules="fnValidasi.validateData" v-model="dataForm.semester_nama"
                                    name="semester_nama" type="text" class="input input-bordered w-11/12" />
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.semester_nama }}
                                </div>
                            </div>

                            <!-- !daerah -->

                            <div>
                                <label for="name"
                                    class="text-sm font-medium text-base-content block mb-2">Provinsi</label>

                                <select class="select select-bordered w-full" v-model="dataForm.provinsi"
                                    @change="getKabupaten($event)">
                                    <option selected>
                                        {{ dataForm.provinsi }}
                                    </option>
                                    <option v-for="item in listProvinsi" :key="item.code" :value="item.code">
                                        {{ item.label }}
                                    </option>
                                </select>
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.provinsi }}
                                </div>
                            </div>
                            <div>
                                <label for="name"
                                    class="text-sm font-medium text-base-content block mb-2">Kabupaten</label>

                                <select class="select select-bordered w-full" v-model="dataForm.kabupaten"
                                    @change="getKecamatan($event)">
                                    <!-- <option disabled selected>Pilih Kabupaten</option> -->
                                    <option selected>
                                        {{ dataForm.kabupaten }}
                                    </option>
                                    <option v-for="item in listKabupaten" :key="item.code" :value="item.code">
                                        {{ item.label }}
                                    </option>
                                </select>
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.kabupaten }}
                                </div>
                            </div>
                            <div>
                                <label for="name"
                                    class="text-sm font-medium text-base-content block mb-2">Kecamatan</label>

                                <select class="select select-bordered w-full" v-model="dataForm.kecamatan"
                                    @change="setKecamatan($event)">
                                    <!-- <option disabled selected>Pilih Kecamatan</option> -->
                                    <option selected>
                                        {{ dataForm.kecamatan }}
                                    </option>
                                    <option v-for="item in listKecamatan" :key="item.code" :value="item.code">
                                        {{ item.label }}
                                    </option>
                                </select>
                                <div class="text-xs text-red-600 mt-1">
                                    {{ errors.kecamatan }}
                                </div>
                            </div>
                            <!-- !daerah-end -->
                        </div>
                    </div>
                </div>
            </div>


            <!-- <div class="py-2 lg:py-4 px-4">
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
                <div class="space-y-4">
                    <div class="flex flex-col">
                        <label>Alamat :</label>
                        <div>
                            <Field :rules="fnValidasi.validateData" v-model="dataForm.nama" name="nama" type="text"
                                class="input input-bordered w-11/12" />
                            <div class="text-xs text-red-600 mt-1">
                                {{ errors.nama }}
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->

            <div class="w-full flex justify-end py-10 px-10 gap-4">
                <span @click="router.go(-1)">
                    <span class="btn btn-secondary">Batal</span></span>
                <button class="btn btn-primary">Simpan</button>
            </div>
        </Form>
    </div>
</template>