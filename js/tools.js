var CONST;
(function (CONST) {
    CONST.identity_key = "HHWTOOL"; //身份标识
})(CONST || (CONST = {}));
var HHW;
(function (HHW) {
    HHW.identity_key = CONST.identity_key + (new Date).getTime(); //身份标识
    //* 通知content-script */
    function sendData(type, data) {
        window.postMessage({
            source: CONST.identity_key,
            data: data,
            type: type,
            identity: HHW.identity_key,
        }, '*');
    }
    HHW.sendData = sendData;
    /**
     * devTool的消息弹窗
     * type 1: err 2: warn other: info
     */
    function sendMessToDevTool(mess, type) {
        sendData("mess" /* CONST.EVENT.mess */, { mess: mess, t: type });
    }
    HHW.sendMessToDevTool = sendMessToDevTool;
    /** 请求hhw进程 */
    function postReq(params, cb) {
        var url = "http://127.0.0.1";
        // let url = "http://" + window.location.hostname; //http://192.168.2.22
        // url += `:8009/hhw/?modules=setTime&method=update&args={'newDate':'${timeStr}'}`;
        url += ":8008/hhw/";
        mo.NET.post(url, params, function (err, rst) {
            if (rst && typeof rst == "string")
                rst = JSON.parse(rst);
            if (cb)
                cb(err, rst);
        });
    }
    HHW.postReq = postReq;
    function request_mo(method, args, cb) {
        if (!G.gMgr.serverInfoMgr.isOpen('test99999')) {
            return;
        }
        if (!args)
            args = {};
        args.method = method;
        // G.gsRequest("test99999.testEnter", args, cb);
        mo.NET.gsMgr.requestWithErr("server.test99999.testEnter", args, cb, function (err) {
            sendMessToDevTool(err, 1);
        });
    }
    HHW.request_mo = request_mo;
    window.addEventListener("message", function (messageEvent) {
        if (messageEvent && messageEvent.data) {
            var data = messageEvent.data;
        }
    });
    sendData("init" /* CONST.EVENT.init */);
})(HHW || (HHW = {}));
var HHW;
(function (HHW) {
    var cfgMap = {
        "c_item": [],
        "c_item_map": {},
        "c_actDesc": {},
    };
    function getCfgMap() {
        var _loop_1 = function (key) {
            if (["c_item_map"].indexOf(key) > -1) {
                return "continue";
            }
            else if (["c_actDesc"].indexOf(key) > -1) {
                if (!mo.OBJ.isEmpty(cfgMap[key])) {
                    return "continue";
                }
                mo.D.each(key, function (temp, id) {
                    if (temp.id) {
                        cfgMap[key][id] = temp.name;
                    }
                });
            }
            else if (!cfgMap[key].length) {
                if (!mo.OBJ.isEmpty(cfgMap[key])) {
                    return "continue";
                }
                var is_item_1 = key == "c_item";
                mo.D.each(key, function (temp, id) {
                    if (temp.id) {
                        if (is_item_1) {
                            cfgMap["c_item_map"][temp.id] = temp.name;
                        }
                        var list = [temp.id, temp.name];
                        cfgMap[key].push(list);
                    }
                });
            }
        };
        for (var key in cfgMap) {
            _loop_1(key);
        }
        return cfgMap;
    }
    HHW.getCfgMap = getCfgMap;
})(HHW || (HHW = {}));
var HHW;
(function (HHW) {
    function getActList() {
        HHW.request_mo("getActList", {}, function (rst) {
            var list = [];
            if (rst && rst.ext && rst.ext.actInfoMap) {
                var actInfoMap = rst.ext.actInfoMap;
                var batchMap = rst.ext.batchMap || {};
                var tempMap = rst.ext.tempMap || {};
                for (var batchId in actInfoMap) {
                    var actInfo = actInfoMap[batchId];
                    for (var key in actInfo) {
                        if (["beginTime", "endTime", "showEndTime"].indexOf(key) > -1) {
                            actInfo[key] = mo.DATE.fmt(mo.DATE.date(actInfo[key]));
                        }
                        else if (typeof actInfo[key] == 'object') {
                            actInfo[key] = JSON.stringify(actInfo[key]);
                        }
                    }
                    actInfo.name = batchMap[batchId] ? batchMap[batchId].name : "";
                    actInfo.tempName = tempMap[actInfo.tempId] ? tempMap[actInfo.tempId].name : "";
                    list.push(actInfo);
                }
                HHW.sendData("update_act" /* CONST.EVENT.update_act */, list);
            }
        });
    }
    HHW.getActList = getActList;
})(HHW || (HHW = {}));
/// <reference path="../request.ts" />
/// <reference path="./cfg.ts" />
/// <reference path="./act.ts" />
var HHW;
/// <reference path="../request.ts" />
/// <reference path="./cfg.ts" />
/// <reference path="./act.ts" />
(function (HHW) {
    HHW.teamX = '';
    //获取当前区服
    function getGsGrpId() {
        return G.gMgr.usrCtrl.$$data.serverId;
    }
    HHW.getGsGrpId = getGsGrpId;
    function isMo() {
        return !!window['G'] && !!window['mo'] && !!window['G'].loginMgr;
    }
    HHW.isMo = isMo;
    function reqHHW(modules, method, args, cb) {
        if (!args)
            args = {};
        args.hhw_team = HHW.teamX;
        args.hhw_gsIdx = getGsGrpId();
        HHW.postReq({
            modules: modules,
            method: method,
            args: args
        }, function (err, rst) {
            if (err)
                HHW.sendMessToDevTool(err, 1);
            else if (cb) {
                cb(rst);
            }
        });
    }
    HHW.reqHHW = reqHHW;
    (function init() {
        var pathList = window.location.pathname.split('/');
        HHW.teamX = pathList[1];
        if (isMo()) {
            G.loginMgr.cnnMgr.on("ON_LOGIN", function () {
                HHW.sendData("on_login" /* CONST.EVENT.on_login */);
            });
            setTimeout(function () {
                mo.NET.gsMgr.on('G.SyncData', function (route, arg, sync) {
                    if (sync) {
                        if (sync.actList) {
                            HHW.getActList();
                        }
                    }
                });
                HHW.getCfgMap();
                HHW.getActList();
                HHW.sendData("init_data" /* CONST.EVENT.init_data */);
            }, 2000);
        }
    })();
})(HHW || (HHW = {}));
var HHW;
(function (HHW) {
    function addRoot(args) {
        HHW.reqHHW('rank', 'addRoot', args, function (rst) {
            HHW.sendMessToDevTool('操作成功');
        });
    }
    HHW.addRoot = addRoot;
})(HHW || (HHW = {}));
/// <reference path="../common.ts" />
/// <reference path="./game/basics.ts" />
/// <reference path="./function/rank.ts" />
var HHW;
/// <reference path="../common.ts" />
/// <reference path="./game/basics.ts" />
/// <reference path="./function/rank.ts" />
(function (HHW) {
    var proxy_data = new Proxy({}, {
        get: function (target, propKey, receiver) {
            return target[propKey];
        },
        set: function (target, propKey, value, receiver) {
            target[propKey] = value;
            return true;
        }
    });
    var _functionMap = {
        output: output,
        changeSwitch: HHW.changeSwitch,
        addRoot: HHW.addRoot,
    };
    function inject_tool(key, arg) {
        if (!!_functionMap[key]) {
            return _functionMap[key](arg);
        }
        else {
            return null;
        }
    }
    HHW.inject_tool = inject_tool;
    /** 日志输出 */
    function output(args) {
        if (args.lv == 1) {
            console.error(args.str);
        }
        else if (args.lv == 2) {
            console.warn(args.str);
        }
        else {
            console.log(args.str);
        }
    }
})(HHW || (HHW = {}));
var HHW;
(function (HHW) {
    //开关
    var _switchMap = {
        "syncData": false,
    };
    // 控制开关
    function changeSwitch(key, isOpen) {
        if (_switchMap.hasOwnProperty(key)) {
            _switchMap[key] = !!isOpen;
            var msg = isOpen ? "打开" : "关闭";
            console.log("开关" + key + "已被" + msg);
            //key特殊判断
            if (key == "syncData") {
                if (isOpen) {
                    mo.NET.gsMgr.on('G.SyncData', _surveySyncData);
                }
                else {
                    mo.NET.gsMgr.un('G.SyncData', _surveySyncData);
                }
            }
        }
    }
    HHW.changeSwitch = changeSwitch;
    // 获取开关参数
    function getSwitchMap(key) {
        return _switchMap[key];
    }
    HHW.getSwitchMap = getSwitchMap;
    // 特殊处理SyncData开关
    function _surveySyncData(route, arg, data) {
        if (route == "gs.usr.heartTick" || route == "server.heartbeat.hb")
            return;
        console.log("请求服务端啦！！ " + mo.DATE.fmt(mo.DATE.date()));
        var obj = {
            "请求路由": route,
            "请求参数": arg,
            "服务端返回数据": data
        };
        console.log(obj);
    }
})(HHW || (HHW = {}));
