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

    export const enum OSTYPE {
        ipod = "ipod",
        ipad = "ipad",
        iphone = "iphone",
        android = "android",
        /** 客户端型号: IOS产品 */
        mac_os = "Mac OS",
        pc = "pc",
    }
}

module HHW {
    export interface HErrorInfo {
        /** 类型 */
        type: string;
        /** error下的message */
        message?: string;
        /** error下的stack */
        stack?: string;
        /** 发生错误的列号 */
        colno?: number;
        /** 发生错误的行号 */
        lineno?: number;
        /** 报错代码文件名 */
        filename?: string
        /** 模块名 */
        module?: string;
        subModules?: string[];
        layerList?: string[];
        args?: any[];
    }

    export interface HClickInfo {
        /** 类型手机还是web */
        type: string;
        /** 高度 */
        h: number;
        /** 宽度 */
        w: number;
        /** 点击坐标 xy*/
        position: number[];
        /** 模块名 */
        module?: string;
        subModules?: string[];
        layerList?: string[];
    }

    export const $ = {
        "()": /\([^)]*\)/gi,
        "[]": /\[[^\]]*\]/gi,
        "{}": /\{[^}]*\}/gi
    }

    export function getKuoHao(str: string, type: '()' | '{}' | '[]' =  '()', idx: number = 0): string {
        let v =  str.match($[type])[idx];
        if (!v) return '';
        return v.substring(1, v.length - 2);
    }

    export function delKuoHao(str: string, type: '()' | '{}' | '[]' =  '()' ): string {
        return str.replace($[type], '');
    }
}