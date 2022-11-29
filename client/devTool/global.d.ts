declare let Vue: any;
declare let ElementPlus: any;
declare let chrome: any;
declare let zhCn: any;
declare let VueRouter: any;

declare type EventType = string | symbol;
declare type Handler<T = unknown> = (event: T) => void;
declare type WildcardHandler<T = Record<string, unknown>> = (type: keyof T, event: T[keyof T]) => void;
declare type EventHandlerList<T = unknown> = Array<Handler<T>>;
declare type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>;
declare type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<keyof Events | '*', EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>>;
interface Emitter<Events extends Record<EventType, unknown>> {
    all: EventHandlerMap<Events>;
    on<Key extends keyof Events>(type: Key | any, handler: Handler<Events[Key]> | any): void;
    on(type: '*', handler: WildcardHandler<Events>): void;
    off<Key extends keyof Events>(type: Key | any, handler?: Handler<Events[Key]> | any): void;
    off(type: '*', handler: WildcardHandler<Events>): void;
    emit<Key extends keyof Events>(type: Key | any, event: Events[Key] | any): void;
    emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key | any : never): void;
}
/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
function mitt<Events extends Record<EventType, unknown>>(all?: EventHandlerMap<Events>): Emitter<Events>;
