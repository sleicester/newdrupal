/*******************************************

    App

*******************************************/

(function () {
    
    "use strict";

    var OUApp = {

        Modules: {},

        Helpers: {},

        init: function () {
            var x;
            for (x in OUApp.Modules) {
                if (OUApp.Modules.hasOwnProperty(x)) {
                    OUApp.Modules[x].init();
                }
            }
            $('input, textarea').placeholder();
            
            //$(window).smartresize(function () { console.log(OUApp.Helpers.getMQ()); });
        }

    };
    
    window.OUApp = OUApp;
    
}());