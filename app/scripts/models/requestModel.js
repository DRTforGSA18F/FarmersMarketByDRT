// RequestModel.js
// ----------
define([
	'jquery', 'backbone','helpers/constants'
], function($, Backbone,Constants) {
	'use strict';

	// Creates a new Backbone Model class object
	var RequestModel = Backbone.Model.extend({

		// Default values for all of the Model attributes
		defaults: {
            type: '',
            loc: '',
            lat: '',
            lng: '',
            dist: '0',
            state: '',
            stateName: '',
            county: '',
            formattedAddress:'',
            products:'',
            searchLoc:''
		},
		clearModel: function() {
			this.set({
	            type: '',
	            loc: '',
	            lat: '',
	            lng: '',
	            dist: '0',
	            state: '',
	            stateName: '',
	            county: '',
	            formattedAddress:'',
	            products:'',
	            searchLoc:''
			});
		},
		generateURL:function(){
			var url;

			url=(this.get('type') === Constants.geocodeTypeZip)? Constants.searchTypeZip + '&zip=' + this.get('loc'): Constants.searchTypeProximity + '&lat=' + this.get('lat') + '&lng=' + this.get('lng') ;
			//Add the distance and filter criteria
			url = url + '&dist=' + this.get('dist') ;
			if (this.get('products')){
				url = url + "&products=" + this.get('products');
			}

			url = window.gblServiceApi + url;
			return url;
		},
		    // rules to validate 
	    validation: {
	      searchLoc: {
	        fn: 'validateSearchLoc'
	      }
	    },
        //this rule will validate search location attribute before setting the value
        validateSearchLoc: function(value, attr, computedState) {
            if (!value) {
                return Constants.locationErrorMessage;
            }
            if (value) {
                if (this.validateMinLength(value)) {
                    return Constants.minLengthErrorMessage;
                } else if (!(this.validateSpecChar(value))) {
                    return Constants.invalidCharErrorMessage;
                } 
            }
        },	
        validateMinLength: function(value) {
            return (value.length < 2) ? true : false;
        },

        validateSpecChar: function(value) {
        	var name = /^\s*[0-9\A-Za-z\-\/@&,.#()\'\"\s]*\s*$/
            return name.test(value) && (value.indexOf('#') === -1);
        },    
	});

	// Returns the Model class
	return RequestModel;
});