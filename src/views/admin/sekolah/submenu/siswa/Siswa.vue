<script setup>
import Api from "@/axios/axiosNode";
import { ref, defineAsyncComponent } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import ButtonDelete from "@/components/atoms/ButtonDel.vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "@/components/lib/Toast";
import { useAdminPagesStore } from '@/stores/admin/adminPagesStore'


const BASE_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const route = useRoute();

const sekolah_id = ref(route.params.sekolah_id)
const kelas_id = ref(route.params.kelas_id)
const adminPagesStore = useAdminPagesStore();
const getSekolahAktif = ref({
    sekolah_id: sekolah_id.value,
    kelas_id: kelas_id.value,
})
const kelas_nama = ref(adminPagesStore.getpages_sekolah_aktif ? adminPagesStore.getpages_sekolah_aktif.kelas_nama : "-")
adminPagesStore.$subscribe((mutation, state) => {
    getSekolahAktif.value = adminPagesStore.getpages_sekolah_aktif;
    // console.log(getSekolahAktif.value);
    kelas_nama.value = getSekolahAktif.value.kelas_nama;
    // inputCariKelas.value = getSekolahAktif.value.kelas_id;
});

const LoadingNavbar = defineAsyncComponent(() =>
    import('@/components/alert/AlertLoading.vue')
)
const AlertFailed = defineAsyncComponent(() =>
    import('@/components/alert/AlertFailed.vue')
)

const data = ref();
const isLoading = ref(true);
const isError = ref(false);

const dataKelas = ref([]);
const pilihKelas = ref([]);
const inputCariKelas = ref({ id: kelas_id.value, label: kelas_nama.value })

const getDataKelas = async () => {
    try {
        const response = await Api.get(`master/sekolah/${sekolah_id.value}/kelas`);
        // console.log(response);
        dataKelas.value = response.data;
        if (dataKelas.value.length > 0) {
            // console.log(dataKelas.value[0].id);
            if (kelas_id.value == 0) {
                kelas_id.value = dataKelas.value[0].id;
            }
            dataKelas.value.forEach((item) => {
                pilihKelas.value.push({
                    label: item.nama,
                    id: item.id,
                });
            });
        }
        return response;
    } catch (error) {
        Toast.danger("Warning", "Data Gagal dimuat");
        console.error(error);
    }
};
getDataKelas();


const columns = [
    {
        label: "Actions",
        field: "actions",
        sortable: false,
        width: "50px",
        tdClass: "text-center",
        thClass: "text-center",
    },
    {
        label: "Nama",
        field: "nama",
        type: "String",
    },
    {
        label: "Kelas",
        field: "kelas_nama",
        type: "String",
    },
    {
        label: "Username",
        field: "username",
        type: "String",
    },
    {
        label: "Password Default",
        field: "passworddefault",
        type: "String",
    },
    {
        label: "Username Ortu",
        field: "ortu_username",
        type: "String",
    },
    {
        label: "Password Default Ortu",
        field: "ortu_passworddefault",
        type: "String",
    },
    {
        label: "Tipe",
        field: "prefix",
        type: "String",
    },
    {
        label: "ID",
        field: "id",
        type: "number",
    },
];

