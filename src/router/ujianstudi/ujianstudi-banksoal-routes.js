const UjianStudiBanksoalRoutes = [
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
                    // ! ASPEK
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

                    // ! ASPEK-END

                    // ! ASPEK_DETAIL //MAPEL
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek_detail",
                        name: "admin-ujianstudi-banksoal-aspek_detail",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianstudiBanksoalAspekDetail.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek_detail/tambah",
                        name: "admin-ujianstudi-banksoal-aspek_detail-tambah",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianstudiBanksoalAspekDetail_tambah.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek_detail/edit/:aspek_detail_id",
                        name: "admin-ujianstudi-banksoal-aspek_detail-edit",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianstudiBanksoalAspekDetail_edit.vue"),
                    },
                    // ! ASPEK_DETAIL-END  //MAPEL-END


                    // ! SOAL
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek_detail/:aspek_detail_id/soal",
                        name: "admin-ujianstudi-banksoal-aspek_detail-soal",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianStudiBanksoalSoal.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek_detail/:aspek_detail_id/soal/tambah",
                        name: "admin-ujianstudi-banksoal-aspek_detail-soal-tambah",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianStudiBanksoalSoal_tambah.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek_detail/:aspek_detail_id/soal/edit/:soal_id",
                        name: "admin-ujianstudi-banksoal-aspek_detail-soal-edit",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianStudiBanksoalSoal_edit.vue"),
                    },
                    {
                        path: "/pages/admin/ujianstudi/banksoal/aspek_detail/:aspek_detail_id/soal/import",
                        name: "admin-ujianstudi-banksoal-aspek_detail-soal-import",
                        component: () => import("@/views/admin/ujianstudi/banksoal/UjianStudiBanksoalSoal_import.vue"),
                    },
                    // ! SOAL-END
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
export default UjianStudiBanksoalRoutes;
