const UjianStudiBanksoalRoutes = [
  {
    path: "/pages/admin/ujiankhusus",
    name: "ujiankhusus",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: {
      requireAuth: true,
    },
    redirect: "/pages/admin/ujiankhusus/banksoal/aspek_detail",
    children: [
      {
        path: "/pages/admin/ujiankhusus/banksoal/index",
        name: "admin-ujiankhusus-banksoal",
        component: () =>
          import("@/views/admin/ujiankhusus/banksoal/Layout.vue"),
        redirect: "/pages/admin/ujiankhusus/banksoal/aspek",
        children: [
          // ! ASPEK
          {
            path: "/pages/admin/ujiankhusus/banksoal/aspek",
            name: "admin-ujiankhusus-banksoal-aspek",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/UjianKhususBanksoalAspek.vue"
              ),
          },
          // ! ASPEK-END

          // ! ASPEKDETAIL
          {
            path: "/pages/admin/ujiankhusus/banksoal/aspek_detail",
            name: "admin-ujiankhusus-banksoal-aspek_detail",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/UjianKhususBanksoalAspekDetail.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/aspek_detail/tambah",
            name: "admin-ujiankhusus-banksoal-aspek_detail-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/UjianKhususBanksoalAspekDetail_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/aspek_detail/edit/:aspek_detail_id",
            name: "admin-ujiankhusus-banksoal-aspek_detail-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/UjianKhususBanksoalAspekDetail_edit.vue"
              ),
          },
          // ! ASPEKDETAIL-END

          // ! SOAL
          {
            path: "/pages/admin/ujiankhusus/banksoal/aspek_detail/:aspek_detail_id/soal",
            name: "admin-ujiankhusus-banksoal-aspek_detail-soal",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/UjianKhususBanksoalSoal.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/aspek_detail/:aspek_detail_id/soal/tambah",
            name: "admin-ujiankhusus-banksoal-aspek_detail-soal-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/UjianKhususBanksoalSoal_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/aspek_detail/:aspek_detail_id/soal/edit/:soal_id",
            name: "admin-ujiankhusus-banksoal-aspek_detail-soal-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/UjianKhususBanksoalSoal_edit.vue"
              ),
          },
          // ! SOAL-END
        ],
      },
    ],
  },
];
export default UjianStudiBanksoalRoutes;