const getData = async () => {
    try {
        const response = await Api.get(`/master/sekolah/${sekolah_id.value}/kelas/${getSekolahAktif.value.kelas_id}/siswa`);
        data.value = response.data;
        isLoading.value = false;
        return response.data;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
getData();

const doDeleteData = async (id, index) => {
    if (confirm("Apakah anda yakin menghapus data ini?")) {
        try {
            const response = await Api.delete(`ujianstudi/paketsoal/${id}`);
            if (response.status) {
                Toast.warning("Berhasil", response.message);
                // Toast.success("Info", "Data berhasil dihapus!");
            } else {
                Toast.warning("Gagal", response.message);
            }
            getData();
            return true;
        } catch (error) {
            console.error(error);
        }
    }
};

const doEditData = async (id, index) => {
    router.push({
        name: "admin-ujianstudi-paketsoal-edit",
        params: { paketsoal_id: id },
    });
};

const doCopyClipboard = (item) => {
    navigator.clipboard.writeText(item);
    Toast.babeng("Info", `${item} berhasil disalin`);
};
const doPilihKelas = async () => {
    let newDataSekolahAktif = {
        sekolah_id: sekolah_id.value,
        kelas_id: inputCariKelas.value.id ? inputCariKelas.value.id : kelas_id.value,
        kelas_nama: inputCariKelas.value.label ? inputCariKelas.value.label : kelas_nama.value,
    }
    await adminPagesStore.setpages_sekolah_aktif(newDataSekolahAktif)
    // console.log('====================================');
    // console.log(getSekolahAktif.value, inputCariKelas.value.id);
    // console.log('====================================');
    await getData()
    // console.log(inputCariKelas.value.id);
    await router.push({
        name: "admin-sekolah-submenu-siswa",
        params: {
            sekolah_id: sekolah_id.value,
            kelas_id: inputCariKelas.value.id ? inputCariKelas.value.id : kelas_id.value,
        },
    });

    // fnSetToTempSekolah(id, inputCariKelas.value.id, inputCariKelas.value.label);
    // getData(inputCariKelas.value.id);
};
</script>
<template>
    <div>
        <article class="prose lg:prose-sm">
            <h1>SISWA KELAS {{ kelas_nama }}</h1>
        </article>

        <div class="w-full bg-base-100 shadow-sm rounded-lg py-4 px-4">
            <div class="flex justify-center">
                <v-select class="py-2 px-3 w-72 mx-auto md:mx-0" :options="pilihKelas" v-model="inputCariKelas"
                    v-bind:class="{ disabled: false }"></v-select>
                <div class="py-2">
                    <button class="btn btn-sm btn-info p-2" @click="doPilihKelas()">
                        Cari
                    </button>
                </div>
            </div>
        </div>
        <span v-if="isLoading">
            <LoadingNavbar />
        </span>
        <span v-else-if="isError">
            <AlertFailed :message="'Gagal mendapatkan response dari server'" />
        </span>
        <span v-else>
            <div class="md:py-2 px-4 lg:flex flex-wrap gap-4" v-if="data">
                <div class="w-full lg:w-full">
                    <div class="bg-white shadow rounded-lg px-4 py-4">
                        <div v-if="data">
                            <vue-good-table :line-numbers="true" :columns="columns" :rows="data" :search-options="{
                                enabled: true,
                            }" :pagination-options="{
    enabled: true,
    perPageDropdown: [50, 100, 150, 200],
}" styleClass="vgt-table striped bordered condensed" class="py-0">
                                <template #table-actions>
                                    <div class="space-x-1 space-y-1 gap-1">
                                        <!-- <router-link :to="{
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    name: 'admin-ujianstudi-paketsoal-tambah',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <button class="btn btn-sm btn-primary tooltip" data-tip="Tambah">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        TAMBAH
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </router-link> -->
                                    </div>
                                </template>
                                <template #table-row="props">
                                    <span v-if="props.column.field == 'actions'">
                                        <div class="text-sm font-medium text-center flex justify-center space-x-1">
                                            <RouterLink
                                                :to="{ name: 'admin-sekolah-submenu-dashboard', params: { sekolah_id: props.row.id } }">
                                                <button class="btn btn-sm btn-primary tooltip" data-tip="Detail">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg></button>
                                            </RouterLink>
                                            <!-- <button class="btn btn-sm btn-warning tooltip" data-tip="Edit"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            @click="doEditData(props.row.id, props.index)">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                fill="currentColor">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <path
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <path fill-rule="evenodd"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    clip-rule="evenodd" />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </svg></button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <button class="btn btn-sm btn-danger"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            @click="doDeleteData(props.row.id, props.index)">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                fill="currentColor">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <path fill-rule="evenodd"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    clip-rule="evenodd" />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </svg>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </button> -->
                                        </div>
                                    </span>


                                    <span v-else-if="props.column.field == 'username'">
                                        <div class="flex justify-center gap-2">
                                            <div class="text-center">{{ props.row.username }}</div>
                                            <span v-if="props.row.username" @click="doCopyClipboard(props.row.username)"
                                                class="hover:text-primary cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                            </span>
                                        </div>
                                    </span>
                                    <span v-else-if="props.column.field == 'passworddefault'">
                                        <div class="flex justify-center gap-2">
                                            <div class="text-center">{{ props.row.passworddefault }}</div>
                                            <span v-if="props.row.passworddefault"
                                                @click="doCopyClipboard(props.row.passworddefault)"
                                                class="hover:text-primary cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                            </span>
                                        </div>
                                    </span>
                                    <span v-else-if="props.column.field == 'ortu_username'">
                                        <div class="flex justify-center gap-2">
                                            <div class="text-center">{{ props.row.ortu_username }}</div>
                                            <span v-if="props.row.ortu_username"
                                                @click="doCopyClipboard(props.row.ortu_username)"
                                                class="hover:text-primary cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                            </span>
                                        </div>
                                    </span>
                                    <span v-else-if="props.column.field == 'ortu_passworddefault'">
                                        <div class="flex justify-center gap-2">
                                            <div class="text-center">
                                                {{ props.row.ortu_passworddefault }}
                                            </div>
                                            <span v-if="props.row.ortu_passworddefault"
                                                @click="doCopyClipboard(props.row.ortu_passworddefault)"
                                                class="hover:text-primary cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                            </span>
                                        </div>
                                    </span>
                                    <span v-else-if="props.column.field == 'prefix'">
                                        <div class="flex justify-center gap-2">
                                            <div v-if="props.row.prefix">
                                                USER
                                            </div>
                                            <div v-else>API</div>

                                        </div>
                                    </span>
                                    <span v-else>
                                        {{ props.formattedRow[props.column.field] }}
                                    </span>
                                </template>
                            </vue-good-table>
                        </div>
                    </div>
                </div>
            </div>

        </span>
    </div>
</template>
