const ujiankhususPaketsoalRoutes = [
  {
    path: "/pages/admin/ujiankhusus/paketsoal/admin_layout",
    name: "ujiankhusus-paketsoal",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: {
      requireAuth: true,
    },
    redirect: "/pages/admin/ujiankhusus/paketsoal",
    children: [
      {
        path: "/pages/admin/ujiankhusus/paketsoal/layout",
        name: "admin-ujiankhusus-paketsoal",
        component: () =>
          import("@/views/admin/ujiankhusus/paketsoal/Layout.vue"),
        redirect: "/pages/admin/ujiankhusus/paketsoal",
        children: [
          {
            path: "/pages/admin/ujiankhusus/paketsoal",
            name: "admin-ujiankhusus-paketsoal",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/paketsoal/ujiankhususPaketsoalIndex.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/paketsoal/tambah",
            name: "admin-ujiankhusus-paketsoal-tambah",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/paketsoal/ujiankhususPaketsoalIndex_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiankhusus/paketsoal/edit/:paketsoal_id",
            name: "admin-ujiankhusus-paketsoal-edit",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/paketsoal/ujiankhususPaketsoalIndex_edit.vue"
              ),
          },

          {
            path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id",
            name: "admin-ujiankhusus-paketsoal-detail",
            component: () =>
              import(
                "@/views/admin/ujiankhusus/paketsoal/ujiankhususPaketsoalIndex_layout.vue"
              ),
            redirect:
              "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek",
            children: [
              {
                path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek",
                name: "admin-ujiankhusus-paketsoal-aspek",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/paketsoal/detail/ujiankhususPaketsoalAspek.vue"
                  ),
              },
              {
                path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek/tambah",
                name: "admin-ujiankhusus-paketsoal-aspek-tambah",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/paketsoal/detail/ujiankhususPaketsoalAspek_tambah.vue"
                  ),
              },
              {
                path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek/detail/:aspek_id/penilaian",
                name: "admin-ujiankhusus-paketsoal-aspek-penilaian",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/paketsoal/detail/ujiankhususPaketsoalAspekPenilaian.vue"
                  ),
              },
              {
                path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek/detail/:aspek_id/penilaian/tambah",
                name: "admin-ujiankhusus-paketsoal-aspek-penilaian-tambah",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/paketsoal/detail/ujiankhususPaketsoalAspekPenilaian_tambah.vue"
                  ),
              },
              {
                path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek_detail",
                name: "admin-ujiankhusus-paketsoal-aspek_detail",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/paketsoal/detail/ujiankhususPaketsoalAspekDetail.vue"
                  ),
              },
              {
                path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek_detail/tambah",
                name: "admin-ujiankhusus-paketsoal-aspek_detail-tambah",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/paketsoal/detail/ujiankhususPaketsoalAspekDetail_tambah.vue"
                  ),
              },
              {
                path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek_detail/edit/:aspek_detail_id",
                name: "admin-ujiankhusus-paketsoal-aspek_detail-edit",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/paketsoal/detail/ujiankhususPaketsoalAspekDetail_edit.vue"
                  ),
              },

              {
                path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek_detail/:aspek_detail_id/bank/:banksoal_aspek_detail_id/soal",
                name: "admin-ujiankhusus-paketsoal-aspek_detail-soal",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/paketsoal/detail/ujiankhususPaketsoalAspekDetailSoal.vue"
                  ),
              },
              {
                path: "/pages/admin/ujiankhusus/paketsoal/detail/:paketsoal_id/aspek_detail/:aspek_detail_id/bank/:banksoal_aspek_detail_id/soal/tambah/",
                name: "admin-ujiankhusus-paketsoal-aspek_detail-soal-tambah",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/paketsoal/detail/ujiankhususPaketsoalAspekDetailSoal_tambah.vue"
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
];
export default ujiankhususPaketsoalRoutes;
