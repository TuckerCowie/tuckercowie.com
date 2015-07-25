$(document).ready(function() {
	
	//Dynamic Header Functionality
	//get checkpoint
	var topofnav = $('#header').offset().top// - parseFloat($('#header').css('margin-top')); //+ parseFloat($('#header').css('height'));
	
	$(window).scroll(function () {
		//get Y pos
		var y = $(window).scrollTop();
		
		//if below checkpoint
		if (y >= topofnav) {
			//add class
			$('#header').addClass('fixed');
		} else {
			//remove class
			$('#header').removeClass('fixed');
		};
	});
		
	$( ".item:nth-child(4n)" ).css({marginRight: 0});
		
	//Cycles Plug-in
	$('#cycles').before('<div id="pager">') 
		.cycle({ 
			fx:     'fade', 
			speed:   300, 
			timeout: 4500, 
			//next:   '#cycles', 
			pause:   1,
			pager: '#pager' 
		});
			
});