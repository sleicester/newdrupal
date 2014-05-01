OUApp.Modules.cookiesbar = {
    
    addCookie: function () {
        Cookies.set('ou_cookie_policy', true);
    },
    
    removeCookie: function () {
        Cookies.expire('ou_cookie_policy');
    },
    
    deactivateBar: function () {
        this.addCookie();
        jQuery('#int-cookies-bar').animate({
            "max-height": "0"
        }, 300, function () { setTimeout(function () { jQuery(this).removeClass('int-active'); }, 250); });
    },
    
    activateBar: function () {
        setTimeout(function () {
            jQuery('#int-cookies-bar').addClass("int-active");
        }, 300);
    },
    
    init: function () {
        var that = this;
        if (!Cookies.get('ou_cookie_policy')) {
            this.activateBar();
            jQuery('#int-cookies-bar .int-button').on('click', function (e) {
                e.preventDefault();
                that.deactivateBar();
            });
        }
    }
    
};