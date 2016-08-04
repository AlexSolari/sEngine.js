var $ = function Utility(selector, context) {
    var searchResult;
    if (typeof (selector) == "string")    {
        context = context || document;

        searchResult = context.querySelectorAll(selector);
    }
    else if ( typeof (selector) != "function" ){
        searchResult = selector;
    }
    else {
        window.onload = selector;
        return;
    }

    searchResult.css = function ApplyCSS(name, value) {
        var length = searchResult.length;
        for (var i = length; i--;) {
            if (typeof (name) == "string") {
                searchResult[i].style[name] = value;
            }
            else {
                var props = name;
                for (var index in props) {
                    searchResult[i].style[index] = props[index];
                }
            }
        }
        return searchResult;
    }

    searchResult.html = function ApplyHTML(value) {
        var length = searchResult.length;
        for (var i = length; i--;) {
            searchResult[i].innerHTML = value;
        }
        return searchResult;
    }

    searchResult.on = function AddEvent(event, handler) {
        var length = searchResult.length;
        for (var i = length; i--;) {
            searchResult[i]["on"+event] = handler;
        }
        return searchResult;
    }

    searchResult.append = function AppendHTML(html) {
        var length = searchResult.length;
        for (var i = length; i--;) {
            searchResult[i].innerHTML += html;
        }
        return searchResult;
    }

    searchResult.each = function Each(handler) {
        var length = searchResult.length;
        for (var i = length; i--;) {
            handler(searchResult[i], i, searchResult);
        }
        return searchResult;
    }

    return searchResult;
}