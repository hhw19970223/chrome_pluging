/// <reference path="../common.ts" />
/// <reference path="./mitt.ts" />
/// <reference path="./request.ts" />
module CONST {
    export const menuList = [
        {
            name: "排行榜填充",
            path: "rank",
        },
        {
            name: "回归记录",
            path: "record",
        }
    ];
}
module HHW {
    export const ref = Vue.ref;
    export const reactive = Vue.reactive;
    export const onMounted = Vue.onMounted;
    export const onBeforeMount = Vue.onBeforeMount;
    export const onUnmounted = Vue.onUnmounted;
    export const computed = Vue.computed;
    export const watch = Vue.watch;
    export const useRouter = VueRouter.useRouter;
    export const useRoute = VueRouter.useRoute;


    export function showErr(message) {
        ElementPlus.ElMessage["error"]({ message: message, type: "error", center: true });
    }

    export function showWarn(message) {
        ElementPlus.ElMessage({ message: message, type: "warning", center: true });
    }

    export function showSuccess(message) {
        ElementPlus.ElMessage({ message: message, type: "success", center: true });
    }


    /** 确认框 */
    export function confirm(msg, onOk, ctx) {
        ctx.$confirm(msg, "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            onOk();
        }).catch(() => {
            showWarn("已取消");
        })
    }
}