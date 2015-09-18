var scroller=jQuery.browser.webkit ? "body": "html";
var lang = $('#langId').val();
var today = new Date();
 
function validate(form, submitFunction){
	var $form = $(form);
	var errorMess = {
		ru : {
			requiredMess : "Вы пропустили",
			emailMess : "Невалидный email"
		},
		en : {
			requiredMess : "empty field",
			emailMess : "Invalid email"
		},
		ua : {
			requiredMess : "Ви пропустили",
			emailMess : "Невалідний email"
		}
	}

	if ($form.length && $form.attr('novalidate') === undefined) {
		$form.on('submit', function(e) {
			e.preventDefault();
		});

		$form.validate({
			errorClass : 'errorText',
            focusCleanup : true,
			focusInvalid : false,
			invalidHandler: function(event, validator) {
				
			},
			errorPlacement: function(error, element) {
				error.appendTo( element.closest('.formInput'));
			},
			highlight: function(element, errorClass, validClass) {
				$(element).addClass('error');
				$(element).closest('.formRow').addClass('error');
			},
			unhighlight: function(element, errorClass, validClass) {
				$(element).removeClass('error');
				$(element).closest('.formRow').removeClass('error');
			},
			submitHandler: function(form) {
				if( typeof(submitFunction) === 'function' ) {
					submitFunction()
				} else {
					form.submit();
				}
			}
		});

        $('[required]',$form).each(function(){
			$(this).rules( "add", {
				required: true,
				messages: {
					required: errorMess[lang].requiredMess
				}
			});
		});

        if($('[type="email"]',$form).length) {
            $('[type="email"]',$form).rules( "add",
            {
                messages: {
                    email: errorMess[lang].emailMess
                 }
            });
        }
	}
};


function scrollTo(scrollTarget) {
	if (typeof(scrollTarget) === 'string') {
    	scrollTarget = $(scrollTarget).offset().top-80;
	}
    
    $(scroller).animate({scrollTop: scrollTarget }, 1000);
}


function smoothScroll(link) {
    $(link).click(function(e) {
    	e.preventDefault();
        var id = $(this).attr('href');

        if ($(id).length) {
	    	scrollTo(id);
        }
    });
}
 
function langBlock() {
	var $lang = $('.lang'),
		$langLi = $lang.find('.langListItem').not('.current');
	
	// init 
	if ($(window).width() > 1024 ) {		
		$langLi.hide();
	}

	// toggle on click
	$(document).on('click', '.lang', function(e) {
		if ($(e.target).closest('langListItem').is('.current')) {
			e.preventDefault();
		} 		

		if ($(window).width() > 1024 ) {		
			$langLi.stop().slideToggle(150);
			$lang.toggleClass('active');
		}
		 
	});

	// close
	function langClose() {
		$langLi.slideUp(150);
		$lang.removeClass('active');
	}
	// close document click close
	$(document).click(function(e) {
		if (!$(e.target).closest('.lang').length && $lang.is('.active') && $(window).width() > 1024 ) {
			langClose();
		}  
	});
	// window resize close
	$(window).resize(function(){
		if ($(window).width() > 1024 ) {
			langClose();
		}
	})
}

function setSummaryDate(days){
	var term = new Date(),
		month = {
			ru : ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
			en : ['January', 'February', 'March', 'April', 'May', 'June', 'Jule', 'August', 'September', 'October', 'November', 'December'],
			ua : ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня']
		};
		day = {
			ru : ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
			en :  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			ua : ['понеділок', 'вівторок','середа', 'четвер', 'п\'ятниця', 'субота', 'неділя']
		};
	
	term.setDate( today.getDate() + days );

  	//var termShort = term.getDate() +' '+ month[lang][term.getMonth()];
  	//var termFull = ('0' + term.getDate()).slice(-2) +'.'+ ('0' + (term.getMonth() + 1)).slice(-2) +'.'+ term.getFullYear() +' '+ day[lang][term.getDay()];

	//$('#termSummary').html( termShort );
	//$('#termSummaryFull').html( termFull );
}

function setLoanTime(minutes) {
	var loanDate = new Date(today.getTime() + minutes*60000),
		loanString =  ('0' + loanDate.getHours()).slice(-2) + ':' + ('0' + loanDate.getMinutes()).slice(-2);
	$('#loanTime').html( loanString )
}


  
function getDayWord(number) {
	function getPluralType(n) { 
		switch (lang) {
			case 'ru' :
			case 'ua' :
	  			return (n%10==1 && n%100!=11 ? 0 : (n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)); 
			break;
			case 'en' :
				return n === 1 ? 0 : 1;
			break;
		}
	} 

	var days = {
			ru : ['день', 'дня', 'дней'],
			ua : ['день', 'дні', 'днів'],
			en :  ['day', 'days']
		}; 

	return days[lang][getPluralType(number)]; 
}
 
function sliderNumberOnly(slider, input, min, max) {
	var t;
	input.keydown(function(e) {

		clearTimeout(t);
		if (e.which == 13) {
			e.preventDefault();
			slider.val( +input.val() );
		}
		if (e.which >= 47 && e.which <= 57 || e.which >= 96 && e.which <= 105 ){
			t = setTimeout(function() {		
				slider.val( +input.val() );
			}, 500)
		}
		else if (e.which != 46 && e.which != 8 && e.which != 37 && e.which != 39) return false;

	});

	input.blur(function(){
		var inputVal = +input.val();

		if ( inputVal < min ) {
			inputVal = min;
		} 
		if ( inputVal > max ) {
			inputVal = max;
		} 
		input.val( inputVal )
		slider.val( inputVal );

	});
}

 function loanSlider() {
 	var slider = $('#loanSlider'),
		input = $('#loanInput'),
		min = 501,
		max = 2000;

	slider.noUiSlider({
		start: +input.val(),
		step: 1,
		range: {
			'min': min,
			'max': max
		},
		format: {
		  to: function ( value ) {
			return (+value).toFixed();
		  },
		  from: function ( value ) {
			return (+value).toFixed();
		  }
		}
	});

	//slider.Link('lower').to($('#loanInput'));
	slider.Link('lower').to($('#loanSummary'));

	sliderNumberOnly(slider, input, min, max);

	slider.on({
		slide: function(){
			input.val( slider.val() );
		},
		set: function(){
			//input.val( slider.val() );
		}
	}); 
 }

 
