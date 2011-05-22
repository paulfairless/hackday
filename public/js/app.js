(function($){
	var main = $('div[role="main"]'),
		nav = $("nav[role='navigation'] ul");
 	
	var init = function(){
		updateStories('uknews', main);
		initNav();
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
	
	var initNav = function(){
		$("li a", nav).click(function() {
			$("li", nav).removeClass("selected");
			$(this).parents().addClass("selected");
			return false;
		});	
	}
	
	init();
	
})(jQuery);
