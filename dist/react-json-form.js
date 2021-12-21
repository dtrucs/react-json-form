(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.reactJsonForm = factory());
}(this, (function () {
  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function getBlankObject(schema) {
    var keys = {};
    var schema_keys = schema.keys || schema.properties;

    for (var key in schema_keys) {
      var value = schema_keys[key];
      var type = value.type;
      if (type === 'list') type = 'array';else if (type === 'dict') type = 'object';
      if (type === 'array') keys[key] = getBlankArray(value);else if (type === 'object') keys[key] = getBlankObject(value);else if (type === 'boolean') keys[key] = value["default"] || false;else if (type === 'integer' || type === 'number') keys[key] = value["default"] || null;else // string etc.
        keys[key] = value["default"] || '';
    }

    return keys;
  }
  function getBlankArray(schema) {
    var items = [];
    var type = schema.items.type;
    if (type === 'list') type = 'array';else if (type === 'dict') type = 'object';
    if (type === 'array') items.push(getBlankArray(schema.items));else if (type === 'object') items.push(getBlankObject(schema.items));else if (type === 'boolean') items.push(schema.items["default"] || false);else if (type === 'integer' || type === 'number') items.push(schema.items["default"] || null);else // string, etc.
      items.push(schema.items["default"] || '');
    return items;
  }
  function getBlankData(schema) {
    var type = schema.type;
    if (type === 'list') type = 'array';else if (type === 'dict') type = 'object';
    if (type === 'array') return getBlankArray(schema);else if (type === 'object') return getBlankObject(schema);else if (type === 'boolean') return schema["default"] || false;else if (type === 'integer' || type === 'number') return schema["default"] || null;else // string, etc.
      return schema["default"] || '';
  }

  function getSyncedArray(data, schema) {
    var newData = JSON.parse(JSON.stringify(data));
    var type = schema.items.type;
    if (type === 'list') type = 'array';else if (type === 'dict') type = 'object';

    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      if (type === 'array') {
        newData[i] = getSyncedArray(item, schema.items);
      } else if (type === 'object') {
        newData[i] = getSyncedObject(item, schema.items);
      } else {
        if ((type === 'integer' || type === 'number') && item === '') newData[i] = null;
      }
    }

    return newData;
  }

  function getSyncedObject(data, schema) {
    var newData = JSON.parse(JSON.stringify(data));
    var schema_keys = schema.keys || schema.properties;
    var keys = [].concat(Object.keys(schema_keys));

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var schemaValue = schema_keys[key];
      var type = schemaValue.type;
      if (type === 'list') type = 'array';else if (type === 'dict') type = 'object';

      if (!data.hasOwnProperty(key)) {
        if (type === 'array') newData[key] = getSyncedArray([], schemaValue);else if (type === 'object') newData[key] = getSyncedObject({}, schemaValue);else if (type === 'boolean') newData[key] = false;else if (type === 'integer' || type === 'number') newData[key] = null;else newData[key] = '';
      } else {
        if (type === 'array') newData[key] = getSyncedArray(data[key], schemaValue);else if (type === 'object') newData[key] = getSyncedObject(data[key], schemaValue);else {
          if ((type === 'integer' || type === 'number') && data[key] === '') newData[key] = null;else newData[key] = data[key];
        }
      }
    }

    return newData;
  }

  function getSyncedData(data, schema) {
    // adds those keys to data which are in schema but not in data
    var type = schema.type;
    if (type === 'list') type = 'array';else if (type === 'dict') type = 'object';

    if (type === 'array') {
      return getSyncedArray(data, schema);
    } else if (type === 'object') {
      return getSyncedObject(data, schema);
    }

    return data;
  }

  var _excluded$1 = ["className"];
  function Button(_ref) {
    var className = _ref.className,
        props = _objectWithoutPropertiesLoose(_ref, _excluded$1);

    if (!className) className = '';
    var classes = className.split(' ');
    className = '';

    for (var i = 0; i < classes.length; i++) {
      className = className + 'rjf-' + classes[i] + '-button ';
    }

    return /*#__PURE__*/React.createElement("button", _extends({
      className: className.trim(),
      type: "button"
    }, props), props.children);
  }

  function Loader(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: "rjf-loader"
    });
  }

  var EditorContext = React.createContext();
  function capitalize(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
  }
  function getVerboseName(name) {
    if (name === undefined || name === null) return '';
    name = name.replace(/_/g, ' ');
    return capitalize(name);
  }
  function getCsrfCookie() {
    if (document.cookie.split(';').filter(function (item) {
      return item.trim().indexOf('csrftoken=') === 0;
    }).length) {
      return document.cookie.split(';').filter(function (item) {
        return item.trim().indexOf('csrftoken=') === 0;
      })[0].split('=')[1];
    }

    return null;
  }

  var _excluded = ["label", "help_text", "error", "inputRef"],
      _excluded2 = ["label", "help_text", "error", "value"],
      _excluded3 = ["label", "help_text", "error", "value", "options"],
      _excluded4 = ["label", "help_text", "error", "value", "options"],
      _excluded5 = ["label", "value"],
      _excluded6 = ["label", "help_text", "error", "inputRef"];
  function FormInput(_ref) {
    var label = _ref.label,
        inputRef = _ref.inputRef,
        props = _objectWithoutPropertiesLoose(_ref, _excluded);

    if (props.type === 'string') props.type = 'text';
    if (inputRef) props.ref = inputRef;
    if (props.value === null) props.value = '';
    return /*#__PURE__*/React.createElement("div", null, label && /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("input", props));
  }
  function FormCheckInput(_ref2) {
    var label = _ref2.label,
        value = _ref2.value,
        props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

    if (!label) label = props.name.toUpperCase();
    if (props.type === 'bool') props.type = 'checkbox';
    if (props.checked === undefined) props.checked = value;
    if (props.checked === '' || props.checked === null || props.checked === undefined) props.checked = false;
    if (props.readOnly) props.disabled = true;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", props), " ", label));
  }
  function FormRadioInput(_ref3) {
    var label = _ref3.label,
        value = _ref3.value,
        options = _ref3.options,
        props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

    if (props.readOnly) props.disabled = true;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, label), options.map(function (option, i) {
      var label, inputValue;

      if (typeof option === 'object') {
        label = option.label;
        inputValue = option.value;
      } else {
        label = option;
        if (typeof label === 'boolean') label = capitalize(label.toString());
        inputValue = option;
      }

      return /*#__PURE__*/React.createElement("label", {
        key: label + '_' + inputValue + '_' + i
      }, /*#__PURE__*/React.createElement("input", _extends({}, props, {
        value: inputValue,
        checked: inputValue === value
      })), " ", label);
    }));
  }
  function FormSelectInput(_ref4) {
    var label = _ref4.label,
        value = _ref4.value,
        options = _ref4.options,
        props = _objectWithoutPropertiesLoose(_ref4, _excluded4);

    if (props.readOnly) props.disabled = true;
    return /*#__PURE__*/React.createElement("div", null, label && /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("select", _extends({
      value: value || ''
    }, props), /*#__PURE__*/React.createElement("option", {
      disabled: true,
      value: "",
      key: '__placehlder'
    }, "Select..."), options.map(function (option, i) {
      var label, inputValue;

      if (typeof option === 'object') {
        label = option.label;
        inputValue = option.value;
      } else {
        label = option;
        if (typeof label === 'boolean') label = capitalize(label.toString());
        inputValue = option;
      }

      return /*#__PURE__*/React.createElement("option", {
        value: inputValue,
        key: label + '_' + inputValue + '_' + i
      }, label);
    })));
  }
  function dataURItoBlob(dataURI) {
    // Split metadata from data
    var splitted = dataURI.split(","); // Split params

    var params = splitted[0].split(";"); // Get mime-type from params

    var type = params[0].replace("data:", ""); // Filter the name property from params

    var properties = params.filter(function (param) {
      return param.split("=")[0] === "name";
    }); // Look for the name and use unknown if no name property.

    var name;

    if (properties.length !== 1) {
      name = "unknown";
    } else {
      // Because we filtered out the other property,
      // we only have the name case here.
      name = properties[0].split("=")[1];
    } // Built the Uint8Array Blob parameter from the base64 string.


    var binary = atob(splitted[1]);
    var array = [];

    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    } // Create the blob object


    var blob = new window.Blob([new Uint8Array(array)], {
      type: type
    });
    return {
      blob: blob,
      name: name
    };
  }
  var FormFileInput = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(FormFileInput, _React$Component);

    function FormFileInput(props) {
      var _this;

      _this = _React$Component.call(this, props) || this;

      _this.getFileName = function () {
        if (!_this.props.value) return '';

        if (_this.props.type === 'data-url') {
          return _this.extractFileInfo(_this.props.value).name;
        } else if (_this.props.type === 'file-url') {
          return _this.props.value;
        } else {
          return 'Unknown file';
        }
      };

      _this.extractFileInfo = function (dataURL) {
        var _dataURItoBlob = dataURItoBlob(dataURL),
            blob = _dataURItoBlob.blob,
            name = _dataURItoBlob.name;

        return {
          name: name,
          size: blob.size,
          type: blob.type
        };
      };

      _this.addNameToDataURL = function (dataURL, name) {
        return dataURL.replace(';base64', ';name=' + encodeURIComponent(name) + ';base64');
      };

      _this.handleChange = function (e) {
        if (_this.props.type === 'data-url') {
          var file = e.target.files[0];
          var fileName = file.name;
          var reader = new FileReader();

          reader.onload = function () {
            // this.setState({src: reader.result});
            // we create a fake event object
            var event = {
              target: {
                type: 'text',
                value: _this.addNameToDataURL(reader.result, fileName),
                name: _this.props.name
              }
            };

            _this.props.onChange(event);
          };

          reader.readAsDataURL(file);
        } else if (_this.props.type === 'file-url') {
          var endpoint = _this.context.fileUploadEndpoint;

          if (!endpoint) {
            console.error("Error: fileUploadEndpoint option need to be passed " + "while initializing editor for enabling file uploads.");
            alert("Files can't be uploaded.");
            return;
          }

          _this.setState({
            loading: true
          });

          var formData = new FormData();
          formData.append('field_name', _this.context.fieldName);
          formData.append('model_name', _this.context.modelName);
          formData.append('coordinates', JSON.stringify(_this.props.name.split('-').slice(1)));
          formData.append('file', e.target.files[0]);
          fetch(endpoint, {
            method: 'POST',
            headers: {
              'X-CSRFToken': getCsrfCookie()
            },
            body: formData
          }).then(function (response) {
            return response.json();
          }).then(function (result) {
            // we create a fake event object
            var event = {
              target: {
                type: 'text',
                value: result.file_path,
                name: _this.props.name
              }
            };

            _this.props.onChange(event);

            _this.setState({
              loading: false
            });
          })["catch"](function (error) {
            alert('Something went wrong while uploading file');
            console.error('Error:', error);

            _this.setState({
              loading: false
            });
          });
        }
      };

      _this.showFileBrowser = function () {
        _this.inputRef.current.click();
      };

      _this.state = {
        value: props.value,
        fileName: _this.getFileName(),
        loading: false
      };
      _this.inputRef = React.createRef();
      return _this;
    }

    var _proto = FormFileInput.prototype;

    _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      if (this.props.value !== prevProps.value) {
        this.setState({
          value: this.props.value,
          fileName: this.getFileName()
        });
      }
    };

    _proto.render = function render() {
      var _value$this$props = _extends({
        value: value
      }, this.props),
          label = _value$this$props.label,
          value = _value$this$props.value,
          props = _objectWithoutPropertiesLoose(_value$this$props, _excluded5);

      props.type = 'file';
      props.onChange = this.handleChange;
      if (props.readOnly) props.disabled = true;
      return /*#__PURE__*/React.createElement("div", null, label && /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("div", {
        className: "rjf-file-field"
      }, this.state.value && /*#__PURE__*/React.createElement("div", {
        className: "rjf-current-file-name"
      }, "Current file: ", /*#__PURE__*/React.createElement("span", null, this.state.fileName)), this.state.value && !this.state.loading && 'Change:', this.state.loading ? /*#__PURE__*/React.createElement("div", {
        className: "rjf-file-field-loading"
      }, /*#__PURE__*/React.createElement(Loader, null), " Uploading...") : /*#__PURE__*/React.createElement("div", {
        className: "rjf-file-field-input"
      }, /*#__PURE__*/React.createElement(FormInput, _extends({}, props, {
        inputRef: this.inputRef
      })))));
    };

    return FormFileInput;
  }(React.Component);
  FormFileInput.contextType = EditorContext;
  function FormTextareaInput(_ref5) {
    var label = _ref5.label,
        inputRef = _ref5.inputRef,
        props = _objectWithoutPropertiesLoose(_ref5, _excluded6);

    delete props.type;
    if (inputRef) props.ref = inputRef;
    return /*#__PURE__*/React.createElement("div", null, label && /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("textarea", props));
  }

  function GroupTitle(props) {
    if (!props.children) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "rjf-form-group-title"
    }, props.children);
  }
  function FormRowControls(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: "rjf-form-row-controls"
    }, props.onMoveUp && /*#__PURE__*/React.createElement(Button, {
      className: "move-up",
      onClick: props.onMoveUp,
      title: "Move up"
    }, /*#__PURE__*/React.createElement("span", null, "\u2191")), props.onMoveDown && /*#__PURE__*/React.createElement(Button, {
      className: "move-down",
      onClick: props.onMoveDown,
      title: "Move down"
    }, /*#__PURE__*/React.createElement("span", null, "\u2193")), props.onRemove && /*#__PURE__*/React.createElement(Button, {
      className: "remove",
      onClick: props.onRemove,
      title: "Remove"
    }, /*#__PURE__*/React.createElement("span", null, "\xD7")));
  }
  function FormRow(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: "rjf-form-row"
    }, /*#__PURE__*/React.createElement(FormRowControls, props), /*#__PURE__*/React.createElement("div", {
      className: "rjf-form-row-inner"
    }, props.children));
  }
  function FormGroup(props) {
    var hasChildren = React.Children.count(props.children);
    var innerClassName = props.level === 0 && !hasChildren ? "" : "rjf-form-group-inner";
    return /*#__PURE__*/React.createElement("div", {
      className: "rjf-form-group"
    }, props.level === 0 && /*#__PURE__*/React.createElement(GroupTitle, null, props.schema.title), /*#__PURE__*/React.createElement("div", {
      className: innerClassName
    }, props.level > 0 && /*#__PURE__*/React.createElement(GroupTitle, null, props.schema.title), props.children, props.addable && /*#__PURE__*/React.createElement(Button, {
      className: "add",
      onClick: function onClick(e) {
        return props.onAdd();
      },
      title: "Add new"
    }, hasChildren ? 'Add more' : 'Add')));
  }

  function handleChange(e, fieldType, callback) {
    var type = e.target.type;
    var value;

    if (type === 'checkbox') {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    if (fieldType === 'number' || fieldType === 'integer') {
      value = value.trim();
      if (value === '') value = null;else if (!isNaN(Number(value))) value = Number(value);
    } else if (fieldType === 'boolean') {
      if (value === 'false' || value === false) value = false;else value = true;
    }

    callback(e.target.name, value);
  }

  function FormField(props) {
    var inputProps = {
      name: props.name,
      value: props.data,
      readOnly: props.schema.readOnly || props.schema.readonly
    };
    var type = props.schema.type;

    if (props.schema.choices) {
      inputProps.options = props.schema.choices;
      type = 'select';
    }

    if (props.schema.widget) type = props.schema.widget;
    var InputField;

    switch (type) {
      case 'string':
        InputField = FormInput;

        if (props.schema.format) {
          if (props.schema.format === 'data-url' || props.schema.format === 'file-url') {
            InputField = FormFileInput;
          }

          inputProps.type = props.schema.format;
        } else {
          inputProps.type = 'text';
        }

        break;

      case 'number':
        inputProps.type = 'number';
        InputField = FormInput;
        break;

      case 'integer':
        inputProps.type = 'number';
        inputProps.step = '1';
        InputField = FormInput;
        break;

      case 'boolean':
        inputProps.type = 'checkbox';
        InputField = FormCheckInput;
        break;

      case 'checkbox':
        inputProps.type = 'checkbox';
        InputField = FormCheckInput;
        break;

      case 'radio':
        inputProps.type = 'radio';
        InputField = FormRadioInput;
        break;

      case 'select':
        InputField = FormSelectInput;
        break;

      case 'textarea':
        InputField = FormTextareaInput;
        break;

      default:
        inputProps.type = 'text';
        InputField = FormInput;
    }

    return /*#__PURE__*/React.createElement(InputField, _extends({}, inputProps, {
      label: props.editable ? /*#__PURE__*/React.createElement("span", null, props.schema.title, " ", /*#__PURE__*/React.createElement(Button, {
        className: "edit",
        onClick: props.onEdit,
        title: "Edit"
      }, "Edit")) : props.schema.title,
      onChange: function onChange(e) {
        return handleChange(e, props.schema.type, props.onChange);
      }
    }));
  }

  function getStringFormRow(args) {
    var data = args.data,
        schema = args.schema,
        name = args.name,
        onChange = args.onChange,
        onRemove = args.onRemove,
        removable = args.removable,
        onEdit = args.onEdit,
        editable = args.editable,
        onMoveUp = args.onMoveUp,
        onMoveDown = args.onMoveDown;
    return /*#__PURE__*/React.createElement(FormRow, {
      key: name,
      onRemove: removable ? function (e) {
        return onRemove(name);
      } : null,
      onMoveUp: onMoveUp,
      onMoveDown: onMoveDown
    }, /*#__PURE__*/React.createElement(FormField, {
      data: data,
      schema: schema,
      name: name,
      onChange: onChange,
      onEdit: onEdit,
      editable: editable
    }));
  }
  function getArrayFormRow(args) {
    var data = args.data,
        schema = args.schema,
        name = args.name,
        onChange = args.onChange,
        _onAdd = args.onAdd,
        onRemove = args.onRemove,
        onMove = args.onMove,
        level = args.level;
    var rows = [];
    var groups = [];
    var removable = true;
    var min_items = schema.min_items || schema.minItems || 0;
    if (data.length <= min_items) removable = false;
    var addable = true;
    var max_items = schema.max_items || schema.maxItems || 100;
    if (data.length >= max_items) addable = false;
    var type = schema.items.type;
    if (type === 'list') type = 'array';else if (type === 'dict') type = 'object';
    var nextArgs = {
      schema: schema.items,
      onChange: onChange,
      onAdd: _onAdd,
      onRemove: onRemove,
      level: level + 1,
      removable: removable,
      onMove: onMove
    };

    var _loop = function _loop(i) {
      nextArgs.data = data[i];
      nextArgs.name = name + '-' + i;
      if (i === 0) nextArgs.onMoveUp = null;else nextArgs.onMoveUp = function (e) {
        return onMove(name + '-' + i, name + '-' + (i - 1));
      };
      if (i === data.length - 1) nextArgs.onMoveDown = null;else nextArgs.onMoveDown = function (e) {
        return onMove(name + '-' + i, name + '-' + (i + 1));
      };

      if (type === 'array') {
        groups.push(getArrayFormRow(nextArgs));
      } else if (type === 'object') {
        groups.push(getObjectFormRow(nextArgs));
      } else {
        rows.push(getStringFormRow(nextArgs));
      }
    };

    for (var i = 0; i < data.length; i++) {
      _loop(i);
    }

    var coords = name; // coordinates for insertion and deletion

    if (rows.length || !rows.length && !groups.length) {
      rows = /*#__PURE__*/React.createElement(FormGroup, {
        level: level,
        schema: schema,
        addable: addable,
        onAdd: function onAdd() {
          return _onAdd(getBlankData(schema.items), coords);
        },
        key: 'row_group_' + name
      }, rows);
    }

    if (groups.length) {
      var groupTitle = schema.title ? /*#__PURE__*/React.createElement("div", {
        className: "rjf-form-group-title"
      }, schema.title) : null;
      groups = /*#__PURE__*/React.createElement("div", {
        key: 'group_' + name
      }, groupTitle, groups.map(function (i, index) {
        return /*#__PURE__*/React.createElement("div", {
          className: "rjf-form-group-wrapper",
          key: 'group_wrapper_' + name + '_' + index
        }, /*#__PURE__*/React.createElement(FormRowControls, {
          onRemove: removable ? function (e) {
            return onRemove(name + '-' + index);
          } : null,
          onMoveUp: index > 0 ? function (e) {
            return onMove(name + '-' + index, name + '-' + (index - 1));
          } : null,
          onMoveDown: index < groups.length - 1 ? function (e) {
            return onMove(name + '-' + index, name + '-' + (index + 1));
          } : null
        }), i);
      }), addable && /*#__PURE__*/React.createElement(Button, {
        className: "add",
        onClick: function onClick(e) {
          return _onAdd(getBlankData(schema.items), coords);
        },
        title: "Add new"
      }, "Add item"));
    }

    return [].concat(rows, groups);
  }
  function getObjectFormRow(args) {
    var data = args.data,
        schema = args.schema,
        name = args.name,
        onChange = args.onChange,
        _onAdd2 = args.onAdd,
        onRemove = args.onRemove,
        level = args.level,
        onMove = args.onMove;
    var rows = [];
    var schema_keys = schema.keys || schema.properties;
    var keys = [].concat(Object.keys(schema_keys));
    if (schema.additionalProperties) keys = [].concat(keys, Object.keys(data).filter(function (k) {
      return keys.indexOf(k) === -1;
    }));

    var _loop2 = function _loop2(i) {
      var key = keys[i];
      var value = data[key];
      var childName = name + '-' + key;
      var schemaValue = schema_keys[key] || {
        type: 'string'
      };
      var type = schemaValue.type;
      if (type === 'list') type = 'array';else if (type === 'dict') type = 'object';
      if (!schemaValue.title) schemaValue.title = getVerboseName(key);
      var removable = false;
      if (schema_keys[key] === undefined) removable = true;
      var nextArgs = {
        data: value,
        schema: schemaValue,
        name: childName,
        onChange: onChange,
        onAdd: _onAdd2,
        onRemove: onRemove,
        level: level + 1,
        removable: removable,
        onMove: onMove
      };

      if (type === 'array') {
        rows.push(getArrayFormRow(nextArgs));
      } else if (type === 'object') {
        rows.push(getObjectFormRow(nextArgs));
      } else {
        nextArgs.onEdit = function () {
          return handleKeyEdit(data, key, value, childName, _onAdd2, onRemove);
        };

        nextArgs.editable = removable;
        rows.push(getStringFormRow(nextArgs));
      }
    };

    for (var i = 0; i < keys.length; i++) {
      _loop2(i);
    }

    if (rows.length || schema.additionalProperties) {
      var coords = name;
      rows = /*#__PURE__*/React.createElement(FormGroup, {
        level: level,
        schema: schema,
        addable: schema.additionalProperties,
        onAdd: function onAdd() {
          return handleKeyValueAdd(data, coords, _onAdd2);
        },
        key: 'row_group_' + name
      }, rows);
    }

    return rows;
  }

  function handleKeyValueAdd(data, coords, onAdd) {
    var key = prompt("Add new key");
    if (key === null) // clicked cancel
      return;
    key = key.trim();
    if (!key) alert("(!) Can't add empty key.\r\n\r\n‎");else if (data.hasOwnProperty(key)) alert("(!) Duplicate keys not allowed. This key already exists.\r\n\r\n‎");else onAdd("", coords + '-' + key);
  }

  function handleKeyEdit(data, key, value, coords, onAdd, onRemove) {
    var newKey = prompt("Rename key", key);
    if (newKey === null) // clicked cancel
      return;
    newKey = newKey.trim();
    if (newKey === key) // same keys
      return;
    if (!newKey) return alert("(!) Key name can't be empty.\r\n\r\n‎");else if (data.hasOwnProperty(newKey)) return alert("(!) Duplicate keys not allowed. This key already exists.\r\n\r\n‎");
    onAdd(value, name + '-' + newKey);
    onRemove(coords);
  }

  var Form = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(Form, _React$Component);

    function Form(props) {
      var _this;

      _this = _React$Component.call(this, props) || this;

      _this.populateDataInput = function () {
        _this.dataInput.value = JSON.stringify(_this.state.data);
      };

      _this.handleChange = function (coords, value) {
        /*
            e.target.name is a chain of indices and keys:
            xxx-0-key-1-key2 and so on.
            These can be used as coordinates to locate 
            a particular deeply nested item.
             This first coordinate is not important and should be removed.
        */
        coords = coords.split('-');
        coords.shift(); // remove first coord

        function setDataUsingCoords(coords, data, value) {
          var coord = coords.shift();
          if (!isNaN(Number(coord))) coord = Number(coord);

          if (coords.length) {
            setDataUsingCoords(coords, data[coord], value);
          } else {
            data[coord] = value;
          }
        }

        var _data = JSON.parse(JSON.stringify(_this.state.data));

        setDataUsingCoords(coords, _data, value);

        _this.setState({
          data: _data
        });
      };

      _this.getFields = function () {
        var data = _this.state.data;
        var formGroups = [];

        try {
          var type = _this.schema.type;
          if (type === 'list') type = 'array';else if (type === 'dict') type = 'object';
          var args = {
            data: data,
            schema: _this.schema,
            name: 'rjf',
            onChange: _this.handleChange,
            onAdd: _this.addFieldset,
            onRemove: _this.removeFieldset,
            onMove: _this.moveFieldset,
            level: 0
          };

          if (type === 'array') {
            return getArrayFormRow(args);
          } else if (type === 'object') {
            return getObjectFormRow(args);
          }
        } catch (error) {
          formGroups = /*#__PURE__*/React.createElement("p", {
            style: {
              color: '#f00'
            }
          }, /*#__PURE__*/React.createElement("strong", null, "(!) Error:"), " Schema and data structure do not match.");
        }

        return formGroups;
      };

      _this.addFieldset = function (blankData, coords) {
        coords = coords.split('-');
        coords.shift();

        _this.setState(function (state) {
          var _data = JSON.parse(JSON.stringify(state.data));

          addDataUsingCoords(coords, _data, blankData);
          return {
            data: _data
          };
        });
      };

      _this.removeFieldset = function (coords) {
        coords = coords.split('-');
        coords.shift();

        _this.setState(function (state) {
          var _data = JSON.parse(JSON.stringify(state.data));

          removeDataUsingCoords(coords, _data);
          return {
            data: _data
          };
        });
      };

      _this.moveFieldset = function (oldCoords, newCoords) {
        oldCoords = oldCoords.split("-");
        oldCoords.shift();
        newCoords = newCoords.split("-");
        newCoords.shift();

        _this.setState(function (state) {
          var _data = JSON.parse(JSON.stringify(state.data));

          moveDataUsingCoords(oldCoords, newCoords, _data);
          return {
            data: _data
          };
        });
      };

      _this.dataInput = document.getElementById(_this.props.dataInputId);
      _this.schema = props.schema;
      var _data2 = props.data;

      if (!_data2) {
        // create empty data from schema
        _data2 = getBlankData(_this.schema);
      } else {
        // data might be stale if schema has new keys, so add them to data
        try {
          _data2 = getSyncedData(_data2, _this.schema);
        } catch (error) {
          console.error("Error: Schema and data structure don't match");
          console.error(error);
        }
      }

      _this.state = {
        value: '',
        data: _data2
      }; // update data in the input

      _this.populateDataInput();

      return _this;
    }

    var _proto = Form.prototype;

    _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      if (this.state.data !== prevState.data) {
        this.populateDataInput();
      }
    };

    _proto.render = function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: "rjf-form-wrapper"
      }, /*#__PURE__*/React.createElement("fieldset", {
        className: "module aligned"
      }, /*#__PURE__*/React.createElement(EditorContext.Provider, {
        value: {
          fileUploadEndpoint: this.props.fileUploadEndpoint,
          fieldName: this.props.fieldName,
          modelName: this.props.modelName
        }
      }, this.getFields())));
    };

    return Form;
  }(React.Component);

  function addDataUsingCoords(coords, data, value) {
    var coord = coords.shift();
    if (!isNaN(Number(coord))) coord = Number(coord);

    if (coords.length) {
      addDataUsingCoords(coords, data[coord], value);
    } else {
      if (Array.isArray(data[coord])) {
        data[coord].push(value);
      } else {
        if (Array.isArray(data)) {
          data.push(value);
        } else {
          data[coord] = value;
        }
      }
    }
  }

  function removeDataUsingCoords(coords, data) {
    var coord = coords.shift();
    if (!isNaN(Number(coord))) coord = Number(coord);

    if (coords.length) {
      removeDataUsingCoords(coords, data[coord]);
    } else {
      if (Array.isArray(data)) data.splice(coord, 1); // in-place mutation
      else delete data[coord];
    }
  }

  function moveDataUsingCoords(oldCoords, newCoords, data) {
    var oldCoord = oldCoords.shift();
    if (!isNaN(Number(oldCoord))) oldCoord = Number(oldCoord);

    if (oldCoords.length) {
      moveDataUsingCoords(oldCoords, newCoords, data[oldCoord]);
    } else {
      if (Array.isArray(data)) {
        /* Using newCoords allows us to move items from 
        one array to another. 
        However, for now, we're only moving items in a 
        single array.
        */
        var newCoord = newCoords[newCoords.length - 1];
        var item = data[oldCoord];
        data.splice(oldCoord, 1);
        data.splice(newCoord, 0, item);
      }
    }
  }

  function JSONForm(config) {
    this.containerId = config.containerId;
    this.dataInputId = config.dataInputId;
    this.schema = config.schema;
    this.data = config.data;
    this.fileUploadEndpoint = config.fileUploadEndpoint;
    this.fieldName = config.fieldName;
    this.modelName = config.modelName;

    this.render = function () {
      ReactDOM.render( /*#__PURE__*/React.createElement(Form, {
        schema: this.schema,
        dataInputId: this.dataInputId,
        data: this.data,
        fileUploadEndpoint: this.fileUploadEndpoint,
        fieldName: this.fieldName,
        modelName: this.modelName
      }), document.getElementById(this.containerId));
    };
  }

  var index = {
    JSONForm: JSONForm
  };

  return index;

})));
//# sourceMappingURL=react-json-form.js.map
