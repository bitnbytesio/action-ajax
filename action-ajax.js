/*
 * Action Ajax v2
 * @author: Harcharan Singh <artisangang@gmail.com>
 * @version 2.2
 * @git: https://github.com/artisangang/action-ajax
 */


(function ($, window, document, undefined) {

    'use strict';

    var actionAjax = actionAjax || {};

    // global config
    var __actionAjax_globals = {

        queue: false,
        multiple_requests: true,
        busy: function () {
            alert("Please wait while application is busy.");
        },
        hooks: {},
        defaults: {
            url: "",
            method: "get",
            cache: false,
            processData: true,
            headers: {},
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
            after: function () {
            },
            before: function () {
            },
            success: function () {
            },
            fail: function () {
            },
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

        var objectIdentity = object;

        if (typeof $(object).attr('id') !== 'undefined') {
            objectIdentity = "#" + $(object).attr('id');
        }

        // set current object
        defaults.element = objectIdentity;

        // extends config with final options
        this.config = $.extend({}, defaults, config);

        this.__temp = {};

        // create object identity
        this.__identity = str_rand(10);


        // bind action ajax event
        this.bind(defaults.element);

    }

    actionAjax.prototype.bind = function (object) {


        var instanse = this;
        var config = this.config;
        var object = object;

        instanse.__temp.isForm = false;

        // if object is form bind on submit event
        if ($(object).is("form")) {

            instanse.__temp.isForm = true;

            instanse.setupForm(object);

            if (config.trigger === true) {

                $(document).on("submit", object, function (e) {

                    e.preventDefault();

                    instanse.setupForm(object);

                    instanse.call();

                    return false;

                });
            } else {
                instanse.call();
            }

        }
        // otherwise check for trigger
        else if (config.trigger !== false) {

            $(object).on(config.trigger, function (e) {

                e.preventDefault();

                // set loader element for any tag
                if (typeof config.loader.element !== "undefined") {
                    config.loader.element = $(object);
                }

                config.data = $.extend({}, config.data, $(object).data());
                config.container = $(object).data('container') ? $(object).data('container') : config.container;

                instanse.call();

                return false;

            });

        }
        // if trigger is set false
        else {

            if (typeof config.loader.element === "undefined") {
                config.loader.element = $(object);
            }

            if (typeof config.data === "object") {
                config.data = $.extend({}, config.data, $(object).data());
            }

            config.container = $(object).data('container') ? $(object).data('container') : config.container;

            instanse.call();

            return false;
        }

    };

    actionAjax.prototype.setupForm = function (object) {

        var instanse = this;
        var config = instanse.config;

        // set loader element for form
        if (typeof config.loader.element !== "undefined") {
            config.loader.element = $(object).find(":submit");

        }

        config.url = $(object).attr('action') ? $(object).attr('action') : config.url;
        config.method = $(object).attr('method') ? $(object).attr('method') : config.method;
        config.container = $(object).data('container') ? $(object).data('container') : config.container;
        config.reset = $(object).data('reset') ? $(object).data('reset') : config.reset;

        if ($(object).attr("enctype") === "multipart/form-data") {
            config.contentType = false;
            config.processData = false;
            config.data = new FormData($(object)[0]);
        } else {
            config.data = $(object).serialize();
        }
    }

    actionAjax.prototype.loader = function (option) {


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

    actionAjax.prototype.progress = function (completed) {

        var config = this.config;

        if (typeof config.progress === "function") {
            var func = config.progress;
            func(completed);
        } else {

            $(config.progress).find('.progress-bar').css("width", completed + "%");
            $(config.progress).find('.progress-bar').attr("aria-valuenow", completed);
            $(config.progress).find('.progress-bar > span').html(completed + "% completed...");
        }

    };

    actionAjax.prototype.messenger = function (message) {

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

            setTimeout(function () {

                $(".action-ajax-alert." + identity).fadeOut(500, function () {

                    $(this).remove();

                });

            }, config.autoRemoveAlert);
        }

    };

    actionAjax.prototype.processQueue = function () {

        if (__actionAjax_queue.length >= 1) {

            var requestNow = __actionAjax_queue[0];
            __actionAjax_queue = __actionAjax_queue.slice(0, 1);
            var instanse = requestNow.request_object;
            instanse.call(true);

        }

    };

    actionAjax.prototype.processCallbacks = function (callbacks) {

        if (typeof callbacks !== 'undefined' && callbacks.length > 0) {

            for (var index in callbacks) {

                if (typeof callbacks.trigger === 'undefined') {
                    continue;
                } else {
                    var curCall = callbacks.trigger;
                    var curParams = callbacks.with;

                    curCall(curParams);
                }

            }

        }

    }

    actionAjax.prototype.call = function (is_queue) {

        var instanse = this;
        var config = instanse.config;
        var object = config.element;
        var hasErrors = false;
        var identity = instanse.__identity;

        var is_queue = is_queue || false;

        if (is_queue === false && __actionAjax_globals.multiple_requests === true && __actionAjax_globals.queue === true) {
            var queueObject = {request_identity: identity, request_object: instanse};
            __actionAjax_queue.push(queueObject);
            if (__actionAjax_queue.length >= 1) {
                return;
            }
        }

        if (__actionAjax_globals.multiple_requests === false && __actionAjax_working === true) {
            var busyCallback = __actionAjax_globals.busy;
            busyCallback();
            return;
        }


        __actionAjax_working = true;


        // remove previous alert
        $(".action-ajax-alert." + identity).remove();

        // show loader
        instanse.loader("show");
        $(config.progress).show();

        var beforeCallback = config.before;
        beforeCallback(config);

        var mergedHeadres = $.extend({}, {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr('content')
        }, config.headers);

        $.ajax({
            xhr: function () {
                // prepare progress bar
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        instanse.progress(percentComplete);
                    }
                }, false);

                return xhr;
            },
            headers: mergedHeadres,
            url: config.url,
            type: config.method,
            contentType: config.contentType,
            processData: config.processData,
            data: config.data,
            cache: config.cache,
            success: function (response) {

                if (typeof response.callback !== 'undefined' && typeof response.callback.trigger !== 'undefined' && typeof __actionAjax_globals.hooks[response.callback.trigger] !== 'undefined') {
                    var actions = __actionAjax_globals.hooks[response.callback.trigger];
                    for (var index in actions) {
                        actions[index](response.callback.with)
                    }
                }

                if ($(object).is("form") && typeof config.errorbag !== "function") {
                    $(object).find('.has-error').each(function () {

                        $(this).removeClass('has-error');
                        $(this).find('.help-block').html('');

                    });
                }


                config.response = response;

                // change hash
                if (typeof response.hash !== "undefined") {
                    window.location.hash = "!/" + response.hash;
                    return;
                }

                // redirect if avialable
                if (typeof response.redirect !== "undefined") {
                    window.location = response.redirect;
                    return;
                }

                if (typeof response.refresh === "boolean" && response.refresh == true) {
                    window.location.reload();
                    return;
                }

                if (config.raw === true) {
                    $(config.container).html(response);

                }

                if (config.raw === false) {

                    // find errors
                    if (typeof response.errors !== "undefined") {
                        hasErrors = true;

                        if (typeof config.errorbag === "function") {
                            var errorbag = config.errorbag;
                            errorbag(response.errors, config);
                        } else {

                            config.errorbag = response.errors;

                            $.each(response.errors, function (key, value) {

                                var inputElement = $(config.element).find("[name=" + key + "]");
                                $(inputElement).next('.help-block').html(value[0]);
                                $(inputElement).parent().before().addClass('has-error');

                            });
                        }

                    } else {
                        // reset form
                        if (config.reset === true && $(object).is("form")) {
                            $(object).trigger("reset");
                        }
                    } // error handling end


                    // load html if avialable
                    if (typeof response.body !== "undefined") {

                        if (config.append === false) {
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

                } // process json

                // run on success function
                if (typeof config.success === 'function') {
                    var success = config.success;
                    success(response, config);
                }

                return;

            }
        }).done(function () {

            __actionAjax_working = false;

            instanse.loader("hide");

            instanse.processQueue();

            $(config.progress).hide();

            // run callbak function
            if (typeof config.after === 'function') {
                var after = config.after;
                if (!hasErrors) {
                    after(config, instanse);
                }
            }

        }).fail(function (jqXHR, textStatus, errorThrown) {

            __actionAjax_working = false;

            instanse.loader("hide");

            // run on failure function
            if (typeof config.fail === 'function') {
                var fail = config.fail;
                fail(config, instanse);
            }

            var message = {text: "We are sorry, unable to serve requested service.", class: "alert-danger"};

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

    $.fn.actionAjax = function (params) {

        var list = this;

        list.each(function (index) {

            var actionAjaxObject = new actionAjax(this, params);

        });


    };

    $.actionAjax = function (call, option) {

        var events = {

            about: function () {
                alert("Action Ajax 2 By git@artisangang  \r\n Author: Harcharan Singh");
            },

            settings: function (option) {

                __actionAjax_globals = $.extend({}, __actionAjax_globals, option);
            },

            options: function (option) {
                __actionAjax_globals.defaults = $.extend({}, __actionAjax_globals.defaults, option);
            },

            hook: function (option) {
                var hooks = __actionAjax_globals.hooks;

                if (typeof hooks[option.name] == 'undefined' && typeof option.action !== 'undefined') {
                    __actionAjax_globals.hooks[option.name] = [options.action];
                } else if (typeof option.action !== 'undefined') {
                    __actionAjax_globals.hooks[option.name].push(options.action);
                }
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
    var mask = '';
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
