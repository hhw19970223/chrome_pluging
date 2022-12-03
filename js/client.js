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
    function eval(key, args, cb) {
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
    HHW.eval = eval;
    function eval2(str, cb) {
        chrome.devtools.inspectedWindow.eval(str, function (result, isException) {
            if (!isException) {
                if (cb)
                    cb(result);
            }
        });
    }
    HHW.eval2 = eval2;
    function eval3(str, cb) {
        chrome.devtools.inspectedWindow.eval(str, function (result, isException) {
            if (cb)
                cb(result, isException);
        });
    }
    HHW.eval3 = eval3;
    /**
     * 日志输出
     * @param str
     * @param lv 状态等级 2 warn 1 error
     */
    function output(str, lv) {
        eval("output", { lv: lv, str: str }, null);
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
            HHW.hMitt.emit("init" /* CONST.EVENT.init */);
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
        eval2("window.location.origin", function (rst) {
            _origin = rst;
        });
        eval2("HHW.identity_key", function (rst) {
            _identity_key = rst;
        });
    }
    // chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    //     _listener(request, sender, sendResponse, "onRequest");
    // })
    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
        _listener(request, sender, sendResponse, "onMessage");
    });
    (function () {
        _init();
    })();
})(HHW || (HHW = {}));
/// <reference path="../common.ts" />
/// <reference path="./mitt.ts" />
/// <reference path="./request.ts" />
var CONST;
/// <reference path="../common.ts" />
/// <reference path="./mitt.ts" />
/// <reference path="./request.ts" />
(function (CONST) {
    CONST.menuList = [
        {
            name: "排行榜填充",
            path: "rank",
        },
        {
            name: "回归记录",
            path: "record",
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
    /** 表格 */
    function getTable() {
        return {
            props: {
                modelValue: {
                    type: Array,
                    default: [],
                },
                col_data_list: {
                    type: Array,
                    default: [],
                },
                oper_list: {
                    type: Array,
                    default: [],
                },
                oper_width: {
                    type: Number,
                    default: 100
                }
            },
            data: function () {
                return {
                    dataList: [],
                    total: 0,
                    page: 1,
                    pageSize: 10,
                };
            },
            methods: {
                pageChange: function (v) {
                    this.page = v;
                    this.getDataList();
                },
                sizeChange: function (v) {
                    this.pageSize = v;
                    this.getDataList();
                },
                getDataList: function () {
                    var list = [];
                    for (var i = (this.page - 1) * this.pageSize; i < this.page * this.pageSize; i++) {
                        if (!this.modelValue[i]) {
                            break;
                        }
                        list.push(this.modelValue[i]);
                    }
                    this.dataList = list;
                },
                isShow: function (item, row) {
                    return !item.isShow || item.isShow(row);
                }
            },
            computed: {
                col_data_list2: function () {
                    return this.col_data_list.filter(function (item) { return !!item.status; });
                }
            },
            watch: {
                modelValue: function (a, b) {
                    this.page = 1;
                    this.pageSize = 10;
                    this.total = a.length;
                    this.getDataList();
                }
            },
            template: "\n<el-table :data=\"dataList\" style=\"width: 100%\">\n    <el-table-column v-if=\"col_data_list2.length\" type=\"expand\">\n        <template v-slot=\"props\">\n            <el-form label-position=\"left\" inline class=\"demo-table-expand\">\n                <el-form-item  v-for=\"(item) in col_data_list2\" :key=\"item.key\"\n                    :label=\"item.label\">\n                    <span>{{ props.row[item.key] }}</span>\n                </el-form-item>\n            </el-form>\n        </template>\n    </el-table-column>\n    <el-table-column :show-overflow-tooltip=\"true\"  v-for=\"(item) in col_data_list\" :key=\"item.key\"\n        :label=\"item.label\" :width=\"item.width || 200\" :formatter=\"item.handler\" :prop=\"item.key\"\n        :fixed=\"item.fixed\" align=\"center\"></el-table-column>\n    <el-table-column v-if=\"oper_list.length\" label=\"\u64CD\u4F5C\" align=\"center\" fixed=\"right\" :width=\"oper_width\">\n        <template v-slot=\"scope\">\n            <el-button v-for=\"item1 in oper_list\" v-show=\"isShow(item1, scope.row)\" :key=\"item1.key\" size=\"small\" type=\"danger\"\n                @click=\"item1.click(scope.row)\">{{ item1.label }}</el-button>\n        </template>\n    </el-table-column>\n</el-table>\n<div class=\"block\" style=\"float: right; margin-top: 30px;\">\n    <el-pagination @size-change=\"sizeChange\" @current-change=\"pageChange\"\n        :current-page=\"page\" :page-sizes=\"[10, 20, 50, 100]\" :page-size=\"pageSize\"\n        layout=\"total, sizes, prev, pager, next, jumper\" :total=\"total\">\n    </el-pagination>\n</div>"
        };
    }
    HHW.getTable = getTable;
    function getButton() {
        return {
            props: {
                type: {
                    type: Number,
                    default: 1,
                },
                name: {
                    type: String,
                    default: 'test',
                },
            },
            computed: {
                activeClass: function () {
                    var activeClass = {
                        'h-btn-hover': true,
                    };
                    var key = 'color-' + this.type;
                    activeClass[key] = true;
                    return activeClass;
                }
            },
            template: "\n<div class=\"h-btn\">\n    <button :class=\"activeClass\">{{ name }}</button>\n</div>            \n            "
        };
    }
    HHW.getButton = getButton;
})(HHW || (HHW = {}));
/// <reference path="./basics.ts" />
var HHW;
/// <reference path="./basics.ts" />
(function (HHW) {
    function router_center() {
        return {
            setup: function (props, ctx) {
                var router = new HHW.useRouter();
                var activeName = HHW.ref('');
                var menuList = CONST.menuList;
                var isMo = HHW.ref(false);
                HHW.onMounted(function () {
                    activeName.value = "rank";
                    HHW.hMitt.on("init" /* CONST.EVENT.init */, init);
                    init();
                });
                HHW.onUnmounted(function () {
                    HHW.hMitt.off("init" /* CONST.EVENT.init */, init);
                });
                function init() {
                    HHW.eval2("HHW.isMo()", function (rst) {
                        isMo.value = rst;
                    });
                }
                HHW.watch(activeName, function (newV, oldV) {
                    router.push({ path: addPath(activeName.value) });
                });
                function addPath(path) {
                    return "/center/" + path;
                }
                return {
                    menuList: menuList,
                    addPath: addPath,
                    activeName: activeName,
                    isMo: isMo
                };
            },
            template: "\n<div>\n    <el-container>\n        <el-main v-if=\"isMo\">\n            <div>\n                <el-tabs class=\"center-tabs\" v-model=\"activeName\">\n                    <el-tab-pane v-for=\"(info, idx) in menuList\" :key=\"idx\" :label=\"info.name\" :name=\"info.path\"></el-tab-pane>\n                </el-tabs>\n            </div>\n            <div>\n                <router-view></router-view>\n            </div>\n        </el-main>\n        <img v-else align=\"middle\" src=\"../png/404.png\"  style=\"margin: 10% auto; color: white\"/>\n    </el-container>\n</div>            \n            "
        };
    }
    HHW.router_center = router_center;
    function router_rank() {
        return {
            setup: function (props, ctx) {
                var actInfoList = HHW.ref([]);
                var grpId = HHW.ref(0);
                var c_actDesc = HHW.ref({});
                var formData = HHW.reactive({});
                var visible = HHW.ref(false);
                var columns_act = HHW.ref([
                    {
                        label: '批次id',
                        key: 'batchId',
                        fixed: 'left',
                        width: 100
                    },
                    {
                        label: '批次名称',
                        key: 'name',
                    },
                    {
                        label: '活动类型',
                        key: 'type',
                        width: 250,
                        handler: function (row, column, v, index) {
                            if (c_actDesc.value[v]) {
                                return c_actDesc.value[v] + '(' + v + ')';
                            }
                            else {
                                return v;
                            }
                        }
                    },
                    {
                        label: '模板id',
                        key: 'tempId',
                        width: 100,
                    },
                    {
                        label: '模板名',
                        key: 'tempName',
                    },
                    {
                        label: 'beginTime',
                        key: 'beginTime',
                    },
                    {
                        label: 'endTime',
                        key: 'endTime',
                    },
                    {
                        label: 'showEndTime',
                        key: 'showEndTime',
                    },
                    {
                        label: '状态',
                        key: 'status',
                        handler: function (row, column, v, index) {
                            if (v) {
                                return "生效";
                            }
                            else {
                                return "失效";
                            }
                        }
                    },
                    {
                        label: 'rule',
                        key: 'rule',
                        width: 100
                    },
                    {
                        label: '公告类型',
                        key: 'noticeId',
                    },
                    {
                        width: 200,
                        label: '活动配置',
                        key: 'content',
                    },
                    {
                        label: 'ext',
                        key: 'ext',
                        width: 150
                    }
                ]);
                var oper_list = HHW.ref([{
                        key: "add",
                        width: 120,
                        label: "添加机器人",
                        click: function (row) {
                            if (!row || !row.batchId) {
                                HHW.showErr("数据有误");
                                return;
                            }
                            show(row);
                        },
                        isShow: function (row) {
                            if (!row)
                                return false;
                            var type = row.type;
                            if (type >= 1 && type < 100)
                                return true;
                            if (type >= 1001 && type < 2000)
                                return true;
                            if (type >= 2001 && type < 3000)
                                return true;
                            return false;
                        }
                    }]);
                HHW.onMounted(function () {
                    HHW.hMitt.on("init_data" /* CONST.EVENT.init_data */, init);
                    HHW.hMitt.on("on_login" /* CONST.EVENT.on_login */, init);
                    HHW.hMitt.on("update_act" /* CONST.EVENT.update_act */, update_act);
                    init();
                    reset();
                });
                HHW.onUnmounted(function () {
                    HHW.hMitt.off("init_data" /* CONST.EVENT.init_data */, init);
                    HHW.hMitt.off("on_login" /* CONST.EVENT.on_login */, init);
                    HHW.hMitt.off("update_act" /* CONST.EVENT.update_act */, update_act);
                });
                function update_act(list) {
                    actInfoList.value = list;
                }
                function init() {
                    HHW.eval2("HHW.getGsGrpId()", function (rst) {
                        grpId.value = rst || 0;
                        if (rst) {
                            HHW.eval2("HHW.getActList()", function (rst) { });
                        }
                    });
                    HHW.eval2("HHW.cfgMap.c_actDesc", function (rst) {
                        c_actDesc.value = rst;
                    });
                }
                function reset() {
                    formData.batchId = '';
                    formData.batchName = '';
                    formData.type = '';
                    formData.rootNum = 10;
                    formData.begin = 0;
                    formData.end = 0;
                    visible.value = false;
                }
                function show(row) {
                    formData.batchId = row.batchId;
                    formData.batchName = row.name;
                    formData.type = row.type;
                    visible.value = true;
                }
                function handleClose() {
                    reset();
                }
                function ok() {
                    HHW.eval('addRoot', formData);
                    reset();
                }
                return {
                    actInfoList: actInfoList,
                    grpId: grpId,
                    c_actDesc: c_actDesc,
                    handleClose: handleClose,
                    ok: ok,
                    show: show,
                    columns_act: columns_act,
                    oper_list: oper_list,
                    visible: visible,
                    formData: formData
                };
            },
            template: "\n<div style=\"background-color: rgba(255, 255, 255, 0.7)\">\n    <el-dialog v-model=\"visible\" title=\"\u6DFB\u52A0\u673A\u5668\u4EBA\" width=\"550px\" :before-close=\"handleClose\">\n        <el-form label-width=\"100px\">\n            <el-form-item label=\"\u6279\u6B21\">\n                <el-input v-model=\"formData.batchId\" style=\"width: 60%\" disabled></el-input>\n            </el-form-item>\n            <el-form-item label=\"\u6279\u6B21\u540D\u79F0\">\n                <el-input v-model=\"formData.batchName\" style=\"width: 60%\" disabled></el-input>\n            </el-form-item>\n            <el-form-item label=\"\u673A\u5668\u4EBA\u6570\u91CF\">\n                <el-input type=\"text\" v-model=\"formData.rootNum\" style=\"width: 60%\"></el-input>\n            </el-form-item>\n            <el-form-item label=\"\u6392\u884C\u699C\u5206\u6570\">\n                <el-input type=\"text\" v-model=\"formData.begin\" style=\"width: 120px\"></el-input>\n                -\n                <el-input type=\"text\" v-model=\"formData.end\" style=\"width: 120px\"></el-input>\n            </el-form-item>\n        </el-form>\n        <template #footer>\n            <span class=\"dialog-footer\">\n                <el-button @click=\"handleClose\">\u53D6 \u6D88</el-button>\n                <el-button type=\"primary\" @click=\"ok\">\u786E \u5B9A</el-button>\n            </span>\n        </template>\n    </el-dialog>\n    <el-container>\n        <el-main>\n            <div v-if=\"grpId\">\n                <hhw-table v-model=\"actInfoList\" :col_data_list=\"columns_act\" :oper_list=\"oper_list\" :oper_width=\"120\"></hhw-table>\n            </div>\n            <p v-else class=\"center-rank-font\">\u8BF7\u5148\u8FDB\u5165\u6E38\u620F</p>\n        </el-main>\n    </el-container>\n</div>            \n            "
        };
    }
    HHW.router_rank = router_rank;
    function router_record() {
        return {
            setup: function (props, ctx) {
                function click1() {
                    HHW.output('11111');
                }
                function click2() {
                    HHW.output('111112');
                }
                function click3() {
                    HHW.output('111113');
                }
                return {
                    click1: click1,
                    click2: click2,
                    click3: click3,
                };
            },
            template: "\n<div>\n    <el-container>\n        <el-main>\n            <hhw-button :type=\"1\" name=\"\u751F\u6210\u56DE\u5F52\u8BB0\u5F55\" @click=\"click1\"></hhw-button>\n            <hhw-button :type=\"2\" name=\"\u56DE\u5F52\u8BB0\u5F55\u5217\u8868\" @click=\"click2\"></hhw-button>\n            <hhw-button :type=\"3\" name=\"\u9519\u8BEF\u8BB0\u5F55\u5217\u8868\" @click=\"click3\"></hhw-button>\n        </el-main>\n    </el-container>\n</div>          \n          \n            "
        };
    }
    HHW.router_record = router_record;
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
                    path: 'rank',
                    component: HHW.router_rank()
                },
                {
                    path: 'record',
                    component: HHW.router_record()
                }
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
        .component('hhw-table', HHW.getTable())
        .component('hhw-button', HHW.getButton())
        .mount('#app');
})(HHW || (HHW = {}));
