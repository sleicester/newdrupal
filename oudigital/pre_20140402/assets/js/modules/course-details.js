OUApp.Modules.course_details = {
    
    courseNav: {
        
        stickyNavTop: 0,
        
        stickyNav: function () {
            var scrollTop = $(window).scrollTop(); // check how far the window has scrolled
            //console.log('scroll: ' + scrollTop + ' : ' + this.stickyNavTop);
            if (scrollTop > this.stickyNavTop) { // check if sticky item is passed top of screen
                $('.int-sticky-inpage').addClass('int-sticky');
            } else {
                $('.int-sticky-inpage').removeClass('int-sticky');
            }
        },
        
        positionStickyNav: function () {
            if ($('.int-sticky-inpage').length > 0) {
                $('.int-sticky-inpage').removeClass('int-sticky'); // put sticky back in original position
                this.stickyNavTop = $('.int-sticky-inpage').offset().top; // get top value of sticky item
                //console.log('position: ' + this.stickyNavTop)
                this.stickyNav();
            }
        },
        
        enableStickyNav: function () {
            var that = this;
            that.positionStickyNav();
            $(window).scroll(function () { that.stickyNav(); }); // check nav pos on scroll
            $(window).smartresize(function () {that.positionStickyNav(); }); // reposition nav when window resizes
            OUApp.Modules.navigation.enableMenuToggle('int-course-nav-toggle', 'int-course-nav'); // enable mobile nav toggle
            // set current active section title when it new tab is selected
            $('.int-sticky-inpage ul a').on('click', function (e) {
                $('#int-course-nav-toggle .int-active-section').text($(this).text());
                OUApp.Modules.navigation.toggleMenu('int-course-nav'); // close the menu
            });
        },
        
        enableTabs: function () {
            // enable tabs - jquery UI control
            $("#int-course-detail-tabs").tabs({
                activate: function (event, ui) {
                    // scroll page to top of tabs when a new tab is activated
                    $(window).scrollTop($("#int-course-detail-tabs").offset().top);
                }
            });
            this.positionStickyNav();
        },
        
        init: function () {
            this.enableTabs();
            this.enableStickyNav();
        }
    },
    
    courseForms: {
        
        feesFundingItems: ['credits', 'degree', 'income', 'employed'], // array of form items
        
        hideFeesOption: function () {
            $('.int-fees-option').removeClass('int-fees-option-active');
        },
        
        showFeesOption: function () {
            console.log('show');
            this.hideFeesOption();
            $('#int-fees-option1').addClass('int-fees-option-active');
        },
        
        setButtonState: function (btn, enabled) {
            var that = this,
                btn = $('#' + btn);
            
            if (enabled) {
                btn.removeAttr('disabled').removeClass('int-button-disabled');
                btn.on('click', function () {
                    that.showFeesOption();
                });
            } else {
                btn.attr('disabled', true);
            }
        },
        // validate form items
        checkFeesFundingForm: function () { 
            var i,
                valid = true;
            for (i = 0; i < this.feesFundingItems.length; i = i + 1) {
                if (this.feesFundingItems[i] === "credits") { // credits is a selectbox
                    if ($('#' + this.feesFundingItems[i]).val() === "") {
                        valid = false;
                    }
                } else {
                    if ($('input[name=' + this.feesFundingItems[i] + ']:checked').length < 1) {
                        valid = false;
                    }
                }
            }
            this.setButtonState('int-btn-feesFunding', valid);
        },
        // validate form every time an item changes
        enableFeesFundingForm: function () { 
            var that = this;
            $('#int-fees-funding-form input[type=radio], #int-fees-funding-form select').on('change', function () {
                that.checkFeesFundingForm();
            });
            this.setButtonState('int-btn-feesFunding', false);
        },
        
        init: function () {
            this.enableFeesFundingForm();
        }
        
    },
    
    init: function () {
        this.courseNav.init();
        this.courseForms.init();
    }
    
};