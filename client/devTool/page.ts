/// <reference path="./basics.ts" />
module HHW {
    export function router_center() {
        return {
            setup(props, ctx) {
                let router = new useRouter();

                onMounted(() => {
                    output("push");
                    router.push('center/blank');
                })

                let menuList1 = CONST.menuList1;

                function addPath(path) {
                    return "center/" + path;
                }

                return {
                    menuList1,
                    addPath
                }
            },
            template: `
<div class="common-layout">
    <el-container>
        <el-header class="center-header">
            <el-menu class="center-menu" mode="horizontal" background-color="#000000" text-color="#F0F8FF" active-text-color="#2E8B57">
                <el-menu-item v-for="(info, idx) in menuList1" :key="idx" :index="addPath(info.path)" :route="info.path">
                    <h2 class="center-font">{{ info.name }}</h2>
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</div>            
            `
        }
    }

    export function router_blank() {
        return {
            template: `
<div style="width: 100%; border: 1px red solid">
    <el-image style="width: 300px; height: 300px; margin: 50px auto; border: 1px red solid" src="/png/blank.png" />
</div>
            `
        }
    }
}