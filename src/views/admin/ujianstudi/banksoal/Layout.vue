<template>
    <div class="space-x-2">
        <RouterLink :to="{ name: 'admin-ujianstudi-banksoal-aspek' }">
            <button class="btn btn-info btn-sm">Aspek</button>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-ujianstudi-banksoal-aspek_detail' }">
            <button class="btn btn-info btn-sm">Mapel</button>
        </RouterLink>
        <div class="divider"></div>
        <div>
            <RouterView />
        </div>
    </div>
</template>