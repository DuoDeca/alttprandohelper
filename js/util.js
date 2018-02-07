(function(window) {
    'use strict';

    var slice = Array.prototype.slice;

    window.at = function(key, value) {
        return function(o) { return o[key] = value, o; }({});
    };

    window.cast_array = function(value) {
        return Array.isArray(value) ? value : [value];
    };

    window.compact = function(array) {
        if (array == null) return [];
        return array.reduce(function(acc, value) {
            return value ? acc.concat(value) : acc;
        }, []);
    };

    window.counter = function(value, delta, max, min) {
        min = min || 0;
        value += delta;
        if (value > max) value = min;
        if (value < min) value = max;
        return value;
    };

    window.create = function(proto, props) {
        var result = Object.create(proto);
        return props != null ? Object.assign(result, props) : result;
    };

    window.filter = function(collection, iteratee) {
        return collection == null ? [] :
            Array.isArray(collection) ?
                collection.filter(iteratee) :
                Object.keys(collection).reduce(function(result, key) {
                    var value = collection[key];
                    if (iteratee(value, key, collection)) result.push(value);
                    return result;
                }, []);
    };

    window.flatten = function(array) {
        return array.reduce(function(result, value) { return result.concat(value); }, []);
    };

    window.get = function(object, path) {
        return object == null ? object : path.reduce(
            function(object, step) { return object && object[step]; },
            object);
    };

    window.map = function(collection, iteratee) {
        return collection == null ? [] :
            Array.isArray(collection) ?
                collection.map(iteratee) :
                Object.keys(collection).map(function(key) {
                    return iteratee(collection[key], key, collection);
                });
    };

    window.map_values = function(object, iteratee) {
        var result = {};
        Object.keys(object).forEach(function(key) {
            result[key] = iteratee(object[key], key, object);
        });
        return result;
    }

    window.max_by = function(array, iteratee) {
        var result = (Array.isArray(array) ? array : []).reduce(function(x, value) {
            var current = iteratee(value);
            return current != null && (x.computed == null || current > x.computed) ?
                { computed: current, value: value } : x;
        }, { computed: null, value: null });
        return result.value;
    };

    window.not = function(predicate) {
        return function() {
            return !predicate.apply(this, arguments);
        };
    };

    window.partition = function(collection, iteratee) {
        var values = Array.isArray(collection) ? collection : map(collection, identity);
        return values.reduce(function(result, value) {
            return result[iteratee(value) ? 0 : 1].push(value), result;
        }, [[],[]]);
    };

    function identity(v) { return v; }

    window.partial = function(func, partials) {
        partials = slice.call(arguments, 1);
        return function(args) {
            args = slice.call(arguments);
            return func.apply(this, partials.concat(args));
        }
    };

    window.property = function(key) {
        return function(object) { return object[key]; };
    };

    window.result = function(key) {
        return function(object) {
            var value = object[key];
            return typeof value === 'function' ? value.call(object) : value;
        }
    };

    window.sum = function(array) {
        return array.reduce(function(acc, value) { return acc + value; });
    }

    // based on https://github.com/medialize/URI.js/blob/gh-pages/src/URI.js
    window.uri_query = memoize(function() {
        var q, href = location.href + '',
            qi = href.indexOf('?'),
            hi = href.indexOf('#');

        q = hi >= 0 ? href.substring(0, hi) : href;
        q = qi >= 0 ? q.substring(qi) : '';

        // clean out leading question, trim amps, and consecutive amps
        return q.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '')
            .split('&').reduce(function(items, param) {
                if (!param) return items;
                var name, value,
                    v = param.split('=', 2);
                name = decodeURIComponent(v.shift());
                value = v[0] ? decodeURIComponent(v.shift()) : true;
                items[name] = value;
                return items;
            }, {});
    });

    function memoize(func) {
        var memoized = function(value) {
            var cache = memoized._cache;
            return cache[value] || (cache[value] = func(value));
        };
        memoized._cache = {};
        return memoized;
    };

    window.valid_css_color = function(text) {
        if (!text || text === 'inherit' || text === 'transparent') return false;
        var e1 = document.createElement('div'),
            e2 = document.createElement('div');
        e1.style.color = 'rgb(0,0,0)';
        e1.style.color = text;
        e2.style.color = 'rgb(255,255,255)';
        e2.style.color = text;
        return e1.style.color.replace(/ /g, '') !== 'rgb(0,0,0)' ||
            e2.style.color.replace(/ /g, '') !== 'rgb(255,255,255)';
    };
}(window));
