/// <reference path="./component.ts" />
/// <reference path="./router.ts" />
module HHW {
    const App = {
        
    }
    export const app = Vue.createApp(App);
    app.use(ElementPlus, {
        locale: zhCn
    })
    .use(router)
    .component('hhw-dialog', getDialog())
    .mount('#app')
}