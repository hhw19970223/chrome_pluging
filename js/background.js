
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request) {
        if (request.type == "tab_id") {
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.executeScript(tab.id, {
                    code: `if (window.mo) tab_id = ${tab.id}`
                })
                chrome.tabs.sendMessage(tab.id, {data: tab.id, type: "tab_id"}, function (response) {});
            }) 
        }
    }
    
    sendResponse("");
});

function sendMessageToContentScript(message, cb) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) cb(response);
        });
    });
}




