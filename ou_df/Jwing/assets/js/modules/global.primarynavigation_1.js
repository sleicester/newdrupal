// ----------------------------------------------------------
// OU.DigitalFramework.Global.PrimaryNavigation
// ----------------------------------------------------------
// The Open University © Copyright 2014. All rights reserved
// Original by Jaywing PLC
// Rewritten by Paul Liu
// paul.liu@open.ac.uk
// ----------------------------------------------------------
// v1.8
// Changes to service link selector from .int-meta-mob to .int-serviceLinksMob
// ----------------------------------------------------------


var OU = OU || {};                                                      //Add OU namespace, check for existing usages.

OU.DigitalFramework = OU.DigitalFramework || {};                        //Add Digital Framework Namespace, check for existing usages.
OU.DigitalFramework.Global = OU.DigitalFramework.Global || {};          //Global Namespace, check for existing usages.

//Closure to protect $ usage in case of use by other libraries.
(function($, window, df, undefined){
    //Extend jQuery function to be able to generate unique ids - used for aria.
    $.fn.OUId = function(){
        return this.each(function(){
            if(typeof $(this).attr('id') === 'undefined'){
                $(this).attr('id', 'OU-' + ($.fn.OUId.counter += 1));
            }
        });
    };
    $.fn.OUId.counter = 0;

    df.ie = (function(){
        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');

        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );

        return v > 4 ? v : undef;
    })();

    df.PrimaryNavigation = function(options){
        this.metadata = $('body').data('navigation-options');               //Allow developers to control primary navigation options from the DOM by adding a data attribute to the body
        this.options = $.extend({}, this.defaults, options, this.metadata); //Allow users the ability to define own options
        this.$nav = $(this.options.navSelector);
        this.$topLevelNav = this.$nav.find('.int-toplevel-nav');

        this.$secondLevelNav = this.$nav.find('.int-secondlevel-nav');

   this.$thirdLevelNav = this.$nav.find('.int-thirdlevel-nav');
        this.$responsiveNav = $(this.options.responsiveNavSelector);
        this.$serviceLink = $(this.options.serviceLinkSelector);
        this.$serviceLinkToggleButton = this.$serviceLink.find('.int-mob-menu-toggle');
        this.init();
    };
    df.PrimaryNavigation.prototype = {
        version: 'OU.DigitalFramework.Global.PrimaryNavigation | v1.8',
        defaults: {
            navSelector: '#ou-global-primary-navigation',
            classes: {
                subMenuClass: 'int-hasChildren'
            },
            markup:{
                navTrigger: '<a href="#" class="int-nav-trigger" role="button"><span><i class="int-icon int-icon-chevron-down"></i><i class="int-icon int-icon-chevron-up"></i></span></a>',
                responsive: {
                    backToMainMenuButton:'<a href="#" class="int-backToMainMenu"><span><i class="int-icon int-icon-chevron-left"></i> Back to Main menu</span></a>',
                    showSubMenuButtonContainer: '<div class="int-nav-sub-menu"><div class="int-container"></div></div>',
                    showSubMenuButton: '<a href="#" class="int-showSubMenu"><i class="int-icon int-icon-chevron-right"></i></a>',
                    showSubSubMenuButtonContainer: '<div class="int-nav-sub-sub-menu"><div class="int-container"></div></div>'
                }
            },
            responsive: true,       //Enable responsive navigation
            responsiveViewport: 768,//Set the viewport at which the responsive nav kicks in
            responsiveNavSelector:'#int-nav-mobile',    //Set the selector for the responsive nav
            serviceLink: true,      //Enable service link functionality
            serviceLinkSelector: '#int-serviceLinks',
            aria: true
        },
        closeSubMenu: function (toplevel) {
            if(toplevel) {
                this.$secondLevelNav.html('');
            }
            this.$thirdLevelNav.html('');
        },
        addNavTriggers: function($el){
            var o = this.options;

            $el.children('ul').children('li').each(function () {
                if($(this).find('ul').length > 0) {
                    $(this).addClass(o.classes.subMenuClass).append(o.markup.navTrigger);
                }
            });

            this.toggleSubMenu($el.find('.int-nav-trigger'));

            return this;
        },
        openSubMenu: function (menu, toplevel) {
            if(toplevel) {
                this.$thirdLevelNav.html('');
                this.$secondLevelNav.html('').append(menu);
                this.addNavTriggers(this.$secondLevelNav); //Add Secondary Nav Triggers
            } else {
                this.$thirdLevelNav.html('').append(menu);
            }
        },
        toggleSubMenu: function ($el) {
            var base = this;

            $el.click(function(){
                var toplevel = $(this).closest('.int-nav-level').hasClass('int-toplevel-nav');
                if($(this).parent().hasClass('int-nav-active')) {
                    base.closeSubMenu(toplevel);
                    $(this).parent().removeClass('int-nav-active');
                } else {
                    if(toplevel) {
                        base.$topLevelNav.children('ul').children('.int-nav-active').removeClass('int-nav-active');
                        base.$secondLevelNav.children('ul').children('li').removeClass('int-nav-active');
                    }
                    base.$secondLevelNav.children('ul').children('.int-nav-active').removeClass('int-nav-active');
                    base.openSubMenu($(this).parent().children('ul').clone().addClass('int-container'), toplevel);
                    $(this).parent().addClass('int-nav-active');
                }
            });
        },
        setActiveNav: function () {
            var $topLevelNav = this.$topLevelNav,
                $activeNav = $topLevelNav.find('.int-nav-active'),
                isTopLevel = $activeNav.parent().parent().hasClass('int-toplevel-nav'),
                hasChildren = $activeNav.find('ul').length > 0,
                isSecondLevel = false;

            if ($activeNav.length > 0) {
                if (!isTopLevel) {
                    isSecondLevel = $activeNav.parent().parent().parent().parent().hasClass('int-toplevel-nav');
                    if (!isSecondLevel) {
                        $activeNav.parent().parent().addClass('int-nav-active').parent().parent().addClass('int-nav-active');
                        this.openSubMenu($activeNav.parent().parent().parent().clone().addClass('int-container'), true);
                        this.openSubMenu($activeNav.parent().clone().addClass('int-container'), isTopLevel);
                    } else {
                        $activeNav.parent().parent().addClass('int-nav-active');
                        this.openSubMenu($activeNav.parent().parent().children('ul').clone().addClass('int-container'), true);
                    }
                    $topLevelNav.children('ul').children('li').children('ul').children('li').removeClass('int-nav-active');
                }
                if(isTopLevel || isSecondLevel) {
                    if (hasChildren) {
                        this.openSubMenu($activeNav.children('ul').clone().addClass('int-container'), isTopLevel);
                    }
                }
            }

            return this;
        },
        responsiveNavClickHandlers: function(showMobileNav){
            if(showMobileNav){
                var markup = this.options.markup.responsive,
                    $responsiveNav = this.$responsiveNav;

                $responsiveNav
                    .each(function(){
                        $('.int-nav-alt-primary', this).append($('.int-toplevel-nav > ul').clone());

                        // add sub menu div's for alt mobile nav
                        $('.int-nav-alt-primary > ul > li > ul', this)
                            .wrap(markup.showSubMenuButtonContainer)
                            .find('ul') // add sub sub menu divs
                            .wrap(markup.showSubSubMenuButtonContainer);

                        $('.int-nav-alt-primary > ul > li', this).each(function () {
                            if ($(this).find('.int-nav-sub-menu').length > 0) { // if nav item has a sub menu
                                // add sub menu toggle nav items
                                $(this).append(markup.showSubMenuButton);
                                // add back to main link
                                $('.int-nav-sub-menu > .int-container', this).prepend(markup.backToMainMenuButton);

                                // loop through sub nav item
                                $('.int-nav-sub-menu > .int-container > ul > li', this).each(function () {
                                    var prevNav = $(this).children('a').text();
                                    if($(this).find('.int-nav-sub-sub-menu').length > 0) { // in nav item has a sub sub menu
                                        // add sub menu toggle nav items
                                        $(this).append('<a href="#" class="int-showSubSubMenu"><i class="int-icon int-icon-chevron-right"></i></a>');

                                        $(this).find('.int-nav-sub-sub-menu > .int-container').prepend('<a href="#" class="int-backToSubMenu"><span><i class="int-icon int-icon-chevron-left"></i> Back to ' + prevNav + '</span></a>');

                                    }
                                });
                            }
                        }); // loop through top level nav items

                        $('.int-nav-active',this).parents('li').addClass('int-nav-active');
                    })
                    .on('click', '.int-nav-toggle', function (e) {
                        e.preventDefault();
                        $responsiveNav.toggleClass('int-nav-open');
                    })
                    .on('click', '.int-showSubMenu, .int-showSubSubMenu', function (e) {
                        e.preventDefault();
                        $(this).parent().addClass('int-nav-active');
                    })
                    .on('click', ' .int-nav-mob-overlay', function (e) {
                        e.preventDefault();
                        $responsiveNav.removeClass('int-nav-open');
                    })
                    .on('click', '.int-backToMainMenu', function (e) {
                        e.preventDefault();
                        $responsiveNav.find('.int-nav-active').removeClass('int-nav-active');
                    })
                    .on('click', ' .int-backToSubMenu', function (e) {
                        e.preventDefault();
                        $(this).closest('li').removeClass('int-nav-active');
                    });
            }
            return this;
        },
        responsiveNavResizeHandler: function(showMobileNav){
            if(showMobileNav){
                var o = this.options,
                    base = this,
                    $window = $(window),
                    $nav = this.$nav,
                    $responsiveNav = this.$responsiveNav,
                    showCorrectMenu = function(){
                        if ($window.width() < o.responsiveViewport) {
                            $nav.hide();
                            $responsiveNav.show().attr('aria-hidden','false');
                            base.$serviceLink.addClass('int-serviceLinksMob');             //TODO Set with media queries
                        } else {
                            $nav.show();
                            $responsiveNav.hide().attr('aria-hidden','true');
                            base.$serviceLink.removeClass('int-serviceLinksMob');          //TODO Set with media queries
                        }
                    };

                $window.resize(showCorrectMenu).trigger('resize');
            }
            return this;
        },
        serviceLinkToggle: function(){
            var base = this;

            this.$serviceLinkToggleButton.click(function () {
                base.$serviceLink.toggleClass('int-nav-active');
            });

            return this;
        },
        aria: function(ariaOn, responsive){
            //Aria for main nav
            if(ariaOn){
                //noinspection JSDuplicatedDeclaration
                var $nav = this.$nav,
                    aria = {
                        role: function(){
                            $nav.find('.int-nav-level')
                                .attr('role','navigation')
                                .children('ul').attr({'role':'menu','aria-expanded': 'true','aria-hidden':'false'})
                                .children('li').attr('role','menuitem');

                            return this;
                        },
                        haspopup: function(){
                            $nav.find('.int-nav-level').attr({
                                'aria-haspopup':'true'
                            });

                            return this;
                        },          //Determines that the nav trigger has a popup element
                        selected: function(){
                            $nav.find('.int-nav-level').each(function(){
                                var isSelected = $(this).closest('.int-hasChildren').hasClass('int-nav-active').toString();

                                $(this).attr({
                                    'aria-selected': isSelected
                                })
                            });

                            return this;
                        },          //Determines which nav trigger is selected
                        controls: function(){
                            $nav.find('.int-nav-level').each(function(){
                                var $nextLevelNavStructure = $(this).next('.int-nav-level');

                                if($nextLevelNavStructure.length > 0){
                                    $(this).find('.int-nav-trigger').attr({
                                        'aria-controls': $nextLevelNavStructure.attr('id')
                                    });
                                }
                            });

                            return this;
                        },          //Determines the nav trigger which controls a child level nav
                        labelledby: function(){
                            $nav.find('.int-hasChildren').each(function(){
                                var id = $(this).children('a').eq(0).find('span').OUId().attr('id');

                                $(this).children('a').eq(1).attr('aria-labelledby', id);
                            });

                            return this;
                        },        //Determines the span which labels a nav trigger
                        owns: function(){
                            $nav.find('.int-nav-level').each(function(){
                                $('.int-nav-level').each(function(){
                                    var $nextLevelNavStructure = $(this).next('.int-nav-level');

                                    if($nextLevelNavStructure.length > 0){
                                        $(this).attr('aria-owns', $nextLevelNavStructure.attr('id'));
                                    }
                                });
                            });

                            return this;
                        },               //Determines parent/child relationship that cannot be infered from the dom
                        init: function(){
                            this.role().haspopup().selected().controls().labelledby().owns();
                        }
                };

                //Click Handler - hooked onto the parent element so click handlers do not have to be re attached when elements are being added and removed from the DOM
                $nav.find('.int-nav-level').OUId()
                    .end()
                    .on('click','.int-nav-trigger',function(){
                        aria.init();
                    });

                aria.init();
            }

            //Aria for responsive nav
            if(responsive && ariaOn){
                var $responsiveNav = this.$responsiveNav;

                $responsiveNav
                    .attr('role','navigation')
                    .find('.int-nav-mob-overlay').attr('role','presentation')
                    .end()
                    .find('.int-nav-alt-primary').attr('role','menu').OUId()
                    .end()
                    .find('.int-nav-toggle').attr('role','button').attr('aria-controls', $responsiveNav.find('.int-nav-alt-primary').attr('id'));
            }

            return this;
        },
        init: function () {
            var o = this.options,
                showMobileNav = (df.ie > 8 || df.ie === undefined) ? (o.responsive && this.$responsiveNav.length > 0) : false; //Switch off mobile nav for ie 8 and below. //Show mobile nave if responsive set to true and responsive nav markup exists

            this.responsiveNavClickHandlers(showMobileNav)
                .responsiveNavResizeHandler(showMobileNav)
                .addNavTriggers(this.$topLevelNav)      //Add primary nav triggers
                .setActiveNav()
                .serviceLinkToggle()
                .aria(o.aria, o.responsive);
        }
    };
    df.PrimaryNavigation.defaults = df.PrimaryNavigation.prototype.defaults;

})(jQuery, window, OU.DigitalFramework.Global);    //If using multiple jquery objects, pass in an alias instead of jQuery

OU.PrimaryNavigation = new OU.DigitalFramework.Global.PrimaryNavigation();
