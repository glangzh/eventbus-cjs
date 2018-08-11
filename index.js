const EventEmitter = require('events');
const emitter = new EventEmitter();

export const register = (target, property, descriptor) => {
    descriptor ? target.$emitter = emitter : target.prototype.$emitter = emitter;
    if (descriptor) {
        let oldVal = descriptor.value;
        descriptor.value = function (...args) {
            this.$emitter = emitter;
            target._target = this;
            return oldVal.apply(this, args);
        }
    }
}

export const emit = eventName => (target, property, descriptor) => {
    if (descriptor) {
        let oldVal = descriptor.value;
        descriptor.value = (...args) => emitter.emit(eventName, oldVal.apply(target, args));
    }
}

export const on = eventName => (target, property, descriptor) => {
    if (descriptor) {
        let oldVal = descriptor.value;
        emitter.on(eventName, (...args) => {
            oldVal.apply(target._target || target, args);
        }) && (() => {
            target.__events = target.__events || {};
            target.__events[eventName] = target.__events[eventName] || {};
            target.__events[eventName][property] = oldVal;
        })();
    }
}

export const once = eventName => (target, property, descriptor) => descriptor && emitter.once(eventName, (...args) => {
    descriptor.value.apply(target._target || target, args);
});

export const remove = (..._events) => (..._listeners) => (target, property, descriptor) => {
    let oldVal = descriptor.value;
    descriptor.value = (...args) => {
        if (_events && _events.length > 0) {
            for (let i = 0, len = _events.length; i < len; i++) {
                _listeners[i] ? removeListener(target, _listeners[i], _events[i]) : removeAllListeners(target, _events[i]);
            }
        } else {
            removeAllListeners(target);
        }
        oldVal.apply(target, args);
    }
}

export const unregister = (target, property, descriptor) => {
    if (descriptor) {
        let oldVal = descriptor.value;
        descriptor.value = (...args) => {
            target.$emitter = target.__events = target._target = removeAllListeners(target);
            oldVal.apply(target, args);
        }
    }
}

const removeListener = (target, property, eventName) => {
    if (target.__events) {
        const remove = _property => {
            let events = target.__events[eventName];
            events && events[_property] && emitter.removeListener(eventName, events[_property]) && delete events[_property];
        }

        Array.isArray(property) ? property.forEach(_property => remove(_property)) : remove(property);
    }
}

const removeAllListeners = (target, eventName) => {
    if (target.__events) {
        const removes = _eventName => {
            let event = target.__events[_eventName];
            event && Object.keys(event).forEach(listener => event[listener] && emitter.removeListener(_eventName, event[listener]));
        }

        eventName ? removes(eventName) : Object.keys(target.__events).forEach(_eventName => removes(_eventName));
        eventName ? delete target.__events[eventName] : delete target.__events;
    }
}