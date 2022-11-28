/// <reference path="./page.ts" />
module HHW {
    export const routes = [
        {
            path: '/',
            redirect: '/center'
        },
        {
            path: '/center',
            component: router_center(),
            children: [
                {
                    path: 'rank',
                    component: router_rank()
                },
            ],
        },
        
    ]

    export const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes,
    })

    router.beforeEach((to, from, next) => {
        // console.log("路由跳转了");
        if (from && from.path === "/" && to && to.path !== "/center") {
            next({
                path: "/center",
            })
        } else {
            next();
        }
    });
    router.afterEach(() => {
        window.scrollTo(0, 0);
    });
}