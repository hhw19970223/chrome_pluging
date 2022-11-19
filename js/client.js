var CONST;
(function (CONST) {
    CONST.identity_key = "HHWTOOL"; //身份标识
})(CONST || (CONST = {}));
var HHW;
(function (HHW) {
    HHW.hMitt = mitt();
})(HHW || (HHW = {}));
var HHW;
(function (HHW) {
    var _origin;
    var _identity_key;
    function _eval(key, args, cb) {
        if (args)
            args = JSON.stringify(args);
        var str = "HHW.inject_tool('".concat(key, "', ").concat(args, ")");
        chrome.devtools.inspectedWindow.eval(str, function (result, isException) {
            if (!isException) {
                if (cb)
                    cb(result);
            }
        });
    }
    HHW._eval = _eval;
    function _eval2(str, cb) {
        chrome.devtools.inspectedWindow.eval(str, function (result, isException) {
            if (!isException) {
                if (cb)
                    cb(result);
            }
        });
    }
    HHW._eval2 = _eval2;
    function _eval3(str, cb) {
        chrome.devtools.inspectedWindow.eval(str, function (result, isException) {
            if (cb)
                cb(result, isException);
        });
    }
    HHW._eval3 = _eval3;
    /**
     * 日志输出
     * @param str
     * @param lv 状态等级 2 warn 1 error
     */
    function output(str, lv) {
        _eval("output", { lv: lv, str: str }, null);
    }
    HHW.output = output;
    function _listener(request, sender, sendResponse, type) {
        if (!request)
            return; //没有数据
        if (request.source != CONST.identity_key)
            return; //身份验证失败；
        var data = request.data;
        if (request.type == "init" /* CONST.EVENT.init */) {
            _init();
        }
        else if (sender.origin != _origin || request.identity != _identity_key) {
            return;
        }
        else if (request.type == "mess" /* CONST.EVENT.mess */) {
            if (data.t == 1) {
                HHW.showErr(data.mess);
            }
            else if (data.t == 2) {
                HHW.showWarn(data.mess);
            }
            else {
                HHW.showSuccess(data.mess);
            }
        }
        else {
            HHW.hMitt.emit(request.type, request.data);
        }
        sendResponse('');
    }
    function _init() {
        _eval2("window.location.origin", function (rst) {
            _origin = rst;
        });
        _eval2("HHW.identity_key", function (rst) {
            _identity_key = rst;
        });
    }
    _init();
    // chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    //     _listener(request, sender, sendResponse, "onRequest");
    // })
    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
        _listener(request, sender, sendResponse, "onMessage");
    });
})(HHW || (HHW = {}));
/// <reference path="../common.ts" />
/// <reference path="./mitt.ts" />
/// <reference path="./request.ts" />
var CONST;
/// <reference path="../common.ts" />
/// <reference path="./mitt.ts" />
/// <reference path="./request.ts" />
(function (CONST) {
    CONST.menuList1 = [
        {
            name: "排行榜填充",
            path: "/rank",
        }
    ];
})(CONST || (CONST = {}));
var HHW;
(function (HHW) {
    HHW.ref = Vue.ref;
    HHW.reactive = Vue.reactive;
    HHW.onMounted = Vue.onMounted;
    HHW.onBeforeMount = Vue.onBeforeMount;
    HHW.onUnmounted = Vue.onUnmounted;
    HHW.computed = Vue.computed;
    HHW.watch = Vue.watch;
    HHW.useRouter = VueRouter.useRouter;
    HHW.useRoute = VueRouter.useRoute;
    function showErr(message) {
        ElementPlus.ElMessage["error"]({ message: message, type: "error", center: true });
    }
    HHW.showErr = showErr;
    function showWarn(message) {
        ElementPlus.ElMessage({ message: message, type: "warning", center: true });
    }
    HHW.showWarn = showWarn;
    function showSuccess(message) {
        ElementPlus.ElMessage({ message: message, type: "success", center: true });
    }
    HHW.showSuccess = showSuccess;
    /** 确认框 */
    function confirm(msg, onOk, ctx) {
        ctx.$confirm(msg, "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(function () {
            onOk();
        }).catch(function () {
            showWarn("已取消");
        });
    }
    HHW.confirm = confirm;
})(HHW || (HHW = {}));
/// <reference path="./basics.ts" />
var HHW;
/// <reference path="./basics.ts" />
(function (HHW) {
    /** 确认框 */
    function getDialog() {
        return {
            name: "hhw-dialog",
            emits: ["oj8k", "cancel"],
            data: function () {
                return {
                    rule: {},
                    formData: {},
                    visible: false,
                };
            },
            props: {
                modelValue: {
                    type: Boolean,
                    default: false,
                },
                args: {
                    type: Array,
                    default: [],
                },
                rules: {
                    type: Array,
                    default: [],
                },
                checkFuc: {
                    type: Function,
                    default: function (form, cb) {
                        cb();
                    }
                },
                ext: {
                    type: Object,
                    default: {},
                },
            },
            mounted: function () {
                var self = this;
                var rule = self.rules;
                var l_i = rule ? rule.length : 0;
                for (var i = 0; i < l_i; i++) {
                    if (rule[i][1]) {
                        self.rule[rule[i][0]] = rule[i][1];
                    }
                    else {
                        self.rule[rule[i][0]] = [{
                                required: true,
                                message: '不能为空',
                                trigger: 'change'
                            }];
                    }
                }
            },
            methods: {
                ok: function () {
                    var self = this;
                    this.checkFuc(self['formData'], function () {
                        self.$refs.ruleForm.validate(function (valid) {
                            if (valid) {
                                var obj = {
                                    extra_ext: self.ext
                                };
                                Object.assign(obj, self['formData']);
                                self.$emit('oj8k', obj);
                            }
                            else {
                                HHW.showErr("表单校验失败");
                            }
                        });
                    });
                },
                handleClose: function () {
                    this.$emit('cancel');
                }
            },
            watch: {
                modelValue: function (val) {
                    this.visible = val;
                    // this.$emit('update:modelValue', val);
                },
                args: function (val) {
                    this.formData = {};
                    for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
                        var itemList = val_1[_i];
                        if (itemList && itemList[0] && itemList[3] && "xxxx/xx/xx xx:xx:xx" != itemList[3]) {
                            this.formData[itemList[0]] = itemList[3];
                        }
                    }
                }
            },
            template: "\n<el-dialog v-model=\"visible\" title=\"\u8BF7\u586B\u5199\u53C2\u6570\" width=\"550px\" :before-close=\"handleClose\">\n    <el-form :model=\"formData\" :rules=\"rule\" ref=\"ruleForm\" label-width=\"100px\" class=\"demo-ruleForm\">\n        <el-form-item v-for=\"v in args\" :key=\"v[0]\" :value=\"v[0]\" :label=\"v[1]\" :prop=\"v[0]\">\n            <el-date-picker v-if=\"v[2] == 'time'\" v-model=\"formData[v[0]]\"\n                format=\"YYYY/MM/DD HH:mm:ss\"></el-date-picker>\n            <el-input v-else-if=\"v[2] == 'textarea'\" type=\"textarea\" :rows=\"2\" placeholder=\"\u8BF7\u8F93\u5165\u5185\u5BB9\" v-model=\"formData[v[0]]\"></el-input>\n            <el-input v-else v-model=\"formData[v[0]]\" style=\"width: 60%\" :disabled=\"!!v[4]\"></el-input>\n        </el-form-item>\n    </el-form>\n    <template #footer>\n        <span class=\"dialog-footer\">\n            <el-button @click=\"handleClose\">\u53D6 \u6D88</el-button>\n            <el-button type=\"primary\" @click=\"ok\">\u786E \u5B9A</el-button>\n        </span>\n    </template>\n</el-dialog>\n    "
        };
    }
    HHW.getDialog = getDialog;
})(HHW || (HHW = {}));
/// <reference path="./basics.ts" />
var HHW;
/// <reference path="./basics.ts" />
(function (HHW) {
    function router_center() {
        return {
            setup: function (props, ctx) {
                var router = new HHW.useRouter();
                HHW.onMounted(function () {
                    HHW.output("push");
                    router.push('center/blank');
                });
                var menuList1 = CONST.menuList1;
                function addPath(path) {
                    return "center/" + path;
                }
                return {
                    menuList1: menuList1,
                    addPath: addPath
                };
            },
            template: "\n<div class=\"common-layout\">\n    <el-container>\n        <el-header class=\"center-header\">\n            <el-menu class=\"center-menu\" mode=\"horizontal\" background-color=\"#000000\" text-color=\"#F0F8FF\" active-text-color=\"#2E8B57\">\n                <el-menu-item v-for=\"(info, idx) in menuList1\" :key=\"idx\" :index=\"addPath(info.path)\" :route=\"info.path\">\n                    <h2 class=\"center-font\">{{ info.name }}</h2>\n                </el-menu-item>\n            </el-menu>\n        </el-header>\n        <el-main>\n            <router-view></router-view>\n        </el-main>\n    </el-container>\n</div>            \n            "
        };
    }
    HHW.router_center = router_center;
    function router_blank() {
        return {
            template: "\n<div style=\"width: 100%; border: 1px red solid\">\n    <el-image style=\"width: 300px; height: 300px; margin: 50px auto; border: 1px red solid\" src=\"/png/blank.png\" />\n</div>\n            "
        };
    }
    HHW.router_blank = router_blank;
})(HHW || (HHW = {}));
/// <reference path="./page.ts" />
var HHW;
/// <reference path="./page.ts" />
(function (HHW) {
    HHW.routes = [
        {
            path: '/',
            redirect: '/center'
        },
        {
            path: '/center',
            component: HHW.router_center(),
            children: [
                {
                    path: 'blank',
                    component: HHW.router_blank()
                },
                {
                    path: 'rank',
                    component: HHW.router_center()
                },
            ],
        },
    ];
    HHW.router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes: HHW.routes,
    });
    HHW.router.beforeEach(function (to, from, next) {
        // console.log("路由跳转了");
        if (from && from.path === "/" && to && to.path !== "/center") {
            next({
                path: "/center",
            });
        }
        else {
            next();
        }
    });
    HHW.router.afterEach(function () {
        window.scrollTo(0, 0);
    });
})(HHW || (HHW = {}));
/// <reference path="./component.ts" />
/// <reference path="./router.ts" />
var HHW;
/// <reference path="./component.ts" />
/// <reference path="./router.ts" />
(function (HHW) {
    var App = {};
    HHW.app = Vue.createApp(App);
    HHW.app.use(ElementPlus, {
        locale: zhCn
    })
        .use(HHW.router)
        .component('hhw-dialog', HHW.getDialog())
        .mount('#app');
})(HHW || (HHW = {}));
