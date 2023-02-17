const UjianStudiRoutes = [
    {
        path: "/pages/admin/ujianstudi",
        name: "ujianstudi",
        component: () => import("@/layouts/AdminLayout.vue"),
        meta: {
            requireAuth: true,
        },
        redirect: "/pages/admin/ujian/studi/banksoal",
        children: [
            {
                path: "/pages/admin/ujianstudi/banksoal",
                name: "admin-ujianstudi-banksoal",
                component: () => import("@/views/admin/ujianstudi/banksoal/UjianstudiBanksoalIndex.vue"),
            },

            {
                path: "/pages/admin/ujianstudi/paketsoal",
                name: "admin-ujianstudi-paketsoal",
                component: () => import("@/views/admin/ujianstudi/paketsoal/UjianstudiPaketsoalIndex.vue"),
            },
        ],
    },
];
export default UjianStudiRoutes;
