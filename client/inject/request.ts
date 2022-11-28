module HHW {
    export const identity_key = CONST.identity_key + (new Date).getTime();//身份标识
    //* 通知content-script */
    export function sendData(type: CONST.EVENT, data?: any) {
        window.postMessage({
            source: CONST.identity_key,
            data: data,
            type,
            identity: identity_key,
        }, '*');
    }

    /** 
     * devTool的消息弹窗 
     * type 1: err 2: warn other: info
     */
    export function sendMessToDevTool(mess: string, type?: number) {
        sendData(CONST.EVENT.mess, { mess: mess, t: type });
    }

    /** 请求hhw进程 */
    export function postReq(params, cb?: (err, rst) => void) {
        let url = "http://" + window.location.hostname; //http://192.168.2.22
        // url += `:8009/hhw/?modules=setTime&method=update&args={'newDate':'${timeStr}'}`;
        url += `:8008/hhw/`;
        mo.NET.post(url, params, (err, rst) => {
            if (rst && typeof rst == "string") rst = JSON.parse(rst);
            if (cb) cb(err, rst);
        })
    }

    export function request_mo(method, args, cb) {
        if (!G.gMgr.serverInfoMgr.isOpen('test99999')) {
            console.error("test99999未配置");
            return;
        }
        if (!args) args = {};
        args.method = method;
        // G.gsRequest("test99999.testEnter", args, cb);
        mo.NET.gsMgr.requestWithErr("server.test99999.testEnter", args, cb, (err) => {
            sendMessToDevTool(err, 1);
        })
    }

    window.addEventListener("message", function (messageEvent) {
        if (messageEvent && messageEvent.data) {
            let data = messageEvent.data;
        }
    });

    sendData(CONST.EVENT.init);
}