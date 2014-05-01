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
        this.mainContentTop = $('#int-content').offset().top;
        
        $(window).scroll(function () {
            that.checkScrollPosition();
        });
        
        $('#int-btn-top a').click(function (e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, "slow");
        });
        
    },
    
    init: function () {
        this.enableBackToTop();
    }
    
};