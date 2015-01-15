 action-ajax
===========

ActionAjax is usefull for **ajax**  submission of **forms or raw data**. you can perform ajax submission in a single line. you can use action ajax with any technology and platform. it also provide prograss bar. Progress bar will be in bootstrap format. it is fully expandable with parameters. you can change any of the default containers and element selectors. it also support triggers like call before, callback, on success or on failure.

## Requirements

- JQuery >= 1.11
- Latest browser

## Features

- Support form and raw data using data-* attributes or data in parameter
- Triggers on success / on failure and before and after request.
- Progress meter with bar

## Code Examples

-**From form**

```html
<form method="post" id="form-id">...</form>
```

```javascript
$("#form-id").actionAjax();
```

-**From Attribute data-***

```html
<a id="element-id" data-id="1" data-name="Sample" data-author="WOSD">...</a>
```

```javascript
$("#element-id").actionAjax({
                            action: 'http://example.com/action',
                            method: 'post',
                            container: '#container',
                             callback: function() {
                              ...
                            }
                            });
```

-**From Raw data**

```html
<div id="alert"></div>
<a id="element-id">...</a>
```

```javascript
$("#element-id").actionAjax({
                            action: 'http://example.com/action',
                            method: 'post',
                            container: '#container',
                            data: {id:2, name:'Sample', category:5},
                            loaderObject: '#element-id',
                            messageContainer: '#alert',
                            callback: function(param) {
                              ...
                            }
                            });
```

-**More Parameters**

```javascript
 var actionAjaxParams = {
            action // url 
            method: 'get', // method
            button: '#action-ajax-button', // id of button
            container: '#action-ajax-container', // container where to load reponse
            objectID: '#action-ajax-object', // object id or button of form
            replace: false, // replace container content if replace is trure other wise append container html
            callback: false, // trigger after requet
            callbefore: false, // trigger before request
            onerror: false, // trigger on error
            onsuccess: false, // trigger on success
            onfailure: false, // trigger on failure
            onsubmit: false, // trigger on submit
            messageContainer: null, // message container
            formReset: true, // will reset form if set to true
            progressContainer: '#action-ajax-progress-bar', // based on bootstrap
            progressMeter: '#action-ajax-progress-meter', // based on bootstrap, watch progress in percentage
            loaderObject: '#action-ajax-button', // element where to how loading bar when requet is in progres
            loaderIdentity: '.action-ajax-loader', // classs to add in ajax loader element 
            alertContainer: '.alert', // alert container class
            logError: false, // on true will log xhtr object
            errorIDPrefix: '', // error id prefix is used in case od multiple forms on same page
            data: {} // data to send in request
        };
```

## Contributing

Contributions to the **ActionAjax** are welcome.

Copyright 2015 [WOSD](http://facebook.com/)

