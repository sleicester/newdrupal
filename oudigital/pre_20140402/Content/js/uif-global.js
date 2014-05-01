//v20 - Fix for broken js

//Namespaces
var aria = {};

//AppFramework Object
OU.AppFramework = {};

//aria
(function ($) {
    //Aria - N.B. you can pass the arguments in two ways:     aria.hidden('div'); or aria.hidden($('div'));, either way would work
    aria.jQueryObject = function (object) { return object instanceof jQuery ? object : $(object); };
    aria.checked = function (object) {
        var $obj = this.jQueryObject(object),
            $objIsCheckedStr = $obj.is(':checked').toString();

        $obj.attr('aria-checked', $objIsCheckedStr);
    };
    aria.disabled = function (a) {
        if ($(a).is('[disabled]')) {
            $(a).attr('aria-disabled', 'true');
        } else {
            $(a).attr('aria-disabled', 'false');
        }
    };
    aria.expanded = function (a) {
        if ($(a).is(':visible')) {
            $(a).attr('aria-expanded', 'true');
        } else {
            $(a).attr('aria-expanded', 'false');
        }
    };
    aria.expandedHidden = function (a) {
        if ($(a).is(':visible')) {
            $(a).attr('aria-expanded', 'true').attr('aria-hidden', 'false');
        } else {
            $(a).attr('aria-expanded', 'false').attr('aria-hidden', 'true');
        }
    };
    aria.hidden = function (a) {
        if ($(a).is(':hidden')) {
            $(a).attr('aria-hidden', 'true');
        } else {
            $(a).attr('aria-hidden', 'false');
        }
    };
    aria.widgetAttribute = {
        live: {
            polite: function (a) {
                if (a === undefined) a = $('.int-note');
                $(a).attr('aria-live', 'polite');
            },
            assertive: function (a) {
                if (a === undefined) a = $('.int-errorMessage');
                $(a).attr('aria-live', 'assertive');
            }
        }
    };
    aria.controls = function ($trigger, $content, callbackToReturnId) {
        $content.uniqueId();
        $trigger.each(function () {
            var id = callbackToReturnId();
            $(this).attr('aria-controls', id);
        });
    };
    aria.labelledBy = function ($label, $content, callbackToReturnId) {
        $label.uniqueId();
        $content.each(function () {
            var id = callbackToReturnId();
            $(this).attr('aria-labelledby', id);
        });
    };
    aria.setAttr = function ($el, attr, val) {
        $el.attr(attr, val);
    };
    aria.states = function ($el) {
        $el.each(function () {
            if ($(this).is(':visible')) {
                $(this).attr('aria-hidden', 'false').attr('aria-expanded', 'true');
            }
            else {
                $(this).attr('aria-hidden', 'true').attr('aria-expanded', 'false');
            }
        });
    };
})(jQuery);

