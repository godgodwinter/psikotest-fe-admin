const AdminRoutes = [
    {
        path: "/pages/admin",
        name: "Admin",
        component: () => import("@/layouts/AdminLayout.vue"),
        meta: {
            requireAuth: true,
        },
        redirect: "/",
        children: [
            {
                path: "/pages/admin/home",
                name: "admin-home",
                component: () => import("@/views/admin/other/ProfileIndex.vue"),
            },
            {
                path: "/pages/admin/profile",
                name: "admin-profile",
                component: () => import("@/views/admin/other/ProfileIndex.vue"),
            },
            {
                path: "/pages/admin/home",
                name: "admin-dashboard",
                component: () => import("@/views/admin/other/ProfileIndex.vue"),
            },
            {
                path: "/pages/admin/sekolah",
                name: "admin-sekolah",
                component: () => import("@/views/admin/other/ProfileIndex.vue"),
            },
        ],
    },
];
export default AdminRoutes;
