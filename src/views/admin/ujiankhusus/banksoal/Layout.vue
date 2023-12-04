<template>
    <div class="space-x-2">
        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-aspek_detail' }">
            <button class="btn btn-info btn-sm">Aspek Detail </button>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-aspek' }">
            <button class="btn btn-info btn-sm">Aspek (Belum digunakan)</button>
        </RouterLink>
        <div class="divider"></div>
        <div>
            <RouterView />
        </div>
    </div>
</template>