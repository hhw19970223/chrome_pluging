module CONST {
    export const identity_key = "HHWTOOL";//身份标识

    /** 交互事件 */
    export const enum EVENT {
        /** inject初始化完成 */
        init = "init",
        /** 游戏数据初始化完毕 */
        init_data = "init_data",
        /** 消息 */
        mess = "mess",
        /** 活动发生变化 */
        update_act = "update_act",
        /** 玩家登录 */
        on_login = "on_login",
    }
}