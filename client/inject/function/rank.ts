
module HHW {
    export function addRoot(args) {
        reqHHW('rank', 'addRoot', args, (rst) => {
            sendMessToDevTool('操作成功');
        })
    }
}