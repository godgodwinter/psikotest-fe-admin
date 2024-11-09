const ujianmmpiPaketsoalRoutes = [
  {
    path: "/pages/admin/ujianmmpi/paketsoal/admin_layout",
    name: "ujianmmpi-paketsoal",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: {
      requireAuth: true,
    },
    redirect: "/pages/admin/ujianmmpi/paketsoal",
    children: [
      {
        path: "/pages/admin/ujianmmpi/paketsoal/layout",
        name: "admin-ujianmmpi-paketsoal",
        component: () => import("@/views/admin/ujianmmpi/paketsoal/Layout.vue"),
        redirect: "/pages/admin/ujianmmpi/paketsoal",
        children: [
          {
            path: "/pages/admin/ujianmmpi/paketsoal",
            name: "admin-ujianmmpi-paketsoal",
            component: () =>
              import(
                "@/views/admin/ujianmmpi/paketsoal/ujianmmpiPaketsoalIndex.vue"
              ),
          },
          {
            path: "/pages/admin/ujianmmpi/paketsoal/tambah",
            name: "admin-ujianmmpi-paketsoal-tambah",
            component: () =>
              import(
                "@/views/admin/ujianmmpi/paketsoal/ujianmmpiPaketsoalIndex_tambah.vue"
              ),
          },
          {
            path: "/pages/admin/ujianmmpi/paketsoal/edit/:paketsoal_id",
            name: "admin-ujianmmpi-paketsoal-edit",
            component: () =>
              import(
                "@/views/admin/ujianmmpi/paketsoal/ujianmmpiPaketsoalIndex_edit.vue"
              ),
          },

          {
            path: "/pages/admin/ujianmmpi/paketsoal/soal/:paketsoal_id",
            name: "admin-ujianmmpi-paketsoal-soal",
            component: () =>
              import(
                "@/views/admin/ujianmmpi/paketsoal/ujianmmpiPaketsoalIndex_soal.vue"
              ),
          },

          {
            path: "/pages/admin/ujianmmpi/paketsoal/soal/:paketsoal_id/add",
            name: "admin-ujianmmpi-paketsoal-soal-add",
            component: () =>
              import(
                "@/views/admin/ujianmmpi/paketsoal/ujianmmpiPaketsoalIndex_soal_add.vue"
              ),
          },
        ],
      },
    ],
  },
];
export default ujianmmpiPaketsoalRoutes;