/*term slider*/
function termSlider()  {
var slider2 = $('#termSlider'),
	input2 = $('#termInput'),
	min = 5,
	max = 31;

	setSummaryDate(+input2.val());

	slider2.noUiSlider({
		start: +input2.val(),
		step: 1,
		range: {
			'min': min,
			'max': max
		},
		format: {
		  to: function ( value ) {
			return parseInt(value);
		  },
		  from: function ( value ) {
			return parseInt(value);
		  }
		}
	});


	slider2.Link('lower').to(input2);

	sliderNumberOnly(slider2, input2, min, max);

	// day plural 
	slider2.on({
		slide: function(){
			$('.termInputDesc').text( getDayWord(input2.val()) );
			console.log()
			setSummaryDate(+input2.val());
		},
		set: function(){
			$('.termInputDesc').text( getDayWord(input2.val()) );
			setSummaryDate(+input2.val());
		}
	});
}


function reviewsSlider() {
	$('#responsesSlider').slick({
		dots: false,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		slidesToScroll: 1,
		//adaptiveHeight: true,
		prevArrow : $('.responsesPrev'),
		nextArrow : $('.responsesNext'),
		responsive: [
		  {
		    breakpoint: 667,
		    settings: {
	    	  slidesToShow: 1,
		      slidesToScroll: 1,
		      arrows : false,
		      autoplay : true
		    }
		  }
		]
	});
}

function latestNewsSlider() {
	$('#latestNewsSlider').slick({
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 2,
		slidesToScroll: 2,
		//adaptiveHeight: true,
		prevArrow : $('.latestNewsPrev'),
		nextArrow : $('.latestNewsNext'),
		responsive: [
		  {
		    breakpoint: 1023,
		    settings: {
		      slidesToShow: 1,
		      slidesToScroll: 1
		    }
		  },
		  {
		    breakpoint: 667,
		    settings: {
	    	  slidesToShow: 1,
		      slidesToScroll: 1,
		      arrows : false,
		      autoplay : true
		    }
		  }
		]
	});
}

function accordion(settings) {
	$(settings.content).slideUp(0);

	$(settings.trigger).click(function(e){
		e.preventDefault();
		var $this = $(this);
		$(settings.block).find('.expanded').not($this).removeClass('expanded').closest(settings.parent).find(settings.content).slideUp();
		$this.toggleClass('expanded').closest(settings.parent).find(settings.content).stop().slideToggle(); 
 
	})
};

function menu() {
	$('.menuButton').click(function() {
        $('.menu').toggleClass('open');
        //$('body').toggleClass('noscroll');
    });

    // $(window).resize(function() { 
    // 	if ($(window).width() > 1024 ) { 
    // 		$('body').removeClass('noscroll');
    // 	}
    // });
}

function showMap() {
	var map = [] , marker = [], infowindow = [];

	$('.showMap').on('click', function() {
		var id = $(this).data('container');
        var $container = $('#' + id);
        var $wrapper = $container.closest('.contactMapWrapper')
        var coords =  $(this).data('coords').split(',');
        var content =  $(this).data('content');
        var index =  parseInt($(this).data('index'));
        var myLatLng = new google.maps.LatLng( coords[0] , coords[1] );
       	
       	if ( $container.is('.empty') ) { // empty container
		    var mapOptions = {
				center: myLatLng ,
				zoom: 17,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		    }

		    map[index] = new google.maps.Map(document.getElementById(id), mapOptions);

		    marker[index] = new google.maps.Marker({
		      	position: myLatLng,
		     	map: map[index],
		     	icon : 'images/pin.png'
		  	});

	     	infowindow[index] = new google.maps.InfoWindow({
			    content: '<div class="contactMapInfoWindow">'+ content+'</div>'
		 	});

		 	infowindow[index].open(map[index], marker[index]);

		  	$container.removeClass('empty');
		  	
		 	//google.maps.event.addListenerOnce(map[index], 'tilesloaded', function(){
		 	setTimeout(function() {
		  		$wrapper.removeClass('closed');
		 	}, 200)
  			//});
		  		
		  	 

        } else {

	        if ($wrapper.is('.closed')) {
	            $wrapper.removeClass('closed');
	           	map[index].setCenter(myLatLng);
	           	map[index].setZoom(17);
	           	infowindow[index].open(map[index], marker[index]);
	        }	
	        else {
	            $wrapper.addClass('closed');
	        }

        }


        return false;
    });
}
 

/* DOCUMENT READY */
$(document).ready(function() {
	validate('.responseForm');
	validate('.contactsForm');
	
	// slider range
	loanSlider();
	termSlider();

	// sliders
	reviewsSlider();
	latestNewsSlider();
	
	setLoanTime($('#loanTimeDiff').val());
	
	menu();
	langBlock();

	accordion({
		block : '.faqList',
		parent : '.faqListItem',
		trigger : '.faqListItemLink', 
		content : '.faqListItemText'
	});

	smoothScroll('.scrollLink');
	showMap();
});

/* WINDOW LOAD */
$(window).load(function() {
	 
	
});

/* WINDOW RESIZE */
$(window).resize(function() {
	 
});
