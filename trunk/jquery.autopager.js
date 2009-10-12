/*
 * Automatic paging plugin for jQuery
 *
 * Copyright (c) lagos
 * Dual licensed under the MIT and GPL licenses.
 *
 * @auther  lagos
 * @version 1.0.0
 */
(function($) {
    var window = this, options = {},
        content, currentUrl, nextUrl,
        active = false;

    $.autopager = function(_options) {
        if (typeof _options === 'string' && $.isFunction(this.autopager[_options])) {
            var args = Array.prototype.slice.call(arguments, 1);
            return this.autopager[_options].apply(this.autopager, args);
        }

        _options = $.extend({
            autoLoad: true,
            page: 1,
            content: '.content',
            link: 'a[rel=next]',
            insertBefore: null, 
            appendTo: null, 
            start: function() {},
            load: function() {},
            disabled: false
        }, _options);
        this.autopager.option(_options);

        content = $(_options.content).filter(':last');
        if (content.length) {
            if (!_options.insertBefore && !_options.appendTo) {
                var insertBefore = content.next();
                if (insertBefore.length) {
                    set('insertBefore', insertBefore);
                } else {
                    set('appendTo', content.parent());
                }
            }
        }

        setUrl();

        return this;
    };

    $.extend($.autopager, {
        option: function(key, value) {
            var _options = key;

            if (typeof key === "string") {
                if (value === undefined) {
                    return options[key];
                }
                _options = {};
                _options[key] = value;
            }

            $.each(_options, function(key, value) {
                set(key, value);
            });
        },

        enable: function() {
            set('disabled', false);
        },

        disable: function() {
            set('disabled', true);
        },

        destroy: function() {
            this.autoLoad(false);
            options = {};
            content = currentUrl = nextUrl = undefined;
        },

        autoLoad: function(value) {
            if (value === undefined) {
                return options.autoLoad;
            }
            set('autoLoad', value);
        },

        load: function() {
            if (active || !nextUrl || options.disabled) {
                return;
            }

            active = true;
            options.start(currentHash(), nextHash());
            $.get(nextUrl, insertContent);
        }

    });

	function set(key, value) {
		switch (key) {
			case 'autoLoad':
                if (value && !options.autoLoad) {
                    $(window).scroll(loadOnScroll);
                } else if (!value && options.autoLoad) {
                    $(window).unbind('scroll', loadOnScroll);
                }
                break;
            case 'insertBefore':
                if (value) {
                    options.appendTo = null;
                }
                break
            case 'appendTo':
                if (value) {
                    options.insertBefore = null;
                }
                break
		}
		options[key] = value;
	}

    function setUrl(context) {
        currentUrl = nextUrl || window.location.href;
        nextUrl = $(options.link, context).attr('href');
    }

    function loadOnScroll() {
        if (content.offset().top + content.height() < $(document).scrollTop() + $(window).height()) {
            $.autopager.load();
        }
    }

    function insertContent(res) {
        var _options = options,
            nextPage = $('<div/>').append(res.replace(/<script(.|\s)*?\/script>/g, "")),
            nextContent = nextPage.find(_options.content); 

        set('page', _options.page + 1);
        setUrl(nextPage);
        if (nextContent.length) {
            if (_options.insertBefore) {
                nextContent.insertBefore(_options.insertBefore);
            } else {
                nextContent.appendTo(_options.appendTo);
            }
            _options.load.call(nextContent.get(), currentHash(), nextHash());
            content = nextContent.filter(':last');
        }
        active = false;
    }

    function currentHash() {
        return {
            page: options.page,
            url: currentUrl
        };
    }

    function nextHash() {
        return {
            page: options.page + 1,
            url: nextUrl
        };
    }
})(jQuery);
