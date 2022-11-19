module HHW {
    
    //开关
    const _switchMap = {
        "syncData": false,
    }

    // 控制开关
    export function changeSwitch(key, isOpen) {
        if (_switchMap.hasOwnProperty(key)) {
            _switchMap[key] = !!isOpen;
            let msg = isOpen ? "打开" : "关闭";
            console.log("开关" + key + "已被" + msg);
            //key特殊判断
            if (key == "syncData") {
                if (isOpen) {
                    mo.NET.gsMgr.on('G.SyncData', _surveySyncData)
                } else {
                    mo.NET.gsMgr.un('G.SyncData', _surveySyncData)
                }
            }
        }
    }

    // 获取开关参数
    export function getSwitchMap(key) {
        return _switchMap[key];
    }

    // 特殊处理SyncData开关
    function _surveySyncData(route, arg, data) {
        if (route == "gs.usr.heartTick" || route == "server.heartbeat.hb") return;

        console.log("请求服务端啦！！ " + mo.DATE.fmt(mo.DATE.date()))
        let obj = {
            "请求路由": route,
            "请求参数": arg,
            "服务端返回数据": data
        }
        console.log(obj)
    }
}