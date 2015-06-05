// Main application 
require(['config/config'], function() {
    'use strict';
    require(['jquery', 'backbone', 'jqueryui', 'respond', 'bootstrap','geocomplete',  'config/globals','routers/router', 'views/headerView', 'views/footerView',
        'backboneModelBinder', 'backboneValidation', 'helpers/validationHelper', 'backboneValidateAll', 'helpers/backboneHelper', 'blockui'],
        function($, Backbone, jqueryui, respond, bootstrap, geocomplete,globals, Router, HeaderView, FooterView,
            ModelBinder, BBValidation, ValidationHelper, BBValidateAll, backboneHelper, BlockUI) {

            $(document).ready(function() {

                //extend backbone avalidation
                _.extend(Backbone.Model.prototype, BBValidation.mixin);

                $.blockUI.defaults.message = "<h1>Please wait...</h1>";
                $(document).ajaxStart($.blockUI).ajaxSuccess($.unblockUI);
                
            	new HeaderView();
    			new FooterView();

                // initialize router
                new Router();
            });
          
        });
});