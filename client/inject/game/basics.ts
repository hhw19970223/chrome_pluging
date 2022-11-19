
/// <reference path="./cfg.ts" />
module HHW {
    export let teamX = '';
    
    //获取当前区服
    export function getGsGrpId() {
        return G.gMgr.gsInfoMgr.selected.grpId;
    }



    (function init() {
        let pathList = window.location.pathname.split('/');
        teamX = pathList[1];
    })()
}