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
    HHW.cfgMap = {
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
                if (!mo.OBJ.isEmpty(HHW.cfgMap[key])) {
                    return "continue";
                }
                mo.D.each(key, function (temp, id) {
                    if (temp.id) {
                        HHW.cfgMap[key][id] = temp.name;
                    }
                });
            }
            else if (!HHW.cfgMap[key].length) {
                if (!mo.OBJ.isEmpty(HHW.cfgMap[key])) {
                    return "continue";
                }
                var is_item_1 = key == "c_item";
                mo.D.each(key, function (temp, id) {
                    if (temp.id) {
                        if (is_item_1) {
                            HHW.cfgMap["c_item_map"][temp.id] = temp.name;
                        }
                        var list = [temp.id, temp.name];
                        HHW.cfgMap[key].push(list);
                    }
                });
            }
        };
        for (var key in HHW.cfgMap) {
            _loop_1(key);
        }
        return HHW.cfgMap;
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
    function reqHHW(module, method, args, cb) {
        if (!args)
            args = {};
        args.hhw_team = HHW.teamX;
        args.hhw_gsIdx = getGsGrpId();
        args.hhw_clientV = mo.PROJ.version;
        HHW.postReq({
            module: module,
            method: method,
            args: args
        }, function (err, rst) {
            if (err)
                HHW.sendMessToDevTool(err, 1);
            else if (rst.err) {
                HHW.sendMessToDevTool(rst.err, 1);
            }
            else if (cb) {
                cb(rst.data);
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
var HHW;
(function (HHW) {
    var HConsole = /** @class */ (function () {
        function HConsole() {
            this.LOG_METHODS = ['error']; //['log', 'info', 'warn', 'debug', 'error'];
            this._origConsole = {};
            this._origG = {};
            this._switch = true; //false;
            this.mockConsole();
        }
        Object.defineProperty(HConsole.prototype, "switch", {
            set: function (status) {
                this._switch = status;
                if (status) {
                    window.removeEventListener('error', this._catchWindowOnError);
                    window.addEventListener('error', this._catchWindowOnError);
                    window.removeEventListener('error', this._catchResourceError);
                    window.addEventListener('error', this._catchResourceError, true);
                    window.removeEventListener('unhandledrejection', this._catchUnhandledRejection);
                    window.addEventListener('unhandledrejection', this._catchUnhandledRejection);
                }
                else {
                    window.removeEventListener('error', this._catchWindowOnError);
                    window.removeEventListener('error', this._catchResourceError);
                    window.removeEventListener('unhandledrejection', this._catchUnhandledRejection);
                }
            },
            enumerable: false,
            configurable: true
        });
        HConsole.prototype.mockConsole = function () {
            var self = this;
            if (self._origConsole.error) { //已经赋值过
                return;
            }
            var methodList = self.LOG_METHODS;
            methodList.map(function (method) {
                self._origConsole[method] = window.console[method];
                if (HHW.isMo())
                    self._origG[method] = G[method];
            });
            methodList.map(function (method) {
                window.console[method] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    self._origConsole[method].apply(window.console, args);
                    var list = [method];
                    list.push.apply(list, args);
                    self._hander_console(list);
                };
                if (HHW.isMo()) {
                    G[method] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        self._origG[method].apply(G, args);
                        var list = [method];
                        list.push.apply(list, args);
                        self._hander_console(list);
                    };
                }
            });
        };
        /**
         * Recover `window.console`.
         */
        HConsole.prototype.unmockConsole = function () {
            // recover original console methods
            for (var method in this._origConsole) {
                window.console[method] = this._origConsole[method];
                delete this._origConsole[method];
                if (HHW.isMo()) {
                    G[method] = this._origG[method];
                    delete this._origG[method];
                }
            }
        };
        HConsole.prototype._generate_log = function (errInfo) {
            if (!errInfo || !this._switch)
                return;
            if (errInfo.message.indexOf('test99999未配置') > -1)
                return;
            try {
                mo.$fillErrInfo(errInfo);
            }
            catch (e) {
            }
            console.warn(errInfo); //test
        };
        HConsole.prototype._hander_console = function (args) {
            var type = args.shift();
            var err = args.join(' ');
            this._generate_log({
                type: 'console.' + type,
                message: err,
            });
        };
        /**
         * Catch `window.onerror`.
         */
        HConsole.prototype._catchWindowOnError = function (event) {
            this._generate_log({
                type: 'error',
                message: event.error ? event.error.message : '',
                stack: event.error && event.error.stack ? event.error.stack.toString() : '',
                lineno: event.lineno,
                colno: event.colno,
                filename: event.filename
            });
        };
        /**
         * Catch resource loading error: image, video, link, script.
         */
        HConsole.prototype._catchResourceError = function (event) {
            var target = event.target;
            // only catch resources error
            if (['link', 'video', 'script', 'img', 'audio'].indexOf(target.localName) > -1) {
                var src = target.href || target.src || target.currentSrc;
                this._generate_log({
                    type: 'resourceError',
                    message: "GET <".concat(target.localName, "> error: ").concat(src),
                });
            }
        };
        /**
         * Catch `Promise.reject`.
         * @reference https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event
         */
        HConsole.prototype._catchUnhandledRejection = function (e) {
            var error = e && e.reason;
            var errorName = 'Uncaught (in promise) ';
            var args = [errorName, error];
            if (error instanceof Error) {
                args = [
                    errorName,
                    {
                        name: error.name,
                        message: error.message,
                        stack: error.stack,
                    },
                ];
            }
            this._generate_log({
                type: 'unhandledrejection',
                args: args,
            });
        };
        return HConsole;
    }());
    HHW.hConsole = new HConsole();
})(HHW || (HHW = {}));
/// <reference path="../common.ts" />
/// <reference path="./game/basics.ts" />
/// <reference path="./function/rank.ts" />
/// <reference path="./log.ts" />
var HHW;
/// <reference path="../common.ts" />
/// <reference path="./game/basics.ts" />
/// <reference path="./function/rank.ts" />
/// <reference path="./log.ts" />
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
