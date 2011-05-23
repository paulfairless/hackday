(function($){
	
	var medium = 992
	var large = 1382
	
	var main = $('div[role="main"]'),
		nav = $("nav[role='navigation'] ul"),
		navPos = 0;
 	
	var init = function(){
		updateStories('uknews', main);
		initNav();
		initArrows();
		initNavClick();
	}
	
	var updateStories = function(channel, container) {
		$.getJSON('/feed/'+channel+'?callback=?', function(data){
			console.log(data);
			var items = data.stories
			container.empty();
			for (var newsItem in items){
				$( "#mediaTemplate" ).tmpl( items[newsItem] ).appendTo( container );
			}
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
	
	// var loadContentItem = function(){
	// 	if (screen.width >= medium) {
	// 		// download complicated script
	// 		// swap in full-source images for low-source ones
	// 		$()
	// 	}
	// }
	
	var initNav = function(){
		$("li a", nav).click(function() {
			$("li", nav).removeClass("selected");
			$(this).parents().addClass("selected");
			return false;
		});	
	}
	
	init();
	
})(jQuery);
