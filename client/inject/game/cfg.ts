module HHW {
    let cfgMap = {
        "c_item": [],
        "c_item_map": {},
        "c_actDesc": {},
    }

    export function getCfgMap() {
        for (let key in cfgMap) {
            if (["c_item_map"].indexOf(key) > -1) {
                continue;
            }
            else if (["c_actDesc"].indexOf(key) > -1) {
                if (!mo.OBJ.isEmpty(cfgMap[key])) {
                    continue;
                }
                mo.D.each(key, function (temp, id) {
                    if (temp.id) {
                        cfgMap[key][id] = temp.name
                    }
                })
            }
            else if (!cfgMap[key].length) {
                if (!mo.OBJ.isEmpty(cfgMap[key])) {
                    continue;
                }
                const is_item = key == "c_item";
                mo.D.each(key, function (temp, id) {
                    if (temp.id) {
                        if (is_item) {
                            cfgMap["c_item_map"][temp.id] = temp.name;
                        }
                        let list = [temp.id, temp.name];
                        cfgMap[key].push(list);
                    }
                })
            }
        }
        return cfgMap;
    }
}    