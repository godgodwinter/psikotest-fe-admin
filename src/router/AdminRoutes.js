const AdminRoutes = [
    {
        path: "/pages/admin",
        name: "User",
        component: () => import("@/layouts/AdminLayout.vue"),
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
        ],
    },
];
export default AdminRoutes;
