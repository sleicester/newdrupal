OUApp.Modules.backToTop = {
    
    mainContentTop: 0,
    
    checkScrollPosition: function () {
        var btn = $('#int-btn-top');
        //console.log('scroll: ' + $(window).scrollTop() + ' : ' + this.mainContentTop);
        if ($(window).scrollTop() > this.mainContentTop) {
            btn.addClass('scrollIn');   
        } else {
            btn.removeClass('scrollIn');   
        }
    },

    enableBackToTop: function () {
        var that = this;
        if ($('#int-content').length > 0) {
            this.mainContentTop = $('#int-content').offset().top;
        }
        
        $(window).scroll(function () {
            that.checkScrollPosition();
        });
        
        $('#int-btn-top a').click(function (e) {
            OUApp.Helpers.scrollPageTo('#int-site');
        });
        
        // scroll to content (skip link)
        $('#int-skip-link').click(function (e) {
            OUApp.Helpers.scrollPageTo('#int-content');
        });
        
    },
    
    init: function () {
        this.enableBackToTop();
    }
    
};