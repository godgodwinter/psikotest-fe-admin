const ujiancfitPaketsoalRoutes = [
  {
    path: "/pages/admin/ujiancfit/paketsoal/admin_layout",
    name: "ujiancfit-paketsoal",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: {
      requireAuth: true,
    },
    redirect: "/pages/admin/ujiancfit/paketsoal",
    children: [
      {
        path: "/pages/admin/ujiancfit/paketsoal/layout",
        name: "admin-ujiancfit-paketsoal",
        component: () => import("@/views/admin/ujiancfit/paketsoal/Layout.vue"),
        redirect: "/pages/admin/ujiancfit/paketsoal",
        children: [
          {
            path: "/pages/admin/ujiancfit/paketsoal",
            name: "admin-ujiancfit-paketsoal",
            component: () =>
              import(
                "@/views/admin/ujiancfit/paketsoal/ujiancfitPaketsoalIndex.vue"
              ),
          },
          {
            path: "/pages/admin/ujiancfit/paketsoal/tambah",
            name: "admin-ujiancfit-paketsoal-tambah",
            component: () =>
              import(
                "@/views/admin/ujiancfit/paketsoal/ujiancfitPaketsoalIndex_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujiancfit/paketsoal/edit/:paketsoal_id",
            name: "admin-ujiancfit-paketsoal-edit",
            component: () =>
              import(
                "@/views/admin/ujiancfit/paketsoal/ujiancfitPaketsoalIndex_edit.vue"
              ),
          },

          {
            path: "/pages/admin/ujiancfit/paketsoal/detail/:paketsoal_id",
            name: "admin-ujiancfit-paketsoal-detail",
            component: () =>
              import(
                "@/views/admin/ujiancfit/paketsoal/ujiancfitPaketsoalIndex_layout.vue"
              ),
            redirect:
              "/pages/admin/ujiancfit/paketsoal/detail/:paketsoal_id/aspek",
            children: [
              {
                path: "/pages/admin/ujiancfit/paketsoal/detail/:paketsoal_id/aspek",
                name: "admin-ujiancfit-paketsoal-aspek",
                component: () =>
                  import(
                    "@/views/admin/ujiancfit/paketsoal/detail/ujiancfitPaketsoalAspek.vue"
                  ),
              },

              {
                path: "/pages/admin/ujiancfit/paketsoal/detail/:paketsoal_id/aspek_detail",
                name: "admin-ujiancfit-paketsoal-aspek_detail",
                component: () =>
                  import(
                    "@/views/admin/ujiancfit/paketsoal/detail/ujiancfitPaketsoalAspekDetail.vue"
                  ),
              },

              {
                path: "/pages/admin/ujiancfit/paketsoal/detail/:paketsoal_id/aspek_detail/tambah",
                name: "admin-ujiancfit-paketsoal-aspek_detail-tambah",
                component: () =>
                  import(
                    "@/views/admin/ujiancfit/paketsoal/detail/ujiancfitPaketsoalAspekDetail_tambah.vue"
                  ),
              },
              {
                path: "/pages/admin/ujiancfit/paketsoal/detail/:paketsoal_id/aspek_detail/edit/:aspek_detail_id",
                name: "admin-ujiancfit-paketsoal-aspek_detail-edit",
                component: () =>
                  import(
                    "@/views/admin/ujiancfit/paketsoal/detail/ujiancfitPaketsoalAspekDetail_edit.vue"
                  ),
              },

              {
                path: "/pages/admin/ujiancfit/paketsoal/detail/:paketsoal_id/aspek_detail/:aspek_detail_id/bank/:banksoal_aspek_detail_id/soal",
                name: "admin-ujiancfit-paketsoal-aspek_detail-soal",
                component: () =>
                  import(
                    "@/views/admin/ujiancfit/paketsoal/detail/ujiancfitPaketsoalAspekDetailSoal.vue"
                  ),
              },
              {
                path: "/pages/admin/ujiancfit/paketsoal/detail/:paketsoal_id/aspek_detail/:aspek_detail_id/bank/:banksoal_aspek_detail_id/soal/tambah/",
                name: "admin-ujiancfit-paketsoal-aspek_detail-soal-tambah",
                component: () =>
                  import(
                    "@/views/admin/ujiancfit/paketsoal/detail/ujiancfitPaketsoalAspekDetailSoal_tambah.vue"
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
];
export default ujiancfitPaketsoalRoutes;
