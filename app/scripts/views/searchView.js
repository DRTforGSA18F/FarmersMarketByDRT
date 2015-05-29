// SearchView.js
// ----------
define([
	'jquery', 'backbone', 'selectize', 'text!templates/search.html', 'text!templates/carousel.html','text!locale/search.json', 'text!locale/es_mx/search.json',
	'text!templates/resultsSubTemplate.html',
	'collections/farmersMarketCollection','text!mockdata/market.json'
], function($, Backbone, Selectize, template, CarouselTemplate, content, contentES, ResultsSubTemplate, FarmersMarket, MockData) {
	'use strict';

	// Creates a new Backbone View class object
	var SearchView = Backbone.View.extend({

		// The Model associated with this view
		model: '',
		geocodeResult:'',
		// View constructor
		initialize: function(options) {

			// Set language attribute to support localization
			this.language = (options && options.language) || 'en_us';

		},

		// View Event Handlers
		events: {
			'click button[id="btnSearch"]': 'getResults',

		},

		// Renders the view's template to the UI
		render: function() {

			// Setting the view's template property using the Underscore template method
			this.template = _.template(template, {
				content: JSON.parse((this.language == 'en_us') ? content : contentES)
			});


			// Dynamically updates the UI with the view's template
			this.$el.html(this.template);

			this.carouselTemplate = _.template(CarouselTemplate, {});
			this.$el.find('#myCarousel').html(this.carouselTemplate)

			var self = this;
			this.$el.find("#geocomplete").geocomplete({
			  map:'#map_canvas',
	          blur: true,
	          geocodeAfterResult: true
	        }).bind("geocode:result", function(event, result){
			    self.geocodeResult = result;
			  });

			// Maintains chainability
			return this;

		},
		getResults:function(){
			$("#geocomplete").trigger("geocode");
			//set the appropriate values to the request Model
			//get the type of search
			if (this.geocodeResult.address_components.length > 1) 
			{
				//the first item in the array gives the search type values
				this.model.attributes.loc = this.geocodeResult.address_components[0].short_name;
				this.model.attributes.type = this.geocodeResult.address_components[0].types[0];
				//set the lat and long values from the geometry section
				this.model.attributes.lat = this.geocodeResult.geometry.location.A;
				this.model.attributes.lng = this.geocodeResult.geometry.location.F;

				//Set the formatted address
				this.model.attributes.formattedAddress = this.geocodeResult.formatted_address;
			}
			//Load the farmers Market collection
            this.farmersMarket = new FarmersMarket();
            this.farmersMarket.url = this.model.generateURL();
            //this.farmersMarket.parse(JSON.parse(MockData));
            var self = this;
            this.farmersMarket.fetch().done(function(){
	            //Display the results 
	            self.$el.find('#resultsContainer').html('');

	            self.resultsTemplate = _.template(ResultsSubTemplate,{
	            	collection:self.farmersMarket.toJSON()
	            });

	            self.$el.find('#resultsContainer').html(self.resultsTemplate)
            })


        }

	});

	// Returns the View class
	return SearchView;
});