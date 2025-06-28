const addon = require('../native');
const { EventEmitter } = require('events');

class RustCatch extends EventEmitter {
    constructor() {
        super();
        this._isRunning = false;

        this._rustCallback = (event) => {
            if (event && event.type) {
                this.emit(event.type, event);
            }
        };
    }

    start() {
        if (this._isRunning) {
            console.warn("rustcatch уже запущен.");
            return;
        }
        addon.start(this._rustCallback);
        this._isRunning = true;
        console.log("rustcatch: Глобальный перехватчик запущен.");
    }

    stop() {
        if (!this._isRunning) {
            return;
        }
        // Вызываем нашу новую нативную функцию
        addon.stop();
        this._isRunning = false;
        console.log("rustcatch: Глобальный перехватчик остановлен.");
    }
}

module.exports = new RustCatch();