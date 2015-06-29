This script enables to load next page automatically, infinitely, just by scrolling.

Like AutoPagerize(Greasemonkey Script) and AutoPager(Firefox extension).




# [Demo](http://lagoscript.org/jquery/autopager/demo) #


# [Documentation](http://lagoscript.org/jquery/autopager/documentation) #



### example: ###
```
$.autopager({
    // a selector that matches a element of next page link
    link: '#next',

    // a selector that matches page contents
    content: '.content'
});
```


### advanced example: ###
```
$.autopager({
    link   : '#next',
    content: '.content',

    // enable/disable scroll loading
    autoLoad: true,

    // initial page number 
    page: 3,
    
    // where contents would be appended.
    // use "appendTo" or "insertBefore"
    appendTo: '#content_container', 
    // insertBefore: '#footer', 

    // a callback function to be triggered when loading start 
    start: function(current, next) {
         alert(
               "Event: start\n\n" + 
               "Current.page: " + current.page + "\n\n" +
               "Current.url: " + current.url + "\n\n" +
               "Next.page: " + next.page + "\n\n" +
               "Next.url: " + next.url
         );
    },

    // a function to be executed when next page was loaded. 
    // "this" points to the element of loaded content.
    load: function(current, next) {
        alert(
            "Event: load\n\n" + 
            "Current.page: " + current.page + "\n\n" +
            "Current.url: " + current.url + "\n\n" +
            "Next.page: " + next.page + "\n\n" +
            "Next.url: " + next.url +"\n\n" +
            "Content: \n" + $(this).html()
        );
    }
});
```


### append page break: ###
```
$.autopager({
    load: function(current, next) {
        var pageBreak = '<hr/><p>Page: <a href="' + current.url + '">' + current.page + '</a></p>';
        $(this).before(pageBreak);
    }
});
```


### click loading: ###
```
$.autopager({
    // disable scroll loading
    autoLoad: false
});
$('a[rel=next]').click(function() {
    // do load
    $.autopager('load');
    return false;
});
```