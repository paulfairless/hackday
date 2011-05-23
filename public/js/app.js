(function($){
	
	var medium = 992,
	    large = 1382

	var main = $('div[role="main"]'),
        howabout = $('ul[role="personalised"]'),
		nav = $("nav[role='navigation'] ul"),
		navPos = 0;
    
	var currentJson = ""
 	
	var init = function(){
		updateStories('news', main);
		initNav();
		initArrows();
		initNavClick();
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
		if (screen.width >= medium) {
			container = $("#bigstory");
			// download complicated script
			// swap in full-source images for low-source ones
			container.empty();
			// console.log( currentJson, index, currentJson.stories[index*1] )
			$( "#bigstoryTemplate" ).tmpl( currentJson.stories[index*1] ).appendTo( container );
		}
	}
	
	var initNav = function(){
		$("li a", nav).click(function() {
			$("li", nav).removeClass("selected");
			$(this).parents().addClass("selected");
			return false;
		});	
	}
	
	init();
	
})(jQuery);
