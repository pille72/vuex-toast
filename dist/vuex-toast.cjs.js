/*!
 * vuex-toast v0.1.5
 * https://github.com/ktsn/vuex-toast
 *
 * @license
 * Copyright (c) 2016 katashin
 * Released under the MIT license
 * https://github.com/ktsn/vuex-toast/blob/master/LICENSE
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PREFIX = '@@toast/';

var ADD = PREFIX + 'ADD_TOAST_MESSAGE';
var REMOVE = PREFIX + 'REMOVE_TOAST_MESSAGE';

function createMessage(id, text, type, dismissAfter) {
  return {
    id: id,
    text: text,
    type: type,
    dismissAfter: dismissAfter
  };
}

function createModule() {
  var _actions, _mutations;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$dismissInter = options.dismissInterval,
      dismissInterval = _options$dismissInter === undefined ? 5000 : _options$dismissInter;


  var maxToastId = 0;

  var state = {
    messages: []
  };

  var getters = {
    toastMessages: function toastMessages(state) {
      return state.messages;
    }
  };

  var actions = (_actions = {}, _defineProperty(_actions, ADD, function (_ref, _ref2) {
    var commit = _ref.commit;
    var text = _ref2.text,
        _ref2$type = _ref2.type,
        type = _ref2$type === undefined ? 'info' : _ref2$type,
        _ref2$dismissAfter = _ref2.dismissAfter,
        dismissAfter = _ref2$dismissAfter === undefined ? dismissInterval : _ref2$dismissAfter;

    var id = ++maxToastId;

    commit(ADD, createMessage(id, text, type, dismissAfter));
    setTimeout(function () {
      return commit(REMOVE, id);
    }, dismissAfter);
  }), _defineProperty(_actions, REMOVE, function (_ref3, id) {
    var commit = _ref3.commit;

    commit(REMOVE, id);
  }), _actions);

  var mutations = (_mutations = {}, _defineProperty(_mutations, ADD, function (state, data) {
    state.messages.push(data);
  }), _defineProperty(_mutations, REMOVE, function (state, id) {
    state.messages = state.messages.filter(function (m) {
      return m.id !== id;
    });
  }), _mutations);

  return {
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations
  };
}

var DefaultTransition = {
  functional: true,
  render: function render(h, _ref) {
    var children = _ref.children;

    var data = {
      attrs: { tag: 'div', name: 'toast', type: 'transition' }
    };
    return h('transition-group', data, children);
  }
};

var Toast = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "toast", class: _vm.positionClass }, [_c('toast-transition', _vm._l(_vm.messages, function (m) {
      return _c('div', { key: m.id, staticClass: "toast-message", class: _vm.messageTypeClass(m), attrs: { "role": "note" } }, [_vm.html ? _c('div', { staticClass: "toast-message-text", domProps: { "innerHTML": _vm._s(m.text) } }) : !_vm.html && _vm.$t && _vm.translate ? _c('div', { staticClass: "toast-message-text" }, [_vm._v(_vm._s(_vm.$t(m.text)))]) : _c('div', { staticClass: "toast-message-text" }, [_vm._v(_vm._s(m.text))]), _vm._v(" "), _c('button', { staticClass: "toast-button", attrs: { "aria-label": "Close", "type": "button" }, on: { "click": function click($event) {
            _vm.close(m.id);
          } } })]);
    }))], 1);
  }, staticRenderFns: [],
  props: {
    position: {
      validator: function validator(value) {
        return (/^(:?n|s|nw|ne|sw|se)$/.test(value)
        );
      },

      default: 'ne'
    },

    namespace: {
      type: String,
      default: ''
    },

    translate: Boolean,
    html: Boolean
  },

  computed: {
    messages: function messages() {
      return this.$store.getters[this.normalizedNamespace + 'toastMessages'];
    },
    positionClass: function positionClass() {
      return 'toast-position-' + this.position;
    },
    normalizedNamespace: function normalizedNamespace() {
      if (this.namespace === '') {
        return '';
      }

      if (!/\/$/.test(this.namespace)) {
        return this.namespace + '/';
      }

      return this.namespace;
    }
  },

  methods: {
    close: function close(id) {
      this.$store.dispatch(this.normalizedNamespace + REMOVE, id);
    },
    messageTypeClass: function messageTypeClass(message) {
      return 'toast-type-' + message.type;
    }
  },

  components: {
    ToastTransition: DefaultTransition
  }
};

/**
 * Simple update without mutation
 */
function update(obj, updater) {
  var res = {};
  Object.keys(obj).forEach(function (key) {
    res[key] = updater[key] === undefined ? obj[key] : updater[key];
  });
  return res;
}

function createComponent() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var transition = options.transition;


  return update(Toast, {
    components: {
      toastTransition: transition
    }
  });
}

exports.createComponent = createComponent;
exports.Toast = Toast;
exports.ADD_TOAST_MESSAGE = ADD;
exports.REMOVE_TOAST_MESSAGE = REMOVE;
exports.createModule = createModule;
