//04 Changed namespace to OU.Accessibility
var OU = OU || {};
OU.Accessibility = {};

(function ($, Accessibility) {
    Accessibility.W3C = {
        Aria: {
            Roles: {
                Abstract: {
                    command: "command"
                    , composite: "composite"
                    , input: "input"
                    , landmark: "landmark"
                    , range: "range"
                    , roletype: "roletype"
                    , section: "section"
                    , sectionhead: "sectionhead"
                    , select: "select"
                    , structure: "structure"
                    , widget: "widget"
                    , window: "window"
                }
                , Widget: {
                    alert: "alert"
                    , alertdialog: "alertdialog"
                    , button: "button"
                    , checkbox: "checkbox"
                    , dialog: "dialog"
                    , gridcell: "gridcell"
                    , link: "link"
                    , log: "log"
                    , marquee: "marquee"
                    , menuitem: "menuitem"
                    , menuitemcheckbox: "menuitemcheckbox"
                    , menuitemradio: "menuitemradio"
                    , option: "option"
                    , progressbar: "progressbar"
                    , radio: "radio"
                    , scrollbar: "scrollbar"
                    , slider: "slider"
                    , spinbutton: "spinbutton"
                    , status: "status"
                    , tab: "tab"
                    , tabpanel: "tabpanel"
                    , textbox: "textbox"
                    , timer: "timer"
                    , tooltip: "tooltip"
                    , treeitem: "treeitem"
                }
                , WidgetComposite: {
                    combobox: "combobox"
                    , grid: "grid"
                    , listbox: "listbox"
                    , menu: "menu"
                    , menubar: "menubar"
                    , radiogroup: "radiogroup"
                    , tablist: "tablist"
                    , tree: "tree"
                    , treegrid: "treegrid"
                }
                , DocumentStructure: {
                    article: "article"
                    , columnheader: "columnheader"
                    , definition: "definition"
                    , directory: "directory"
                    , document: "document"
                    , group: "group"
                    , heading: "heading"
                    , img: "img"
                    , list: "list"
                    , listitem: "listitem"
                    , math: "math"
                    , note: "note"
                    , presentation: "presentation"
                    , region: "region"
                    , row: "row"
                    , rowheader: "rowheader"
                    , separator: "separator"
                    , toolbar: "toolbar"
                }
                , Landmark: {
                    application: "application"
                    , banner: "banner"
                    , complementary: "complementary"
                    , contentinfo: "contentinfo"
                    , form: "form"
                    , main: "main"
                    , navigation: "navigation"
                    , search: "search"
                }
            }
        }
    };

    //Plugins
    function dataToString($el, dataName) {
        var dataVal = $el.data(dataName);

        return typeof dataVal === 'undefined' ? '' : dataVal.toString();
    }

    //6.5.1. Widget Attributes - Aria States
    $.fn.AriaState = function (state, options) {
        var base = this;

        base.defaults = {
            checked: {
                dataName: 'checked'
                , values: ['true', 'false', 'mixed', '']
            }
            , disabled: {
                dataName: 'disabled'
                , values: ['true', 'false', '']
            }
            , expanded: {}
            , hidden: {}
            , invalid: {
                dataName: 'invalid'
                , values: ['grammar', 'false', 'spelling', 'true', '']
            }
            , pressed: {
                dataName: 'pressed'
                , values: ['true', 'false', 'mixed', '']
            }
            , selected: {
                dataName: 'selected'
                , values: ['true', 'false', '']
            }
        };

        var o = $.extend(base.defaults[state], options),
            fn = {};

        fn.setAriaStateByDataVal = function ($el, state) {
            var value = dataToString($el, o.dataName),
                i = $.inArray(value, o.values);

            if (o.values[i] !== '') {
                $el.attr('aria-' + state, o.values[i]);
            }
        };
        fn.setAriaStateByVisibility = function ($el, state, is) {
            $el.attr('aria-' + state, $el.is(is).toString());
        };

        return base.each(function () {
            var $el = $(this),
                states = {
                    checked: function () {
                        fn.setAriaStateByDataVal($el, state);
                    }
                    , disabled: function () {
                        fn.setAriaStateByDataVal($el, state);
                    }
                    , expanded: function () {
                        fn.setAriaStateByVisibility($el, state, ':visible');
                    }
                    , hidden: function () {
                        fn.setAriaStateByVisibility($el, state, ':hidden');
                    }
                    , invalid: function () {
                        fn.setAriaStateByDataVal($el, state);
                    }
                    , pressed: function () {
                        fn.setAriaStateByDataVal($el, state);
                    }
                    , selected: function () {
                        fn.setAriaStateByDataVal($el, state);
                    }
                };

            states[state]();
        });
    };

    $.fn.AriaProperties = function () {

    };
})(jQuery, OU.Accessibility);

