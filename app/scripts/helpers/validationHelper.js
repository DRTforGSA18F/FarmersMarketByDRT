define(['jquery', 'underscore', 'backbone', 'backboneValidation'],
    function($, _, Backbone, backboneValidation) {
        'use strict';
        _.extend(Backbone.Validation.callbacks, {
            valid: function(view, attr, selector) {
                var control = view.$('[' + selector + '=' + attr + ']');
                var group = control.closest('.control-group');
                group.removeClass('has-error');

                if (control.data('error-style') === 'tooltip') {
                    // CAUTION: calling tooltip('hide') on an uninitialized tooltip
                    // causes bootstraps tooltips to crash somehow...
                    if (control.data('tooltip')) {
                        control.tooltip('hide');
                    }
                } else if (control.data('error-style') === 'inline') {
                    group.find('.help-inline.error-message').remove();
                } else {
                    var error_child = group.find('.help-block.error-message:first');
                    if (!error_child.closest('.control-group').hasClass('has-error')) {
                        error_child.remove();
                    }
                }
                //this.displayErrorMessagesSummary(view, attr, selector, '');
            },
            invalid: function(view, attr, error, selector) {
                var target;
                var control = view.$('[' + selector + '=' + attr + ']');
                var group = control.closest('.control-group');
                group.addClass('has-error');

                if (control.data('error-style') === 'tooltip') {
                    var position = control.data('tooltip-position') || 'right';
                    control.tooltip({
                        placement: position,
                        trigger: 'manual',
                        title: error
                    });
                    control.tooltip('show');
                } else if (control.data('error-style') === 'inline') {
                    if (group.find('.help-inline').length === 0) {
                        group.find('.controls').append('<span class=\'help-inline error-message\' for=\'' + control.attr('id') + '\' id=\'error-' + control.attr('id') + '\'></span>');
                        group.find('#' + control.attr('id')).attr('aria-describedby', 'error-' + control.attr('id'));
                    }
                    target = group.find('.help-inline');
                    target.text(error);
                } else {
                    if (group.find('.help-block').length === 0) {
                        group.find('.controls:first').append('<span class=\'help-block error-message text-bold\' tabindex=\'-1\'  for=\'' + control.attr('id') + '\' id=\'error-' + control.attr('id') + '\'></span>');
                        group.find('#' + control.attr('id')).attr('aria-describedby', 'error-' + control.attr('id'));
                    }
                    target = group.find('.help-block');
                    target.html('<img src="images/exclamation-circle-16.png" class="push-right-five" alt="Error" />' + error);
                }
                //this.displayErrorMessagesSummary(view, attr, selector, error);
            },
            displayErrorMessagesSummary: function(view, attr, selector, error) {
                if (this.displaySummary) {
                    if (!($('#main-content').find('.error-summary').length > 0) && error) {
                        $('#main-content').find('.heading-main').after('<div class="error-summary" role=group aria-labelledby=error-summary-heading-0><h2 id=error-summary-heading-0 class="error-summary-heading text-danger" tabindex=-1><img src="images/exclamation-circle-22.png" class="push-right-fifteen" alt="Error" /></span> Your information contains <span class="num-errors"></span></h2><ul></ul></div>');
                    }
                    var container = $('#main-content').find('.error-summary ul');
                    if (error) {
                        var labelID = $('#main-content').find('[' + selector + '=' + attr + ']').prop('id');
                        var labeltxt = $('label:not(.control-label)[for=' + labelID + ']').data('errortitle') || $('label:not(.error-message)[for=' + labelID + ']').text();
                        labeltxt = error.replace('Error', '<span class="text-bold">' + labeltxt.replace('*', '') + '</span>');
                        if (container.find('li a[' + selector + '=error_' + attr + ']').length === 0) {
                            container.append('<li><a href=#' + labelID + ' ' + selector + '=error_' + attr + ' data-errorcntrl=' + labelID + '>' + labeltxt + '</a></li>');
                        } else {
                            container.find('li a[' + selector + '=error_' + attr + ']').text(labeltxt);
                        }

                        $('a[name=error_' + attr + ']').on('click', function(e) {
                            e.preventDefault();
                            $('#' + $(this).data('errorcntrl')).focus();
                        });
                    } else {
                        container.find('li').remove();
                        if (container.find('li').length === 0) {
                            container.parent().remove();
                        }
                    }

                    var numErrors = $('#main-content').find('.error-summary .num-errors');
                    var errorCount = container.find('li a').length;
                    if (errorCount > 1) {
                        numErrors.text(errorCount + ' errors');
                    } else {
                        numErrors.text(errorCount + ' error');
                    }

                    $('.error-summary > h2').focus();
                }
            }
        });
    }
);