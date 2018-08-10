(function (window, $$, undefined) {

    'use strict';

    var toNode = function (namespace, param) {

        if (param && (param.nodeType === 1 || param.nodeType === 11 || param.nodeType === 9)) {
            return param;
        } else if (param && typeof param === 'string') {
            if (/^[\w\d-]+$/.test(param)) {
                if (namespace === 'svg') {
                    return document.createElementNS($$.namespace.svg, param);
                } else {
                    return document.createElement(param);
                }
            } else {
                var frameDiv;
                if (namespace === 'svg') {
                    frameDiv = document.createElementNS($$.namespace.svg, 'svg');
                } else {
                    frameDiv = document.createElement("div");
                }
                frameDiv.innerHTML = param;
                return $$.selectAll(frameDiv).children().collection[0];
            }
        } else {
            throw new Error('Unexcepted Error!');
        }

    };

    // 在被选元素内部的结尾插入内容
    $$.node.prototype.append = function (param) {
        var flag, node;
        if (this._collection && this._collection.enter) {
            for (flag = 0; flag < this._collection.enter.length; flag++) {
                node = toNode(this.namespace, param);
                node._data = this._collection.enter[flag];
                $$.selectAll(this.content).append(node);
                this.collection.push(node);
            }
            delete this._collection;
            this.size = this.collection.length;
        } else {
            for (flag = 0; flag < this.size; flag++) {
                node = toNode(this.namespace, param);
                this.collection[flag].appendChild(node);
            }
        }
        return this;

    };

    // 在被选元素内部的开头插入内容
    $$.node.prototype.prepend = function (param) {

        var flag, node;
        if (this._collection && this._collection.enter) {
            for (flag = 0; flag < this._collection.enter.length; flag++) {
                node = toNode(this.namespace, param);
                node._data = this._collection.enter[flag];
                $$.selectAll(this.content).prepend(node);
                this.collection.push(node);
            }
            delete this._collection;
            this.size = this.collection.length;
        } else {
            for (flag = 0; flag < this.size; flag++) {
                node = toNode(this.namespace, param);
                this.collection[flag].insertBefore(node, this.clone().eq(flag).children().collection[0]);
            }
        }
        return this;

    };

    // 在被选元素之后插入内容
    $$.node.prototype.after = function (param) {

        var flag, node;
        if (this._collection && this._collection.enter) {
            for (flag = 0; flag < this._collection.enter.length; flag++) {
                node = toNode(this.namespace, param);
                node._data = this._collection.enter[flag];
                $$.selectAll(this.content).after(node);
                this.collection.push(node);
            }
            delete this._collection;
            this.size = this.collection.length;
        } else {
            for (flag = 0; flag < this.size; flag++) {
                node = toNode(this.namespace, param);
                this.clone().eq(flag).parent().collection[0].insertBefore(node, this.clone().eq(flag).next().collection[0]);
            }
        }
        return this;

    };

    // 在被选元素之前插入内容
    $$.node.prototype.before = function (param) {

        var flag, node;
        if (this._collection && this._collection.enter) {
            for (flag = 0; flag < this._collection.enter.length; flag++) {
                node = toNode(this.namespace, param);
                node._data = this._collection.enter[flag];
                $$.selectAll(this.content).before(node);
                this.collection.push(node);
            }
            delete this._collection;
            this.size = this.collection.length;
        } else {
            for (flag = 0; flag < this.size; flag++) {
                node = toNode(this.namespace, param);
                this.clone().eq(flag).parent().collection[0].insertBefore(node, this.collection[flag]);
            }
        }
        return this;

    };

    // 删除被选元素（及其子元素）
    $$.node.prototype.remove = function () {

        var flag;
        for (flag = 0; flag < this.size; flag++) {
            this.clone().eq(flag).parent().collection[0].removeChild(this.collection[flag]);
        }
        return this;

    };

    // 从被选元素中删除子元素
    $$.node.prototype.empty = function () {

        var flag;
        for (flag = 0; flag < this.size; flag++) {
            this.collection[flag].innerHTML = '';
        }
        return this;

    };

    // 用于设置/获取属性值
    $$.node.prototype.attr = function (name, val, isInner) {

        if (!name || typeof name !== 'string') {
            throw new Error('The name is invalid!');
        } else if (val === null || val === undefined) {
            return this.size > 0 ? this.collection[0].getAttribute(name) : undefined;
        } else {
            var flag, target;
            if (!isInner && this._animation.transition && typeof this._animation.attrback[name] === 'function') {//如果需要过渡设置值
                for (flag = 0; flag < this.size; flag++) {
                    // 结点对象，序号，起始值，终止值，过渡时间，过渡方式
                    target = this.clone().eq(flag);
                    this._animation.attrback[name](name, target, flag, target.attr(name), typeof val === 'function' ? val(this.collection[flag]._data, flag) : val, this._animation.duration, this._animation.ease);
                }
            } else {
                for (flag = 0; flag < this.size; flag++) {
                    // 目前先不考虑针对特殊属性，比如svg标签的href和title等需要在指定的命名空间下，且前缀添加「xlink:」的情况
                    this.collection[flag].setAttribute(name, typeof val === 'function' ? val(this.collection[flag]._data, flag) : val);
                }
            }
            return this;
        }

    };

    // 用于设置/获取样式
    $$.node.prototype.css = function (name, style) {

        if (arguments.length <= 1 && typeof name !== 'object') {
            if (this.size < 1) {
                return undefined;
            }
            var allStyle;
            // 获取结点全部样式
            if (document.defaultView && document.defaultView.getComputedStyle) {
                allStyle = document.defaultView.getComputedStyle(this.collection[0], null);
            } else {
                allStyle = this.collection[0].currentStyle;
            }
            // 返回样式
            if (typeof name === 'string') {
                return allStyle.getPropertyValue(name);
            } else {
                return allStyle;
            }
        } else if (this.size > 0) {
            if (typeof name === 'object') {
                var flag, key;
                for (key in name) {
                    for (flag = 0; flag < this.size; flag++) {
                        this.collection[flag].style[key] = name[key];
                    }
                }
            } else {
                this.collection[0].style[name] = style;
            }
        }
        return this;
    };

})(window, window.quickES);