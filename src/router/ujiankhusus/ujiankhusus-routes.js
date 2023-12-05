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
          // ! SOAL-END
        ],
      },
    ],
  },
];
export default UjianStudiBanksoalRoutes;
