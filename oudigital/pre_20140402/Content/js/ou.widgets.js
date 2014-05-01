//27 - Persistent Table Headers 

//Helper jQuery Plugins
(function ($) {
    $.extend($.expr[":"], {
        "containsIN": function (elem, i, match, array) {
            return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });
    $.fn.doesExist = function () {
        return jQuery(this).length > 0;
    };
    $.fn.togglefn = function (a, b) {
        return this.each(function () {
            var clicked = false;
            $(this).click(function () {
                if (clicked) {
                    clicked = false;
                    return b.apply(this, arguments);
                }
                clicked = true;
                return a.apply(this, arguments);
            });
        });
    };
    $.fn.alert = function (options) {
        options = $.extend({}, $.fn.alert.defaults, options);

        return this.each(function () {
            var $this = $(this);
            $this.empty();
            if (options !== false) {
                var $alertDiv = $('<div class="int-alert"></div>');
                $alertDiv.toggleClass("int-alertSticky", options.sticky);
                if (options.level !== "") {
                    $alertDiv.addClass("int-" + options.level);
                }

                if (options.level !== "error") {
                    $alertDiv.append('<a class="int-alertClose" href="#" title="close alert"><i class="int-icon-remove"></i></a>');
                }

                if (options.title !== "") {
                    $alertDiv.append('<strong>' + options.title + '</strong> ');
                }

                $alertDiv.append(options.text);
                $this.append($alertDiv);
            }
        });
    };
    $.fn.alert.defaults = {
        level: '',
        sticky: false,
        title: '',
        text: ''
    };
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
})(jQuery);

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
            "containsIN": function (elem, i, match) {
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
    Widgets.Filter.prototype.summary = function ($summary,summaryHtml) {
        var base = this,
            $filter = base.$element,
            $items = base.$items,
            summary = typeof summaryHtml === 'undefined' ? '<p class="int-alert int-info"><strong>Filter Results: </strong> #relevant of #total</p>' : summaryHtml;

        $filter.keyup(function () {
            var filterValue = $(this).val(),
                numItems = $items.length,
                numRelevantItems = $items.filter(':containsIN(' + filterValue + ')').length;

            $summary.html((filterValue != '') ? summary.replace('#relevant', numRelevantItems.toString()).replace('#total', numItems.toString()) : '');
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
        base.$content = $('#' + $el.attr('data-controls'));
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

    Widgets.Listbox = function ($el, options) {
        this.$listbox = $el;
    };
    Widgets.Listbox.prototype.init = function () {
        var base = this,
            $listbox = base.$listbox,
            $selectA = $listbox.find('select').eq(0),
            $selectB = $listbox.find('select').eq(1),
            $selectAControls = $selectA.prev('div').find('button'),
            $selectBControls = $selectB.prev('div').find('button'),
            $moveAOptionsUpButton = $selectAControls.eq(0),
            $moveAOptionsDownButton = $selectAControls.eq(1),
            $selectAllAButton = $selectAControls.eq(2),
            $aToBButton = $selectAControls.eq(3),
            $moveBOptionsUpButton = $selectBControls.eq(2),
            $moveBOptionsDownButton = $selectBControls.eq(3),
            $selectAllBButton = $selectBControls.eq(1),
            $bToAButton = $selectBControls.eq(0);


        moveOptionsAcrossHandler($aToBButton, $selectA, $selectB);
        moveOptionsAcrossHandler($bToAButton, $selectB, $selectA);
        selectAllOptionsHandler($selectAllAButton, $selectA);
        selectAllOptionsHandler($selectAllBButton, $selectB);
        moveOptionsUpAndDownHandler($moveAOptionsUpButton, $moveAOptionsDownButton, $selectA);
        moveOptionsUpAndDownHandler($moveBOptionsUpButton, $moveBOptionsDownButton, $selectB);

        function $returnSelected($select) {
            return $select.children(':selected');
        }
        function moveOptionsAcrossHandler($button, $src, $destination) {
            $button.click(function () {
                $returnSelected($src).appendTo($destination);
            });
        }
        function selectAllOptionsHandler($button, $select) {
            $button.click(function () {
                $select.find('option').attr('selected', 'selected');
            });
        }
        function moveOptionsUpAndDownHandler($upButton, $downButton, $select) {
            $upButton.click(function () {
                $returnSelected($select).each(function () {
                    $(this).insertBefore($(this).prev());
                });
            });
            $downButton.click(function () {
                $returnSelected($select).each(function () {
                    $(this).insertAfter($(this).next());
                });
            });
        }

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
            var $label = $(this);

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

    Widgets.FixedHeaderTable = function ($el, options) {
        var base = this;

        base.$container = $el;
        base.defaults = {
            fixedHeaderClass: 'int-fixedHeader'
            , containerHeight: 200
            , viewport: 480
        };
        base.options = $.extend(base.defaults, options);
    };
    Widgets.FixedHeaderTable.prototype.init = function () {
        var base = this,
            o = base.options,
            $container = base.$container,
            $table = $container.find('table'),
            $tableContainer = $table.parent('div'),
            $thead = $table.find('thead'),
            $tbody = $table.find('tbody'),
            $firstRowTds = $tbody.find('tr').eq(0).children('td'),
            fixedHeaderHTML = '<div class="int-tableFeature ' + o.fixedHeaderClass + '"><table><thead>' + $thead.html() + '</thead></table></div>';

        $thead.hide();
        $container.prepend(fixedHeaderHTML);

        var $fixedHeaderContainer = $container.find('.' + o.fixedHeaderClass),
            $fixedHeaderColumns = $fixedHeaderContainer.find('th');

        setFixedHeaderColumnWidths();
        $tableContainer.outerHeight(o.containerHeight);

        $(window).resize(function () {
            setFixedHeaderColumnWidths();
        });

        function setFixedHeaderColumnWidths() {
            if ($(window).width() <= o.viewport) {
                showRelevantHeader($thead, $fixedHeaderContainer);
            } else {
                var widthsOfTds = [],
                    totalWidthOfTds = 0;

                showRelevantHeader($fixedHeaderContainer, $thead);
                getWidthsOfTds($firstRowTds, widthsOfTds);

                for (var i = 0; i < widthsOfTds.length; i++) {
                    $fixedHeaderColumns.eq(i).outerWidth(widthsOfTds[i]);
                    totalWidthOfTds = totalWidthOfTds + widthsOfTds[i];
                }

                //Widths of the final column header takes account of the scroll bar.
                var scrollBarWidth = $container.outerWidth() - totalWidthOfTds;
                $fixedHeaderContainer.outerWidth(totalWidthOfTds + scrollBarWidth);                             //Set the width of container for fixed header
                $fixedHeaderColumns.eq(-1).outerWidth(widthsOfTds[widthsOfTds.length - 1] + scrollBarWidth);    //Set the last fixed header column width
            }
        }
        function showRelevantHeader($header1, $header2) {
            $header1.show();
            $header2.hide();
        }
        function getWidthsOfTds($cells, arrayOfTdWidths) {
            $cells.each(function () {
                arrayOfTdWidths.push($(this).outerWidth());
            });
        }

        return base;
    };

    Widgets.PersistentHeaders = {};
    Widgets.PersistentHeaders.Table = function ($el, options) {
        this.$area = $el;
        this.defaults = {
            headerClass: 'int-persistentTableHeader'
            , floatingHeaderClass: 'int-floatingTableHeader'
            , scrollWindowSelector: '#int-content'              //the scrollable window - normally window but in AppFramework this is #int-content
            , widthAdjustment: 1
        };
        this.options = $.extend(this.defaults, options);
    };
    Widgets.PersistentHeaders.Table.prototype.init = function () {
        var base = this,
            o = base.options,
            $scrollWindow = $(o.scrollWindowSelector),
            $area = base.$area,
            areaPosition = $area.position(),
            areaHeight = $area.height(),
            $floatingHeader = $area.find('.' + o.headerClass),
            $floatingHeaderColumns = $floatingHeader.find('th'),
            $header = function () {
                return $floatingHeader.prev('.' + o.headerClass);
            };

        //Clone header and insert before current header. Turn header into floating header.
        $floatingHeader.before($floatingHeader.clone()).addClass(o.floatingHeaderClass);

        $(o.scrollWindowSelector).scroll(function () {
            setFloatingHeaderVisibility();
        }).trigger('scroll');

        $(window).resize(function () {
            setFloatingHeaderPosition();
            setFloatingHeaderWidth();
        }).trigger('resize');

        function setFloatingHeaderVisibility() {
            var dynamicAreaPosition = $area.position(),
                scrollPosition = $scrollWindow.scrollTop(),
                displayFloatingHeader = (dynamicAreaPosition.top <= 0) && (scrollPosition < areaHeight + areaPosition.top);

            $floatingHeader.css('display', displayFloatingHeader ? 'block' : 'none');
        }
        function setFloatingHeaderWidth() {
            var arrayOfTdWidths = [];

            $header().find('th').each(function () {
                arrayOfTdWidths.push($(this).outerWidth());
            });

            for (var i = 0; i < arrayOfTdWidths.length; i++) {
                $floatingHeaderColumns.eq(i).outerWidth(arrayOfTdWidths[i] + o.widthAdjustment);
            }
        }
        function setFloatingHeaderPosition() {
            $floatingHeader.css('top', $scrollWindow.offset().top);
        }

        return base;
    };

    //Global Components

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
                base.$trigger.html(o.dynamicText[(base.$content.is(':visible')) ? 1 : 2]);
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

    Widgets.Throbber = function ($el, options) {
        var base = this;

        base.$throbber = $el;
        base.defaults = {
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
        base.ajaxLoaderTimer = null;
        base.timeout = 250;
        base.options = $.extend(base.defaults, options);
    };
    Widgets.Throbber.prototype.init = function () {
        var base = this,
            opts = base.options,
            $throbber = base.$throbber,
            showSpinner = function () {
                base.ajaxLoaderTimer = setTimeout(function () {
                    $throbber.spin(opts);
                }, base.timeout);
            },
            hideSpinner = function () {
                window.clearTimeout(base.ajaxLoaderTimer);
                $throbber.spin(false);
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

    Widgets.ButtonTextToggler = function ($button, text) {
        this.$button = $button;
        this.text = text;
    };
    Widgets.ButtonTextToggler.prototype.init = function() {
        var base = this,
            counter = true;
        
        base.$button.html(base.text[0]);
        
        base.$button.click(function () {
            if (counter) {
                $(this).html(base.text[1]);
            } else {
                $(this).html(base.text[0]);
            }
            counter = !counter;
        });

        return base;
    };

    //Global Handlers handle events at a parent level.
    //Events bubble up to be handled by parent element so new elements added to the DOM may not need to be instantiated as long as they share the same HTML markup
    Widgets.GlobalHandler = {};

    Widgets.GlobalHandler.Alerts = function ($el, options) {
        var base = this;

        base.$parent = $el;
        base.defaults = {
            hideButtonClass: 'int-alertClose'
            , removeButtonClass: 'int-alertRemove'
            , alertClass: 'int-alert'
        };
        base.options = $.extend(base.defaults, options);
    };
    Widgets.GlobalHandler.Alerts.prototype.init = function () {
        var base = this,
            o = base.options,
            $contentArea = base.$parent,
            $closestAlertFrom = function ($el) {
                return $el.closest('.' + o.alertClass);
            };

        $contentArea
            .on('click', '.' + o.hideButtonClass, function () {
                $closestAlertFrom($(this)).hide();
            })
            .on('click', '.' + o.removeButtonClass, function () {
                $closestAlertFrom($(this)).remove();
            });

        return base;
    };

    Widgets.GlobalHandler.FormHelp = function ($el, options) {
        var base = this;

        base.$parent = $el;
        base.defaults = {
            helpMessageClass: 'int-helpDesc'
            , triggerClass: 'int-help'
        };
        base.options = $.extend(base.defaults, options);
    };
    Widgets.GlobalHandler.FormHelp.prototype.init = function () {
        var base = this,
            o = base.options,
            $contentArea = base.$parent,
            messageSelector = '.' + o.helpMessageClass;

        $contentArea.on('click', '.' + o.triggerClass, function () {
            var $messages = $(messageSelector),
                $message = $(this).parents().eq(2).children(messageSelector),
                hiddenStr = function () { return ':hidden'; };

            $messages.slideUp(150);

            $message.filter(hiddenStr()).slideDown(150);
        });

        return base;
    };

    Widgets.GlobalHandler.TipsyTooltip = function ($el, options) {
        var base = this;

        base.$parent = $el;
        base.defaults = {
            tooltipSelector: '.int-tooltip[title]'
            , tipsyCalledClass: 'tipsy-tooltip'
        };
        base.options = $.extend(base.defaults, options);
    };
    Widgets.GlobalHandler.TipsyTooltip.prototype.init = function () {
        var base = this;

        var $contentArea = base.$parent,
            o = base.options,
            tooltipSelector = o.tooltipSelector;

        $contentArea.on('mouseenter', tooltipSelector, function () {
            var $el = $(this);

            if (!$el.hasClass(o.tipsyCalledClass)) {
                $el
                    .tipsy({ gravity: $.fn.tipsy.autoNS })
                    .addClass(o.tipsyCalledClass)
                    .trigger('mouseenter'); //to trigger the tooltip
            }
        });

        return base;
    };

    Widgets.GlobalHandler.ExpandableTables = function ($el, options) {
        var base = this;

        base.$parent = $el;
        base.defaults = {
            tableClassName: 'int-expandingTable'
            , childTableRowClassName: 'int-childTable'
            , triggerRowClassName: 'int-parent'
            , triggerRowHiddenIconClassName: 'int-icon-caret-right'
            , triggerRowVisibleIconClassName: 'int-icon-caret-down'
            , iconMarkup: '<i class="int-icon-caret-right"><a href="#"></a></i>&nbsp;'
            , selectedClassName: 'int-selected'
        };
        base.options = $.extend(base.defaults, options);
        base.hidden = true;
    };
    Widgets.GlobalHandler.ExpandableTables.prototype.init = function () {
        var base = this,
            o = base.options,
            $parent = base.$parent,
            $childTableRows = $parent.find('.' + o.childTableRowClassName);

        $childTableRows
            .hide()
            .prev('tr').addClass(o.triggerRowClassName);

        var $triggerRows = $parent.find('.' + o.triggerRowClassName);

        $triggerRows.css({
            'cursor': 'pointer'
            , '-webkit-touch-callout': 'none'
            , '-webkit-user-select': 'none'
            , '-khtml-user-select': 'none'
            , '-moz-user-select': 'none'
            , '-ms-user-select': 'none'
            , 'user-select': 'none'
        });

        prependIcon();
        triggerRowClickHandler();

        function prependIcon() {
            $triggerRows.children('td:first-child').remove('i').prepend(o.iconMarkup);
        }
        function triggerRowClickHandler() {
            $parent.on('click', '.' + o.triggerRowClassName, function () {
                $(this).toggleClass(o.selectedClassName).next('.' + o.childTableRowClassName).fadeToggle(0);
                $(this).children(':first-child').children('i').toggleClass(o.triggerRowHiddenIconClassName).toggleClass(o.triggerRowVisibleIconClassName);
            });
        }

        return base;
    };
    Widgets.GlobalHandler.ExpandableTables.prototype.showAll = function ($button) {
        var base = this,
            o = base.options;

        $button.click(function () {
            var $childTableRows = base.$parent.find('.' + o.childTableRowClassName),
                $triggersWithHiddenChildTableRows = $childTableRows.filter(':hidden').prev('.' + o.triggerRowClassName),
                $TriggersWithVisibleChildTableRows = $childTableRows.filter(':visible').prev('.' + o.triggerRowClassName),
                $triggers = (base.hidden) ? $triggersWithHiddenChildTableRows : $TriggersWithVisibleChildTableRows;
            $triggers.trigger('click');
            base.hidden = !base.hidden;
        });

        return base;
    };

}(jQuery, OU.Widgets));