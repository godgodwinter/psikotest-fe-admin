<template>
    <div class="space-x-2">
        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-aspek_detail' }">
            <button class="btn btn-info btn-sm">MAPEL UMUM (SELAIN TIPE MULTI JAWABAN, Minat & KR)</button>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-minat' }">
            <button class="btn btn-warning btn-sm">Minat Bakat</button>
        </RouterLink>

        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-kr' }">
            <button class="btn btn-warning btn-sm">KR</button>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-multijawaban' }">
            <button class="btn btn-warning btn-sm">MULTI JAWABAN (CFIT)</button>
        </RouterLink>
        <!-- <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-aspek' }">
            <button class="btn btn-info btn-sm">Aspek (U/ 8KM)</button>
        </RouterLink> -->
        <div class="divider"></div>
        <div>
            <RouterView />
        </div>
    </div>
</template>