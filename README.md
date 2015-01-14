# action-ajax
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
                            messageContainer: '#alert,
                            callback: function() {
                              ...
                            }
                            });
```

## Contributing

Contributions to the **ActionAjax** are welcome.

Copyright 2015 [WOSD](http://facebook.com/)

