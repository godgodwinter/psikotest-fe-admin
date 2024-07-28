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
            path: "/pages/admin/mastering/sekolah/tambah",
            name: "admin-sekolah-tambah",
            component: () => import("@/views/admin/sekolah/SekolahTambah.vue"),
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

              // ! ujiankhusus-PROSES
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujiankhusus",
                name: "admin-sekolah-submenu-ujiankhusus",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/proses/UjiankhususProsesPerkelas.vue"
                  ),
              },
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujiankhusus/siswa/:siswa_id/reset",
                name: "admin-sekolah-submenu-ujiankhusus-persiswa-reset",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/proses/UjiankhususProsesPerSiswa_reset.vue"
                  ),
              },

              // ! UJIANSTUDI-PROSES versi ringan

              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujiankhusus/v2",
                name: "admin-sekolah-submenu-ujiankhusus-v2",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/proses/UjiankhususProsesPerkelas_v2.vue"
                  ),
              },

              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujiankhusus/v3",
                name: "admin-sekolah-submenu-ujiankhusus-v3",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/proses/UjiankhususProsesPerkelas_v3.vue"
                  ),
              },
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujiankhusus/v2/siswa/:siswa_id/reset",
                name: "admin-sekolah-submenu-ujiankhusus-persiswa-reset-v2",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/proses/UjiankhususProsesPerSiswa_reset_v2.vue"
                  ),
              },

              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujiankhusus/v3/siswa/:siswa_id/reset",
                name: "admin-sekolah-submenu-ujiankhusus-persiswa-reset-v3",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/proses/UjiankhususProsesPerSiswa_reset_v3.vue"
                  ),
              },

              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujiankhusus/siswa/:siswa_id/tambahan",
                name: "admin-sekolah-submenu-ujiankhusus-persiswa-tambahan",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/proses/UjiankhususProsesPerSiswa_tambahan.vue"
                  ),
              },
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/ujiankhusus/siswa/:siswa_id",
                name: "admin-sekolah-submenu-ujiankhusus-persiswa",
                component: () =>
                  import(
                    "@/views/admin/ujiankhusus/proses/UjiankhususProsesPerSiswa.vue"
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
              // !hspq
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/hspq",
                name: "admin-sekolah-submenu-hspq",
                component: () => import("@/views/hspq/DataHspqPerkelas.vue"),
              },
              // !8km
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/8km",
                name: "admin-sekolah-submenu-8km",
                component: () => import("@/views/ist_8km/Data8kmPerkelas.vue"),
              },
              // !cfit
              {
                path: "/pages/admin/mastering/sekolah/:sekolah_id/submenu/kelas/:kelas_id?/cfit",
                name: "admin-sekolah-submenu-cfit",
                component: () => import("@/views/cfit/DataCfitPerkelas.vue"),
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
        path: "/pages/admin/mastering/sekolah/:sekolah_id?/submenu/kelas/:kelas_id?/cfit/import",
        name: "admin-sekolah-submenu-cfit-import",
        component: () => import("@/views/ist/import/CfitImportIndex.vue"),
      },
      {
        path: "/pages/admin/mastering/sekolah/:sekolah_id?/submenu/kelas/:kelas_id?/cfit/import_iq_generator",
        name: "admin-sekolah-submenu-cfit-import-iq-generator",
        component: () =>
          import(
            "@/views/ist/import/CfitImportIndex_rumus_iq_generator_Index.vue"
          ),
      },

      {
        path: "/pages/admin/mastering/sekolah/:sekolah_id?/submenu/kelas/:kelas_id?/cfit/import_pohon_generator",
        name: "admin-sekolah-submenu-cfit-import-pohon-generator",
        component: () =>
          import(
            "@/views/ist/import/CfitImportIndex_rumus_pohon_generator_Index.vue"
          ),
      },
      {
        path: "/pages/admin/mastering/sekolah/:sekolah_id?/submenu/kelas/:kelas_id?/ist/import/migrasi",
        name: "admin-sekolah-submenu-ist-import-migration",
        component: () =>
          import("@/views/ist/import/IstImportIndex_migration.vue"),
      },
      // !hspq rumus generator
      {
        path: "/pages/admin/hspq/import/rumus",
        name: "admin-hspq-import-rumus",
        component: () => import("@/views/hspq/HspqImportRumus.vue"),
      },
    ],
  },
];
export default AdminSekolahRoutes;
