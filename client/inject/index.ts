/// <reference path="../common.ts" />
/// <reference path="./game/basics.ts" />

/// <reference path="./automation/click.ts" />
/// <reference path="./automation/log.ts" />
/// <reference path="./function/rank.ts" />
module HHW {

    let proxy_data = new Proxy({}, {
        get(target, propKey, receiver) {
            return target[propKey]
        },
        set(target, propKey, value, receiver) {
            target[propKey] = value;
            return true;
        }
    })

    
    const _functionMap = {
        output,
        changeSwitch,
        addRoot,
    }

    export function inject_tool(key, arg) {
        if (!!_functionMap[key]) {
            return _functionMap[key](arg);
        } else {
            return null
        }
    }

    /** 日志输出 */
    function output(args) {
        if (args.lv == 1) {
            console.error(args.str);
        } else if (args.lv == 2) {
            console.warn(args.str);
        } else {
            console.log(args.str);
        }
    }
}

