_context.invoke('Nittro.Extras.Flashes', function (DOM, Arrays, CSSTransitions) {

    var Service = _context.extend(function (options) {
        this._ = {
            options: Arrays.mergeTree({}, Service.defaults, options),
            globalHolder: DOM.create('div', {'class': 'nittro-flash-global-holder'})
        };

        if (typeof this._.options.layer === 'string') {
            this._.options.layer = DOM.getById(this._.options.layer);

        } else if (!this._.options.layer) {
            this._.options.layer = document.body;

        }

        this._.options.layer.appendChild(this._.globalHolder);

        if (!this._.options.positioning) {
            this._.options.positioning = Service.basicPositioning;

        }

        if (typeof this._.options.positioningOrder === 'string') {
            this._.options.positioningOrder = this._.options.positioningOrder.split(/\s*,\s*|\s+/g);
        }

        if (!this._.options.classes) {
            this._.options.classes = DOM.getData(this._.options.layer, 'flash-classes');

        }
    }, {
        STATIC: {
            defaults: {
                layer: null,
                minMargin: 20,
                positioning: null,
                positioningOrder: 'above,rightOf,below,leftOf',
                classes: null
            },
            basicPositioning: {
                above: function (target, elem, minMargin, force) {
                    var res = {
                        left: target.left + (target.width - elem.width) / 2,
                        top: target.top - elem.height
                    };

                    if (force || target.top > elem.height + minMargin && res.left > 0 && res.left + elem.width < window.innerWidth) {
                        return res;

                    }
                },
                below: function(target, elem, minMargin, force) {
                    var res = {
                        left: target.left + (target.width - elem.width) / 2,
                        top: target.bottom
                    };

                    if (force || target.bottom + elem.height + minMargin < window.innerHeight && res.left > 0 && res.left + elem.width < window.innerWidth) {
                        return res;

                    }
                },
                leftOf: function (target, elem, minMargin, force) {
                    var res = {
                        left: target.left - elem.width,
                        top: target.top + (target.height - elem.height) / 2
                    };

                    if (force || target.left > elem.width + minMargin && res.top > 0 && res.top + elem.height < window.innerHeight) {
                        return res;

                    }
                },
                rightOf: function (target, elem, minMargin, force) {
                    var res = {
                        left: target.right,
                        top: target.top + (target.height - elem.height) / 2
                    };

                    if (force || target.right + elem.width + minMargin < window.innerWidth && res.top > 0 && res.top + elem.height < window.innerHeight) {
                        return res;

                    }
                }
            }
        },
        add: function (content, type, target, rich) {
            type || (type = 'info');

            var elem = DOM.create('div', {
                'class': 'nittro-flash nittro-flash-' + type
            });

            if (target && typeof target === 'string') {
                target = DOM.getById(target);

            }

            var classes = target ? DOM.getData(target, 'flash-classes') : this._.options.classes,
                inline = target ? DOM.getData(target, 'flash-inline') : false;

            if (classes) {
                DOM.addClass(elem, classes.replace(/%type%/g, type));

            }

            if (rich) {
                DOM.html(elem, content);

            } else {
                DOM.addClass(elem, 'nittro-flash-plain');
                elem.textContent = content;

            }

            var timeout = Math.max(2000, Math.round(elem.textContent.split(/\s+/).length / 0.003));

            if (inline) {
                target.appendChild(elem);
                this._show(elem, 'inline', timeout);
                return;
            }

            if (target) {
                DOM.setStyle(elem, 'opacity', 0);
                this._.options.layer.appendChild(elem);

                var fixed = this._hasFixedParent(target),
                    elemRect = this._getRect(elem),
                    targetRect = this._getRect(target),
                    style = {},
                    positionName = DOM.getData(target, 'flash-position'),
                    position;

                if (fixed) {
                    style.position = 'fixed';

                }

                if (positionName) {
                    position = this._.options.positioning[positionName].call(null, targetRect, elemRect, this._.options.minMargin, true);

                } else {
                    for (var i = 0; i < this._.options.positioningOrder.length; i++) {
                        positionName = this._.options.positioningOrder[i];

                        if (position = this._.options.positioning[positionName].call(null, targetRect, elemRect, this._.options.minMargin)) {
                            break;

                        }
                    }
                }

                if (position) {
                    style.left = position.left;
                    style.top = position.top;

                    if (!fixed) {
                        style.left += window.pageXOffset;
                        style.top += window.pageYOffset;

                    }

                    style.left += 'px';
                    style.top += 'px';
                    style.opacity = '';

                    DOM.setStyle(elem, style);
                    this._show(elem, positionName, timeout);
                    return;

                } else {
                    DOM.setStyle(elem, 'opacity', '');
                }
            }

            this._.globalHolder.appendChild(elem);
            this._show(elem, 'global', timeout);

        },

        _show: function (elem, position, timeout) {
            DOM.addClass(elem, 'nittro-flash-show nittro-flash-' + position);

            window.setTimeout(function () {
                var foo = window.pageYOffset; // need to force css recalculation
                DOM.removeClass(elem, 'nittro-flash-show');
                this._bindHide(elem, timeout);

            }.bind(this), 1);
        },

        _bindHide: function (elem, timeout) {
            var hide = function () {
                DOM.removeListener(document, 'mousemove', hide);
                DOM.removeListener(document, 'mousedown', hide);
                DOM.removeListener(document, 'keydown', hide);
                DOM.removeListener(document, 'touchstart', hide);

                window.setTimeout(function () {
                    DOM.addClass(elem, 'nittro-flash-hide');

                    CSSTransitions.run(elem).then(function () {
                        elem.parentNode.removeChild(elem);
                    });
                }, timeout);
            }.bind(this);

            DOM.addListener(document, 'mousemove', hide);
            DOM.addListener(document, 'mousedown', hide);
            DOM.addListener(document, 'keydown', hide);
            DOM.addListener(document, 'touchstart', hide);

        },

        _hasFixedParent: function (elem) {
            do {
                if (elem.style.position === 'fixed') return true;
                elem = elem.offsetParent;

            } while (elem && elem !== document.documentElement && elem !== document.body);

            return false;

        },

        _getRect: function (elem) {
            var rect = elem.getBoundingClientRect();

            return {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                width: 'width' in rect ? rect.width : (rect.right - rect.left),
                height: 'height' in rect ? rect.height : (rect.bottom - rect.top)
            };
        }
    });

    _context.register(Service, 'Service');

}, {
    DOM: 'Utils.DOM',
    Arrays: 'Utils.Arrays',
    CSSTransitions: 'Utils.CSSTransitions'
});
