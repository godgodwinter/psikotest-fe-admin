const ujianmmpi2PaketsoalRoutes = [
  {
    path: "/pages/admin/ujianmmpi2/paketsoal/admin_layout",
    name: "ujianmmpi2-paketsoal",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: {
      requireAuth: true,
    },
    redirect: "/pages/admin/ujianmmpi2/paketsoal",
    children: [
      {
        path: "/pages/admin/ujianmmpi2/paketsoal/layout",
        name: "admin-ujianmmpi2-paketsoal",
        component: () =>
          import("@/views/admin/ujianmmpi2/paketsoal/Layout.vue"),
        redirect: "/pages/admin/ujianmmpi2/paketsoal",
        children: [
          {
            path: "/pages/admin/ujianmmpi2/paketsoal",
            name: "admin-ujianmmpi2-paketsoal",
            component: () =>
              import(
                "@/views/admin/ujianmmpi2/paketsoal/ujianmmpiPaketsoalIndex.vue"
              ),
          },
          {
            path: "/pages/admin/ujianmmpi2/paketsoal/tambah",
            name: "admin-ujianmmpi2-paketsoal-tambah",
            component: () =>
              import(
                "@/views/admin/ujianmmpi2/paketsoal/ujianmmpiPaketsoalIndex_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujianmmpi2/paketsoal/edit/:paketsoal_id",
            name: "admin-ujianmmpi2-paketsoal-edit",
            component: () =>
              import(
                "@/views/admin/ujianmmpi2/paketsoal/ujianmmpiPaketsoalIndex_edit.vue"
              ),
          },

          {
            path: "/pages/admin/ujianmmpi2/paketsoal/soal/:paketsoal_id",
            name: "admin-ujianmmpi2-paketsoal-soal",
            component: () =>
              import(
                "@/views/admin/ujianmmpi2/paketsoal/ujianmmpiPaketsoalIndex_soal.vue"
              ),
          },

          {
            path: "/pages/admin/ujianmmpi2/paketsoal/soal/:paketsoal_id/add",
            name: "admin-ujianmmpi2-paketsoal-soal-add",
            component: () =>
              import(
                "@/views/admin/ujianmmpi2/paketsoal/ujianmmpiPaketsoalIndex_soal_add.vue"
              ),
          },
          // !ujian mmpi
          // {
          //   path: "/pages/admin/ujianmmpi2/paketsoal",
          //   name: "admin-sekolah-submenu-ujian-mmpi",
          //   component: () =>
          //     import(
          //       "@/views/admin/ujianmmpi2/paketsoal/ujianmmpiPaketsoalIndex.vue"
          //     ),
          // },
        ],
      },
    ],
  },
];
export default ujianmmpi2PaketsoalRoutes;
