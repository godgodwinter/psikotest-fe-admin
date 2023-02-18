const UjianStudiRoutes = [
    {
        path: "/pages/admin/ujianstudi",
        name: "ujianstudi",
        component: () => import("@/layouts/AdminLayout.vue"),
        meta: {
            requireAuth: true,
        },
        redirect: "/pages/admin/ujianstudi/banksoal/aspek_detail",
        children: [
            {
                path: "/pages/admin/ujianstudi/banksoal/index",
                name: "admin-ujianstudi-banksoal",
                component: () => import("@/views/admin/ujianstudi/banksoal/Layout.vue"),
                redirect: "/pages/admin/ujianstudi/banksoal/aspek",
                children: [
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek",
                        name: "admin-ujianstudi-banksoal-aspek",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianstudiBanksoalAspek.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek/tambah",
                        name: "admin-ujianstudi-banksoal-aspek-tambah",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianstudiBanksoalAspek_tambah.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek/edit/:aspek_id",
                        name: "admin-ujianstudi-banksoal-aspek-edit",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianstudiBanksoalAspek_edit.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek_detail",
                        name: "admin-ujianstudi-banksoal-aspek_detail",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianstudiBanksoalAspekDetail.vue"),
                    },
                ]
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
