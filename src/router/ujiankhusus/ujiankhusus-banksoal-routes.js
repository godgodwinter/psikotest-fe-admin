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

          // ! banksoal minat dan bakat
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat",
            name: "admin-ujiankhusus-banksoal-minat",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/UjianKhususBanksoalMinat.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat/tambah",
            name: "admin-ujiankhusus-banksoal-minat-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/UjianKhususBanksoalMinat_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat/edit/:banksoal_minatbakat_id",
            name: "admin-ujiankhusus-banksoal-minat-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/UjianKhususBanksoalMinat_edit.vue"
              ),
          },

          // !kelompok
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat/detail/:banksoal_minatbakat_id/kelompok",
            name: "admin-ujiankhusus-banksoal-minat-kelompok",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/kelompok/UjianKhususBanksoalMinat_Kelompok.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat/detail/:banksoal_minatbakat_id/kelompok/tambah",
            name: "admin-ujiankhusus-banksoal-minat-kelompok-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/kelompok/UjianKhususBanksoalMinat_Kelompok_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat/detail/:banksoal_minatbakat_id/kelompok/edit/:kelompok_id",
            name: "admin-ujiankhusus-banksoal-minat-kelompok-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/kelompok/UjianKhususBanksoalMinat_Kelompok_edit.vue"
              ),
          },
          // !kelompok-end

          // !profesi
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat/detail/:banksoal_minatbakat_id/kelompok/:kelompok_id/profesi",
            name: "admin-ujiankhusus-banksoal-minat-kelompok-profesi",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/kelompok/profesi/Profesi_index.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat/detail/:banksoal_minatbakat_id/kelompok/:kelompok_id/profesi/tambah",
            name: "admin-ujiankhusus-banksoal-minat-kelompok-profesi-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/kelompok/profesi/Profesi_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/minat/detail/:banksoal_minatbakat_id/kelompok/:kelompok_id/profesi/edit/:profesi_id",
            name: "admin-ujiankhusus-banksoal-minat-kelompok-profesi-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/minat/kelompok/profesi/Profesi_edit.vue"
              ),
          },
          // !profesi-end

          // !kreativitas
          {
            path: "/pages/admin/ujiankhusus/banksoal/kr",
            name: "admin-ujiankhusus-banksoal-kr",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/kr/UjianKhususBanksoalKr.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/kr/tambah",
            name: "admin-ujiankhusus-banksoal-kr-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/kr/UjianKhususBanksoalKr_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/kr/edit/:kr_id",
            name: "admin-ujiankhusus-banksoal-kr-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/kr/UjianKhususBanksoalKr_edit.vue"
              ),
          },
          // !kr-pj
          {
            path: "/pages/admin/ujiankhusus/banksoal/kr/edit/:kr_id/pj",
            name: "admin-ujiankhusus-banksoal-kr-pj",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/kr/pj/Kr_pj_index.vue"
              ),
          },

          {
            path: "/pages/admin/ujiankhusus/banksoal/kr/detail/:kr_id/pj",
            name: "admin-ujiankhusus-banksoal-kr-pj",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/kr/pj/Kr_pj_index.vue"
              ),
          },

          {
            path: "/pages/admin/ujiankhusus/banksoal/kr/detail/:kr_id/pj/:pj_id",
            name: "admin-ujiankhusus-banksoal-kr-pj-edit",
            component: () =>
              import("@/views/admin/ujiankhusus/banksoal/kr/pj/Kr_pj_edit.vue"),
          },

          {
            path: "/pages/admin/ujiankhusus/banksoal/kr/detail/:kr_id/pj_tambah",
            name: "admin-ujiankhusus-banksoal-kr-pj-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/kr/pj/Kr_pj_tambah.vue"
              ),
          },
          // !kr-pj-end
          // !kreativitas-end

          // !multijawaban
          {
            path: "/pages/admin/ujiankhusus/banksoal/multijawaban",
            name: "admin-ujiankhusus-banksoal-multijawaban",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/multijawaban/UjianKhususBanksoalMultijawaban.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/multijawaban/tambah",
            name: "admin-ujiankhusus-banksoal-multijawaban-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/multijawaban/UjianKhususBanksoalMultijawaban_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/multijawaban/edit/:multijawaban_id",
            name: "admin-ujiankhusus-banksoal-multijawaban-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/multijawaban/UjianKhususBanksoalMultijawaban_edit.vue"
              ),
          },
          // ! MULTIJAWABAN-SOAL
          {
            path: "/pages/admin/ujiankhusus/banksoal/multijawaban/aspek_detail/:aspek_detail_id/soal",
            name: "admin-ujiankhusus-banksoal-multijawaban-aspek_detail-soal",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/multijawaban/soal/BanksoalMultijawabanSoal.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/multijawaban/aspek_detail/:aspek_detail_id/soal/tambah",
            name: "admin-ujiankhusus-banksoal-multijawaban-aspek_detail-soal-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/multijawaban/soal/BanksoalMultijawabanSoal_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/multijawaban/aspek_detail/:aspek_detail_id/soal/edit/:soal_id",
            name: "admin-ujiankhusus-banksoal-multijawaban-aspek_detail-soal-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/multijawaban/soal/BanksoalMultijawabanSoal_edit.vue"
              ),
          },
          // ! MULTIJAWABAN-SOAL-END
          // !multijawaban-soal

          // !multijawaban-soal-end

          // !multijawaban

          // !pohon
          {
            path: "/pages/admin/ujiankhusus/banksoal/pohon",
            name: "admin-ujiankhusus-banksoal-pohon",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/pohon/UjianKhususBanksoalPohon.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/pohon/tambah",
            name: "admin-ujiankhusus-banksoal-pohon-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/pohon/UjianKhususBanksoalPohon_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/pohon/edit/:pohon_id",
            name: "admin-ujiankhusus-banksoal-pohon-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/pohon/UjianKhususBanksoalPohon_edit.vue"
              ),
          },
          // ! pohon-SOAL
          {
            path: "/pages/admin/ujiankhusus/banksoal/pohon/aspek_detail/:aspek_detail_id/soal",
            name: "admin-ujiankhusus-banksoal-pohon-aspek_detail-soal",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/pohon/soal/BanksoalPohonSoal.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/pohon/aspek_detail/:aspek_detail_id/soal/tambah",
            name: "admin-ujiankhusus-banksoal-pohon-aspek_detail-soal-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/pohon/soal/BanksoalPohonSoal_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/banksoal/pohon/aspek_detail/:aspek_detail_id/soal/edit/:soal_id",
            name: "admin-ujiankhusus-banksoal-pohon-aspek_detail-soal-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/banksoal/pohon/soal/BanksoalPohonSoal_edit.vue"
              ),
          },
          // ! MULTIJAWABAN-SOAL-END

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
        ],
      },
    ],
  },
];
export default UjianStudiBanksoalRoutes;
