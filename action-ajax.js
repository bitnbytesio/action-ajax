/*
 * Action Ajax v1.2
 * @author: Harcharan Singh
 * @version 1.7
 * @git: https://github.com/artisangang/action-ajax
 */
if ("undefined" === typeof jQuery)
    throw new Error("Action Ajax JavaScript requires jQuery to work");

;
(function($, window, document, undefined)
{
    var aa_lastObject = false;
    var aa_currentObject = null;
    var bindedObjects = [];

    $.fn.actionAjax = function(params) {
        var actionAjaxParams = {
            action: '',
            method: 'get',
            button: '#action-ajax-button',
            sendData: {},
            container: '#action-ajax-container',
            objectID: '#action-ajax-object',
            is_form: false,
            replace: false,
            callback: false,
            callbefore: false,
            onerror: false,
            onsuccess: false,
            onfailure: false,
            onsubmit: false,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: true,
            messageContainer: null,
            formReset: true,
            progressContainer: '#action-ajax-progress-bar',
            progressMeter: '#action-ajax-progress-meter',
            loaderObject: '#action-ajax-button',
            loaderIdentity: '.action-ajax-loader',
            alertContainer: '.alert',
            logError: false,
            errorIDPrefix: '',
            objectIdenty: '',
            data: {}
        };

        // if has params load into object
        if (typeof params !== 'undefined') {
            for (key in params) {
                actionAjaxParams[key] = params[key];
            }
        }

        // remove progress bar
        removeProgress = function(actionAjaxParams) {
            $(actionAjaxParams.progressContainer).css("display", "none");
            $(actionAjaxParams.progressMeter).css("width", "0%");
            $(actionAjaxParams.progressMeter).attr("aria-valuenow", 0);
            $(actionAjaxParams.progressMeter + " > span").html("0% completed...");
        };

        send = function(actionAjaxParams) {
            // get current object identity
            aa_currentObject = $(actionAjaxParams.objectIdenty);
            // if current object is same as last object return false
            if (aa_lastObject === aa_currentObject) {
                return false;
            }
            // make current object last
            aa_lastObject = aa_currentObject;
            // remove is there is any alert box
            $(actionAjaxParams.alertContainer).remove();

            // display progress bar
            $(actionAjaxParams.progressContainer).css("display", 'block');
            // remove alert box
            $(actionAjaxParams.alertContainer).remove();
            // call before request function
            if (typeof actionAjaxParams.callbefore === 'function') {
                beforeClourse = actionAjaxParams.callbefore;
                beforeClourse(actionAjaxParams);
            }
            // loader identity
            loaderObjectIdentity = actionAjaxParams.loaderIdentity;
            loaderObjectIdentity = loaderObjectIdentity.replace(".", "");
            // append loader object
            $(actionAjaxParams.loaderObject).prepend('<span class="' + loaderObjectIdentity + '"></span>');
            // prepare for ajax request
            $.ajax({
                xhr: function()
                {
                    // prepare progress bar
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            $(actionAjaxParams.progressMeter).css("width", percentComplete + "%");
                            $(actionAjaxParams.progressMeter).attr("aria-valuenow", percentComplete);
                            $(actionAjaxParams.progressMeter + " > span").html(percentComplete + "% completed...");

                        }
                    }, false);

                    return xhr;
                },
                url: actionAjaxParams.action,
                type: actionAjaxParams.method,
                contentType: actionAjaxParams.contentType,
                processData: actionAjaxParams.processData,
                data: actionAjaxParams.sendData,
                success: function(responce) {
                    // remove old alert container
                    $(actionAjaxParams.alertContainer).remove();
                    // empty help block
                    $('.form-group').each(function(e) {
                        $(this).find('div.has-error').addClass('has-success').removeClass('has-error');
                        $('.form-group .help-block').html('');
                    });
                    if (typeof responce.hash !== "undefined")
                    {
                        window.location.hash = "!/" + responce.hash;
                    }
                    // redirect if avialable
                    if (typeof responce.redirect !== "undefined") {
                        window.location = responce.redirect;
                        return;
                    }
                    // load html if avialable
                    if (typeof responce.body !== "undefined") {
                        // load html / raw content into container
                        if (actionAjaxParams.replace === true) {
                            $(actionAjaxParams.container).html(responce.body);
                        } else {
                            $(actionAjaxParams.container).append(responce.body);
                        }
                    }
                    // load data into object
                    if (typeof responce.data !== "undefined") {
                        // load html / raw content into container
                        actionAjaxParams.data = responce.data;
                    }
                    // check for message
                    if (typeof responce.message !== "undefined") {
                        responceText = responce.message.text;
                        responceClass = responce.message.class;
                        responceMessage = '<p class="alert ' + responceClass + '">' + responceText + '</p>';
                        if (null === actionAjaxParams.messageContainer) {
                            $(actionAjaxParams.objectID).prepend(responceMessage);

                        } else {
                            $(actionAjaxParams.messageContainer).prepend(responceMessage);

                        }
                    }
                    // reset form
                    if (actionAjaxParams.formReset) {
                        $(actionAjaxParams.objectID).trigger("reset");
                    }
                    hasErrors = false;
                    // find errors
                    if (typeof responce.errors !== "undefined") {
                        hasErrors = true;
                        $.each(responce.errors, function(key, value) {
                            objectSelectorPath = "#" + actionAjaxParams.errorIDPrefix + key;
                            $(objectSelectorPath).next().html(value[0]);
                            $(objectSelectorPath).parent().before().addClass('has-error');
                        });

                    }
                    // run on success function
                    if (typeof actionAjaxParams.onsuccess === 'function') {
                        afterClouser = actionAjaxParams.onsuccess;
                        if (!hasErrors) {
                            afterClouser(actionAjaxParams);
                        }
                    }

                    return;
                }
            }).done(function() {
                $(actionAjaxParams.loaderIdentity).remove();
                runActionAjax = true;
                removeProgress(actionAjaxParams);
                aa_currentObject = null;
                // run callbak function
                if (typeof actionAjaxParams.callback === 'function') {
                    afterClouser = actionAjaxParams.callback;
                    if (!hasErrors) {
                        afterClouser(actionAjaxParams);
                    }
                }

            }).fail(function(jqXHR, textStatus, errorThrown) {
                // run on failure function
                if (typeof actionAjaxParams.onfailure === 'function') {
                    afterClouser = actionAjaxParams.onfailure;
                    if (!hasErrors) {
                        afterClouser(actionAjaxParams);
                    } else {
                        onErrorClouser = actionAjaxParams.onerror;
                        if (typeof onErrorClouser === 'function') {
                            onErrorClouser(actionAjaxParams);
                        }
                    }
                }
                // remove progress bar
                removeProgress(actionAjaxParams);
                // remove alert
                $(".alert").remove();
                responceText = "We are sorry, unable to serve requested service at the moment";
                responceClass = "alert-info";
                responceMessage = '<p class="alert ' + responceClass + '">' + responceText + '</p>';
                if (null === actionAjaxParams.messageContainer) {
                    $(actionAjaxParams.objectID).prepend(responceMessage);

                } else {
                    $(actionAjaxParams.messageContainer).prepend(responceMessage);

                }
                $(actionAjaxParams.loaderIdentity).remove();
                // log error
                if (actionAjaxParams.logError === true) {
                    console.log("fall back:-> " + jqXHR);
                    console.log("text status:-> " + textStatus);
                    console.log("error thrown:-> " + errorThrown);
                }

            });
        };

        if (!this.is("form")) {
            // call before submit function
            if (typeof actionAjaxParams.onsubmit === 'function') {
                submitClourse = actionAjaxParams.onsubmit;
                submitClourse(actionAjaxParams);
            }
            actionAjaxParams.sendData = $(this).data();
            if (typeof params !== "undefined" && typeof params.data !== "undefined") {
                actionAjaxParams.sendData = params.data;
            }
            send(actionAjaxParams);
        }

        // return if dupliate call for form
        if (indexOf.call(bindedObjects, $(this).data('uq')) >= 0) {
            return;
        }

        var uq = randomString(16);
        $(this).data('uq', uq);
        bindedObjects.push(uq);

        // default jquery event handling click / submit
        this.on('submit', function(e) {
            e.preventDefault();
            // call before submit function
            if (typeof actionAjaxParams.onsubmit === 'function') {
                submitClourse = actionAjaxParams.onsubmit;
                submitClourse(actionAjaxParams);
            }

            actionAjaxParams.objectIdenty = randomString(32);
            actionAjaxParams.button = $(this).find(':submit');
            actionAjaxParams.action = $(this).attr('action');
            actionAjaxParams.method = $(this).attr('method');
            actionAjaxParams.container = $(this).data('container') ? $(this).data('container') : actionAjaxParams.container;
            actionAjaxParams.replace = $(this).data('replace') ? $(this).data('replace') : actionAjaxParams.replace;
            if (actionAjaxParams.objectID === "#action-ajax-object") {
                actionAjaxParams.objectID = $(this);
            }
            actionAjaxParams.errorIDPrefix = $(this).data('errprefix') ? $(this).data('errprefix') : actionAjaxParams.errorIDPrefix;
            actionAjaxParams.loaderObject = $(this).data('loader') ? $(this).data('loader') : actionAjaxParams.loaderObject;
            if ($(this).attr("enctype") === "multipart/form-data") {
                actionAjaxParams.contentType = false;
                actionAjaxParams.processData = false;
                actionAjaxParams.sendData = new FormData($(this)[0]);
            } else {
                actionAjaxParams.sendData = $(actionAjaxParams.objectID).serialize();
            }
            send(actionAjaxParams);
            return false;

        });  // default jquery click/submit events
    };
    $.actionAjax = function() {
        alert("Action-Ajax 1.2 \r\n Author: Harcharan Singh");
    };





})(window.jQuery || window.Zepto, window, document);


// global functions
// for random string or find in array

function randomString(length) {
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

var indexOf = function(needle) {
    if (typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for (i = 0; i < this.length; i++) {
                if (this[i] === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle);
};
