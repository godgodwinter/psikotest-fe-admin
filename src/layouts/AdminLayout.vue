<script setup>
import { RouterLink, RouterView } from "vue-router";
import AdminNavbar from "./admin-layouts-components/AdminNavbar.vue";
import AdminSidebar from "./admin-layouts-components/AdminSidebar.vue";
</script>

<template>
    <div data-theme="winter" class="min-h-screen">
        <AdminNavbar />
        <AdminSidebar />
        <RouterView />
</div>
</template>
