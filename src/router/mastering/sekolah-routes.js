const AdminSekolahRoutes = [
  {
    path: "/pages/admin/mastering/sekolah/admin_layout",
    name: "mastering-sekolah-admin-layout",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: {
      requireAuth: true,
    },
    redirect: "/pages/admin/mastering/sekolah/layout",
    children: [
      {
        path: "/pages/admin/mastering/sekolah/layout",
        name: "admin-sekolah-layout",
        component: () => import("@/views/admin/sekolah/Layout.vue"),
        redirect: "/pages/admin/sekolah/index",
        children: [
          {
            path: "/pages/admin/mastering/sekolah/index",
            name: "admin-sekolah",
            component: () => import("@/views/admin/sekolah/SekolahIndex.vue"),
          },
          {
            path: "/pages/admin/mastering/sekolah/dashboard",
            name: "admin-sekolah-submenu",
            component: () =>
              import("@/views/admin/sekolah/submenu/SekolahSubmenuLayout.vue"),
            redirect: "/pages/admin/sekolah/submenu/dashboard",
            children: [
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/dashboard",
                name: "admin-sekolah-submenu-dashboard",
                component: () =>
                  import(
                    "@/views/admin/sekolah/submenu/SekolahSubmenuDashboard.vue"
                  ),
              },
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas",
                name: "admin-sekolah-submenu-kelas",
                component: () =>
                  import("@/views/admin/sekolah/submenu/kelas/Kelas.vue"),
              },
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/siswa",
                name: "admin-sekolah-submenu-siswa",
                component: () =>
                  import("@/views/admin/sekolah/submenu/siswa/Siswa.vue"),
              },
              // ! UJIANSTUDI-PROSES
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujianstudi",
                name: "admin-sekolah-submenu-ujianstudi",
                component: () =>
                  import(
                    "@/views/admin/ujianstudi/proses/UjianstudiProsesPerkelas.vue"
                  ),
              },
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujianstudi/siswa/:siswa_id",
                name: "admin-sekolah-submenu-ujianstudi-persiswa",
                component: () =>
                  import(
                    "@/views/admin/ujianstudi/proses/UjianstudiProsesPerSiswa.vue"
                  ),
              },

              // ! UJIANSTUDI-PROSES-END

              // ! DATA-IST-PROSES
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ist",
                name: "admin-sekolah-submenu-ist",
                component: () => import("@/views/ist/DataIstPerkelas.vue"),
              },
              // ! DATA-IST-PROSES-END
              // ! DATA-MINATBAKAT-PROSES
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/minatbakat",
                name: "admin-sekolah-submenu-minatbakat",
                component: () =>
                  import("@/views/minatbakat/DataMinatbakatPerkelas.vue"),
              },
              // ! DATA-MINATBAKAT-PROSES-END
            ],
          },
        ],
      },
      {
        path: "/pages/admin/mastering/sekolah/:sekolah_id?/submenu/kelas/:kelas_id?/ist/import",
        name: "admin-sekolah-submenu-ist-import",
        component: () => import("@/views/ist/import/IstImportIndex.vue"),
      },
      {
        path: "/pages/admin/mastering/sekolah/:sekolah_id?/submenu/kelas/:kelas_id?/ist/import/migrasi",
        name: "admin-sekolah-submenu-ist-import-migration",
        component: () =>
          import("@/views/ist/import/IstImportIndex_migration.vue"),
      },
    ],
  },
];
export default AdminSekolahRoutes;
