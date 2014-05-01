//31 - Aria-Controls unbound from functionality

OU.AppFramework = {};

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
            var $pageControlBar = $('#int-pageControlBar');
            //ensure scrollbar does not disappear behind control bar
            $('#int-content').css('bottom',
                parseInt($pageControlBar.css('height')) +
                    parseInt($pageControlBar.css('padding-bottom')) +
                    parseInt($pageControlBar.css('padding-top')) +
                    parseInt($pageControlBar.css('border-top-width')) + 'px'
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
        var $contentArea = $('#int-content'),
            fn = {
                buttons: function () {
                    //Radio Switch
                    $('.int-radioSwitch').find('input[type="radio"]').eq(0).prop('checked', true); //Ensures that the the default for radio switch is always checked at the start

                    (function dropDownMenu() {
                        //Drop Down Menu
                        $('.int-dropButton').each(function () {
                            var newInstance = new OU.Widgets.DropDownMenu($(this), $(this).next('.int-dropMenu')).init();
                        });
                    })();
                    (function dropDownContent() {
                        //Drop Down Content
                        $('.int-dropDivButton').each(function () {
                            var $trigger = $(this),
                                $content = $trigger.next('.int-dropDiv');

                            $trigger.click(function () {
                                $content.width($content.parent().width() - 50).css('margin-top', '.4em');   //Resize content to fit parent container
                            });
                            var newInstance = new OU.Widgets.Toggler($trigger, $content, {}).init();
                        });
                    })();
                    (function contentToggler() {
                        //Content Toggler
                        $('.int-toggleTrigger').each(function () {
                            var newInstance = new OU.Widgets.Toggler($(this), $(this).next('.int-toggle'), {}).init();
                        });
                    })();
                    (function moreInfoToggler() {
                        //More Info Toggler
                        $('.int-more').each(function () {
                            var newInstance = new OU.Widgets.Toggler($(this), $(this).next('.int-less'), {
                                dynamicText: [true, '<i class="int-icon-minus"></i> Less Info', '<i class="int-icon-plus"></i> More Info']
                            }).init();
                        });
                    })();
                    (function accordionToggler() {
                        //Accordion Toggler
                        $('.int-toggler').each(function () {
                            var newInstance = new OU.Widgets.AccordionToggler($(this), {
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
                                , triggerClasses: ['int-togglerHeadActive', 'widget-slave-hidden']
                                , contentClasses: ['int-togglerContentActive', 'widget-hidden']
                                , iconClasses: ['int-icon-chevron-down', 'int-icon-chevron-right']
                            }).init();
                        });

                        //Accordion Button
                        var showObj = {
                            allHiddenPanelsShow: function () {
                                $('.int-toggler').children('div').filter(':hidden').prev('h3').trigger('click');
                            }
                            , allVisiblePanelsHide: function () {
                                $('.int-toggler').children('div').filter(':visible').prev('h3').trigger('click');
                            }
                        };
                        $('.int-showAllToggler').togglefn(showObj.allHiddenPanelsShow, showObj.allVisiblePanelsHide);
                        $('.int-showToggler').each(function () {
                            var a = function () {
                                $(this).next('.int-toggler').children('div').filter(':hidden').prev('h3').trigger('click');
                            },
                                b = function () {
                                    $(this).next('.int-toggler').children('div').filter(':visible').prev('h3').trigger('click');
                                };
                            $(this).togglefn(a, b);
                        })
                    })();
                }
                , forms: function () {
                    $('input, textarea').formtips({
                        tippedClass: 'tipped'
                    });
                }
                , tables: {
                    sortable: function () {
                        $(".int-sortableTable thead tr th").append('<a href="#" role="button"></a>');
                        $(".int-sortableTable").tablesorter();
                    }
                    , expandable: function () {
                        $('.int-expandingTable').each(function () {
                            var expandingTableInstance = new OU.Widgets.GlobalHandler.ExpandableTables($(this), {}).init().showAll($('[data-controls="' + $(this).attr('id') + '"]'));
                        });
                    }
                    , init: function () {
                        this.sortable();
                        this.expandable();
                    }
                    , datatables: function () {
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
                    }//Datatables - initialised separately. Removes show entries' select and appends it to after the label. Has to be called after the function call for datatables.
                }
                , globalHandlers: function () {
                    this.help = new OU.Widgets.GlobalHandler.FormHelp($contentArea, {}).init();
                    this.alerts = new OU.Widgets.GlobalHandler.Alerts($contentArea, {}).init();
                    this.tooltip = new OU.Widgets.GlobalHandler.TipsyTooltip($contentArea, {}).init();
                    this.tooltipW = new OU.Widgets.GlobalHandler.TipsyTooltip($contentArea, {
                        tooltipSelector: '.int-tooltipW[title]'
                        , tipsyCalledClass: 'tipsy-tooltipW'
                    }).init();
                }
            };

        return {
            UpdateAll: function () {
                this.UpdateGlobalHandlers();
                this.UpdateButtons();
                this.UpdateForms();
                this.UpdateTables();
                this.UpdateDatatables();
            },
            UpdateGlobalHandlers: function () {
                fn.globalHandlers();
            },
            UpdateButtons: function () {
                fn.buttons();
            },
            UpdateForms: function () {
                fn.forms();
            },
            UpdateTables: function () {
                fn.tables.init();
            },
            UpdateDatatables: function () {
                fn.tables.datatables();
            }
        };
    };

    appFramework.Aria = function () {

        var role = function ($el, role) {
            $el.attr('role', role);
        };


        var fn = {
            updateAll: function () {
                this.updateMain();
                this.updateButtons();
                this.updateForms();
                this.updateNavigation();
                this.updateNotifications();
                this.updateTables();
                this.updateDatatables();
                this.updateTypography();
            }
            , updateMain: function () {
                (function Roles() {
                    role($('#int-content'), 'main');
                    role($('.int-primary, .int-secondary, .int-accordionNav'), 'navigation');
                    role($('#int-region1, #int-region2'), 'region');
                    role($('.int-controlBar'), 'toolbar');
                })();
                (function SkipToMainContent() {
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
                })();
            }
            , updateButtons: function () {
                (function Roles() {
                    role($('.int-button').not('button'), 'button');
                })();
            }
            , updateForms: function () {
                (function Roles() {
                    var $errorMessage = $('.int-errorMessage');
                    $('.int-radioGroup').attr('role', 'radiogroup');
                    $('.int-slideButton').attr('role', 'presentation'); //Sliding bar for radio switch for presentation only.
                    $('form').attr('role', 'form');
                    $errorMessage.attr('role', 'alert');
                    $('input[type="text"], textarea').attr('role', 'textbox');
                    $('.int-checkToggle p, .int-checkToggle span').attr('role', 'presentation'); //for checkswitches
                    $('textarea[rows]').attr('aria-multiline', 'true');
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
                })();
            }
            , updateNavigation: function () {
                (function Roles() {
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
                    $('.int-disabled a').attr('aria-disabled', 'true');
                    $('.int-pagination ul li:not(.int-disabled) a').attr('aria-disabled', 'false');
                })();
            }
            , updateNotifications: function () {
                (function Roles() {

                })();
            }
            , updateTables: function () {
                (function Roles() {

                })();
            }
            , updateDatatables: function () {
                (function Roles() {

                })();
            }
            , updateTypography: function () {
                (function Roles() {
                    role($('i[class*="int-icon"], hr, int-vantageLogo'), 'presentation');
                    role($('.int-note').attr('aria-live', 'polite'), 'note');
                })();
            }
        };

        return {
            UpdateAll: function () {
                fn.updateAll();
            },
            UpdateMain: function () {
                fn.updateMain();
            },
            UpdateButtons: function () {
                fn.updateButtons();
            },
            UpdateForms: function () {
                fn.updateForms();
            },
            UpdateNavigation: function () {
                fn.updateNavigation();
            },
            UpdateNotifications: function () {
                fn.updateNotifications();
            },
            UpdateTables: function () {
                fn.updateTables();
            },
            UpdateDatatables: function () {
                fn.updateDatatables();
            },
            UpdateTypography: function () {
                fn.updateTypography();
            }
        };
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

    appFramework.GeneralFramework = {
        Framework: function () {
            //Replaces uif-framework
            //update menu when an entry in the A to Z listing is selected
            $('#a2z .enabled').click(function (e) {
                var appId = $(e.target).attr('id');
                window.OU.Vantage.MenuManager.SelectApp($(appId));
            });

            //Wire anchor buttons with a data-target-form attribute to submit that form when clicked (used to allow control bar buttons to submit forms)
            $('a[data-target-form]').click(function (e) {
                e.preventDefault();
                var formId = $(this).attr('data-target-form');
                $('#' + formId).submit();
            });
        },
        AutoComplete: function () {
            //application tags for autocomplete
            var acApplications;

            var id = "";
            var value = "";
            var label = "";

            // wrapped in { } on line above simply for hiding in ultraedit
            acApplications = [];

            $('.app').each(function () {

                var entry = new Object();
                entry.id = $(this).attr('id');
                entry.label = $(this).attr('id');
                entry.value = $(this).attr('id');
                acApplications.push(entry);
            });


            //set up autocomplete
            $("#search").autocomplete({
                minLength: 3,
                source: acApplications,
                focus: function (event, ui) {
                    $('#search').val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    $("#search").val(ui.item.label);
                    var idSelected = ui.item.id;
                    //$('#int-content').html("<br /><br />" + idSelected);	//todo - update menu to display selected application
                    OU.Vantage.MenuManager.SelectApp("#" + idSelected);
                    return false;
                }
            });

            $("#search").click(function () {
                $(this).val("");
            });

            /*
             //old application structure
             {
             acApplications = [
             "3T Manual Allocation",
             "ADMS Batch Tracking",
             "ADMS Document Production Selection",
             "ADMS Exam Script Tracking",
             "ADMS Item Tracking",
             "ADMS Language Oral Exams Tracking",
             "ADMS Marker Allocation",
             "ADMS Marker Maintenance",
             "ADMS Parameter Maintenance",
             "ADMS Parameter View",
             "ADMS Project Tracking",
             "ADMS Special Exam Request Maintenance",
             "AL Applications",
             "AL CPCM Points Maintenance",
             "AL CVP Params",
             "AL Interviews",
             "AL Staff Search",
             "AVC Enquiry Maintenance",
             "Activity Line Link Maintenance",
             "Activity Line Maintenance",
             "Activity Maintenance",
             "Activity Search",
             "Advert Request Maintenance (PIMS)",
             "Advert Search (Pims)",
             "Advice Referral",
             "Advice Referral Summary - Stud/Corp Contact",
             "Advice Summary - Student/Corporate Contact",
             "Advice and Information",
             "Allocation Factors",
             "Allocation Group Members",
             "Allocation Group Search",
             "Allocation Groups",
             "Allowance Summary (PIMS)",
             "Alternative CPCM Points Maintenance",
             "Amaxis Group Maintenance",
             "Amaxis Group Search",
             "Amaxis Module Maintenance",
             "Amaxis Module Search",
             "Appeals",
             "Application Grade Set Maintenance",
             "Application Search",
             "Application Server DB Connections Maintenance",
             "Applications",
             "Applications Maintenance (PIMS)",
             "Appointment Allowance (PIMS)",
             "Appointment Amendment (PIMS)",
             "Appointment Cancellation (PIMS)",
             "Appointment Dates (PIMS)",
             "Appointment End (PIMS)",
             "Appointment Extension (PIMS)",
             "Appointment Generation (PIMS)",
             "Appointment Location (PIMS)",
             "Appointment Pay Factors",
             "Appointment Search",
             "Appointment Summary (PIMS)",
             "Appointments",
             "Approval of Student Requests",
             "Areas of Disability",
             "Assessment Adjustment and Tags Maintenance",
             "Assessment Copies Print Maintenance",
             "Assessment Job Request",
             "Assessment Late Data Monitoring",
             "Assessment Report Selection",
             "Assessment Special Circumstances Entry",
             "Associate Lecturer Contact Details",
             "Audit Viewer",
             "Authorisation Id Maintenance",
             "Award",
             "Award Activity Line Groups",
             "Award Classification Route",
             "Award Course",
             "Award Course Group Search",
             "Award Course Groups",
             "Award Designation",
             "Award Groups",
             "Award Job Scheduling",
             "Award Level",
             "Award Paths",
             "Awards and Ceremonies Parameters",
             "Bank Branch",
             "Bank Details",
             "Batch Fee Parameter Maintenance",
             "Batch Runs and Reports",
             "Batch Runs and Reports - New",
             "Budget Code Conversion",
             "Budget Code GL Maintenance",
             "Bulk Appointment Acceptance",
             "Bulk Appointment Refusal",
             "Bulk Line Manager Maintenance",
             "Bulk Performance Assessment",
             "Bulk Staff CVP Status/Tutorial Hours",
             "CAR Details",
             "CAR Manager",
             "CAR Message CVP Links",
             "CAR Message Maintenance",
             "CAR Outstanding Batch Summary",
             "CCP Double Marked Task Maintenance",
             "CCP Single Marked Task Maintenance",
             "CDH Demo",
             "AL CDSA Details Maintenance",
             "Tuition Observation",
             "CIRCE Applet Registration",
             "CIRCE Role Registration",
             "CIRCE Template Registration",
             "CIRCE_MI Role Registration",
             "CIRCE_MI Template Registration",
             "CMA Error Records",
             "CMA Level 3 Feedback Parameters",
             "CMA Parameters",
             "CMA Status Maintenance",
             "CTP Details",
             "CTP Manager",
             "CTP Outstanding Batch Summary",
             "CVP Conflation Parameter Maintenance",
             "Conflation Period Details",
             "CVP Conflation Period Maintenance",
             "CVP Despatch Dependency Maintenance",
             "CVP Fees",
             "CVP Registration Groups",
             "CVP Services",
             "CVPs Linked to Non Std Desp Components",
             "Cap a BD Award",
             "Carrier Maintenance",
             "Carrier Postcode",
             "Carry Forward Student Assignment Scores",
             "Catchment Area to Exam Centre Mappings",
             "Catchment Area Defaults Maintenance",
             "Catchment Area Groups",
             "Catchment Areas",
             "Ceremony",
             "Ceremony Guest List",
             "Ceremony Preference Status Summary",
             "Ceremony Waiting List",
             "Certificate Request",
             "Certificate of Sponsorship Maintenance (PIMS)",
             "Change Student Allocation",
             "Claim Check",
             "Claim Details",
             "Claim Summary",
             "Collaborating Establishment Details",
             "Collaborating Establishments",
             "Collaborative Course Results Maintainance",
             "Company",
             "Company Search",
             "Complaints",
             "Completion Profile Maintenance",
             "Conflation Simulation",
             "Contact Maintenance (PIMS)",
             "Copy Allocation Groups",
             "Copy Miscellaneous Recipient CVPs",
             "Corporate Contact",
             "Corporate Contact Search",
             "Corporate Course Details",
             "Corporate Course Reservation",
             "Corporate Discounts",
             "Corporate Discounts Search",
             "Counsellor Links",
             "Country Group Pricing Area",
             "Course",
             "Course Assessment External File Entry",
             "Course Assessment Feedback Control",
             "Course Assessment Outcome Boundary Maintenance",
             "Course Assessment Parameter Maintenance (2008 06)",
             "Course Assessment Parameter Maintenance",
             "Course Assessment Parameter Status View",
             "Course Assessment Template A",
             "Course Assessment Template B",
             "Course Assessment Template C",
             "Course Assessment Template D",
             "Course Assessment Template E",
             "Course Content Details",
             "Course Criteria",
             "Course Exam Session Availability Restrictions",
             "Course Family Group Maintenance",
             "Course Fee Payment",
             "Course Price",
             "Course Regulations",
             "Course Search",
             "Course Summary",
             "Course Sundry Fees",
             "Course Version",
             "Course Version Appointments",
             "Course Version Presentation",
             "Credit Transfer Award",
             "Credit Transfer Claim",
             "Credit Transfer Claim Activity",
             "Criminal Record Check",
             "DRT Appointment Details Release",
             "Data Class Builder",
             "Database Registration",
             "Database Registration",
             "Delivery Instructions Maintenance",
             "Delphi Department Maintenance",
             "Despatch Confirmation",
             "Despatch Details",
             "Despatch Notes",
             "Despatch Output Print",
             "Despatch Output Reprint",
             "Despatch Request",
             "Despatch Summary",
             "Disabilities and Add Req's Facilities",
             "Disabilities and Add Req's Facility Search",
             "Disabilities and Add Req's Facility Type",
             "Discipline Applications",
             "Discipline and Academic Units",
             "Document Despatch",
             "Document Mailing Maintenance",
             "Document Print Diversion",
             "EAB AG Mark Maintenance",
             "ECA Guideline Maintenance",
             "ECA Parameter Maintenance",
             "EDS Document Code Maintenance",
             "EDS Document Details Maintenance",
             "ENA Parameter Maintenance",
             "ETMA Parameter Maintenance",
             "Enquiry",
             "Enquiry History",
             "Enquiry Maintenance (PIMS)",
             "Enrol Document Messages Maintenance",
             "Enrol Documents Requests",
             "Entitlement Maintenance",
             "Event Maintenance",
             "Event Room Bookings",
             "Event Search",
             "Event Staff Maintenance",
             "Event Timetable Search",
             "Event Timetable Summary",
             "Exam CV Session Maintenance",
             "Exam Centre Details",
             "Exam Centre Session Maintenance",
             "Exam Copies Print Maintenance",
             "Exam Schedule Control",
             "Exam Schedule File Viewer",
             "Exam Schedule Request",
             "Exam Schedule Viewer",
             "Exam Session Details",
             "Exam Summary",
             "Exam Timetable Basic Details",
             "Exam Timetable Course Groups",
             "Exam Timetable Manual Adjustment",
             "Exam Timetable Production Control",
             "Exam Timetable Special Schedule",
             "Exams",
             "Exception Confirmation and Reprint",
             "Extensions",
             "Eye Care Voucher Maintenance",
             "Fast Input Enquiry",
             "Fee Calculation",
             "Fee Parameters",
             "Financial Support Applications",
             "Financial Support Budgets",
             "Fix/Notify Allocation Groups",
             "Geographical Criteria",
             "Grant Claims",
             "Grant Parameters",
             "Grant Payments",
             "Grant Rates",
             "Grants",
             "Guideline Status Set Maintenance",
             "Hesa Control Lists",
             "Hesa Maintenance (PIMS)",
             "Hesa Parameters",
             "Hesa Return Contract (PIMS)",
             "Hesa Return Person (PIMS)",
             "Hesa Returns (PIMS)",
             "Hesa Student Details",
             "Historic Despatches",
             "Historic Results Maintenance",
             "Hubs and Clusters",
             "IRD Review",
             "In Tray (PIMS)",
             "Infrastructure Id Maintenance",
             "Institutional Mailings",
             "Interview Maintenance (PIMS)",
             "Invitation To Apply",
             "Invitation To Apply Search",
             "Invoice Address Search",
             "Invoice Addresses",
             "Job Code Maintenance (PIMS)",
             "Mailing CVP Status Change",
             "Mailing Criteria Maintenance",
             "Mailing Pack Maintenance",
             "Mailing Progress",
             "Mailing Search",
             "Maintain Credit Transfer Claim Type",
             "Maintain Credit Transfer Subject",
             "Maintain Hosts",
             "Maintain Ingres Permissions",
             "Maintain LocnCombinations",
             "Maintain Machine Accounts",
             "Maintain SQL Server Permissions",
             "Maintain Nation and Transitional Fee Status",
             "Maintain User Accounts",
             "Maintain User Remit Profile (PIMS)",
             "Manifest Create",
             "Manifest Preview",
             "Manual Allocation",
             "Manual Fee Waivers",
             "Manual Student Exam Centre Allocation (New)",
             "Manual Student Exam Centre Allocation",
             "Medical Codes Maintenance",
             "Medical Conditions Maintenance",
             "Medical Event Maintenance",
             "Medical Loans Maintenance",
             "Membership Maintenance",
             "Message Code Maintenance",
             "Message Details",
             "Miscellaneous Fees",
             "Miscellaneous Recipient Details",
             "Module Life Change",
             "Monitor Your Advice Items",
             "MSE AL Contact Details",
             "MSE AL Staff Search",
             "MSE Event Room Bookings",
             "MSE Event Search",
             "MSE Event Timetable Search",
             "MSE Public Holiday Maintenance",
             "MSE Tutor Events Summary",
             "MSE Venue Contact Details",
             "MSE Venue Facility Details",
             "MSE Venue Maintenance",
             "MSE Venue Room Details",
             "MSE Venue Room Maintenance",
             "MSE Venue Room Summary",
             "MSE Venue Search",
             "Multiple Student Reallocation",
             "New Refunds",
             "New Student Reservation",
             "New TMA Parameters",
             "Nominal Code Maintenance",
             "Non Course Based Fees",
             "Non Standard Despatch Requests",
             "Non Std Desp Components",
             "Non Std Desp Components Linked to CVPs",
             "OU Computer User Search",
             "Offer Maintenance (PIMS)",
             "Outstanding Grant Claims",
             "Outstanding Requests",
             "PI Merge",
             "PIMS SQL Submission",
             "PLANET Transfers",
             "Parameter Table Maintenance",
             "Partner Course Groups Maintenance",
             "Partner Institution Maintenance",
             "Pause Course Reservation",
             "Pay Enquiry",
             "Pay Factor Maintenance",
             "Payment Authorisation",
             "Payroll Switch",
             "Pending View",
             "Pension Scheme Transfers",
             "Pension Statement Query",
             "Performance Assessment",
             "Permanent\Fixed Status Maintenance (PIMS)",
             "Posy Category Keyword Maintenance",
             "Posy Coded Remark Maintenance",
             "Posy Item Maintenance",
             "Posy MI (NEW)",
             "Posy MI",
             "Posy Operator Maintenance",
             "Posy Order Number Maintenance",
             "Posy Purchase Orders",
             "Posy Recover Transferred Orders",
             "Posy Remark Link Maintenance",
             "Posy Supplier Maintenance",
             "Posy Vat Maintenance",
             "Presentation Carry Forward",
             "Presentation Transfer",
             "Presentation Transfer Maintenance",
             "Print Manager",
             "Print Monitor",
             "Print Requests",
             "Probation",
             "Probation Maintenance (PIMS)",
             "Processing Group Maintenance",
             "Progress and Probation",
             "Public Holiday Mtce",
             "Publication",
             "Publication Search",
             "Query Payments",
             "Quick Address Lookup",
             "Quota Maintenance",
             "Recall Manager",
             "Record Ceremony Attendance",
             "Recruitment Organisation Maintenance (PIMS)",
             "Reference Maintenance (PIMS)",
             "Refund Authorisation",
             "Refunds",
             "Remove Reregistration Requests",
             "Request Batch Mailing",
             "Request Credit Transfer Claim Form",
             "Request Enquiry Letters",
             "Retirement Dates (PIMS)",
             "Role Codes Maintenance (PIMS)",
             "Role Maintenance",
             "Role Pay Maintenance",
             "SAMPOP1",
             "SAMPOP2",
             "SAMPOP3",
             "SAMS Error Maintenance",
             "SAMS OUCU Person Id Link Maintenance",
             "SAMS Service Maintenance",
             "SAMS Service Relationship Maintenance",
             "SAMS Service Search",
             "SAMS Service Selection",
             "SAMS Service VLE Integration",
             "SAMS User Service Maintenance",
             "SAMS User Service Selection",
             "SCF Actual Costs Per Account",
             "SCF Appointment Account",
             "SCF Assign Actual Costs",
             "SCF Costing Appointment Account",
             "SCF Costing Forecast",
             "SCF Create Forecast Budget",
             "SCF Forecast Balance",
             "SCF Forecast Run Results",
             "SCF Forecast Run Selection",
             "SCF Inflation Rate",
             "SCF Maintain Allocation of Costs",
             "SCF Maintain Individuals Details",
             "SCF Maintain Parameters",
             "SCF Manipulate Forecast Budget",
             "SCF National Insurance Scale",
             "SCF Non Standard Forecast",
             "SCF Non-Standard Inflation Rate",
             "SCF Non-Standard Pension Rate",
             "SCF Option Screen",
             "SCF Pension Rate",
             "SCF Select Appointment Account",
             "SCF Select For Output Report",
             "SCF Select Inflation Rate",
             "SCF Select National Insurance Scale",
             "SCF Select Pension Rate",
             "SCF Standard Forecast",
             "SEPs and ARCs",
             "SLC FA Academic Year Maintenance",
             "SLC FA Eligible Awards Maintenance",
             "SLC Student Loans",
             "SRNEW Course",
             "SRNEW Course Pres",
             "Salary History (PIMS)",
             "Sanctions Inhibit List Maintenance",
             "Score Scale Maintenance",
             "Search Application",
             "Selection Monitor",
             "Selection Summary (PIMS)",
             "Service Registration",
             "Session Appointment Summary",
             "Session Attendance",
             "Source of Interest",
             "Source of Interest Search",
             "Special Skills Maintenance",
             "Special Skills Search",
             "Sponsor Invoice Selection",
             "Sponsoring Establishment Details",
             "Sponsoring Establishments",
             "Sponsorship Agreement",
             "Staff Casual Worker Maintenance",
             "Staff DAR Profile Text",
             "Staff Details (Research Degrees)",
             "Staff Development Participation",
             "Staff Development Summary",
             "Staff Development Type Maintenance",
             "Staff Disabilities",
             "Staff Enquiry",
             "Staff Enquiry History",
             "Staff Groups",
             "Staff Links",
             "Staff Maintenance (PIMS)",
             "Staff Maintenance",
             "Staff Manual RCS Requests",
             "Staff Monitoring Grade Set Maintenance",
             "Staff Payments",
             "Staff Per Students",
             "Staff Search (CIRCE)",
             "Staff Search (PIMS)",
             "Staff Selections and Labels",
             "Staff Special Skills",
             "Statements of Academic Record",
             "Student",
             "Student Academic Progress",
             "Student Activity Line Details",
             "Student Activity Line Summary",
             "Student Additional Fees Support",
             "Student Advice",
             "Student Allocation",
             "Student Assessment Score Simulation",
             "Student Assignment Details (New)",
             "Student Assignment Details",
             "Student Attendance",
             "Student Award Acceptance",
             "Student Award Completion Messages",
             "Student Award Designation Maintenance",
             "Student Award Level Course Maintenance",
             "Student Award Level History",
             "Student Award Level Maintenance",
             "Student Award Maintenance",
             "Student Award Progress Check",
             "Student Award Used Course Maintenance",
             "Student Ceremony",
             "Student Ceremony Allocation History",
             "Student Certificate Names",
             "Student Conflation Simulation",
             "Student Course Award History",
             "Student Course Details",
             "Student Course Fee Adjustment",
             "Student Course Outcome Exceptions",
             "Student Course Outcome Maintenance",
             "Student Course Result Maintenance",
             "Student Course Result Summary",
             "Student Course Search",
             "Student Course Status Change",
             "Student Course Status History",
             "Student Course Summary",
             "Student DAR Profile Text",
             "Student Details (Research Degrees)",
             "Student Disabilities",
             "Student Disabilities and Add Req's Requests",
             "Student Duplicate Search",
             "Student ECA Deferral",
             "Student ECMA Maintenance",
             "Student Excusals And Surrenders",
             "Student Fee Grant Allocation Status History",
             "Student Fees Summary",
             "Student Grant Assessment",
             "Student Grant Claims History",
             "Student Grant Entitlements",
             "Student Home Exam Parameters",
             "Student Loans",
             "Student Module Late Data Snapshots",
             "Student Outcome EAB Overrides",
             "Student Outcome Version Changes View",
             "Student Payments",
             "Student Pending Maintenance",
             "Student Preference Capture",
             "Student Qualification Maintenance",
             "Student Search",
             "Student Subordinate Awards",
             "Student Supplementary Details",
             "Student TMA Extensions",
             "Student Task Mark Maintenance",
             "Students On Corporate Reservation",
             "Students per Staff",
             "Study Event Maintenance",
             "Study Event Search",
             "Supplementary Details Template",
             "Suspensions",
             "THD Supplementary Information",
             "TMA Parameters",
             "TMA Payment Factors",
             "TMA Std Fee and Expense Payment Rates",
             "TSA Course Parameters",
             "TSA Presentation Signoff",
             "TSA RS Course Criteria",
             "TSA Related DARF",
             "Temporary Address Maintenance",
             "Thesis Details",
             "Transfer Staff between Units",
             "Trigger Pay",
             "Tutor Events Summary",
             "Tutor History",
             "Unified Staff Record Enquiry",
             "Unit Maintenance (PIMS)",
             "Unit Relationship Maintenance (PIMS)",
             "Unit Search (PIMS)",
             "User Creation and Maintenance",
             "User Name Search",
             "User Service Registration",
             "VLE Cluster Group Maintenance",
             "VLE Cluster Group Search",
             "VLE Data Integration",
             "VLE Data Integration Activities",
             "Vacancy Maintenance (PIMS)",
             "Vacancy Search (PIMS)",
             "Vacancy Search",
             "Vaccinations Maintenance",
             "Venue Contact Details",
             "Venue Facility Details",
             "Venue Maintenance",
             "Venue Room Details",
             "Venue Room Maintenance",
             "Venue Room Summary",
             "Venue Search",
             "View Drip Tray",
             "View Selected Recipients",
             "WIMS BOM Parameters",
             "WIMS Forecast Data Maintenance",
             "WIMS Stock Disposals",
             "Web Enquiry Category Search",
             "Web Enquiry Generic Publications",
             "Web Enquiry Publication Links",
             "Work Permit Info Maintenance (PIMS)",
             "Your Outstanding Advice Referrals"
             ];
             }
             */
        }
    };

    appFramework.Conditional = {
        IE8: function () {
            /* -----------IE7 Table Striping----------- */
            //$('tr').not(':odd').css('background-color', '#ffffff');
            $('table tr:even').addClass('int-striped');
            // Table Stripping fix for Sortable Tables
            function intStriped() {
                setTimeout(function () {
                    $('table.int-sortableTable tr:even').addClass('int-striped');
                }, 1);
            }
            $('table.int-sortableTable th.header').click(function () {
                $('table.int-sortableTable tr').removeClass('int-striped');
                intStriped();
            });
            // Paul:
            // beacause the click event on th.header is used to execute the table sort AND the adding of the class int-striped
            // I have added a delay of 1 milisecond before int-striped is added so the table sort executes first.
            // This prevents the class being added before the table sort which would put the zebra stripping in the wrong order.
            /* -----------End IE7 Table Striping----------- */
            //Fix pre tag display issues in ie8 and ie7
            $('pre').css('padding', '20px');
            $('pre.int-toggleCode').css('height', '50px');
        }
    };

})(jQuery, OU.AppFramework);

OU.AppFramework.UtilityHelper = new OU.AppFramework.Utility();
OU.AppFramework.ComponentHelper = new OU.AppFramework.Components();
OU.AppFramework.AriaHelper = new OU.AppFramework.Aria();
OU.AppFramework.Spinner = new OU.Widgets.Throbber($('#int-throbber'), {}).init();
OU.AppFramework.MenuManager = new OU.AppFramework.Menu();
OU.AppFramework.ModalHelper = new OU.AppFramework.Modal();
OU.AppFramework.GeneralFramework.AutoComplete();
OU.AppFramework.GeneralFramework.Framework();