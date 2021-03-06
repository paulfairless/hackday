(function($){
	
	var medium = 992,
	    large = 1382

	var main = $('div[role="main"]'),
        howabout = $('ul[role="personalised"]'),
		nav = $("nav[role='navigation'] ul"),
		twitter = $("#tweets")
		blogs = $("#blogs"),
		navPos = 0,
		width = $(window).width(),
		INIT_768 = false,
		INIT_992 = false,
		INIT_1180 = false,
		_flash_installed = ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object") || (window.ActiveXObject && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) != false));
    
	var currentJson = ""
 	
	var init = function(){
		updateStories('news', main);
		initNav();
		initArrows();
		initNavClick();
		initDetectResize();
		initialiseViewport();
	}

    var updateHowAboutThis = function(currentChannel, container, otherItems) {
        var behaviour = site.Personalisation.getBehaviour();
        var favouriteChannel = 'politics';
        $.each(behaviour, function(key, value) {
             if (key != currentChannel && (favouriteChannel == null || behaviour[favouriteChannel] < value)) {
                 favouriteChannel = key;
             }
        });
//        console.log(favouriteChannel);

        var existingIds = [];
        $.each(otherItems, function(key, value) {
            existingIds.push( value.id );
        });
//        console.log(existingIds);

        var url = '/feed/'+favouriteChannel+'?callback=?';
        $.getJSON(url, function(data){
            container.empty()
            var items = data.stories;
            var count = 0;
            for(var newsItem in items) {
                var story = items[newsItem];
                if (!(story.id in existingIds)) {
                    story["index"] = newsItem;
       			    $( "#howaboutTemplate" ).tmpl( story ).appendTo( container );
                    count++;
                }

                // Only show 4 items at most
                if (count == 4) {
                    return;
                }
            }
        });
    }

	var updateStories = function(channel, container) {

		container.empty();
		container.html("<img src='img/ajax-loader.gif' />")
		$.getJSON('/feed/'+channel+'?callback=?', function(data){

			currentJson = data;
			// console.log(data);
			var items = data.stories
			container.empty();
			for (var newsItem in items){
				var story = items[newsItem]
				story["index"] = newsItem;
				$( "#mediaTemplate" ).tmpl( story).appendTo( container );
			}
            updateHowAboutThis(channel, howabout, items);
			initStoryClick();
			$("article:eq(0)", main).click();
		});
	}
	
	var updateBlogs = function() {
		blogs.empty();
		$.getJSON('/blogs?callback=?', function(data){
			var items = data.rss.channel.item
			for (var newsItem in items){
				var story = items[newsItem]
				story["index"] = newsItem;
				$( "#blogTemplate" ).tmpl( story).appendTo( blogs );
			}
		});
		blogs.show()
	}

	var initArrows = function(){
		$('#left-arrow').click(function(ev){
			navPos += 100;
			
			nav.css('left', navPos+'px');
			ev.preventDefault();
		});
		
		$('#right-arrow').click(function(ev){
			navPos -= 100;
			
			nav.css('left', navPos+'px');
			ev.preventDefault();
		});
	}
	
	var initNavClick = function(){
		$("li a", nav).click(function(ev){
			updateStories($(this).attr('data-channel'),main);
			ev.preventDefault();
		});
	}
	
	var initStoryClick = function(){
		$("article", main).click(function(ev){
			loadContentItem($(this).attr('data-index'));
			
			$("article", main).removeClass("selected");
			$(this).addClass("selected");
			ev.preventDefault();
		});
	}
	
	var loadContentItem = function(index){
		var container
		if (width>= medium) {
			container = $("#bigstory");
			// download complicated script
			// swap in full-source images for low-source ones
			container.empty();
			// console.log( currentJson, index, currentJson.stories[index*1] )
			var story = currentJson.stories[index*1];
			// console.log(story)
			$( "#bigstoryTemplate" ).tmpl( story ).appendTo( container );
			var _tracker = _gat._getTracker("[UA-6044180-3]");
			if(story.video) {				
				if(_flash_installed) {
				flowplayer("player", "player/flowplayer-3.2.7.swf", {

					clip: {
						// track start event for this clip
						onStart: function(clip) {
							_tracker._trackEvent("Videos", "Play", clip.url);
						},

						// track pause event for this clip. time (in seconds) is also tracked
						onPause: function(clip) {
							_tracker._trackEvent("Videos", "Pause", clip.url, parseInt(this.getTime()));
						},

						// track stop event for this clip. time is also tracked
						onStop: function(clip) {
							_tracker._trackEvent("Videos", "Stop", clip.url, parseInt(this.getTime()));
						},

						// track finish event for this clip
						onFinish: function(clip) {
							_tracker._trackEvent("Videos", "Finish", clip.url);
						}
					}
				});
				}
			}
		}
	}
	
	var initNav = function(){
		$("li a", nav).click(function() {
			$("li", nav).removeClass("selected");
			$(this).parents().addClass("selected");
			return false;
		});	
	}
	
	var updateTwitter = function(query, container){
		
		$.getJSON('http://search.twitter.com/search.json?q=from%3A'+query+'&callback=?', function(data){
			container.empty();
			var items = data.results
			for (var tweetIdx in items){
				var tweet = items[tweetIdx]
				$( "#twitterTemplate" ).tmpl( tweet).appendTo( container );
			}
		});
	}
	
	var init_768 = function(){
		INIT_768 = true;
	}
	
	var init_992 = function(){
		try {loadContentItem(0)}catch(err){}
		INIT_992 = true;
	}
	
	var init_1180 = function(){
		updateBlogs();
		updateTwitter('skynewsbreak', twitter)
		INIT_1180 = true;
	}
	
	var initialiseViewport = function(){
		width = $(window).width()
		if(width >= 768 && !INIT_768) {
			init_768();
		}
		if(width >= 992  && !INIT_992) {
			init_992();
		}
		if(width >= 1180  && !INIT_1180) {
			init_1180();
		}
	}
	
	var initDetectResize = function(){
		document.body.onresize = function(){
			initialiseViewport();
		}
	}
	
	init();
	
})(jQuery);
