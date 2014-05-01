OUApp.Modules.course_details = {
    
    courseNav: {
        
        stickyNavTop: 0,
        
        stickyNav: function () {
            var scrollTop = $(window).scrollTop(); // check how far the window has scrolled
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
        },
        
        init: function () {
            this.enableTabs();
            this.enableStickyNav();
        }
    },
    
    courseForms: {
        
        feesFundingItems: ['study', 'degree', 'income', 'employed'],
        
        enableButton: function (btn) {
            //console.log('enable button' + btn);
            $('#' + btn).removeAttr('disabled').removeClass('int-button-disabled');
        },
        
        checkFeesFundingForm: function () {
            var i;
            for (i = 0; i < this.feesFundingItems.length; i = i + 1) {
                //console.log(this.feesFundingItems[i] + ' : ' + $('input[name=' + this.feesFundingItems[i] + ']:checked').length);
                if ($('input[name=' + this.feesFundingItems[i] + ']:checked').length < 1) {
                    return false;
                }
            }
            this.enableButton('int-btn-feesFunding');
        },
        
        enableFeesFundingForm: function () {
            var that = this;
            //console.log('enable form');
            $('#int-fees-funding-form input[type=radio]').on('change', function () {
                //console.log('change');
                that.checkFeesFundingForm();
            });
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