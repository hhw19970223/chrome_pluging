/// <reference path="./basics.ts" />
module HHW {
    export function router_center() {
        return {
            setup(props, ctx) {
                let router = new useRouter();
                let activeName = ref('');
                let menuList = CONST.menuList;
                let isMo = ref(false);

                onMounted(() => {
                    activeName.value = "rank";
                    hMitt.on(CONST.EVENT.init, init);
                    init();
                })

                onUnmounted(() => {
                    hMitt.off(CONST.EVENT.init, init);
                })

                function init() {
                    eval2("HHW.isMo()", (rst) => {
                        isMo.value = rst;
                    })
                }

                watch(activeName, (newV, oldV) => {
                    router.push({path: addPath(activeName.value)});
                })


                function addPath(path) {
                    return "/center/" + path;
                }

                return {
                    menuList,
                    addPath,
                    activeName,
                    isMo
                }
            },
            template: `
<div class="common-layout">
    <el-container>
        <el-main v-if="isMo">
            <div>
                <el-tabs class="center-tabs" v-model="activeName">
                    <el-tab-pane v-for="(info, idx) in menuList" :key="idx" :label="info.name" :name="info.path"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="router-background">
                <router-view></router-view>
            </div>
        </el-main>
        <img v-else align="middle" src="../png/404.png"  style="margin: 10% auto;">
    </el-container>
</div>            
            `
        }
    }

    export function router_rank() {
        return {
            setup(props, ctx) {
                let actInfoList = ref([]);
                let grpId = ref(0);
                let c_actDesc = ref({});
                let formData = reactive({});
                let visible = ref(false);

                let columns_act = ref([
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
                        handler: (row, column, v, index) => {
                            if (c_actDesc.value[v]) {
                                return c_actDesc.value[v] + '(' + v + ')';
                            } else {
                                return v
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
                        handler: (row, column, v, index) => {
                            if (v) {
                                return "生效"
                            } else {
                                return "失效"
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

                let oper_list = ref([{
                    key: "add",
                    width: 120,
                    label: "添加机器人",
                    click: (row) => {
                        if (!row || !row.batchId) {
                            showErr("数据有误");
                            return;
                        }
                        show(row);
                    },
                    isShow: (row) => {
                        if (!row) return false;
                        let type = row.type;
                        if (type >= 1 && type < 100) return true;
                        if (type >= 1001 && type < 2000) return true;
                        if (type >= 2001 && type < 3000) return true;
                        return false;
                    }
                }]);
                
                onMounted(() => {
                    hMitt.on(CONST.EVENT.init_data, init);
                    hMitt.on(CONST.EVENT.on_login, init);
                    hMitt.on(CONST.EVENT.update_act, update_act);
                    init();
                    reset();
                })

                onUnmounted(() => {
                    hMitt.off(CONST.EVENT.init_data, init);
                    hMitt.off(CONST.EVENT.on_login, init);
                    hMitt.off(CONST.EVENT.update_act, update_act);
                })

                function update_act(list) {
                    actInfoList.value = list;
                }

                function init() {
                    eval2("HHW.getGsGrpId()", (rst) => {
                        grpId.value = rst || 0;
                        if (rst) {
                            eval2("HHW.getActList()", (rst) => {})
                        }
                    })

                    eval2("HHW.cfgMap.c_actDesc", (rst) => {
                        c_actDesc.value = rst;
                    })
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
                    eval('addRoot', formData);
                    reset();
                }

                return {
                    actInfoList,
                    grpId,
                    c_actDesc,
                    handleClose,
                    ok,
                    show,
                    columns_act,
                    oper_list,
                    visible,
                    formData
                }
            },
            template: `
<div class="common-layout">
    <el-container>
        <el-main>
            <el-dialog v-model="visible" title="添加机器人" width="550px" :before-close="handleClose">
                <el-form label-width="100px" class="demo-ruleForm">
                    <el-form-item label="批次">
                        <el-input v-model="formData.batchId" style="width: 60%" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="批次名称">
                        <el-input v-model="formData.batchName" style="width: 60%" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="机器人数量">
                        <el-input v-model="formData.rootNum" style="width: 60%"></el-input>
                    </el-form-item>
                    <el-form-item label="排行榜分数">
                        <el-input v-model="formData.begin" style="width: 120px"></el-input>
                        -
                        <el-input v-model="formData.end" style="width: 120px"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="handleClose">取 消</el-button>
                        <el-button type="primary" @click="ok">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
            <div v-if="grpId">
                <hhw-table v-model="actInfoList" :col_data_list="columns_act" :oper_list="oper_list" :oper_width="120"></hhw-table>
            </div>
            <p v-else class="center-rank-font">请先进入游戏</p>
        </el-main>
    </el-container>
</div>            
            `
        }
    }
}