import { defineStore } from "pinia";
import { ref } from "vue";

export const useSuperadminStore = defineStore("superadminStore", () => {
  const isSuperadminActive = ref(
    localStorage.getItem("isSuperadmin") === "true" || false
  );

  const toggleSuperadmin = () => {
    isSuperadminActive.value = !isSuperadminActive.value;
    localStorage.setItem("isSuperadmin", isSuperadminActive.value);
  };

  return {
    isSuperadminActive,
    toggleSuperadmin,
  };
});
