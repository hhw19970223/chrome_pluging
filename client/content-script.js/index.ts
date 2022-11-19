/// <reference path="../common.ts" />
module HHW {
    // 当初始的 HTML 文档被完全加载和解析完成之后
    document.addEventListener('DOMContentLoaded', function () {
        injectCustomJs('js/tools.js');
    });



    // 向页面注入JS
    function injectCustomJs(jsPath) {
        var temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        temp.src = chrome.extension.getURL(jsPath);
        temp.onload = function () {
            // 放在页面不好看，执行完后移除掉
            //@ts-ignore
            this.parentNode.removeChild(this);
        };
        document.body.appendChild(temp);
    }


    // 接收来自后台的消息
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request) {
            if (request.type == "tab_id") {

            }
        }
        sendResponse("");
    });

    // 主动发送消息给后台
    function sendMessageToBackground(message) {
        chrome.runtime.sendMessage(message, function (response) {
            // console.warn(response);
        });
    }


    function sendDataToDevTool(args) {
        // chrome.extension.sendRequest(args, function (response) {
        //     // console.log(response);
        // });
        chrome.extension.sendMessage(null, args, function (response) {
            // console.log(response);
        });
    }

    //接受inject发送的消息
    window.addEventListener("message", function (e) {
        if (e && e.data && e.data.source == CONST.identity_key) {
            sendDataToDevTool(e.data);
        }
    }, false);
}







