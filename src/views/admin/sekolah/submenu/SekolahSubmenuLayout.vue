<script setup>
import { ref, defineAsyncComponent } from "vue"
import { useRoute } from "vue-router";
import Api from "@/axios/axiosNode";
import { useAdminPagesStore } from '@/stores/admin/adminPagesStore'
const adminPagesStore = useAdminPagesStore();
const route = useRoute();
const sekolah_id = ref(route.params.sekolah_id)
const kelas_id = ref(0)
const sekolah_nama = ref(null)
const kelas = ref([])
const isLoading = ref(true);
const isError = ref(false);

const getData = async () => {
    try {
        const response = await Api.get(`/master/sekolah/${sekolah_id.value}`);
        sekolah_nama.value = response.data?.nama;
        kelas.value = response.data?.kelas;
        isLoading.value = false;
        // console.log(kelas.value);
        fn_periksaLocalStrg_sekolahAktif()

        return response.data;
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
    }
};
getData();

const SubSidebar = defineAsyncComponent(() =>
    import('./SubSidebar.vue')
)

const getSekolahAktif = adminPagesStore.getpages_sekolah_aktif;
const sekolahDefault = adminPagesStore.getsekolah_default;
sekolahDefault.sekolah_id = sekolah_id.value;
const fn_periksaLocalStrg_sekolahAktif = async () => {
    //! jika localstorage masi kosong
    if (!getSekolahAktif) {
        await adminPagesStore.setpages_sekolah_aktif(sekolahDefault)
    }
    //! jika localstrg.sekolah_id != sekolah_id -> maka ambil kelas_id;
    if (getSekolahAktif?.sekolah_id !== sekolah_id.value) {
        kelas_id.value = kelas.value.length > 0 ? kelas.value[0].id : 99;
        let newDataSekolahAktif = {
            sekolah_id: sekolah_id.value,
            kelas_id: kelas_id.value,
            kelas_nama: kelas.value.length > 0 ? kelas.value[0].nama : "-aa",
        }
        await adminPagesStore.setpages_sekolah_aktif(newDataSekolahAktif)

    }
}

</script>
<template>
    <div class="space-x-1">
        <div class="container mx-auto lg:mx-0 my-5 p-1">
            <div class="xl:flex no-wrap lg:-mx-2">
                <!-- Left Side -->
                <div class="w-full xl:w-3/12 mx-2">
                    <!-- <SubSideBarMenu :data="data"></SubSideBarMenu> -->
                    <!-- !SUB-SIDEBAR -->
                    <article class="prose lg:prose-xs text-center underline uppercase">
                        <h4>{{ sekolah_nama }}</h4>
                    </article>
                    <div class="collapse lg:collapse-open">
                        <input type="checkbox" class="peer" />
                        <div
                            class="collapse-title bg-slate-50 text-primary-content peer-checked:bg-green-50 peer-checked:text-secondary-content">
                            <div class=" p-2 border-t-4 border-green-400 shadow-sm">
                                <span class="flex space-x-2 justify-center items-center">
                                    <p
                                        class=" text-base-content font-bold text-lg hover:text-gray-600 leading-6 text-center pt-2">
                                        SUBMENU <!-- {{ data.nama }} -->
                                    </p>
                                </span>

                            </div>
                        </div>
                        <div
                            class="collapse-content  bg-slate-50 text-primary-content peer-checked:bg-green-50 peer-checked:text-secondary-content">
                            <SubSidebar />
                        </div>
                    </div>

                    <!-- !SUB-SIDEBAR -->

                </div>
                <!-- Right Side -->
                <div class="w-full xl:w-9/12 pt-10 lg:pt-0 mx-2">
                    <router-view />
                </div>
            </div>
        </div>

    </div>
</template>