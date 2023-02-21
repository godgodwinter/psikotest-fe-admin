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
                        path: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id",
                        name: "admin-ujianstudi-paketsoal-detail",
                        component: () => import("@/views/admin/ujianstudi/paketsoal/UjianstudiPaketsoalIndex_layout.vue"),
                        redirect: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id/aspek",
                        children: [
                            {
                                path: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id/aspek",
                                name: "admin-ujianstudi-paketsoal-aspek",
                                component: () => import("@/views/admin/ujianstudi/paketsoal/detail/UjianstudiPaketsoalAspek.vue"),
                            },
                            {
                                path: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id/aspek/tambah",
                                name: "admin-ujianstudi-paketsoal-aspek-tambah",
                                component: () => import("@/views/admin/ujianstudi/paketsoal/detail/UjianstudiPaketsoalAspek_tambah.vue"),
                            },
                            {
                                path: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id/aspek/detail/:aspek_id/penilaian",
                                name: "admin-ujianstudi-paketsoal-aspek-penilaian",
                                component: () => import("@/views/admin/ujianstudi/paketsoal/detail/UjianstudiPaketsoalAspekPenilaian.vue"),
                            },
                            {
                                path: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id/aspek/detail/:aspek_id/penilaian/tambah",
                                name: "admin-ujianstudi-paketsoal-aspek-penilaian-tambah",
                                component: () => import("@/views/admin/ujianstudi/paketsoal/detail/UjianstudiPaketsoalAspekPenilaian_tambah.vue"),
                            },
                            {
                                path: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id/aspek_detail",
                                name: "admin-ujianstudi-paketsoal-aspek_detail",
                                component: () => import("@/views/admin/ujianstudi/paketsoal/detail/UjianstudiPaketsoalAspekDetail.vue"),
                            },
                            {
                                path: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id/aspek_detail/tambah",
                                name: "admin-ujianstudi-paketsoal-aspek_detail-tambah",
                                component: () => import("@/views/admin/ujianstudi/paketsoal/detail/UjianstudiPaketsoalAspekDetail_tambah.vue"),
                            },

                            {
                                path: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id/aspek_detail/:aspek_detail_id/bank/:banksoal_aspek_detail_id/soal",
                                name: "admin-ujianstudi-paketsoal-aspek_detail-soal",
                                component: () => import("@/views/admin/ujianstudi/paketsoal/detail/UjianstudiPaketsoalAspekDetailSoal.vue"),
                            },
                            {
                                path: "/pages/admin/ujianstudi/paketsoal/detail/:paketsoal_id/aspek_detail/:aspek_detail_id/bank/:banksoal_aspek_detail_id/soal/tambah/",
                                name: "admin-ujianstudi-paketsoal-aspek_detail-soal-tambah",
                                component: () => import("@/views/admin/ujianstudi/paketsoal/detail/UjianstudiPaketsoalAspekDetailSoal_tambah.vue"),
                            },
                        ]
                    },


                ]
            },
        ]
    }
];
export default UjianStudiPaketsoalRoutes;
