/// <reference path="./basics.ts" />
module HHW {
    /** 确认框 */
    export function getDialog() {
        return {
            name: "hhw-dialog",
            emits: ["oj8k", "cancel"],
            data: function () {
                return {
                    rule: {},
                    formData: {},
                    visible: false,
                }
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
                    default: (form, cb) => {
                        cb()
                    }
                },
                ext: {
                    type: Object,
                    default: {},
                },
            },
            mounted() {
                let self = this;

                let rule = self.rules;
                let l_i = rule ? rule.length : 0;
                for (let i = 0; i < l_i; i++) {
                    if (rule[i][1]) {
                        self.rule[rule[i][0]] = rule[i][1];
                    } else {
                        self.rule[rule[i][0]] = [{
                            required: true,
                            message: '不能为空',
                            trigger: 'change'
                        }];
                    }

                }
            },
            methods: {
                ok() {
                    let self = this;
                    this.checkFuc(self['formData'], () => {
                        self.$refs.ruleForm.validate((valid) => {
                            if (valid) {
                                let obj = {
                                    extra_ext: self.ext
                                };
                                Object.assign(obj, self['formData'])
                                self.$emit('oj8k', obj);
                            } else {
                                showErr("表单校验失败");
                            }
                        })
                    })

                },
                handleClose() {
                    this.$emit('cancel');
                }
            },
            watch: {
                modelValue(val) {
                    this.visible = val;
                    // this.$emit('update:modelValue', val);
                },
                args(val) {
                    this.formData = {};
                    for (let itemList of val) {
                        if (itemList && itemList[0] && itemList[3] && "xxxx/xx/xx xx:xx:xx" != itemList[3]) {
                            this.formData[itemList[0]] = itemList[3];
                        }
                    }
                }
            },
            template: `
<el-dialog v-model="visible" title="请填写参数" width="550px" :before-close="handleClose">
    <el-form :model="formData" :rules="rule" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item v-for="v in args" :key="v[0]" :value="v[0]" :label="v[1]" :prop="v[0]">
            <el-date-picker v-if="v[2] == 'time'" v-model="formData[v[0]]"
                format="YYYY/MM/DD HH:mm:ss"></el-date-picker>
            <el-input v-else-if="v[2] == 'textarea'" type="textarea" :rows="2" placeholder="请输入内容" v-model="formData[v[0]]"></el-input>
            <el-input v-else v-model="formData[v[0]]" style="width: 60%" :disabled="!!v[4]"></el-input>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="ok">确 定</el-button>
        </span>
    </template>
</el-dialog>
    `
        }
    }
}