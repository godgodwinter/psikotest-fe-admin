import { ref, computed } from "vue";
import { defineStore } from "pinia";
// import { useRouter } from "vue-router";
// import Toast from "@/components/lib/Toast.js";

export const useAdminPagesStore = defineStore("adminPagesStore", () => {
    // const router = useRouter();
    // State
    const isSidebarActive = ref(false);
    // Getter Setter
    const getIsSidebarActive = computed(() => isSidebarActive.value);
    const setIsSidebarActive = (item) => {
        isSidebarActive.value = item;
    };
    const toggleSideBar = () => {
        isSidebarActive.value = !isSidebarActive.value;
    }

    const pagesActive = ref(false);
    // Getter Setter
    const getPagesActive = computed(() => pagesActive.value);
    const setPagesActive = (item) => {
        pagesActive.value = item;
    };

    const identitas = ref(false);
    // Getter Setter
    const getIdentitas = computed(() => identitas.value);
    const setIdentitas = (item) => {
        identitas.value = item;
    };

    const superadmin = ref(localStorage.getItem("superadmin_001") ? localStorage.getItem("superadmin_001") : false);
    // Getter Setter
    const getSuperadmin = computed(() => superadmin.value);
    const setSuperadmin = (item) => {
        superadmin.value = item;
    };

    return {
        isSidebarActive,
        getIsSidebarActive,
        setIsSidebarActive,
        toggleSideBar,
        pagesActive,
        getPagesActive,
        setPagesActive,
        identitas,
        getIdentitas,
        setIdentitas
    };
});
