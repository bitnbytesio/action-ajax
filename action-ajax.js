/*
 * Action Ajax v2
 * @author: Harcharan Singh <artisangang@gmail.com>
 * @version 2
 * @git: https://github.com/artisangang/action-ajax
 */

;(function($, window, document, undefined){

	var actionAjax = actionAjax || {};

	// global config
	var __actionAjax_globals = {
		
		queue: false,
		multiple_requests: true,
		defaults: {
				url: "",
				method: "get",
				processData: true,
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
		
	};

	// is busy or not
	var __actionAjax_working = false;

	// request queue bucket
	var __actionAjax_queue = [];
	
	function actionAjax(object, config) {

		// get global options
		var defaults = __actionAjax_globals.defaults;

		// set current object
		defaults.element = object;

		// extends config with final options
		this.config = $.extend({}, defaults, config);

		this.__temp = {};
		
		// create object identity
		this.__identity = str_rand(10);
		

		// bind action ajax event
		this.bind(object);
	
	}

	actionAjax.prototype.bind = function(object) {

		var instanse = this;
		var config = this.config;

		instanse.__temp.isForm = false;

		// if object is form bind on submit event
		if($(object).is("form")) {

			instanse.__temp.isForm = true;

			$(object).on("submit", function(e) {

				e.preventDefault();

				// set loader element for form
				if (typeof config.loader.element !== "undefined") {
					config.loader.element = $(object).find(":submit");

				}

				config.url = $(object).attr('action');
        		config.method = $(object).attr('method');
        		config.container = $(object).data('container') ? $(object).data('container') : config.container;
        		config.reset = $(object).data('reset') ? $(object).data('reset') : config.reset;
        		
        		if ($(object).attr("enctype") === "multipart/form-data") {
	                config.contentType = false;
	                config.processData = false;
	                config.data = new FormData($(object)[0]);
	            } else {
	                config.data = $(object).serialize();
	            }

	            instanse.call();

	            return false;

			});

		} 
		// otherwise check for trigger
		else if(config.trigger !== false) {

			$(object).on(config.trigger, function(e) {

				e.preventDefault();

				// set loader element for any tag
				if (typeof config.loader.element !== "undefined") {
					config.loader.element = $(object);
				}

				config.data = $.extend({}, config.data, $(object).data());

				 instanse.call();

				 return false;

			});

		} 
		// if trigger is set false
		else {

			if (typeof config.loader.element === "undefined") {
					config.loader.element = $(object);
			}

			config.data = $.extend({}, config.data, $(object).data());

			 instanse.call();

			 return false;
		}

	};

	actionAjax.prototype.loader = function(option) {


		if (option === "show") {

	    	if (typeof this.config.loader === "function") {
				var loader = this.config.loader;
				loader("show", this.config);
			}

			if (typeof this.config.loader.class !== "undefined") {
				var loader_class = this.config.loader.class;
				var loader_element = this.config.loader.element;
				var loader_html = '<span class="' + loader_class + '"></span>';
				$(loader_element).parent().append(loader_html);
			}
		}

		if (option === "hide") {

	    	if (typeof this.config.loader === "function") {
				var loader = this.config.loader;
				loader("hide", this.config);
			}

			if (typeof this.config.loader.class !== "undefined") {
				var loader_class = this.config.loader.class;
				var loader_element = this.config.loader.element;
				$("." + loader_class).remove();
			}
		}

	};

	actionAjax.prototype.progress = function(completed) {

		if (typeof this.config.progress === "function") {
			var func = this.config.progress;
			func(completed);
		} else {
			  $(this.config.progress).css("width", completed + "%");
              $(this.config.progress).attr("aria-valuenow", completed);
              $(this.config.progress).find("span").html(completed + "% completed...");
		}

	};

	actionAjax.prototype.messenger = function(message) {

		var config = this.config;
		
		var message_text = message.text;
        var message_class = message.class;
		var alertClass = config.alertClass;
		var identity = this.__identity;
        var message_object = '<p class="action-ajax-alert ' + identity + ' ' + alertClass + ' ' + message_class + '">' + message_text + '</p>';
        if (null === config.messageContainer) {
            $(config.element).prepend(message_object);

        } else {
            $(config.messageContainer).prepend(message_object);

        }
			
		if (config.autoRemoveAlert) {
			
			setTimeout(function(){
				
				$(".action-ajax-alert." + identity).fadeOut(500, function() { 
				
				$(this).remove(); 
				
				});
				
				}, config.autoRemoveAlert);
		}
		
	}
	
	actionAjax.prototype.call = function() {
		
		__actionAjax_working = true;

		var instanse = this;
		var config = instanse.config;
		var object = config.element;
		var hasErrors = false;
		var identity = instanse.__identity;
		
		// remove previous alert
		$(".action-ajax-alert." + identity).remove();
		
		// show loader
		instanse.loader("show");
        
        var beforeCallback = config.before;
        beforeCallback(config);

           
        $.ajax({
            xhr: function()
            {
                // prepare progress bar
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        instanse.progress(percentComplete);
                    }
                }, false);

                return xhr;
            },
            url: config.url,
            type: config.method,
            contentType: config.contentType,
            processData: config.processData,
            data: config.data,
            success: function(response) {

                config.response = response;
		
                if (config.raw) {
                	$(config.container).html(response);
                	return;
                }


                // find errors
                if (typeof response.errors !== "undefined") {
                    hasErrors = true;

                    if (typeof config.errorbag === "function") {
                    	var errorbag = config.errorbag;
                    	errorbag(response.errors, config);
                    } else {

	                    $.each(response.errors, function(key, value) {

	                        var inputElement = $(objectSelectorPath).find("#" + key);
	                        $(inputElement).next().html(value[0]);
	                        $(inputElement).parent().before().addClass('has-error');

	                    });
                	}

                }

                
                // change hash
                if (typeof response.hash !== "undefined")
                {
                    window.location.hash = "!/" + response.hash;
                    return;
                }

                // redirect if avialable
                if (typeof response.redirect !== "undefined") {
                    window.location = response.redirect;
                    return;
                }

                // load html if avialable
                if (typeof response.body !== "undefined") {
                
                    if (config.replace === true) {
                        $(config.container).html(response.body);
                    } else {
                        $(config.container).append(response.body);
                    }
                }
				
                // check for message
                if (typeof response.message !== "undefined") {

                	if (typeof config.messenger === "function") {
                			var messenger = config.messenger;
                			messenger(response.message);
                	} else {

	                   instanse.messenger(response.message);
                	}
                }

               

                // reset form
                if (config.reset === true && hasErrors !== false) {
                    $(config.element).trigger("reset");
                }

               
                // run on success function
                if (typeof config.success === 'function') {
                    success = config.success;
                    success(response, config);
                }

                return;
            
        }
    }).done(function() {

        	__actionAjax_working = false;

        	instanse.loader("hide");
           
            // run callbak function
            if (typeof config.after === 'function') {
                after = config.after;
                if (!hasErrors) {
                    after(config, instanse);
                }
            }

        }).fail(function(jqXHR, textStatus, errorThrown) {

        	instanse.loader("hide");

            // run on failure function
            if (typeof config.fail === 'function') {
                fail = config.fail;
                fail(config, instanse);
            }

            var message = {text: "We are sorry, unable to serve requested service.", class:"alert-danger"};

        	if (typeof config.messenger === "function") {
        			var messenger = config.messenger;
        			messenger(message);
        	} else {

               instanse.messenger(message);
        	}
        
           
            // log error
            if (config.debug === true) {
                console.log("fall back:-> " + jqXHR);
                console.log("text status:-> " + textStatus);
                console.log("error thrown:-> " + errorThrown);
            }

        });
		
	
	};

	$.fn.actionAjax = function(params) {

		var list = this;
		
		list.each(function(index){
									
			var actionAjaxObject = new actionAjax(this, params);
						
		});
		
	
	};

	$.actionAjax = function(call, option) {

		var events = {

			about: function() {
				alert("Action Ajax 2 By git@artisangang  \r\n Author: Harcharan Singh");
			},

			settings: function(option) {
				
				__actionAjax_globals = $.extend({}, __actionAjax_globals, option);
			},

			options: function(option) {
				__actionAjax_globals.defaults = $.extend({}, __actionAjax_globals.defaults, option);
			}

		};


		if (typeof events[call] === "function") {
			var func = events[call];
			func(option);
		}

	};
	
})(window.jQuery || window.Zepto, window, document);

// global function for random string
function str_rand(length) {
    chars = "aA#";
    mask = '';
    if (chars.indexOf('a') > -1) {
        mask += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (chars.indexOf('A') > -1) {
        mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (chars.indexOf('#') > -1) {
        mask += '0123456789';
    }

    var result = '';
    for (var i = length; i > 0; --i) {
        result += mask[Math.round(Math.random() * (mask.length - 1))];
    }

    return result;
}