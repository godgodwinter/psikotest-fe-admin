<template>
    <div class="space-x-2">
        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-aspek_detail' }">
            <button class="btn btn-info btn-sm">Aspek Detail / MAPEL</button>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-ujiankhusus-banksoal-aspek' }">
            <button class="btn btn-info btn-sm">Aspek (U/ 8KM)</button>
        </RouterLink>
        <div class="divider"></div>
        <div>
            <RouterView />
        </div>
    </div>
</template>