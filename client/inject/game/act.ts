module HHW {
    
    export function getActList() {
        request_mo("getActList", {}, (rst) => {
            let list = [];
            if (rst && rst.ext && rst.ext.actInfoMap) {
                let actInfoMap = rst.ext.actInfoMap;
                let batchMap = rst.ext.batchMap || {};
                let tempMap = rst.ext.tempMap || {};
                for (let batchId in actInfoMap) {
                    let actInfo = actInfoMap[batchId];

                    for (let key in actInfo) {
                        if (["beginTime", "endTime", "showEndTime"].indexOf(key) > -1) {
                            actInfo[key] = mo.DATE.fmt(mo.DATE.date(actInfo[key]));
                        } else if (typeof actInfo[key] == 'object') {
                            actInfo[key] = JSON.stringify(actInfo[key]);
                        }
                    }
                    actInfo.name = batchMap[batchId] ? batchMap[batchId].name : "";
                    actInfo.tempName = tempMap[actInfo.tempId] ? tempMap[actInfo.tempId].name : "";
                    list.push(actInfo);
                }
                sendData(CONST.EVENT.update_act, list);
            }
        })
    }
}