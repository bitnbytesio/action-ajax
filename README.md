 action-ajax
===========
**Note: This branch is for development. If we have anything new, we will update it on master**

ActionAjax is usefull for **ajax**  submission of **forms or raw data**. you can perform ajax submission in a single line. you can use action ajax with any technology and platform. it also provide prograss bar. Progress bar will be in bootstrap format. it is fully expandable with parameters. you can change any of the default containers and element selectors. it also support triggers like call before, callback, on success or on failure.

## Requirements

- JQuery >= 1.11
- Latest browser

## Features

- Support form and raw data using data-* attributes or data in parameter
- Triggers on success / on failure and before and after request.
- Progress meter (Bootstrap)

**Global Config**

```javascript
// enable queue mode or multiple requests
$.actionAjax("settings", {
 queue: false,
 multiple_requests: true
 });

// use can define any parameter (from below list of parameter) as default for all ajax calls
$.actionAjax("options", {
 method:"post", 
 action:"http://www.example.com",
 });
```

**Parameters**

```javascript
 defaults: {
				url: "",
				method: "get",
				cache: false,
				processData: true,
				headers:{},
				raw: false,
				trigger: "click",
				reset: true,
				element: null,
				data: {},
				response: null,
				alertClass: "alert",
				autoRemoveAlert: 10000,
				container: "#action-ajax-container",
				loader: {class: "action-ajax-loader", element: null},
				messageContainer: null,
				append: false,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8", 
				after: function() {},
				before: function() {},
				success: function() {},
				fail: function() {},
				progress: ".progress",
				messenger: false,
				errorbag: false, 
				debug: false
				
			}
```
## Contributing

Contributions to the **ActionAjax** are welcome.

Copyright 2015 [WOSD](http://facebook.com/)

