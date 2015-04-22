/*
 * Action Ajax v2
 * @author: Harcharan Singh
 * @version 2
 * @git: https://github.com/artisangang/action-ajax
 */

;(function(){

	var actionAjax = actionAjax || {};
	
	function actionAjax(config) {
		
		var defaults = {
				url: "",
				method: "get",
				trigger: "click",
				container: "#action-ajax-container",
				append: false,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8", 
				after: function() {},
				before: function() {},
				success: function() {},
				fail: function() {},
				
			};
		
		this.config = $.extend({}, defauls, config);
	
	}
	
	actionAjax.prototype.call = function() {
	
		
	
	};
	
});