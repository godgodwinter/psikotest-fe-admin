<script setup>
import { ref, computed } from 'vue';
import { useSuperadminStore } from '@/stores/admin/superadminPagesStore';

const superadminStore = useSuperadminStore();

const status = computed(() => (superadminStore.isSuperadminActive ? 'Aktif' : 'Tidak Aktif'));

const toggleStatus = () => {
    superadminStore.toggleSuperadmin();
};
</script>

<template>
    <div class="p-2 px-2">
        <h2>Status Superadmin: {{ status }}</h2>
        <button class="btn btn-lg btn-info" @click="toggleStatus">Update Status</button>
    </div>
</template>