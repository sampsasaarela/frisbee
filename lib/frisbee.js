'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _caseless = require('caseless');

var _caseless2 = _interopRequireDefault(_caseless);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _buffer = require('buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetch = (typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) === 'object' ? window.fetch : global.fetch;
//     frisbee
//     Copyright (c) 2015- Nick Baugh <niftylettuce@gmail.com>
//     MIT Licensed

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/frisbee>

// # frisbee

if (!fetch) throw new Error('A global `fetch` method is required as either `window.fetch` ' + 'for browsers or `global.fetch` for node runtime environments. ' + 'Please add `require(\'isomorphic-fetch\')` before importing `frisbee`. ' + 'You may optionally `require(\'es6-promise\').polyfill()` before you ' + 'require `isomorphic-fetch` if you want to support older browsers.' + '\n\nFor more info: https://github.com/niftylettuce/frisbee#usage');

var methods = ['get', 'head', 'post', 'put', 'del', 'options', 'patch'];

var respProperties = {
  readOnly: ['headers', 'ok', 'redirected', 'status', 'statusText', 'type', 'url', 'bodyUsed'],
  writable: ['useFinalURL'],
  callable: ['clone', 'error', 'redirect', 'arrayBuffer', 'blob', 'formData', 'json', 'text']
};

function createFrisbeeResponse(origResp) {
  var resp = {
    originalResponse: origResp
  };

  respProperties.readOnly.forEach(function (prop) {
    return (0, _defineProperty2.default)(resp, prop, {
      value: origResp[prop]
    });
  });

  respProperties.writable.forEach(function (prop) {
    return (0, _defineProperty2.default)(resp, prop, {
      get: function get() {
        return origResp[prop];
      },
      set: function set(value) {
        origResp[prop] = value;
      }
    });
  });

  var callable = null;
  respProperties.callable.forEach(function (prop) {
    (0, _defineProperty2.default)(resp, prop, {
      value: (callable = origResp[prop], typeof callable === 'function' && callable.bind(origResp))
    });
  });

  var headersObj = {};
  origResp.headers.forEach(function (pair) {
    headersObj[pair[0]] = pair[1];
  });
  Object.defineProperty(resp, 'headersObj', {
    value: headersObj
  });

  return resp;
}

var Frisbee = function () {
  function Frisbee() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Frisbee);

    this.opts = opts;

    if (!opts.baseURI) throw new Error('baseURI option is required');

    this.parseErr = new Error('Invalid JSON received from ' + opts.baseURI);

    this.headers = (0, _extends3.default)({}, opts.headers);

    this.arrayFormat = opts.arrayFormat || 'indices';

    if (opts.auth) this.auth(opts.auth);

    methods.forEach(function (method) {
      _this[method] = _this._setup(method);
    });
  }

  (0, _createClass3.default)(Frisbee, [{
    key: '_setup',
    value: function _setup(method) {
      var _this2 = this;

      return function () {
        var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


        // path must be string
        if (typeof path !== 'string') throw new Error('`path` must be a string');

        // otherwise check if its an object
        if ((typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) !== 'object' || Array.isArray(options)) throw new Error('`options` must be an object');

        var opts = (0, _extends3.default)({}, options, {
          headers: (0, _extends3.default)({}, _this2.headers, options.headers),
          method: method === 'del' ? 'DELETE' : method.toUpperCase()
        });

        var c = (0, _caseless2.default)(opts.headers);

        // in order to support Android POST requests
        // we must allow an empty body to be sent
        // https://github.com/facebook/react-native/issues/4890
        if (typeof opts.body === 'undefined') {
          if (opts.method === 'POST') opts.body = '';
        } else if ((0, _typeof3.default)(opts.body) === 'object' || opts.body instanceof Array) {
          if (opts.method === 'GET') {
            path += '?' + _qs2.default.stringify(opts.body, { arrayFormat: _this2.arrayFormat });
            delete opts.body;
          } else if (c.get('Content-Type') === 'application/json') {
            try {
              opts.body = (0, _stringify2.default)(opts.body);
            } catch (err) {
              throw err;
            }
          }
        }

        return new _promise2.default(function () {
          var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
            var originalRes, res, contentType;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return fetch(_this2.opts.baseURI + path, opts);

                  case 3:
                    originalRes = _context.sent;
                    res = createFrisbeeResponse(originalRes);
                    contentType = res.headers.get('Content-Type');

                    if (res.ok) {
                      _context.next = 28;
                      break;
                    }

                    res.err = new Error(res.statusText);

                    // check if the response was JSON, and if so, better the error

                    if (!(contentType && contentType.includes('application/json'))) {
                      _context.next = 26;
                      break;
                    }

                    _context.prev = 9;

                    if (!(typeof res.json === 'function')) {
                      _context.next = 16;
                      break;
                    }

                    _context.next = 13;
                    return res.json();

                  case 13:
                    res.body = _context.sent;
                    _context.next = 20;
                    break;

                  case 16:
                    _context.next = 18;
                    return res.text();

                  case 18:
                    res.body = _context.sent;

                    res.body = JSON.parse(res.body);

                  case 20:

                    // attempt to use Glazed error messages
                    if ((0, _typeof3.default)(res.body) === 'object' && typeof res.body.message === 'string') {
                      res.err = new Error(res.body.message);
                    } else if (!(res.body instanceof Array)
                    // attempt to utilize Stripe-inspired error messages
                    && (0, _typeof3.default)(res.body.error) === 'object') {
                      if (res.body.error.message) res.err = new Error(res.body.error.message);
                      if (res.body.error.stack) res.err.stack = res.body.error.stack;
                      if (res.body.error.code) res.err.code = res.body.error.code;
                      if (res.body.error.param) res.err.param = res.body.error.param;
                    }

                    _context.next = 26;
                    break;

                  case 23:
                    _context.prev = 23;
                    _context.t0 = _context['catch'](9);

                    res.err = _this2.parseErr;

                  case 26:

                    resolve(res);
                    return _context.abrupt('return');

                  case 28:
                    if (!(contentType && contentType.includes('application/json'))) {
                      _context.next = 50;
                      break;
                    }

                    _context.prev = 29;

                    if (!(typeof res.json === 'function')) {
                      _context.next = 36;
                      break;
                    }

                    _context.next = 33;
                    return res.json();

                  case 33:
                    res.body = _context.sent;
                    _context.next = 40;
                    break;

                  case 36:
                    _context.next = 38;
                    return res.text();

                  case 38:
                    res.body = _context.sent;

                    res.body = JSON.parse(res.body);

                  case 40:
                    _context.next = 48;
                    break;

                  case 42:
                    _context.prev = 42;
                    _context.t1 = _context['catch'](29);

                    if (!(contentType === 'application/json')) {
                      _context.next = 48;
                      break;
                    }

                    res.err = _this2.parseErr;
                    resolve(res);
                    return _context.abrupt('return');

                  case 48:
                    _context.next = 53;
                    break;

                  case 50:
                    _context.next = 52;
                    return res.text();

                  case 52:
                    res.body = _context.sent;

                  case 53:

                    resolve(res);

                    _context.next = 59;
                    break;

                  case 56:
                    _context.prev = 56;
                    _context.t2 = _context['catch'](0);

                    reject(_context.t2);

                  case 59:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this2, [[0, 56], [9, 23], [29, 42]]);
          }));

          return function (_x4, _x5) {
            return _ref.apply(this, arguments);
          };
        }());
      };
    }
  }, {
    key: 'auth',
    value: function auth(creds) {

      if (typeof creds === 'string') {
        var index = creds.indexOf(':');
        if (index !== -1) {
          creds = [creds.substr(0, index), creds.substr(index + 1)];
        }
      }

      if (!Array.isArray(creds)) creds = [].slice.call(arguments);

      switch (creds.length) {
        case 0:
          creds = ['', ''];
          break;
        case 1:
          creds.push('');
          break;
        case 2:
          break;
        default:
          throw new Error('auth option can only have two keys `[user, pass]`');
      }

      if (typeof creds[0] !== 'string') throw new Error('auth option `user` must be a string');

      if (typeof creds[1] !== 'string') throw new Error('auth option `pass` must be a string');

      if (!creds[0] && !creds[1]) delete this.headers.Authorization;else this.headers.Authorization = 'Basic ' + new _buffer.Buffer(creds.join(':')).toString('base64');

      return this;
    }
  }, {
    key: 'jwt',
    value: function jwt(token) {
      if (token === null) delete this.headers.Authorization;else if (typeof token === 'string') this.headers.Authorization = 'Bearer ' + token;else throw new Error('jwt token must be a string');

      return this;
    }
  }]);
  return Frisbee;
}();

exports.default = Frisbee;