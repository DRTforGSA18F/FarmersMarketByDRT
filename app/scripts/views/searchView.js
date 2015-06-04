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
	          blur: true,
	          geocodeAfterResult: true
	        }).bind("geocode:result", function(event, result){
			    self.geocodeResult = result;
			  });

			// Maintains chainability
			return this;

		},
		displayResults:function(){

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

		            //load google maps
		            self.loadGoogleMap(self.farmersMarket);
		            //google.maps.event.addDomListener(window, 'load', self.loadGoogleMap);
	            });

		},
		getResults:function(e){
			e.preventDefault();
			this.model.clearModel();

			var data = $('#searchContainer').find('input, select').serializeObject();
			this.setModelDataAndNavigate(data);

        },
	    loadGoogleMap:function(marketCollection) {
			  //var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
			  var mapOptions = {
			          center: { lat: parseFloat(this.model.get('lat')), lng: parseFloat(this.model.get('lng'))},
			          zoom: 10
			        };
			  var map = new google.maps.Map(document.getElementById('mapcanvas'), mapOptions);
			  var centerSearch = new google.maps.Marker({
				      position: new google.maps.LatLng(parseFloat(this.model.get('lat')), parseFloat(this.model.get('lng'))),
				      map: map,
				      title: this.model.get('formattedAddress')
				  	});

			  _.each(marketCollection.models, function(market){
				  	var marker = new google.maps.Marker({
				      position: new google.maps.LatLng(parseFloat(market.get('location').coordinates[1]), parseFloat(market.get('location').coordinates[0])),
				      map: map,
				      title: market.get('marketName')
				  	});
				  	marker.setMap(map);
			  });

	      },
	    setModelDataAndNavigate: function(data) {
			data = {
				'searchLoc': data.searchLoc,
				'products': (data.products) ? (_.isArray(data.products) ? data.products.join(',') : data.products) : '',
				'dist': data.dist
			};
			this.model.set(data, {
				validate: true,
				validateAll: false,
				displaySummary: false
			});
			if (this.model.isValid(_.keys(data))) {
				this.displayResults();
			}
		},

	});

	// Returns the View class
	return SearchView;
});