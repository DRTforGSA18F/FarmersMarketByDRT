/*global define*/

define([
    'underscore',
    'backbone',
    'collections/seasonsCollection',
    'models/seasonModel',
    'collections/productsCollection',
    'models/productModel',
    'helpers/constants'
], function (_, Backbone, SeasonsCollection, SeasonModel, ProductsCollection,ProductModel,Constants) {
    'use strict';

    var FarmerMarketModel = Backbone.Model.extend({
        url: '',

        defaults: {
            "id":"",
            "marketName":"",
            "website":"",
            "street":"",
            "city":"",
            "county":"",
            "state":"",
            "zip":"",
            "Seasons":[],
            "lng":"",
            "lat":"",
            "location":"",
            "credit":"",
            "wic":"",
            "wicCash":"",
            "sfmnp":"",
            "snap":"",
            "products":[]
        },
        initialize: function(details) {
            this.parse(details);
        },


        validate: function(attrs, options) {
        },

        parse: function(details)  {
            this.set ({
            "id":details._id,
            "marketName":details.name,
            "website":details.website,
            "street":details.street,
            "city":details.city,
            "county":details.county,
            "state":details.state,
            "zip":details.zip,
            "Seasons": this.createSeasonCollection(details),
            "lng":details.lng,
            "lat":details.lat,
            "location":details.location,
            "credit":details.credit,
            "wic":details.WIC,
            "wicCash":details.WICcash,
            "sfmnp":details.SFMNP,
            "snap":details.SNAP,
            "products":this.createProductsCollection(details)
            });
        },
        createSeasonCollection:function(detail){
            var seasonsCollection = new SeasonsCollection();

            var self = this;
            _.each(Constants.seasonArray, function(seasonItem) {

                if (detail[seasonItem.seasonDate] && detail[seasonItem.seasonTime]) {
                    var seasonModel = new SeasonModel();
                    seasonModel.seasonDate = detail[seasonItem.seasonDate];
                    seasonModel.seasonTime = detail[seasonItem.seasonTime];
                    seasonsCollection.push(seasonModel);
                }
            });

            return seasonsCollection;
        },
        createProductsCollection:function(detail){
            var productsCollection = new ProductsCollection();

            var self = this;
            _.each(Constants.productArray, function(productItem) {

                if (detail[productItem]) {
                    var productModel = new ProductModel();
                    productModel.productName = productItem;
                    productModel.productAvailability = detail[productItem];
                    productsCollection.push(productModel);
                }
            });

            return productsCollection;

        }
    });

    return FarmerMarketModel;
});
