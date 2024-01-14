<script setup>
import { useRoute } from 'vue-router';
import { ref } from "vue"
const route = useRoute();
const paketsoal_id = ref(route.params.paketsoal_id)
</script>
<template>
    <div class="space-x-2">
        <div class="pt-0 px-10 md:flex justify-between gap-2 space-y-2 md:space-y-0">
            <div class="space-x-2">
                <!-- <RouterLink :to="{ name: 'admin-ujiankhusus-paketsoal', params: { paketsoal_id } }">
                    <button class="btn btn-info btn-sm">Beranda Paketsoal</button>
                </RouterLink> -->
                <!-- <RouterLink :to="{ name: 'admin-ujianstudi-paketsoal-penilaian', params: { paketsoal_id } }">
                        <button class="btn btn-info btn-sm">Penilaian</button>
                    </RouterLink> -->
            </div>
            <div class="md:py-0 py-0">
                <router-link :to="{ name: 'admin-ujiankhusus-paketsoal' }"><button
                        class="btn font-semibold underline uppercase">PAKET SOAL</button></router-link>
            </div>
        </div>

        <div class="divider"></div>
        <div>

            <RouterView />
        </div>
    </div>
</template>