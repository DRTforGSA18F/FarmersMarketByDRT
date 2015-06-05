define([], function() {
    'use strict';

    // JavaScript constants for the application
    var Constants = {

        seasonArray: [{
            'seasonDate': 'season1Date',
            'seasonTime': 'season1Time'
        }, {
            'seasonDate': 'season2Date',
            'seasonTime': 'season2Time'
        }, {
            'seasonDate': 'season3Date',
            'seasonTime': 'season3Time'
        }, {
            'seasonDate': 'season4Date',
            'seasonTime': 'season4Time'
        }],

        productArray:['bakedgoods','cheese','crafts','flowers','eggs','seafood','herbs','vegetables','honey','jams','maple','meat','nursery','nuts','plants','poultry','prepared','soap','trees','wine'],

        //GeoCode type constants
        geocodeTypeZip: 'postal_code',
        geocodeTypeCity: 'locality',
        geocodeTypeCounty: 'administrative_area_level_2',
        geocodeTypeState: 'administrative_area_level_1',

        searchTypeZip: 'zip',
        searchTypeState: 'state',
        searchTypeCounty: 'county',
        searchTypeCity: 'city',
        searchTypeProximity: 'proximity',

        locationErrorMessage: 'Error: Enter a location',
        minLengthErrorMessage: 'Error: Enter at least two characters',
        invalidCharErrorMessage: 'Error: Remove invalid characters',
        invalidLocSearchErrorMessage: 'Error: Enter a valid ZIP Code or City, State or State',
    };

    //Returns the Constants object
    return Constants;
});