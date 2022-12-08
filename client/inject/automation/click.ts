/// <reference path="./action.ts" />
module HHW {
    export let osType: CONST.OSTYPE;//谷歌浏览器的系统类型
    export let height: number;//谷歌浏览器内屏高度
    export let width: number;//谷歌浏览器内屏宽度
    export let model: string;//机型
    export let isResize: boolean;//游戏宽高是否变化过

    function _resize(event, isFirst?: boolean): void {
        if (isFirst) {
            isResize = false;
        } else if (height == window.screen.height && width == window.screen.width) {
            return;//宽高无变化
        }

        isResize = true;

        const ua = navigator.userAgent;
        model = getKuoHao(navigator.userAgent);

        if (ua.match(/(windows nt)\s([\d_]+)/i)) {
            osType = CONST.OSTYPE.pc;
        }
        else if (ua.match(/(android).*\s([\d_]+)/i)) {
            osType = CONST.OSTYPE.android;
        }
        else if (ua.match(/(iphone).*\s([\d_]+)/i)) {
            osType = CONST.OSTYPE.iphone;
        }
        else if (ua.match(/(ipad).*\s([\d_]+)/i)) {
            osType = CONST.OSTYPE.ipad;
        }
        else if (ua.match(/(ipod).*\s([\d_]+)/i)) {
            osType = CONST.OSTYPE.ipod;
        }
        else if (ua.match(/(Mac OS X).*\s([\d_]+)/i)) {
            osType = CONST.OSTYPE.mac_os;
        }

        height = window.screen.height;
        width = window.screen.width;

        if (!isFirst) HClick.resize(event);
    }

    export class HClick {
        public readonly TOUCH_METHODS: string[] = ['onTouchBegin', 'onTouchMove', 'onTouchEnd'];
        private _action: HAction;
        private _isDown: boolean;//鼠标是否按下
        private _webTouchHandler: any;
        /** 存储被替换的touch */
        private _origTouch: { [method: string]: Function };
        constructor() {
            let self = this;
            self._isDown = false;
            self._origTouch = {};

            _resize(null, true);
            if (isMo() && hasEgret()) {
                let _action = new HAction();
                let webTouchHandler = this._webTouchHandler = document.querySelector(".egret-player")['egret-player'].webTouchHandler;

                const methodList = self.TOUCH_METHODS;

                methodList.map((method) => {
                    self._origTouch[method] = webTouchHandler.touch[method];
                });

                methodList.map((method) => {
                    webTouchHandler.touch[method] = function (...args) {
                        self._origTouch[method].apply(webTouchHandler.touch, args);
                        self['_' + method].apply(self, args);
                    }
                });
                window.addEventListener('resize', _resize);
            }
        }


        private _onTouchBegin(x, y, identifier) {
            this._isDown = true;
            console.log('TouchStart', x, y);
        }

        private _onTouchMove(x, y, identifier) {
            if (this._isDown) {
                console.log('TouchMove', x, y);
            }
        }

        private _onTouchEnd(x, y, identifier) {
            if (this._isDown == false) return;

            this._isDown = false;
            console.log('TouchEnd', x, y);
        }

        /** 浏览器大小发生变化 */
        public static resize(event) {
            console.log(height, width);
        }
    }
    export const hClick: HClick = new HClick();
}
