module HHW {
    export class HClick {
        /** 浏览器大小发生变化 */
        public static resize(event) {

        }
    }

    window.addEventListener('resize', HClick.resize)
}
