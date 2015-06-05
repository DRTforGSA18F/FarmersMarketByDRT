define(['jquery', 'underscore', 'backbone', 'backboneValidation'],
    function($, _, Backbone, backboneValidation) {
        'use strict';
        $.fn.serializeObject = function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };
 
        //barrowed from greg franco
        Backbone.Model.prototype._validate = function(attrs, options) {
            if (!options.validate || !this.validate) {
                return true;
            }
            if (options.validateAll !== false) {
                attrs = _.extend({}, this.attributes, attrs);
            }
            var error = this.validationError = this.validate(attrs, options) || null;
            if (!error) {
                return true;
            }
            this.trigger('invalid', this, error, _.extend(options || {}, {
                validationError: error
            }));
            return false;
        };

        //this function will bind the modelBinder and validation 
        Backbone.View.prototype.ModelBindAndValidation = function(model, rootEL, bindings) {
            Backbone.ModelBinder.SetOptions({
                modelSetOptions: {
                    validate: true,
                    validateAll: false
                }
            });
            this.model = model;
            Backbone.Validation.bind(this, {
                model: model
            });
            this._modelBinder = new Backbone.ModelBinder();
            this._modelBinder.bind(model, rootEL, bindings);
        };
    });