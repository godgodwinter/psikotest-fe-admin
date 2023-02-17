<script setup>
import { RouterLink, RouterView } from "vue-router";
import AdminNavbar from "./admin-layouts-components/AdminNavbar.vue";
</script>

<template>
    <div data-theme="winter" class="min-h-screen">
        <AdminNavbar />
        <RouterView />
</div>
</template>
