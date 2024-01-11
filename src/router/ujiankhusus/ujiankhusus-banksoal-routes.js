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
          {
            path: "/pages/admin/ujiankhusus/banksoal/aspek/tambah",
            name: "admin-ujiankhusus-banksoal-aspek-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/UjianKhususBanksoalAspek_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/aspek/edit/:aspek_id",
            name: "admin-ujiankhusus-banksoal-aspek-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/UjianKhususBanksoalAspek_edit.vue"
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

          // ! banksoal minat dan bakat
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat",
            name: "admin-ujiankhusus-banksoal-minat",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/UjianKhususBanksoalMinat.vue"
              ),
          },
          // {
          //   path: "/pages/admin/ujiankhusus/banksoal/minat/tambah",
          //   name: "admin-ujiankhusus-banksoal-minat-tambah",
          //   component: () =>
          //     import(
          //       "@/views/admin/ujiankhusus/banksoal/minat/UjianKhususBanksoalMinat_tambah.vue"
          //     ),
          // },
          // {
          //   path: "/pages/admin/ujiankhusus/banksoal/minat/edit/:banksoal_minatbakat_id",
          //   name: "admin-ujiankhusus-banksoal-minat-edit",
          //   component: () =>
          //     import(
          //       "@/views/admin/ujiankhusus/banksoal/minat/UjianKhususBanksoalMinat_edit.vue"
          //     ),
          // },
          // ! banksoal minat dan bakat-END

          // ! banksoal kreatifitas
          // {
          //   path: "/pages/admin/ujiankhusus/banksoal/kr",
          //   name: "admin-ujiankhusus-banksoal-kr",
          //   component: () =>
          //     import(
          //       "@/views/admin/ujiankhusus/banksoal/kr/UjianKhususBanksoalKr.vue"
          //     ),
          // },
          // {
          //   path: "/pages/admin/ujiankhusus/banksoal/kr/tambah",
          //   name: "admin-ujiankhusus-banksoal-kr-tambah",
          //   component: () =>
          //     import(
          //       "@/views/admin/ujiankhusus/banksoal/kr/UjianKhususBanksoalKr_tambah.vue"
          //     ),
          // },
          // {
          //   path: "/pages/admin/ujiankhusus/banksoal/kr/edit/:banksoal_krbakat_id",
          //   name: "admin-ujiankhusus-banksoal-kr-edit",
          //   component: () =>
          //     import(
          //       "@/views/admin/ujiankhusus/banksoal/kr/UjianKhususBanksoalKr_edit.vue"
          //     ),
          // },
          // ! banksoal kreatifitas-END

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
