//JS14 - Global to Widgets: Added icons to accordion, added switch buttons
var OU = OU || {};

OU.Widgets = OU.Widgets || {};

(function ($, Widgets) {
    Widgets.Filter = function ($el, $items) {
        this.$element = $el;
        this.$items = $items;
    };
    Widgets.Filter.prototype.init = function () {
        var base = this;

        $.extend($.expr[":"], {
            "containsIN": function (elem, i, match, array) {
                return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        base.$element.keyup(function () {
            var filterValue = $(this).val(),
                $relevantItems = base.$items.filter(':containsIN(' + filterValue + ')');

            base.$items.hide();
            $relevantItems.show();
        });

        return base;
    };
    Widgets.Filter.prototype.clear = function ($button) {
        var base = this;

        $button.click(function () {
            base.$element.val('').trigger('keyup');
        });

        return base;
    };

    Widgets.CheckAll = function ($el) {
        this.$master = $el;
        this.$slave = $('[data-group="' + $el.data('group') + '"]').not('#' + $el.attr('id'));
        this.addon = {
            summary: false
        };
    };
    Widgets.CheckAll.prototype.init = function () {
        var base = this;
        base.$master.change(function () {
            base.$slave.prop('checked', this.checked);
        });

        base.$slave.change(function () {
            base.$master.prop('checked', (base.$slave.length === base.$slave.filter(':checked').length));
        });

        return base;
    };
    Widgets.CheckAll.prototype.summary = function ($el, summaryText) {
        var base = this;

        if (!base.addon.summary) {
            var text = (typeof summaryText === 'string' && summaryText.length > 0) ? summaryText : '#checked selected of #total';

            base.$slave.change(function () {
                var numChecked = base.$slave.filter(':checked').length,
                    summary = text.replace('#checked', numChecked).replace('#total', base.$slave.length.toString());

                $el.html((numChecked === 0) ? '' : summary);
            });

            base.$master.change(function () {
                base.$slave.trigger('change');
            });

            //Call change event to check initial state of checkboxes.
            base.$slave.trigger('change');

            base.addon.summary = true;
        }

        return base;
    };

    Widgets.MultiSelect = function ($el, obj) {
        var base = this;
        base.$element = $el;
        base.defaults = {
            buttonText: 'Select options',
            checkboxSummaryText: '#checked selected of #total',
            checkboxSummary: true,
            radioSummary: true,
            elementCss: {},
            menuCss: {},
            buttonCss: {},
            collision: true,
            mouseLeave: true,
            mouseLeaveTimeout: 2000,
            offClick: true,
            maximumChecked: [false, 0]
        };
        base.options = $.extend(base.defaults, obj);
        base.addon = {
            checkAll: false,
            filter: false
        };
        base.$button = $el.children('button');
        base.$menu = $el.children('ul');
        base.$checkboxes = base.$menu.find('input[type="checkbox"]').not('.master');
        base.$masterCheckbox = null;
        base.numCheckboxes = base.$checkboxes.length;
        base.$radios = base.$menu.find('input[type="radio"]');
        base.helper = {
            callback: function (callback) {
                if (typeof callback == 'function') {
                    callback();
                }
            },
            numChecked: function () {
                return base.$checkboxes.filter(':checked').length;
            },
            allChecked: function () {
                return base.numCheckboxes === base.helper.numChecked();
            },
            jQueryArrayCheck: function ($el) {
                return $el.length > 0;
            }
        };
    };
    Widgets.MultiSelect.prototype.init = function () {
        //Initialisation
        var base = this,
            options = base.options,
            $element = base.$element,
            $button = base.$button,
            $menu = base.$menu,
            $checkboxes = base.$checkboxes,
            numCheckboxes = $checkboxes.length,
            $radios = base.$radios,
            elementClass = 'widgets-multiselect',
            menuClass = 'widgets-multiselect-menu';

        $element.css(options.elementCss).addClass(elementClass);
        $button.html(options.buttonText).css(options.buttonCss);
        $menu.addClass(menuClass).menu().css(options.menuCss).find('li').addClass('items');

        //Event Handlers.
        (function CheckboxChange() {
            if (base.helper.jQueryArrayCheck($checkboxes)) {
                $checkboxes.change(function () {
                    if (options.checkboxSummary) {
                        var moreThanOneChecked = base.helper.numChecked() > 0,
                            checkboxSummary = options.checkboxSummaryText.replace('#checked', base.helper.numChecked().toString()).replace('#total', numCheckboxes.toString());

                        $button.html((moreThanOneChecked) ? checkboxSummary : options.buttonText);
                    }

                    if (options.maximumChecked[0]) {
                        var maximumCheckableChecked = base.helper.numChecked() >= options.maximumChecked[1],
                            $uncheckedCheckboxes = $checkboxes.not(':checked'),
                            $uncheckedCheckboxesLabels = $uncheckedCheckboxes.parent('label');

                        $uncheckedCheckboxes.prop('disabled', maximumCheckableChecked);
                        $uncheckedCheckboxesLabels.css({
                            'color': (maximumCheckableChecked ? 'grey' : '#333'),
                            'cursor': (maximumCheckableChecked ? 'not-allowed' : 'pointer')
                        });
                    }
                });
            }
        })();
        (function RadioChange() {
            if (options.radioSummary && base.helper.jQueryArrayCheck($radios)) {
                $radios.change(function () {
                    $button.html($(this).parent('label').text());
                });
            }
        })();
        (function ButtonClick() {
            $button.click(function () {
                $('.' + menuClass).not($menu).hide();       //Hide other multiselect menus
                $menu.toggle();

                $menu.position({
                    my: "left top+4",
                    at: "left bottom",
                    of: this,
                    collision: "flipfit"
                });
            });
        })();
        (function DocumentClick() {
            if (options.offClick) {
                $(document).click(function () {
                    $menu.filter(':visible').hide();
                });

                //Stop the propagation of document click event when component clicked.
                $button.click(function (e) {
                    e.stopPropagation();
                });
                $menu.click(function (e) {
                    e.stopPropagation();
                });
            }
        })();
        (function MenuMouseLeave() {
            if (options.mouseLeave) {
                var time = {};
                //Sets timeout function
                $menu.mouseleave(function () {
                    time.timeout = window.setTimeout(function () {
                        $menu.hide();
                    }, options.mouseLeaveTimeout);
                });
                //Cancels the timeout if you enter into the menu again
                $menu.mouseenter(function () {
                    if (typeof time.timeout == "number") {
                        window.clearTimeout(time.timeout);
                        delete time.timeout;
                    }
                });
            }
        })();

        return base;
    };
    Widgets.MultiSelect.prototype.filter = function () {
        var base = this;

        if (!base.addon.filter) {
            var $menu = base.$menu;

            $menu.prepend('<li class="addon"><div class="filter"><input placeholder="Filter" type="text" class="filter-input"/><button type="button" class="int-button filter-button"><i class="int-icon-remove"></i></button></div></li>');

            var $filter = $menu.find('.filter-input'),
                $items = $menu.find('.items'),
                $filterButton = $menu.find('.filter-button'),
                FilterObj = new Widgets.Filter($filter, $items).init().clear($filterButton);  //Initialise filter object

            if (base.addon.checkAll) {
                $filter.keyup(function () {
                    base.$masterCheckbox.prop('disabled', ($items.is(':visible') == 0));             //Disable checkall functionality if all items are filtered out
                });
            }

            base.addon.filter = true;
        }

        return base;
    };
    Widgets.MultiSelect.prototype.checkAll = function (stringArray) {
        var base = this;

        if (!base.addon.checkAll && !base.options.maximumChecked[0]) {
            var options = $.extend(['Check all', 'Uncheck all'], stringArray),
                $menu = base.$menu,
                $checkboxes = base.$checkboxes,
                $masterLabel;

            if (base.helper.jQueryArrayCheck($checkboxes)) {
                $checkboxes.eq(0).closest('li').before('<li class="addon"><label><input type="checkbox" class="master"/><span class="check-all-text">' + options[0] + '</span></label></li>');
                base.$masterCheckbox = $menu.find('.master');
                $masterLabel = $menu.find('.check-all-text');
                base.$masterCheckbox.closest('li').css({
                    'font-weight': '900'
                });

                base.$masterCheckbox.change(function () {
                    $checkboxes
                        .not(':hidden')//check all ones that are visible i.e. not filtered out
                        .prop('checked', this.checked)
                        .trigger('change'); //to update summary text
                    $masterLabel.html((base.helper.allChecked()) ? options[1] : options[0]);
                });

                $checkboxes.change(function () {
                    base.$masterCheckbox.prop('checked', (base.helper.allChecked()));
                    $masterLabel.html((base.helper.allChecked()) ? options[1] : options[0]);
                });

                base.addon.checkAll = true;
            }
        }

        return base;
    };
    Widgets.MultiSelect.prototype.setCheckedByIndex = function (array) {
        var base = this,
            $checkboxes = base.$checkboxes;

        if (base.helper.jQueryArrayCheck($checkboxes)) {
            for (var i = 0; i < array.length; i++) {
                $checkboxes.eq(i).prop('checked', true).trigger('change');
            }
        }

        return base;
    };
    Widgets.MultiSelect.prototype.setCheckedByValue = function (array) {
        var base = this,
            $checkboxes = base.$checkboxes,
            containsObject = function (obj, list) {
                var i;
                for (i = 0; i < list.length; i++) {
                    if (list[i] === obj) {
                        return true;
                    }
                }

                return false;
            };

        if (base.helper.jQueryArrayCheck($checkboxes)) {
            $checkboxes.each(function () {
                var $thisCheckbox = $(this);
                if (containsObject($thisCheckbox.val(), array)) {
                    $thisCheckbox.prop('checked', true).trigger('change');
                }
            });
        }

        return base;
    };

    Widgets.Wizard = function ($el, opts) {
        var base = this;
        base.$wizard = $el;
        base.$stages = $el.children('li');
        base.selectedIndex = null;
        base.defaults = {
            updateButtonText: [],
            revertButtonText: [],
            stageIcon: 'int-icon-ok-sign',
            unavailableStageIcon: 'int-icon-minus-sign'
        };
        base.options = $.extend(base.defaults, opts);
        base.$buttons = base.$stages.find('button');
    };
    Widgets.Wizard.prototype.init = function (selectedIndex) {
        var base = this,
            numOfStages = base.$stages.length;

        base.selectedIndex = selectedIndex;

        var $buttons = base.$buttons,
            $nextAvailableStage = base.$stages.eq(base.selectedIndex + 1),
            $futureStages = $nextAvailableStage.nextAll('li'),
            $selectedStage = (base.selectedIndex < 0) ? $nextAvailableStage.prev('li') : base.$stages.eq(base.selectedIndex),   //This is as eq(-1) selects the element from the end of the collection
            $prevSelectedStage = (base.selectedIndex === numOfStages) ? base.$stages.eq(base.selectedIndex - 1) : $selectedStage.prev('li'),
            $pastStage = $prevSelectedStage.prevAll('li'),
            $icons = base.$stages.find('h4').children('i');

        init();

        function aria() {
            base.$stages.not('.int-selected').attr('aria-selected', 'false');
            base.$stages.filter('.int-selected').attr('aria-selected', 'true');
        }
        function setAvailabilityClasses() {
            base.$stages.removeAttr('class');

            $pastStage.addClass('int-pastSelected');                    //button disabled
            $prevSelectedStage.addClass('int-previouslySelected');      //button enabled
            $selectedStage.addClass('int-selected');                    //button disabled
            $nextAvailableStage.addClass('int-nextAvailable');          //button enabled
            $futureStages.addClass('int-unavailable');                  //button disabled
        }
        function setIcon() {
            $icons.removeAttr('class');

            base.$stages.each(function () {
                var $stage = $(this),
                    $icon = $stage.find('h4').find('i');

                $icon.addClass(($stage.hasClass('int-unavailable')) ? base.options.unavailableStageIcon : base.options.stageIcon);
            });
        }
        function setButtonAvailability() {
            $buttons.prop('disabled', true);

            base.$stages.each(function () {
                var $stage = $(this),
                    $button = $stage.find('button'),
                    stageClassname = $stage.attr('class'),
                    buttonEnabled = (stageClassname === 'int-previouslySelected' || stageClassname === 'int-nextAvailable');

                $button.prop('disabled', !buttonEnabled);
            });
        }
        function setButtonText() {
            for (var i = 0; i < $buttons.length; i++) {
                var $button = $buttons.eq(i),
                    $stage = $button.closest('li'),
                    buttonText = ($stage.hasClass('int-pastStage') || $stage.hasClass('int-previouslySelected')) ? base.options.revertButtonText[i] : base.options.updateButtonText[i];

                $button.text(buttonText);
            }
        }
        function init() {
            setAvailabilityClasses();
            setIcon();
            setButtonAvailability();
            setButtonText();
            aria();
        }

        return base;
    };
    Widgets.Wizard.prototype.clickHandler = function () {
        var base = this;

        base.$buttons.click(function () {
            var $stage = $(this).closest('li'),
                index = $stage.index();
            base.init(index);
        });

        return base;
    };

    Widgets.AssistiveMenu = function ($el, options) {
        var base = this;
        base.$assist = $el;
        base.$dot = $el.find('.int-assistiveDot');
        base.$content = $('#' + $el.attr('aria-controls'));
        base.defaults = {
            containment: 'window'
            , fadeIn: 1000
            , dynamicPosition: {
                my: 'left top+4',
                at: 'left bottom',
                collision: 'flip flipfit'
            }
            , originalPosition: {
                'right': '50px',
                'top': '100px',
                'left': 'auto'
            }
            , mobilePosition: {
                'top': '0',
                'right': '0',
                'left': 'auto'
            }
            , mobileViewport: 480
            , tabbable: [true, 2]
        };
        base.options = $.extend(base.defaults, options);
    };
    Widgets.AssistiveMenu.prototype.init = function () {
        var base = this,
            $assist = base.$assist,
            $dot = base.$dot,
            $content = base.$content,
            o = base.options,
            $window = $(window);

        setPosition();
        initAssist();
        initEventHandlers();

        function setPosition() {
            $assist.css(($window.width() <= o.mobileViewport) ? o.mobilePosition : o.originalPosition);
            hideMenu();
        }
        function hideMenu() {
            $content.hide();
        }
        function initEventHandlers() {
            $(document).click(function () {
                $content.hide();
            });

            $dot.click(function (e) {
                $content
                    .toggle()
                    .position({
                        of: $assist,
                        my: o.dynamicPosition.my,
                        at: o.dynamicPosition.at,
                        collision: o.dynamicPosition.collision
                    });
                e.stopPropagation();
            });

            $content.click(function (e) {
                e.stopPropagation();
            });

            $window.resize(function () {
                setPosition();
            });
        }
        function initAssist() {
            $assist
                .fadeIn(o.fadeIn)
                .draggable({
                    containment: o.containment
                    , scroll: false
                    , drag: hideMenu
                });
            if (o.tabbable[0]) {
                $dot.append('<a href="#" tabindex="' + o.tabbable[1] + '">&nbsp;</a>'); //To allow tabbing to the trigger dot
            }
        }
        return base;
    };


    //Global Components

    //Button & Togglers
    Widgets.DropDownMenu = function ($button, $menu, options) {
        var base = this;
        base.$button = $button;
        base.$menu = $menu;
        base.defaults = {
            offClick: true
        };
        base.options = $.extend(base.defaults, options);
    };
    Widgets.DropDownMenu.prototype.init = function () {
        var base = this;

        base.$menu.menu().hide().css('position', 'absolute');

        base.$button.click(function () {
            base.$menu.toggle().position({              //show next menu
                my: "left top+4",
                at: "left bottom",
                of: this,
                collision: "flipfit"
            });
        });

        if (base.options.offClick) {
            $(document).click(function () {
                base.$menu.filter(':visible').hide();
            });

            //Stop the propagation of document click event when component clicked.
            base.$button.click(function (e) {
                e.stopPropagation();
            });
            base.$menu.click(function (e) {
                e.stopPropagation();
            });
        }

        return base;
    };

    Widgets.Toggler = function ($trigger, $content, options) {
        var base = this;

        base.$trigger = $trigger;
        base.$content = $content;
        base.defaults = {
            dynamicText: [false, '', '']
            , initiallyDisplayed: false
            , $contentCss: {}
        };
        base.options = $.extend(base.defaults, options);
    };
    Widgets.Toggler.prototype.init = function () {
        var base = this,
            o = base.options;

        base.$content.css(o.$contentCss);

        setInitialVisibility();
        triggerClickHandler();

        function setTriggerText() {
            if (o.dynamicText[0]) {
                base.$trigger.text(o.dynamicText[(base.$content.is(':visible')) ? 1 : 2]);
            }
        }
        function setInitialVisibility() {
            if (o.initiallyDisplayed) {
                base.$content.show();
            } else {
                base.$content.hide();
            }
            setTriggerText();
        }
        function triggerClickHandler() {
            base.$trigger.click(function () {
                base.$content.toggle();
                setTriggerText();
            });
        }

        return base;
    };

    Widgets.AccordionToggler = function ($el, options) {
        var base = this;

        base.$accordion = $el;
        base.defaults = {
            triggerTag: 'h3'
            , triggerCss: {
                'cursor': 'pointer'
                , '-webkit-touch-callout': 'none'
                , '-webkit-user-select': 'none'
                , '-khtml-user-select': 'none'
                , '-moz-user-select': 'none'
                , '-ms-user-select': 'none'
                , 'user-select': 'none'
            }
            , triggerClasses: ['widget-slave-visible', 'widget-slave-hidden']
            , contentClasses: ['widget-visible', 'widget-hidden']
            , iconClasses: ['int-icon-chevron-down', 'int-icon-chevron-right']
        };
        base.options = $.extend(base.defaults, options);
        base.$triggers = $el.children(base.options.triggerTag);
        base.$content = $el.children('div');
    };
    Widgets.AccordionToggler.prototype.init = function () {
        var base = this,
            o = base.options,
            $triggers = base.$triggers,
            $content = base.$content;

        initPanels();
        prependIconElement();
        setIcons();
        triggerClickHandler();

        function setVisibilityClasses() {
            $triggers.each(function () {
                var $trigger = $(this),
                    panelVisible = $trigger.next('div').is(':visible');

                $trigger.removeClass(o.triggerClasses[panelVisible ? 1 : 0]).addClass(o.triggerClasses[panelVisible ? 0 : 1]);
            });
            $content.each(function () {
                var $panel = $(this),
                    panelVisible = $panel.is(':visible');

                $panel.removeClass(o.contentClasses[panelVisible ? 1 : 0]).addClass(o.contentClasses[panelVisible ? 0 : 1]);
            });
        }
        function prependIconElement() {
            $triggers.each(function () {
                var $trigger = $(this),
                    iconExists = $trigger.children('i').length > 0;
                $trigger.prepend((iconExists ? '' : '<i></i> '));
            });
        }
        function setIcons() {
            $triggers.each(function () {
                var $trigger = $(this),
                    panelVisible = $trigger.next('div').is(':visible');
                $trigger.children('i').removeAttr('class').addClass(o.iconClasses[(panelVisible) ? 0 : 1]);
            });
        }
        function triggerClickHandler() {
            $triggers.click(function () {
                var $panel = $(this).next('div');

                $panel.toggle();
                setVisibilityClasses();
                setIcons();
            });
        }
        function initPanels() {
            $content.not('.' + o.contentClasses[0]).hide();
            setVisibilityClasses();
            $triggers.css(o.triggerCss);
        }
        return base;
    };
    Widgets.AccordionToggler.prototype.showAll = function ($button, options) {
        var base = this,
            o = base.options,
            defaults = {
                showPanels: true
            },
            methodOptions = $.extend(defaults, options);

        $button.click(function () {
            var hiddenOrVisible = function () { return methodOptions.showPanels ? ':hidden' : ':visible' },
                $content = base.$content.filter(hiddenOrVisible());
            $content.each(function () {
                $(this).prev(o.triggerTag).trigger('click');
            });
            methodOptions.showPanels = !methodOptions.showPanels;
        });

        return base;
    };

    Widgets.SwitchButtonGroup = function ($el, options) {
        var base = this;

        base.$element = $el;
        base.$inputs = $el.find('input');
        base.isRadio = $el.find('input').eq(0).is(':radio');
        base.$labels = $el.find('label');
        base.defaults = {
            selectedClass: 'int-selected'
            , labelCss: {
                'cursor': 'pointer'
                , '-webkit-touch-callout': 'none'
                , '-webkit-user-select': 'none'
                , '-khtml-user-select': 'none'
                , '-moz-user-select': 'none'
                , '-ms-user-select': 'none'
                , 'user-select': 'none'
            }
        };
        base.options = $.extend(base.defaults, options);
    };
    Widgets.SwitchButtonGroup.prototype.init = function () {
        var base = this,
            $inputs = base.$inputs,
            $labels = base.$labels;

        $inputs.hide();
        $labels.css(base.options.labelCss);

        setChecked();

        $labels.click(function () {
            var $label = $(this),
                $input = $label.prev('input');

            if (base.isRadio) {
                $labels.removeClass(base.options.selectedClass);
                $label.addClass(base.options.selectedClass);
            } else {
                $label.toggleClass(base.options.selectedClass);
            }

            setChecked();
        });

        function setChecked() {
            $inputs.each(function () {
                var $input = $(this),
                    $label = $input.next('label');

                $input.prop('checked', $label.hasClass(base.options.selectedClass));
            });
        }

        return base;
    };

    Widgets.CheckboxButton = function ($checkbox, options) {
        var base = this;
        base.$checkbox = $checkbox;
        base.$label = $('label[for="' + $checkbox.attr('id') + '"]');
        base.defaults = {
            selectedClass: 'int-selected'
            , labelCss: {
                'cursor': 'pointer'
                , '-webkit-touch-callout': 'none'
                , '-webkit-user-select': 'none'
                , '-khtml-user-select': 'none'
                , '-moz-user-select': 'none'
                , '-ms-user-select': 'none'
                , 'user-select': 'none'
            }
        };
        base.options = $.extend(base.defaults, options);
    };
    Widgets.CheckboxButton.prototype.init = function () {
        var base = this;

        setCheckbox();

        base.$label.css(base.options.labelCss);

        //Different method depending on if the input is nested inside the label or not - due to click issues for nested checkboxes.
        if (base.$label.children('input').length > 0) {
            base.$checkbox.change(function () {
                if (base.$checkbox.is(':checked')) {
                    base.$label.addClass(base.options.selectedClass);
                } else {
                    base.$label.removeClass(base.options.selectedClass);
                }
            });
        } else {
            base.$checkbox.hide();
            base.$label.click(function () {
                $(this).toggleClass(base.options.selectedClass);
                setCheckbox();
            });
        }

        function setCheckbox() {
            base.$checkbox.prop('checked', base.$label.hasClass(base.options.selectedClass));
        }

        return base;
    };

}(jQuery, OU.Widgets));