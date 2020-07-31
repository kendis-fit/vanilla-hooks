"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var types = {
  object: "object",
  array: "array",
  string: "string",
  "boolean": "boolean",
  bool: "bool",
  number: "number",
  date: "date"
};

function useVanillaForm(_ref) {
  var schema = _ref.schema,
      onSubmit = _ref.onSubmit,
      initialValues = _ref.initialValues,
      _ref$valuesAnyway = _ref.valuesAnyway,
      valuesAnyway = _ref$valuesAnyway === void 0 ? false : _ref$valuesAnyway,
      _ref$allFieldsExisted = _ref.allFieldsExisted,
      allFieldsExisted = _ref$allFieldsExisted === void 0 ? true : _ref$allFieldsExisted;

  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      errors = _useState2[0],
      setErrors = _useState2[1];

  (0, _react.useEffect)(function () {
    setValues(initialValues);
  }, []);

  var convertType = function convertType(type, value) {
    switch (type) {
      case types.bool:
      case types["boolean"]:
        return Boolean(value);

      case types.number:
        return Number(value);

      default:
        return value;
    }
  };

  var parseForm = function parseForm(schema, name) {
    var typeSchema = schema.describe().type;
    var formData = undefined;

    (function () {
      switch (typeSchema) {
        case types.object:
          var fieldObj = {};
          var fields = Object.keys(schema.fields);
          fields.forEach(function (field) {
            var fieldValue = parseForm(schema.fields[field], name ? "".concat(name, ".").concat(field) : field);

            if (typeof fieldValue !== "undefined") {
              fieldObj[field] = fieldValue;
            }
          });

          if (Object.keys(fieldObj).length > 0) {
            formData = fieldObj;
          }

          break;

        case types.array:
          formData = [];
          var i = 0;

          while (true) {
            var elements = document.querySelectorAll("[name*=\"".concat(name ? name : "", "[").concat(i, "]\"]"));

            if (elements.length > 0) {
              if (schema._subType.fields) {
                (function () {
                  // if child is an object
                  var fields = Object.keys(schema._subType.fields);
                  var fieldObj = {};
                  fields.forEach(function (field) {
                    var fieldSchema = schema._subType.fields[field];
                    var fieldName = "".concat(name ? name : "", "[").concat(i, "].").concat(field);
                    var fieldValue = parseForm(fieldSchema, fieldName);

                    if (typeof fieldValue !== "undefined") {
                      fieldObj[field] = fieldValue;
                    }
                  });

                  if (Object.keys(fieldObj).length > 0) {
                    formData.push(fieldObj);
                  }
                })();
              } else {
                // it means schema consists of primary type
                var type = schema._subType._type;

                var _isBoolean = typeSchema === types.bool || typeSchema === types["boolean"];

                formData.push(convertType(type, elements[0][_isBoolean ? "checked" : "value"]));
              }

              ++i;
            } else {
              if (i === 0) {
                formData = undefined;
              }

              break;
            }
          }

          break;

        case types.string:
        case types.date:
        case types.bool:
        case types["boolean"]:
        case types.number:
          var element = document.querySelector("[name=\"".concat(name, "\"]"));
          var isBoolean = typeSchema === types.bool || typeSchema === types["boolean"];

          if (!allFieldsExisted) {
            formData = element ? convertType(typeSchema, element[isBoolean ? "checked" : "value"]) : undefined;
          } else {
            formData = convertType(typeSchema, element[isBoolean ? "checked" : "value"]);
          }

          break;
      }
    })();

    return formData;
  };

  var handleSubmit = function handleSubmit() {
    var formData = parseForm(schema);
    var formOpts = {
      abortEarly: false
    };
    var errors = {};
    schema.validate(formData, formOpts).then(function () {
      onSubmit(true, formData);
    })["catch"](function (err) {
      err.inner.forEach(function (e) {
        return errors[e.path] = e.message;
      });
      onSubmit(false, valuesAnyway ? formData : null, errors);
    })["finally"](function () {
      return setErrors(errors);
    });
  };

  var fillForm = function fillForm(initVals, name) {
    if (_typeof(initVals) === "object") {
      if (initVals.length) {
        // if it is an array
        initVals.forEach(function (value, index) {
          if (_typeof(value) === "object") {
            var fields = Object.entries(value);
            fields.forEach(function (_ref2) {
              var _ref3 = _slicedToArray(_ref2, 2),
                  key = _ref3[0],
                  val = _ref3[1];

              return fillForm(val, name ? "".concat(name, "[").concat(index, "].").concat(key) : "[".concat(index, "].").concat(key));
            });
          } else {
            fillForm(value, name ? "".concat(name, "[").concat(index, "]") : "[".concat(index, "]"));
          }
        });
      } else {
        var fields = Object.entries(initVals);
        fields.forEach(function (_ref4) {
          var _ref5 = _slicedToArray(_ref4, 1),
              key = _ref5[0];

          return fillForm(initVals[key], name ? "".concat(name, ".").concat(key) : key);
        });
      }
    } else {
      var isBoolean = typeof initVals === "boolean";
      var element = document.querySelector("[name=\"".concat(name, "\"]"));

      if (element) {
        element[isBoolean ? "checked" : "value"] = initVals;
      }
    }
  };

  var setValues = function setValues(initialValues) {
    return fillForm(initialValues);
  };

  var getValues = function getValues() {
    return parseForm(schema);
  };

  return {
    errors: errors,
    handleSubmit: handleSubmit,
    setValues: setValues,
    getValues: getValues
  };
}

var _default = useVanillaForm;
exports["default"] = _default;