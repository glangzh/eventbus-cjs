import {
    on,
    once,
    emit,
    remove,
    register,
    unregister
} from '../index'

@register
class TestA {
    @emit('event_a')
    send(msg) {
        return 'hello B ' + msg;
    };

    @emit('event_b')
    sendb(msg) {
        return 'hello Bb ' + msg;
    };

    @emit('event_once')
    sendO(msg) {
        return 'hello B ' + msg;
    };

    @on('event_a')
    onMessageAA(msg) {
        console.log('aona', msg);
        this.$emitter.emit('event_b', '$emitter');
    }
}

@register
class TestB {
    @on('event_a')
    onMessage(msg) {
        console.log('on', msg);
    }

    @on('event_a')
    onMessageA(msg) {
        console.log('ona', msg);
    }

    @on('event_b')
    onMessageB(msg) {
        console.log('onb', msg);
    }

    @once('event_once')
    onMessageOnce(msg) {
        console.log('once', msg);
    }

    @remove('event_a', 'event_b')('onMessageCCCC')
    onPause(msg) {
        //
        console.log('onPause', msg);
    }

    @unregister
    onDestory() {

    }
}

let vue = {
    @register
    data() {

    },
    @on('event_a')
    onMessageU(msg) {
        console.log('--------------------vue-msg', msg);
    },
    // @unregister
    onDestory() {
        //
    }
}

let ta = new TestA();
ta.send();
ta.send('aaa');
ta.sendb('bbb');
ta.sendO('once');
ta.sendO('once');
let tb = new TestB();
tb.onPause('bbb');
tb.onDestory();

vue.onDestory();