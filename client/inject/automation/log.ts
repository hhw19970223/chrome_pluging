module HHW {
    class HLog {
        public readonly LOG_METHODS: IConsoleLogMethod[] = ['error'];//['log', 'info', 'warn', 'debug', 'error'];
        /** 存储被替换的console */
        private _origConsole: { [method: string]: Function };
        /** 存储被替换的G下的打印 */
        private _origG: { [method: string]: Function };
        private _switch: Boolean;

        public set switch(status: Boolean) {
            this._switch = status;
            if (status) {
                window.removeEventListener('error', this._catchWindowOnError);
                window.addEventListener('error', this._catchWindowOnError);

                window.removeEventListener('error', this._catchResourceError);
                window.addEventListener('error', this._catchResourceError, true);

                window.removeEventListener('unhandledrejection', this._catchUnhandledRejection);
                window.addEventListener('unhandledrejection', this._catchUnhandledRejection);
            } else {
                window.removeEventListener('error', this._catchWindowOnError);
                window.removeEventListener('error', this._catchResourceError);
                window.removeEventListener('unhandledrejection', this._catchUnhandledRejection);
            }
        }

        constructor() {
            this._origConsole = {};
            this._origG = {};
            this._switch = true;//false;
            this.mockConsole();
        }

        public mockConsole() {
            let self = this;
            if (self._origConsole.error) {//已经赋值过
                return;
            }

            const methodList = self.LOG_METHODS;

            methodList.map((method) => {
                self._origConsole[method] = window.console[method];

                if (isMo()) self._origG[method] = G[method];
            });

            methodList.map((method) => {
                window.console[method] = function (...args) {
                    self._origConsole[method].apply(window.console, args);
                    let list = [method];
                    list.push(...args);
                    self._hander_console(list);
                }

                if (isMo()) {
                    G[method] = function (...args) {
                        self._origG[method].apply(G, args);
                        let list = [method];
                        list.push(...args);
                        self._hander_console(list);
                    }
                }
            });
        }

        /**
         * Recover `window.console`.
         */
        public unmockConsole() {
            // recover original console methods
            for (const method in this._origConsole) {
                window.console[method] = this._origConsole[method];
                delete this._origConsole[method];

                if (isMo()) {
                    G[method] = this._origG[method];
                    delete this._origG[method];
                }
            }
        }

        private _generate_log(errInfo: HErrorInfo) {
            if (!errInfo || !this._switch) return;
            if (errInfo.message.indexOf('test99999未配置') > -1) return;
            try {
                mo.$fillErrInfo(errInfo);
            } catch(e) {

            }

            // console.warn(errInfo);//test
        }

        private _hander_console(args) {
            let type = args.shift();
            let err = args.join(' ');

            this._generate_log({
                type: 'console.' + type,
                message: err,
            })
        }

        /**
         * Catch `window.onerror`.
         */
        private _catchWindowOnError(event) {
            this._generate_log({
                type: 'error',
                message: event.error ?  event.error.message : '',
                stack: event.error && event.error.stack ? event.error.stack.toString() : '',
                lineno: event.lineno,
                colno: event.colno,
                filename: event.filename
            })
        }

        /**
         * Catch resource loading error: image, video, link, script.
         */
        private _catchResourceError(event) {
            const target = event.target;
            // only catch resources error
            if (['link', 'video', 'script', 'img', 'audio'].indexOf(target.localName) > -1) {
                const src = target.href || target.src || target.currentSrc;

                this._generate_log({
                    type: 'resourceError',
                    message: `GET <${target.localName}> error: ${src}`,
                })
            }
        }

        /**
         * Catch `Promise.reject`.
         * @reference https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event
         */
        private _catchUnhandledRejection(e) {
            let error = e && e.reason;
            const errorName = 'Uncaught (in promise) ';
            let args = [errorName, error];
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
                args,
            })
        }
    }

    export const hLog: HLog = new HLog();
}