//OU.AppFramework
(function ($, appFramework) {
    appFramework.Utility = function () {
        var applyValidation = function (context) {
            // Ideally the container name should be passed, in rather than relying on a class selector.
            var customContainerSelector = $('.customMessageContainer', context);
            var customContainerId = null;

            if (customContainerSelector.length) {
                customContainerId = '#' + $('.customMessageContainer', context)[0].getAttribute('id');
            }

            $('form', context).each(function () {
                var $form = $(this);
                addErrorStyles($form);
                $form.submit(function () {
                    if (!$form.valid()) {
                        addValidationSummary(customContainerId);
                    }
                });
            });
        };

        var calculatePageControlBarHeight = function () {
            //ensure scrollbar does not disappear behind control bar
            $('#int-content').css('bottom',
                parseInt($('#int-pageControlBar').css('height')) +
                parseInt($('#int-pageControlBar').css('padding-bottom')) +
                parseInt($('#int-pageControlBar').css('padding-top')) +
                parseInt($('#int-pageControlBar').css('border-top-width')) +
                'px'
            );
        };

        function addValidationSummary(container) {
            var messageContainer = '#message-container';
            var isSticky = true;
            if (container) {
                messageContainer = container;
                isSticky = false;
            }

            $(messageContainer).alert({ title: 'One or more errors were detected on this page. Please review now.', sticky: isSticky, level: 'error' });
            OU.AppFramework.AriaHelper.UpdateNotifications();
        }

        function addErrorStyles(form) {
            form.find('.int-row').each(function () {
                if ($(this).find('span.field-validation-error').length > 0) {
                    $(this).addClass('int-error');
                    $(this).find('span.field-validation-error').each(function () {
                        $(this).addClass('int-errorMessage');
                    });
                }
            });
        }

        return {
            ApplyValidationStyles: function (context) {
                applyValidation(context);
            },
            CalculatePageControlBarHeight: function () {
                calculatePageControlBarHeight();
            }
        };
    };

    appFramework.Components = function () {

        var main = {
            roles: function () {
                $('#int-content').attr('role', 'main');
                $('.int-primary, .int-secondary, .int-accordionNav').attr('role', 'navigation');
                $('#int-region1, #int-region2').attr('role', 'region');
                $('.int-controlBar').attr('role', 'toolbar');
                //Roles and Attributes for Buttons
                $('.int-button').attr('role', 'button');
                //Roles and Attributes for Typography
                $('ul.int-bulletList, ol.int-numberedList').attr('role', 'list');
                $('ul.int-bulletList li, ol.int-numberedList li').attr('role', 'listitem');
                $('i[class*="int-icon"], hr, int-vantageLogo').attr('role', 'presentation');
                $('.int-note').attr('role', 'note').attr('aria-live', 'polite');
                //Forms
                var $errorMessage = $('.int-errorMessage');
                $('.int-radioGroup').attr('role', 'radiogroup');
                $('.int-slideButton').attr('role', 'presentation'); //Sliding bar for radio switch for presentation only.
                $('form').attr('role', 'form');
                $errorMessage.attr('role', 'alert');
                $('input[type="text"], textarea').attr('role', 'textbox');
                $('.int-checkToggle p, .int-checkToggle span').attr('role', 'presentation'); //for checkswitches
                $('textarea[rows]').attr('aria-multiline', 'true');
                $('[disabled]').attr('aria-disabled', 'true');
                $('[readonly]').attr('aria-readonly', 'true');
                $('[required]').attr('aria-required', 'true');
                $('.int-required, .int-requiredAsterisk').attr('role', $errorMessage);
                (function inputs() {
                    //for pre fixes with a span, the input displays aria-describedby with the id of the span that is prepended to the input.
                    (function prefix() {
                        var description = $('.int-inputPrepend').has('span').children('span');
                        description.uniqueId();
                        description.each(function () {
                            var descriptionId = $(this).attr('id');
                            $(this).parent().children('input').attr('aria-labelledby', descriptionId);
                        });
                    })();
                    //For post fixes with buttons, the buttons display aria-controls and the id of the input
                    (function postfix() {
                        var $inputAppend = $('.int-inputAppend'),
                            trigger = $inputAppend.has('a.int-button').children('a.int-button');
                        $inputAppend.children('input').uniqueId(); //Just incase an ID has not been hardcoded for the input
                        trigger.each(function () {
                            var inputId = $(this).parent().children('input').attr('id');
                            $(this).attr('aria-controls', inputId);
                        });
                        //for post fixes with a span, the input displays aria-describedby with the id of the span that is appended to the input.
                        var description = $inputAppend.has('span').children('span');
                        description.uniqueId();
                        description.each(function () {
                            var descriptionId = $(this).attr('id');
                            $(this).parent().children('input').attr('aria-describedby', descriptionId);
                        });
                    })();
                    //aria-labelledby for multiple inline inputs
                    (function inputGroup() {
                        $('.int-inputGroup').each(function () {
                            var label = $(this).children().children('label');
                            if (label.doesExist()) {
                                label.uniqueId();
                                var id = label.attr('id');
                                $(this).attr('aria-labelledby', id);
                            }
                        });
                    })();
                })();
                //Navigation
                //Breadcrumb
                $('.int-breadcrumb').attr('role', 'navigation');
                $('.int-breadcrumb li').attr('role', 'presentation');
                $('.int-breadcrumb li.int-active a').attr('aria-pressed', 'true').attr('aria-disabled', 'true').click(function (event) {
                    event.preventDefault(); //prevents click event of active breadcrumb
                });
                $('.int-breadcrumb li:not(.int-active) a').attr('aria-pressed', 'false').attr('aria-disabled', 'false');
                //Jumplink
                $('.int-jumpLinks').attr('role', 'navigation');
                $('.int-jumpLinks li').attr('role', 'presentation');
                //Pagination
                $('.int-pagination').attr('role', 'navigation');
                $('.int-pagination ul li').attr('role', 'presentation');
                $('.int-pagination ul li a').attr('role', 'button');
                $('.int-pagination ul li.int-active a').attr('aria-pressed', 'true');
                $('.int-pagination ul li:not(.int-active) a').attr('aria-pressed', 'false');
                $('.int-pagination ul li.int-disabled a').attr('aria-disabled', 'true');
                $('.int-pagination ul li:not(.int-disabled) a').attr('aria-disabled', 'false');
            },
            skipToMainContent: function () {
                /*-----------------Skip to Main Content Links-----------------*/
                //http://terrillthompson.com/blog/161
                // add a click handler to all links 
                // that point to same-page targets (href="#...")		
                $("a[href^='#']").click(function () {
                    // get the href attribute of the internal link
                    // then strip the first character off it (#)
                    // leaving the corresponding id attribute
                    $("#" + $(this).attr("href").slice(1) + "")
                        // give that id focus (for browsers that didn't already do so)
                        .focus();
                    // add a highlight effect to that id (comment out if not using)			
                    //.effect("highlight", {}, 3000);
                });
                $('#int-content').attr('tabindex', '-1').css("outline", "0");
                $('#int-page').attr('tabindex', '-1').css("outline", "0"); //Removes orange outline in chrome on focus.
            }
        },
        buttons = {},
        forms = {},
        notification = {},
        tables = {};

        //Buttons
        buttons.dropComponents = function () {
            //Init
            var $menuButtons = $('.int-dropButton'),
                $menus = $('.int-dropMenu'),
                $contentButtons = $('.int-dropDivButton'),
                $contents = $('.int-dropDiv');

            (function init() {
                $menus.menu();      //initialise jQueryUI menu.
                Aria($menuButtons, $menus, '.int-dropMenu');
                Aria($contentButtons, $contents, '.int-dropDiv');
            })();

            //Methods
            function Aria($trigger, $content, contentClass) {
                aria.controls($trigger, $content, function () { return $(this).next(contentClass).attr('id') });
                aria.setAttr($trigger, 'aria-haspopup', 'true');
                $content.hide(aria.states($content));
            }
            function menuButtonClickHandler($button, $menu) {
                $button.click(function () {
                    var menuIsVisible = $menu.is(':visible');

                    if (menuIsVisible) {
                        $menu.hide();
                        aria.states($menu);
                    }
                    else {
                        $menus.hide().not($menu);              //hide all open menus that is not the next menu
                        $contents.hide();
                        $menu.show().position({              //show next menu
                            my: "left top+4",
                            at: "left bottom",
                            of: this,
                            collision: "flipfit"
                        });
                        aria.states($menus);
                        aria.states($contents);
                    }

                    // Register a click outside the menu to close it
                    $(document).one("click", function () {
                        $menu.hide();
                        aria.states($menus);
                    });
                    // Make sure to return false here or the click registration
                    // above gets invoked.
                    return false;
                });
            }
            function contentButtonClickHandler($button, $content) {
                $button.click(function () {
                    var isContentVisible = $content.is(':visible');

                    if (isContentVisible) {
                        $content.hide();
                        aria.states($content);
                    }
                    else {
                        $contents.hide().not($content);
                        $menus.hide();
                        $content.show().width($content.parent().width() - 50).css('margin-top', '.4em');           //thisContent.parent().width() is set inside the click function in case the window is resized between clicks. Thus each new show will resize based on the latest parent width calculation
                        aria.states($contents);
                        aria.states($menus);
                    }
                    // Register a click outside the content to close it
                    $(document).one("click", function () {
                        $content.hide();
                        aria.states($contents);
                    });
                    // Make sure to return false here or the click registration
                    // above gets invoked.
                    return false;
                });
            }
            function menuMouseLeaveHandler($menu) {
                $menu.mouseleave(function () {
                    setTimeout(function () {
                        $menu.hide();
                        aria.states($menu);
                    }, 750);
                });
            }
            function windowResize() {
                //On Windows Resize
                $(window).resize(function () {
                    $menus.hide();
                    aria.states($menus);
                    $contents.hide();
                    aria.states($contents);
                });
            }

            //Event Handlers
            $menuButtons.each(function () {
                var $button = $(this),
                    $menu = $button.next('.int-dropMenu');

                menuButtonClickHandler($button, $menu);

                menuMouseLeaveHandler($menu);
            });
            $contentButtons.each(function () {
                var thisButton = $(this);
                var thisContent = thisButton.next('.int-dropDiv');

                contentButtonClickHandler(thisButton, thisContent);
            });
            windowResize();
        };
        buttons.toggler = function () {

            function toggler($trigger, $content, callback) {
                //Set aria-controls property
                aria.controls($trigger, $content, function () { return $(this).next($content).attr('id'); });

                //Hide content initially, and set aria expanded/hidden state after hide.
                $content.hide(aria.expandedHidden($content));

                //Event Handler
                $trigger.each(function () {
                    var $slave = $(this).next($content);

                    $(this).click(function () {
                        $slave.fadeToggle(0);
                        aria.expandedHidden($slave);

                        if (typeof callback == 'function') {
                            callback();
                        }
                    });
                });
            }

            //Content Toggler
            toggler($('.int-toggleTrigger'), $('.int-toggle'));

            //More Info Toggler
            toggler($('.int-more'), $('.int-less'), function () {
                $('.int-more').each(function () {
                    var contentIsVisible = $(this).next('.int-less').is(':visible');
                    $(this).html((contentIsVisible) ? '<i class="int-icon-minus"></i> Less Info' : '<i class="int-icon-plus"></i> More Info');
                });
            });

            //Accordion Toggler
            (function accordionToggler() {
                var component = $('.int-toggler'),
                    trigger = $('.int-toggler > h3'),
                    content = $('.int-toggler > div'),
                    init = (function () {
                        //aria
                        component.attr('role', 'tablist');
                        trigger.attr('role', 'tab');
                        content.attr('role', 'tabpanel');
                        aria.controls(trigger, content, function () { return $(this).next('div').attr('id'); });
                        aria.labelledBy(trigger, content, function () { return $(this).prev('h3').attr('id'); });

                        //Prepend icon if it doesnt already exist
                        trigger.each(function () {
                            var iconExists = $(this).children('i').doesExist();
                            $(this).prepend((iconExists ? '' : '<i class="accordionIcon"></i> '));
                        });
                    })(),
                    checkState = function () {
                        var activeContent = $('.int-toggler > div.int-togglerContentActive'),
                            hiddenContent = $('.int-toggler > div').not('.int-togglerContentActive');
                        //Chevron Icon States
                        activeContent.prev('h3').addClass('int-togglerHeadActive').children('i').addClass('int-icon-chevron-down').removeClass('int-icon-chevron-right');
                        hiddenContent.prev('h3').removeClass('int-togglerHeadActive').children('i').addClass('int-icon-chevron-right').removeClass('int-icon-chevron-down');
                        //Content Expanded and Hidden States
                        activeContent.attr('aria-expanded', 'true').attr('aria-hidden', 'false');
                        hiddenContent.attr('aria-expanded', 'false').attr('aria-hidden', 'true');
                        //Trigger Selected States
                        var selected = $('.int-toggler > h3.int-togglerHeadActive'); //Note, this variable is defined here as it is changed by the chveron icon states statements
                        var unselected = $('.int-toggler > h3').not('.int-togglerHeadActive');
                        selected.attr('aria-selected', 'true');
                        unselected.attr('aria-selected', 'false');
                    },
                    showAllControl = {
                        nextInstance: function () {
                            //Show/Hide All for next instance of the toggler
                            $('.int-showToggler').each(function () {
                                var $trigger = $(this),
                                    $content = $trigger.next('.int-toggler').children('div'),
                                    showContent = function () {
                                        $content.addClass('int-togglerContentActive');
                                        checkState();
                                    },
                                    hideContent = function () {
                                        $content.removeClass('int-togglerContentActive');
                                        checkState();
                                    },
                                    init = (function () {
                                        //Set aria-controls property
                                        aria.controls($trigger, $content, function () {
                                            return $content.map(function () {
                                                return this.id;
                                            }).get().join(" ");
                                        });

                                        //Event Handler
                                        $trigger.togglefn(showContent, hideContent);
                                    })();
                            });
                        },
                        allInstances: function () {
                            //Show/Hide All for all instances of the toggler
                            $('.int-showAllToggler').each(function () {
                                var $trigger = $(this),
                                    showContent = function () {
                                        content.addClass('int-togglerContentActive');
                                        checkState();
                                    },
                                    hideContent = function () {
                                        content.removeClass('int-togglerContentActive');
                                        checkState();
                                    },
                                    init = (function () {
                                        //Set aria-controls property
                                        aria.controls($trigger, content, function () {
                                            return content.map(function () {
                                                return this.id;
                                            }).get().join(" ");
                                        });

                                        //Event Handler
                                        $trigger.togglefn(showContent, hideContent);
                                    })();
                            });
                        }
                    };

                checkState();

                //Click handler to toggle individual togglers
                trigger.click(function () {
                    var $slave = $(this).next('div'),
                        slaveIsHidden = $slave.is(':hidden'),
                        init = (function () {
                            $slave.toggleClass('int-togglerContentActive', slaveIsHidden);
                            checkState();
                        })();
                });

                showAllControl.nextInstance();
                showAllControl.allInstances();
            })();
        };
        buttons.init = function () {
            this.dropComponents();
            this.toggler();
        };

        //Forms
        forms.radioSwitch = function () {
            $('.int-radioSwitch input[type="radio"]:first').prop('checked', true); //Ensures that the the default for radio switch is always checked at the start
        };
        forms.help = function () {
            var helpMessage = $('.int-helpDesc');
            var trigger = $('.int-help');
            //roles
            trigger.attr('role', 'button');
            //aria-controls
            helpMessage.uniqueId();
            trigger.each(function () {
                var id = $(this).parents().eq(2).children('.int-helpDesc').attr('id');
                $(this).attr('aria-controls', id);
            });
            helpMessage.hide();
            //aria-expanded, aria-hidden, aria-live
            aria.widgetAttribute.live.polite(helpMessage);
            aria.expandedHidden(helpMessage);
            //click fn
            trigger.on('click', function () {
                helpMessage.slideUp(150).attr('aria-expanded', 'false').attr('aria-hidden', 'true'); //Close all open descriptions
                if ($(this).parents().eq(2).children('.int-helpDesc').is(':visible') == false) { //If the next description is not open, then open it
                    $(this).parents().eq(2).children('.int-helpDesc').slideDown(150);
                    aria.expandedHidden($(this).parents().eq(2).children('.int-helpDesc'));
                }
            });
        };
        forms.listbox = function () {
            /*AToB BToA controls*/
            $('.int-listboxWidget .int-listboxWidgetAToB').click(function () {
                var selectA = $(this).parent().parent().prev('select');
                var selectB = $(this).parent().parent().next('select');
                selectA.children(':selected').appendTo(selectB);
            });
            $('.int-listboxWidget .int-listboxWidgetBToA').click(function () {
                var selectA = $(this).parent().parent().prev('select');
                var selectB = $(this).parent().parent().next('select');
                selectB.children(':selected').appendTo(selectA);
            });
            /*Up Down controls*/
            $('.int-listboxWidget .option-move-up').click(function () {
                var selectB = $(this).parent().parent().prev('select');
                selectB.children(':selected').each(function () {
                    $(this).insertBefore($(this).prev());
                });
            });
            $('.int-listboxWidget .option-move-down').click(function () {
                var selectB = $(this).parent().parent().prev('select');
                selectB.children(':selected').each(function () {
                    $(this).insertAfter($(this).next());
                });
            });
            /*Select all buttons*/
            $('.int-listboxWidgetSelectAllA').click(function () {
                var optionsA = $(this).closest('.int-listboxWidgetExtras').next('select').children('option');
                optionsA.attr('selected', 'selected');
            });
            $('.int-listboxWidgetSelectAllB').click(function () {
                var optionsB = $(this).closest('.int-listboxWidgetExtras').nextAll().eq(2).children('option');
                optionsB.attr('selected', 'selected');
            });
            /* WAI-ARIA*/
            $('.int-listboxWidget select').uniqueId();
            $('.int-listboxWidgetSelectAllA').each(function () {
                var ID = $(this).closest('.int-listboxWidgetExtras').next('select').attr('id');
                $(this).attr('aria-controls', ID);
            });
            $('.int-listboxWidgetSelectAllB').each(function () {
                var ID = $(this).closest('.int-listboxWidgetExtras').nextAll().eq(2).attr('id');
                $(this).attr('aria-controls', ID);
            });
            $('.int-listboxWidgetAToB').each(function () {
                var ID = $(this).parent().parent().prev('select').attr('id');
                $(this).attr('aria-controls', ID);
            });
            $('.int-listboxWidgetBToA').each(function () {
                var ID = $(this).parent().parent().next('select').attr('id');
                $(this).attr('aria-controls', ID);
            });
            $('.option-move-up, .option-move-down').each(function () {
                var ID = $(this).parent().parent().prev('select').attr('id');
                $(this).attr('aria-controls', ID);
            });
        };
        forms.switchButtons = function () {
            function tabindex() {
                inputs.each(function () {
                    if ($(this).next('label').hasClass('int-selected')) {
                        $(this).attr('tabindex', '-1');
                    } else {
                        $(this).attr('tabindex', '0');
                    }
                });
            }
            function checkboxOnChange(a) {
                $(a).change(function () {
                    var thisCheckbox = $(this);
                    var ID = $(this).attr('id');
                    var label = $('[for="' + ID + '"]');

                    if (thisCheckbox.is(':checked')) {
                        label.addClass('int-selected').attr('aria-selected', 'true');
                    } else {
                        label.removeClass('int-selected').attr('aria-selected', 'false');
                    }
                });
            }
            function checkSelectedLabel(input) {
                $(input).each(function () {
                    var thisInput = $(this);
                    var inputID = thisInput.attr('id');
                    var thisLabel = $('[for="' + inputID + '"]');                       //The label for which the for attribute equals the ID of the input

                    if (thisLabel.hasClass('int-selected')) {                           //check initial state of labels
                        thisInput.prop('checked', true).attr('aria-checked', 'true');   //if int-selected is applied, then check the input
                        thisLabel.attr('aria-selected', true);                          //Set aria-selected
                    } else {
                        thisLabel.attr('aria-selected', false);
                    }
                });
            }
            function init(buttonType, g, i, l, role) {
                this.group = $(g);
                this.inputs = $(i);
                this.labels = $(l);

                if (role.length > 0) {
                    group.attr('role', role);
                }
                inputs.uniqueId().each(function () {
                    var thisInput = $(this);
                    var thisLabel = thisInput.next('label');
                    var inputID = thisInput.attr('id');
                    thisInput
                        .addClass('int-hide')                                         //hide inputs
                        .attr('aria-hidden', 'true')                                    //set aria-hidden
                        .next('label').attr('for', inputID);                            //set for label
                    checkSelectedLabel(this);
                });

                /*Event Handler For Checkboxes*/
                if (buttonType == 'checkbox') {
                    checkboxOnChange(i);
                }

                /* Event Handler for Radio*/
                tabindex();
                if (buttonType == 'radio') {
                    inputs.click(function () {
                        var thisRadio = $(this);
                        var thisLabel = thisRadio.next('label');
                        var name = $(this).attr('name');

                        labels.removeClass('int-selected').attr('aria-selected', 'false');
                        thisLabel.addClass('int-selected').attr('aria-selected', 'true');
                        tabindex();
                        aria.checked($('input[type="radio"][name="' + name + '"]').not(this));
                    });
                }

            }
            //Grouped Checkbox Buttons
            init('checkbox', '.int-checkboxSwitchButtons', '.int-checkboxSwitchButtons > input:checkbox', '.int-checkboxSwitchButtons > label', '');
            //Grouped Radio Buttons
            init('radio', '.int-radioSwitchButtons', '.int-radioSwitchButtons > input:radio', '.int-radioSwitchButtons > label', 'radiogroup');
            //Single Checkbox Buttons Instances
            checkSelectedLabel('.int-checkboxButton');      //Check initial selected state
            checkboxOnChange('.int-checkboxButton');        //Set event handler function for .int-checkboxButton
        };
        forms.init = function () {
            this.radioSwitch();
            this.help();
            this.listbox();
            this.switchButtons();
        };

        //Notification
        notification.alerts = function () {
            $('.int-alert').attr('role', 'alert').attr('aria-live', 'polite');
            $('.int-error').attr('aria-live', 'assertive');
            $('.int-alert:hidden').removeAttr('aria-live');
            aria.expandedHidden($('.int-alert'));
            var closeButton = $('.int-alert').children('a.int-alertClose');
            closeButton.attr('role', 'button');
            closeButton.on('click', function () { //Set on to events i.e. click, to so new items can be dynamically added to the dom. Attaches event handlers dynamically to the the selector and the event, not just the selector.
                var a = $(this).parent('.int-alert');
                $(this).fadeOut(0); //Fadeout has to be zero for aria to work
                a.fadeOut(0);
                aria.expandedHidden(a);
                $('.int-alert:hidden').removeAttr('aria-live'); //removes the live attribute from the hidden alert
            });
        };
        notification.tooltips = function () {
            $('[title]').tipsy({ gravity: $.fn.tipsy.autoNS }); //Tipsy tooltip function call
            $('.int-tooltipW').attr('title', 'Show/hide sidebar').tipsy({ gravity: 'w' }); //this has to be called separately as the default tooltip position obscures the text.
        };
        notification.init = function () {
            this.alerts();
            this.tooltips();
        };

        //Tables
        tables.sortable = function () {
            $(".int-sortableTable thead tr th").append('<a href="#" role="button"></a>');
            $(".int-sortableTable").tablesorter();
        };
        tables.expandable = function () {
            //Expanding Nested Tables
            var mainTable = $('.int-expandingTable');
            var childTable = $('.int-childTable');
            childTable.prev('tr').addClass('int-parent'); //Adds in-parent class to the previous tr element.
            var triggerRow = $('.int-parent');
            childTable.hide();

            //Initial Row Icons state
            triggerRow.children(':first-child').prepend('<i class="int-icon-caret-right" role="presentation"><a href="#"></a></i>&nbsp;');

            //aria roles
            mainTable.attr('role', 'tablist');
            childTable.attr('role', 'tabpanel');
            triggerRow.attr('role', 'tab');
            triggerRow.children(':first-child').children('i').children('a').attr('role', 'button');
            //aria-controls
            childTable.uniqueId();
            triggerRow.each(function () {
                var id = $(this).next(childTable).attr('id');
                $(this).attr('aria-controls', id);
                $(this).children(':first-child').children('i').children('a').attr('aria-controls', id);
            });
            //aria-expanded and aria-hidden
            aria.expandedHidden(childTable); //this has to be below the hide function for child tables.
            //aria-selected
            var selected = function () {
                $('.int-parent').each(function () {
                    if ($(this).hasClass('int-selected') == true) {
                        $(this).attr('aria-selected', 'true');
                    } else {
                        $(this).attr('aria-selected', 'false');
                    }
                });
            };
            selected(); //check initial selected state

            //Toggle individual child tables
            $('table').on('click', 'tr.int-parent', function () { //Hooks event handler up to the table instead of the individual row, the event will bubble up to the table and the second parameter is a selector for that event.
                $(this).toggleClass('int-selected').next('.int-childTable').fadeToggle(0); //This allows dynamically adding rows without the need to re-hook event handlers, and lower overheads when there are many tr.int-parents
                $(this).children(':first-child').children('i').toggleClass('int-icon-caret-right').toggleClass('int-icon-caret-down');
                aria.expandedHidden($(this).next('.int-childTable'));
                selected();
            });

            //Toggle All Tables
            var triggerAll = $('.int-expandCollapseAll');

            //aria-controls
            var allChildTablesId = childTable.map(function () {
                return this.id;
            }).get().join(" ");
            triggerAll.attr('aria-controls', allChildTablesId);
            triggerAll.prepend('<i class="int-icon-plus" role="presentation"></i> Expand all tables');
            /*For jQuery 1.9.1 */
            triggerAll.each(function () {
                var A = function () {
                    $(this).html('<i class="int-icon-minus"></i> Collapse all tables');
                    childTable.show();
                    triggerRow.addClass('int-selected').children(':first-child').children('i').removeClass('int-icon-caret-right').addClass('int-icon-caret-down');
                    aria.expandedHidden(childTable);
                    selected();
                }
                var B = function () {
                    $(this).html('<i class="int-icon-plus"></i> Expand all tables');
                    childTable.hide();
                    triggerRow.removeClass('int-selected').children(':first-child').children('i').removeClass('int-icon-caret-down').addClass(' int-icon-caret-right');
                    aria.expandedHidden(childTable);
                    selected();
                }
                $(this).togglefn(A, B);
            });
        };
        tables.init = function () {
            this.sortable();
            this.expandable();
        };

        //Datatables - initialised separately. Removes show entries' select and appends it to after the label. Has to be called after the function call for datatables.
        tables.datatables = function () {
            var displayLengthArray = [];

            $('.int-datatables').each(function () {
                var uniqueId = $(this).attr('id');
                displayLengthArray[uniqueId] = "10";
                var uniqueIdShowEntries = $('#' + uniqueId + '_length');
                var select = $('#' + uniqueId + '_length label select');
                var options = $('#' + uniqueId + '_length label select option');

                uniqueIdShowEntries.children("label").html("Show entries");
                uniqueIdShowEntries.append(select);
                $('#' + uniqueId + '_length select').attr("id", uniqueId + "_select");

                $(options).each(function () {
                    $('#' + uniqueId + '_select').append(this);
                });

                $(document).on("click", '#' + uniqueId + '_select', function () {
                    var originalTableId = $(this).attr('id');
                    originalTableId = originalTableId.substring(0, originalTableId.length - 7);
                    if ($(this).val() != displayLengthArray[originalTableId]) {
                        displayLengthArray[originalTableId] = $(this).val();
                        var oTable = $('#' + originalTableId).dataTable();
                        var oSettings = oTable.fnSettings();
                        oSettings._iDisplayLength = parseInt($(this).val());
                        oTable.fnPageChange("first");
                    }
                });
            });
        };

        return {
            UpdateAll: function () {
                main.roles();
                main.skipToMainContent();
                buttons.init();
                forms.init();
                notification.init();
                tables.init();
                tables.datatables();
                $('input, textarea').formtips({
                    tippedClass: 'tipped'
                });
            },
            UpdateMain: function () {
                main.roles();
                main.skipToMainContent();
            },
            UpdateButtons: function () {
                buttons.init();
            },
            UpdateForms: function () {
                forms.init();
            },
            UpdateTooltips: function () {
                notification.tooltips();
            },
            UpdateAlerts: function () {
                notification.alerts();
            },
            UpdateTables: function () {
                tables.sortable();
                tables.expandable();
            },
            UpdateDatatables: function () {
                tables.datatables();
            }
        };

    };
    
    appFramework.Spin = function () {
        //default setting for spin.js spinner
        var opts = {
            lines: 13, // The number of lines to draw
            length: 0, // The length of each line
            width: 8, // The line thickness
            radius: 25, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#fff', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: true, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'int-throbber', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };

        var ajaxLoaderTimer;
        //function to show the spinner
        var showSpinner = function () {
            ajaxLoaderTimer = setTimeout(function () {
                $('#int-throbber').spin(opts);
            }, 250);

        };

        //function to hide the spinner
        var hideSpinner = function () {
            window.clearTimeout(ajaxLoaderTimer);
            $('#int-throbber').spin(false);
        };

        return {
            Start: function () {
                showSpinner();
            },
            Stop: function () {
                hideSpinner();
            }
        };
    };

    //extending JQuery to provide a .spin method that can be applied to elements. 
    $.fn.spin = function (opts) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data();

            if (data.spinner) {
                this.style.display = "none";
                data.spinner.stop();
                delete data.spinner;
            }
            if (opts !== false) {
                this.style.display = "block";
                opts = $.extend(
                    { color: $this.css('color') },
                    opts
                );
                data.spinner = new Spinner(opts).spin(this);
            }
        });
    };
    
    appFramework.Menu = function () {

        var initialise = function () {
            $('.int-secondary > ul').accordion({ autoHeight: false }).fadeIn(0);

            $('#int-navToggle').click(function () {
                if ($('#int-region2').hasClass('int-sidebarToggle'))
                    showNav();
                else
                    hideNav();
            });

            $('.bfa').click(function (e) {

                //hide all accordions
                $('.int-secondary').hide();

                //show the accordion for the selected bfa tab
                var navbfa = $(e.target).attr('href');
                $(navbfa).show();

                highlightTab($(e.target));
                showNav();
                e.preventDefault();
            });

            $('.app').click(function (e) {
                updateTitle($(this).children('a'));
            });

            initMenu();
        };

        function findPages(urlPathParts, depth) {
            if (depth == 0) {
                return undefined;
            }

            var pages = $('.int-secondary').find('a').filter(function () {
                if (isHashUrl(this) == true) return false;
                var menuItemPathParts = getPathParts(this.pathname);
                //console.log(menuItemPathParts.length + ' | ' + urlPathParts.length + ' | ' + depth + ' | ' + this.pathname);
                // ignore menu items with path length shorter than current depth - we'll catch those on the next pass
                if (menuItemPathParts.length < depth) return false;
                for (var i = 0; i < depth; i++) {
                    if (menuItemPathParts[i] != urlPathParts[i]) return false;
                }

                return true;
            });

            //console.log(depth + '-' + pages.length);
            if (pages.length > 0) {
                return pages;
            }

            return findPages(urlPathParts, depth - 1);
        }

        // SR
        // Currently going with the simple approach of testing for a # at the end of the URL due to issues with IE8 resolving URLs (:80 on one host but not the other, differences in leading /)
        // Leave the commented out lines for now in case we need to revisit this. Adding a trailing # to a URL will stop the menu highlighting from working
        function isHashUrl(a) {
            var href = a.href;
            return href.charAt(href.length - 1) == '#';
            //var anchorUrl = a.protocol + "//" + a.host + a.pathname + '#';
            //var origin = window.location.origin;
            //var pathname = window.location.pathname;
            //var hashUrl = origin + pathname + "#";
            //alert('Anchor:' + anchorUrl + ', URL:' + hashUrl);
            //alert('Window Origin: ' + window.location.origin + ' :Window Host: ' + window.location.host + ' :Window Path: ' + window.location.pathname + ': *** Anchor Origin:' + a.origin + ' :Anchor Host: ' + a.host + ' :Anchor Path: ' + a.pathname);
            //return anchorUrl == hashUrl;
        }

        function getPathParts(path) {
            // ignore the slash at the beginning if there is one
            if (path.charAt(0) == '/') path = path.substr(1);
            return path.split('/');
        }

        var initMenu = function (undefined) {
            if (!window.location.origin) window.location.origin = window.location.protocol + "//" + window.location.host;
            var pathname = window.location.pathname;
            //TODO: Remove?
            //TESTING ====================================================
            //pathname = "/";
            //pathname = "/Vantage";
            //pathname = "/Vantage/Docs";
            //pathname = "/Vantage/Docs/jQueryUI";
            //pathname = "/Vantage/Docs/jQueryUI#";
            //pathname = "/Vantage/Docs/jQueryUI/Index";
            //pathname = "/Vantage/Docs/jQueryUI/Index/Blah";
            //pathname = "/Vantage/Docs/jQueryUI/Index/Id/567";
            //pathname = "/Vantage/Docs/jQueryUI/Id/567";
            //TESTING ====================================================

            var pathParts = getPathParts(pathname);

            var page;

            //console.log("*** Matching " + pathname);

            //TODO: My eyes are bleeding from souble slash wounds!
            //find page for this url - eg $('#page10').children('a');
            var pages = findPages(pathParts, pathParts.length);
            if (pages !== undefined) {
                pages.each(function (index) {
                    if (index == 0) page = $(this);
                });
            }

            //if the page is not found default to the first page
            if (page === undefined || page.attr('href') == null) {
                page = $('.page > a').first();
            }

            //find its app - eg $('#app4 > a');
            var app = page.closest('.app').children('a');

            //update the menu       
            updateMenu(page, app);
        };

        var updateMenu = function (page, app) {
            //based on the app provided
            //find its acc - eg $('#acc-bfa2');
            var acc = app.closest('ul');

            //find its nav - eg $(bfa).attr('href');
            var nav = "#" + acc.closest('nav').attr('id');

            //find its bfa - eg $('#bfa2').children('a');
            var bfa = $('.bfa').find('a').filter(function () { return this.href.lastIndexOf(nav) >= 0; });

            //if the required element is not found in the menu bail out
            if (acc.length == 0 || nav.length == 0 || bfa.length == 0) {
                //alert("This application was not found in the menu");
                return;
            }

            //highlight correct primary menu (tab)
            highlightTab($(bfa));

            //display correct secondary menu (nav)
            $('.int-secondary').hide();
            $(nav).show();

            //display correct accordion (acc)
            $(app).click();

            //update header
            updateTitle(app);

            //highlight correct page if one was provided
            if (page != null) {
                $(page).addClass('int-selected');
            }

            //ensure the sidebar is visible even if the user hid it
            showNav();
        };

        var highlightTab = function (tabSelected) {
            $('.bfa').children('a').removeClass('int-selected');
            tabSelected.addClass('int-selected');
        };

        var updateTitle = function (app) {
            $('#main-title').text($(app).text());
        };

        var showNav = function () {

            $('#int-region2').removeClass('int-sidebarToggle');
            $('#int-region1').removeClass('int-mainContentToggle');
            $('#int-navToggle').blur();
        };

        var hideNav = function () {

            $('#int-region2').addClass('int-sidebarToggle');
            $('#int-region1').addClass('int-mainContentToggle');
            $('#int-navToggle').blur();
        };

        var selectApp = function (thepage, theapp) {
            updateMenu(thepage, $(theapp).children('a'));
        };

        return {
            Initialise: function () {
                initialise();
            },
            SelectApp: function (page, app) {
                selectApp(page, app);
            }
        };
    };
    
    appFramework.Modal = function () {

        var paddingHeight = 30;

        function updateButtons(modal, cancelButtonText, actionButtons, undefined) {
            if (actionButtons === undefined) {
                actionButtons = [];
            }

            if (cancelButtonText !== undefined) {
                actionButtons.push({ text: cancelButtonText, click: function () { $(this).dialog("close"); } });
            }

            modal.dialog("option", "buttons", actionButtons);
        }

        function configureModal(id, cancelButtonText, actionButtons, dialogWidth, dialogHeight, undefined) {
            var $modal = $(id);

            $modal.dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                draggable: true,
                width: dialogWidth,
                height: dialogHeight,
                zIndex: 999999
            });

            updateButtons($modal, cancelButtonText, actionButtons, undefined);

            $modal.dialog("open");
            var dialogContentHeight = $modal.height();
            var $tabs = $('.int-navPills', $modal);
            var tabHeight = 0;
            if ($tabs.length) {
                tabHeight = $tabs.actual('height');
            }

            log("tabHeight: " + tabHeight);
            $modal.dialog("close");

            log("dialogHeight: " + dialogHeight);
            log("dialogContentHeight: " + dialogContentHeight);
            log("paddingHeight: " + paddingHeight);
            $('.int-dialogContent', $modal).height(dialogContentHeight - paddingHeight - tabHeight);
            $(".int-dialogWrap", $modal).height(dialogContentHeight - tabHeight);
        }

        function configureAlertModal(id, cancelButtonText, actionButtons, undefined) {
            var $alertModal = $(id);
            var dialogWidth = 500;
            var dialogHeight = 300;

            configureModal(id, cancelButtonText, actionButtons, dialogWidth, dialogHeight, undefined);

            $(window).bind('resize', function () {
                $alertModal.dialog('option', 'position', 'center');
            });
        }

        function configureFormModal(id, cancelButtonText, actionButtons, undefined) {
            var $modal = $(id);
            var sizeMultiplier = 0.85;
            var windowWidth = $(window).actual('width');
            var windowHeight = $(window).actual('height');
            var dialogWidth = windowWidth * sizeMultiplier;
            var dialogHeight = windowHeight * sizeMultiplier;

            configureModal(id, cancelButtonText, actionButtons, dialogWidth, dialogHeight, undefined);

            $(window).bind('resize', function () {
                var width = $(this).actual('width') * sizeMultiplier;
                var height = $(this).actual('height') * sizeMultiplier;
                var contentHeight = $modal.height();
                log("* contentHeight: " + contentHeight);
                var $tabs = $('.int-navPills', $modal);
                var tabHeight = 0;
                if ($tabs.length) {
                    tabHeight = $tabs.actual('height');
                }

                log("tabHeight: " + tabHeight);
                $modal.dialog('option', 'width', width);
                $modal.dialog('option', 'height', height);
                $('.int-dialogContent', $modal).height(contentHeight - paddingHeight - tabHeight);
                $modal.dialog('option', 'position', $modal.dialog('option', 'position'));
            });
        }

        function log(message) {
            if (window.console) {
                //console.log(message);
            }
        }

        return {
            ConfigureAlertModal: function (id, cancelButtonText, actionButtons) {
                configureAlertModal(id, cancelButtonText, actionButtons);
            },
            ConfigureFormModal: function (id, cancelButtonText, actionButtons) {
                configureFormModal(id, cancelButtonText, actionButtons);
            }
        };
    };
})(jQuery, OU.AppFramework);

OU.AppFramework.UtilityHelper = new OU.AppFramework.Utility();
OU.AppFramework.AriaHelper = new OU.AppFramework.Components();
OU.AppFramework.Spinner = new OU.AppFramework.Spin();
OU.AppFramework.MenuManager = new OU.AppFramework.Menu();
OU.AppFramework.ModalHelper = new OU.AppFramework.Modal();