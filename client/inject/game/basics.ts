/// <reference path="../request.ts" />
/// <reference path="./cfg.ts" />
/// <reference path="./act.ts" />
module HHW {
    export let teamX = '';
    
    //获取当前区服
    export function getGsGrpId() {
        return G.gMgr.usrCtrl.$$data.serverId;
    }

    export function isMo() {
        return !!window['G'] && !!window['mo'] && !!window['G'].loginMgr;
    }

    export function reqHHW(module: string, method: string, args: any, cb?: (rst) => void) {
        if (!args) args = {};
        args.hhw_team = teamX;
        args.hhw_gsIdx = getGsGrpId();
        args.hhw_clientV = mo.PROJ.version;
        
        postReq({
            module,
            method,
            args
        }, (err, rst) => {
            if (err) sendMessToDevTool(err, 1);
            else if (rst.err) {
                sendMessToDevTool(rst.err, 1);
            }
            else if (cb) {
                cb(rst.data);
            }
        });
    }

    (function init() {
        let pathList = window.location.pathname.split('/');
        teamX = pathList[1];

        if (isMo()) {
            G.loginMgr.cnnMgr.on("ON_LOGIN", () => {
                sendData(CONST.EVENT.on_login);
            })

            setTimeout(() => {
                mo.NET.gsMgr.on('G.SyncData', (route, arg, sync) => {
                    if (sync) {
                        if (sync.actList) {
                            getActList();
                        }
                    }
                })

                getCfgMap();
                getActList();

                sendData(CONST.EVENT.init_data);
            }, 2000)
        }

    })()
}