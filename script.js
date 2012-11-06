var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var MemoPadView = (function () {
    function MemoPadView(model, controller, ui) {
        var self = this;
        self.textarea = $(ui.textarea);
        self.saveButton = $(ui.saveButton);
        self.clearButton = $(ui.clearButton);
        self.saveButton.on('click', function () {
            return controller.save(self.textarea.val());
        });
        self.clearButton.on('click', function () {
            return controller.clear();
        });
        self.render(model.getData());
        model.addEventListener('updated', function (event) {
            return self.render(event.value);
        });
        model.addEventListener('cleared', function (event) {
            return self.render('');
        });
    }
    MemoPadView.prototype.render = function (value) {
        this.textarea.val(value);
    };
    return MemoPadView;
})();
var EventDispatcher = (function () {
    function EventDispatcher() {
        this.dispatcher = $({
        });
    }
    EventDispatcher.prototype.addEventListener = function (type, listener) {
        this.dispatcher.on.apply(this.dispatcher, arguments);
    };
    EventDispatcher.prototype.removeEventListener = function (type) {
        this.dispatcher.off.apply(this.dispatcher, arguments);
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        this.dispatcher.trigger.apply(this.dispatcher, arguments);
    };
    return EventDispatcher;
})();
var MemoPadModel = (function (_super) {
    __extends(MemoPadModel, _super);
    function MemoPadModel(namespace) {
        localStorage.setItem(namespace, localStorage.getItem(namespace) || '');
        this.namespace = namespace;
        _super.call(this);
    }
    MemoPadModel.prototype.getData = function () {
        return localStorage.getItem(this.namespace);
    };
    MemoPadModel.prototype.update = function (value) {
        localStorage.setItem(this.namespace, value);
        this.dispatchEvent({
            type: 'updated',
            value: value
        });
    };
    MemoPadModel.prototype.destroy = function () {
        this.dispatchEvent({
            type: 'cleared'
        });
        localStorage.setItem(this.namespace, '');
    };
    return MemoPadModel;
})(EventDispatcher);
var MemoPadController = (function () {
    function MemoPadController(model) {
        this.model = model;
    }
    MemoPadController.prototype.clear = function () {
        this.model.destroy();
    };
    MemoPadController.prototype.save = function (value) {
        this.model.update(value);
    };
    return MemoPadController;
})();
var App = (function () {
    function App(ui) {
        var model = new MemoPadModel('MemoPadApp');
        var controller = new MemoPadController(model);
        var view = new MemoPadView(model, controller, ui);
    }
    return App;
})();
var ui = {
    textarea: '#memoArea',
    saveButton: '#saveButton',
    clearButton: '#clearButton'
};
$(function () {
    var app = new App(ui);
});
