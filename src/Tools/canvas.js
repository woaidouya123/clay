// 获取canvas2D对象
function _getCanvas2D(selector) {
    if (selector && selector.constructor === CanvasRenderingContext2D)
        return selector;
    else {
        var canvas = clay(selector);
        if (canvas.length > 0)
            return canvas[0].getContext("2d");
    }
}

// 直接使用canvas2D绘图
clay.prototype.painter = function () {
    if (this.length > 0 && (this[0].nodeName != 'CANVAS' && this[0].nodeName != 'canvas'))
        throw new Error('painter is not function');
    return _getCanvas2D(this);
};

// 使用图层绘图
clay.prototype.layer = function () {
    if (this.length > 0 && (this[0].nodeName != 'CANVAS' && this[0].nodeName != 'canvas'))
        throw new Error('layer is not function');
    // 画笔
    var painter = _getCanvas2D(this),
        canvas = [],
        // 图层集合
        layer = {};
    var width = this[0].clientWidth,//内容+内边距
        height = this[0].clientHeight;
    var layerManager = {
        "painter": function (index) {
            if (!layer[index] || layer[index].constructor !== CanvasRenderingContext2D) {

                canvas.push(document.createElement('canvas'));
                // 设置大小才会避免莫名其妙的错误
                canvas[canvas.length - 1].setAttribute('width', width);
                canvas[canvas.length - 1].setAttribute('height', height);

                layer[index] = canvas[canvas.length - 1].getContext('2d');
            }
            return layer[index];
        },
        "clean": function (ctx2D) {
            if (ctx2D) {
                if (ctx2D.constructor !== CanvasRenderingContext2D)
                    ctx2D = layerManager.painter(ctx2D);
                ctx2D.clearRect(0, 0, width, height);
            }
            return layerManager;
        },
        "update": function () {
            if (painter && painter.constructor === CanvasRenderingContext2D) {
                var flag;
                painter.clearRect(0, 0, width, height);
                painter.save();
                // 混合模式等先不考虑
                for (flag = 0; flag < canvas.length; flag++) {
                    painter.drawImage(canvas[flag], 0, 0, width, height, 0, 0, width, height);
                }
                painter.restore();
            }
            return layerManager;
        }
    };

    return layerManager;

};
