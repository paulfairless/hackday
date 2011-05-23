var site = site || {};

site.Personalisation = (function($) {

    var behaviour = {};

    var init = function() {
        var siteNavLinks = $('nav li a');
        if (siteNavLinks.size()) {
            state.load();
            siteNavLinks.each(function(index, link) {
                 $(link).click(track);
            });
        }
    };

    var track = function(ev) {
        var channel = ev.target.getAttribute('data-channel');
        if (behaviour[channel]) {
            behaviour[channel]++;
        } else {
            behaviour[channel] = 1;
        }
        state.save();
    };

    var state = {
        storageLocator:'site.Personalisation',
        enabled: (typeof localStorage !== "undefined"),

        save: function() {
            if (state.enabled && typeof JSON !== "undefined") {
                var data = {};
                data.behaviour = behaviour;
                localStorage[state.storageLocator] = JSON.stringify(data);
            }
        },

        load: function() {
            if (state.enabled && localStorage[state.storageLocator]) {
                var dataString = localStorage[state.storageLocator],
                    data = JSON.parse(dataString);
                behaviour = data.behaviour
            }
        }
    };

    $(init);

    return {
        getBehaviour : function() {
            return behaviour;
        }
    };

}(jQuery));