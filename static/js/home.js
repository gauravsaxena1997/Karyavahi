$(document).ready(function() {
	$('.page-options').scrollToFixed({
		marginTop: 100
	});
	
	$('.filter').scrollToFixed({
		marginTop: 0,
		unfixed: function() {
			$('.page-options').css({'top': 100});
			 $(window).on('scroll', function() {
				st = $(this).scrollTop();
				if(st > 180) {
					$('.fixed-search, .fixed-search-container').addClass('mov-bottom');
				}
				else {
					$('.fixed-search, .fixed-search-container').removeClass('mov-bottom');
				}
			});
		}
	});
	
	$('body').on({
		click: function() {
			$(this).hide();
			var $el = $('.fixed-search-container');
			$el.fadeIn(200).css({'width': 500});
			$el.find('.md-search, .md-close').fadeTo(1200, 1);
		}
	}, '.fixed-search');
	
	$('body').on({
		click: function() {
			$(this).parents('.fixed-search-container').css({ 'width': 0 }).fadeOut(600);
			setTimeout(function() {
				$('.fixed-search').fadeIn(800);
			}, 600)
		}
	}, '.fixed-search-container .md-close');
});