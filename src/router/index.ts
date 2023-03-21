import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import {useUserStore} from "@/store/modules/user";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/Layout.vue"),
    children: [
      {
        path: "/",
        component: () => import("@/views/home/HomePage.vue"),
      },
      {
        path: "/category/:id",
        component: () => import("@/views/category/index.vue"),
      },
      {
        path: "/category/sub/:id",
        component: () => import("@/views/category/sub.vue"),
      },
      {
        path: "/product/:id",
        component: () => import("@/views/goods/index.vue"),
      },
      {
        path: "/cart",
        component: () => import("@/views/cart/index.vue"),
      },
      {
        path: "/member/checkout",
        component: () => import("@/views/member/pay/checkout.vue"),
      },
      {
        path: "/member/pay",
        component: () => import("@/views/member/pay/index.vue"),
      },
      {
        path: "/pay/callback",
        component: () => import("@/views/member/pay/result.vue"),
      },
      {
        path: "/member",
        component: () => import("@/views/member/Layout.vue"),
        children: [
          {
            path: "/member",
            component: () => import("@/views/member/home/index.vue"),
          },
          {
            path: "/member/order",
            children: [
              {
                path: "",
                component: () => import("@/views/member/order/index.vue"),
              },
              {
                path: ":id",
                component: () => import("@/views/member/order/detail.vue"),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/login/callback",
    component: () => import("@/views/login/callback.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {left: 0, top: 0};
  },
});

router.beforeEach((to, form, next) => {
  const userStore = useUserStore();
  const profile = userStore.profile;
  if (!profile.token && to.path.startsWith("/member")) {
    return next("/login?redirectUrl=" + encodeURIComponent(to.fullPath));
  }
  next();
});

export default router;
