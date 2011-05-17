(function($) {
  var filterOne = function(arrayLike, filterFn, transformFn) {
    var len = arrayLike.length,
        item,
        i;
    
    for(i = 0; i < len; i += 1) {
      item = (transformFn && transformFn(arrayLike[i])) || arrayLike[i];
      if(filterFn(item)) {
        return item;
      }
    }
  };

  $.filterOne = function(arrayLike, filterFn, transformFn) {
    return filterOne(arrayLike, filterFn, transformFn);
  };

  $.fn.filterOne = function(filterFn, transformFn) {
    return filterOne(this, filterFn, function(ele) {
      return $(ele);
    });
  };
})(jQuery);

(function($) {
  var valHandler = {
        handles: function($element) {
          if($element.is('input')) return true;
          return $element.is('textarea');
        },
        getValue: function($element) {
          return $element.val();
        },
        setValue: function($element, val) {
          $element.val(val || '');
        }
      },
      checkboxGroupHandler = {
        handles: function($element) {
            return $element.find(':checkbox').length !== 0;
        },
        getValue: function($element) {
            var checkedCheckboxes = $element.find(':checkbox:checked');
            return $.map(checkedCheckboxes, function(checkbox) {
                return $(checkbox).val();
            });
        }
      },
      htmlSetter = {
        handles: function($element) {
          return true;
        },
        setValue: function($element, val) {
          $element.html(val);
        }
      },
      getters = [checkboxGroupHandler, valHandler],
      setters = [valHandler, htmlSetter];

  var findElements = function($element, propertyName) {
    var selectors = [
      '#' + $.camelize(propertyName),
      '.' + $.camelize(propertyName),
      '#' + $.pascalize(propertyName),
      '.' + $.pascalize(propertyName)
    ];
    return $.filterOne(selectors, function($childElement) {
        return $childElement.length === 1;
      },
      function(selector) {
        return $element.find(selector);
    });
  };
  
  $.fn.extract = function(obj) {
    var propertyName,
        propertyValue,
        foundElements,
        getter;
    
    for(propertyName in obj) {
      foundElements = findElements(this, propertyName);
      if(foundElements) {
        getter = $.filterOne(getters, function(getterObj) {
          return getterObj.handles(foundElements);
        });
        obj[propertyName] = getter.getValue(foundElements);
      }
    }
  };

  var setPropertyValue = function(obj, $ele, callbacks, propertyName) {
    var foundElements = findElements($ele, propertyName),
        val = obj[propertyName],
        callback = callbacks && callbacks[propertyName],
        setter;
    if(foundElements) {
      setter = $.filterOne(setters, function(setterObj) {
        return setterObj.handles(foundElements);
      });
      setter.setValue(foundElements, val);
      if(callback) {
        callback(foundElements, val);
      }
    }
  };

  $.fn.inject = function(obj, callbacks) {
    Object.keys(obj).forEach(setPropertyValue.bind(this, obj, this, callbacks));
    return this;
  };

})(jQuery);
