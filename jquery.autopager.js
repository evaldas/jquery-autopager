/*
 * AutoPager plugin for jQuery
 *
 * Copyright (c) 2009 lagos
 * Dual licensed under the MIT and GPL licenses.
 *
 * @auther  lagos
 * @version 0.1.0
 */
(function($) {
    $.autopager = function(options) {
        var nextPageUrl;
        var requestedPages = [location.href];
        if ($.browser.msie) {
             var scrollTopElement = $('html');
             var heightElement = $(document);
        } else {
             var scrollTopElement = $(document);
             var heightElement = $('html');
        }

        options = $.extend({
            insertBefore: $(options.pageElement).next(),
            pagingPoint: 350,
            success: function() {}
        }, options);

        setNextPageUrl();

        $(window).scroll(function(){
            if (nextPageUrl && $.inArray(nextPageUrl, requestedPages) < 0 && scrollHeightRemain() < options.pagingPoint) {
                requestedPages.push(nextPageUrl);
                $.get(nextPageUrl, function(data){
                    var nextPage = $('<div/>').html(data);
                    setNextPageUrl(nextPage);
                    insertPageElement(nextPage);
                    options.success(requestedPages.length);
                });
            }
        });

        return this;

        function setNextPageUrl(context) {
            var args = [options.nextLink];
            if (context) args.push(context);
            nextPageUrl = $.apply(null, args).attr('href');
        }

        function insertPageElement(context) {
            var pageElement = $(options.pageElement, context); 
            if (pageElement) pageElement.insertBefore(options.insertBefore);
        }

        function scrollHeightRemain() {
            return heightElement.height() - scrollTopElement.scrollTop() - $(window).height();
        }
    };
})(jQuery);

