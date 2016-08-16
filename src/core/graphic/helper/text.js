
    //使用默认样式

    import Style from "../../config/style"
    import {getContext} from "./viewutil"

    var st = new Style._style();

    var defaultFont = st.font;
    var defaultAlign = st.textAlign;
    var defaultBaseline = st.textBaseline;

    var _ctx = getContext();

    var TextUtil = {
        TEXT_CACHE_MAX: 5000,

        _textHeightCache: [],
        _textHeightCacheCounter: 0,

        getTextHeight: function(text, textFont) {
            textFont = textFont || defaultFont;
            var key = text + ':' + textFont;
            if (TextUtil._textHeightCache[key]) {
                return TextUtil._textHeightCache[key];
            }

            _ctx.save();
            if (textFont) {
                _ctx.font = textFont;
            }

            text = (text + '').split('\n');
            // 比较粗暴
            var height = (_ctx.measureText('国').width + 2) * text.length;

            _ctx.restore();

            TextUtil._textHeightCache[key] = height;
            if (++TextUtil._textHeightCacheCounter > TextUtil.TEXT_CACHE_MAX) {
                // 内存释放
                TextUtil._textHeightCacheCounter = 0;
                TextUtil._textHeightCache = {};
            }
            return height;
        },
        _textWidthCache: [],
        _textWidthCacheCounter: 0,

        getTextWidth: function(text, textFont) {

            textFont = textFont || defaultFont;
            var key = text + ':' + textFont;
            if (TextUtil._textWidthCache[key]) {
                return TextUtil._textWidthCache[key];
            }
            _ctx.save();

            if (textFont) {
                _ctx.font = textFont;
            }

            text = (text + '').split('\n');
            var width = 0;
            for (var i = 0, l = text.length; i < l; i++) {
                width = Math.max(
                    _ctx.measureText(text[i]).width,
                    width
                );
            }
            _ctx.restore();

            TextUtil._textWidthCache[key] = width;
            if (++TextUtil._textWidthCacheCounter > TextUtil.TEXT_CACHE_MAX) {
                // 内存释放
                TextUtil._textWidthCacheCounter = 0;
                TextUtil._textWidthCache = {};
            }

            return width;
        },
        /*
         * @param {Canvas} ctx 绘图上下文
         * @param {string} text 要获取矩形范围的文字
         * @param {number} x 绘制文字起始X座标
         * @param {number} y 绘制文字起始Y座标
         * @param {string} textFont 字体
         */
        getTextRect: function(text, x, y, textFont, textAlign, textBaseline) {

            textFont = textFont || defaultFont;
            textAlign = textAlign || defaultAlign;
            textBaseline = textBaseline || defaultBaseline;

            var width = TextUtil.getTextWidth(text, textFont);
            var lineHeight = TextUtil.getTextHeight('国', textFont);

            text = (text + '').split('\n');

            switch (textAlign) {
                case 'end':
                case 'right':
                    x -= width;
                    break;
                case 'center':
                    x -= (width / 2);
                    break;
            }

            switch (textBaseline) {
                case 'top':
                    break;
                case 'bottom':
                    y -= lineHeight * text.length;
                    break;
                default:
                    y -= lineHeight * text.length / 2;
            }

            return {
                x: x,
                y: y,
                width: width,
                height: lineHeight * text.length
            };
        }
    };


    function _fillText(ctx, text, x, y, textFont, textAlign, textBaseline) {
        if (textFont) {
            ctx.font = textFont;
        }
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        var rect = TextUtil.getTextRect(
            text, x, y, textFont, textAlign, textBaseline
        );

        text = (text + "").split("\n");

        var lineHeight = TextUtil.getTextHeight("国", textFont);

        switch (textBaseline) {
            case "top":
                y = rect.y;
                break;
            case "bottom":
                y = rect.y + lineHeight;
                break;
            default:
                y = rect.y + lineHeight / 2;
        }

        for (var i = 0, l = text.length; i < l; i++) {
            ctx.fillText(text[i], x, y);
            y += lineHeight;
        }
    }

    export default {
        fillText: _fillText,
        getTextRect: TextUtil.getTextRect,
        getTextWidth: TextUtil.getTextWidth,
        getTextHeight: TextUtil.getTextHeight
    };
