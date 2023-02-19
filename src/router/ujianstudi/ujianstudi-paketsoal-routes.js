const UjianStudiPaketsoalRoutes = [
    {
        path: "/pages/admin/ujianstudi/paketsoal/admin_layout",
        name: "ujianstudi-paketsoal",
        component: () => import("@/layouts/AdminLayout.vue"),
        meta: {
            requireAuth: true,
        },
        redirect: "/pages/admin/ujianstudi/paketsoal",
        children: [
            {
                path: "/pages/admin/ujianstudi/paketsoal/layout",
                name: "admin-ujianstudi-paketsoal",
                component: () => import("@/views/admin/ujianstudi/paketsoal/Layout.vue"),
                redirect: "/pages/admin/ujianstudi/paketsoal",
                children: [
                    {
                        path: "/pages/admin/ujianstudi/paketsoal",
                        name: "admin-ujianstudi-paketsoal",
                        component: () => import("@/views/admin/ujianstudi/paketsoal/UjianstudiPaketsoalIndex.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/paketsoal/tambah",
                        name: "admin-ujianstudi-paketsoal-tambah",
                        component: () => import("@/views/admin/ujianstudi/paketsoal/UjianstudiPaketsoalIndex_tambah.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/paketsoal/edit/:paketsoal_id",
                        name: "admin-ujianstudi-paketsoal-edit",
                        component: () => import("@/views/admin/ujianstudi/paketsoal/UjianstudiPaketsoalIndex_edit.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/paketsoal/aspek",
                        name: "admin-ujianstudi-paketsoal-aspek",
                        component: () => import("@/views/admin/ujianstudi/paketsoal/UjianstudiPaketsoalIndex.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/paketsoal/aspek_detail",
                        name: "admin-ujianstudi-paketsoal-aspek_detail",
                        component: () => import("@/views/admin/ujianstudi/paketsoal/UjianstudiPaketsoalIndex.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/paketsoal/penilaian",
                        name: "admin-ujianstudi-paketsoal-penilaian",
                        component: () => import("@/views/admin/ujianstudi/paketsoal/UjianstudiPaketsoalIndex.vue"),
                    },
                ]
            },
        ]
    }
];
export default UjianStudiPaketsoalRoutes;
