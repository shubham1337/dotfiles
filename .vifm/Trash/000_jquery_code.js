/* This function adds custom buttons to the quiz page */
function customButtons(buttonName, type){
    var button = $('ul.quizMultipleChoiceOptions input[name="'+ buttonName +'"]');
    $(button).each(function(){
        $(this).wrap( "<span class='custom-" + type + "'></span>" );
        if($(this).is(':checked')){
            $(this).parent().addClass("selected");
        }

    });

    if (type === "radio"){
        $(button).click(function(){
            if($(this).is(':checked')){
                $(this).parent().addClass("selected");
            }
            $(button).not(this).each(function(){
                $(this).parent().removeClass("selected");
            });
        });
    }
    else
    {
        $(button).click(function(){
            $(this).parent().toggleClass("selected");
        });
    }
}

/**
 * This variable stores the state information for the side menu bar (open/close : true/false)
 * But, the animation will run in the opposite state because the value of the variable is changing 
 * at the end of toggleSideBar() function.
 */
var isSideBarOpen = false;

function toggleSideBar(){
    $('.overlayDiv').toggle();

    if(!isSideBarOpen)
    {
        $('#sideMenuBar').addClass('fixedSidebar');
    }

    //For making the body not scrollable, the delay is because the animation does not work otherwise. 
    setInterval(function(){
        if(isSideBarOpen)
        {
            $('html').css('overflow', 'hidden');
        }
        else
        {
            $('html').css('overflow', 'auto');
            $('#sideMenuBar').removeClass('fixedSidebar');
        }  
    }, 2000);

    $('#sideMenuBar').toggleClass('shadow slideRight');
    $('.sideMenuButton').toggleClass('slideRight');
    $('.firstBar').toggleClass('crossFirstBar');
    $('.secondBar').toggleClass('crossSecondBar');
    $('.thirdBar').toggleClass('crossThirdBar');

    $('#sideMenuScroller').css({
        'height': $(window).height()
    });

    //Toggling the variable with every call to this function
    isSideBarOpen = !isSideBarOpen;
}

function animateSideMenuBar(){
    $('.sideMenuButton, .overlayDiv').click(function(){
        toggleSideBar();
    });

    $('.sideMenuBar1, .sideMenuBar2, .sideMenuBar3').click(function(){
        if ($(window).width() <= 850)
        {
            //Makes the sidebar disappear.
            $('#sideMenuBar, .sideMenuButton').css('display', 'none');

            //Completes the animation, but, the sidebar is not visible
            toggleSideBar();

            //Makes it reappear in the DOM but not to the USER.
            $('#sideMenuBar, .sideMenuButton').css('display', '');
        }
    });

    /* This will close the sidebar if it is open and the user increases the window width */
    $(window).resize(function(){
        if ($(window).width() > 850 && isSideBarOpen)
        {
            toggleSideBar();
        }
    });
}

function popTheHeader(){
    /* The header will only pop when the scroll bar reaches 100px from the top of the window
     * and only when the window's width is <= 850
     */
    if ($(window).scrollTop() >= 100 && $(window).width() <= 850)
    {
        $('.containerHeader').addClass('addShadow popHeader');

        //This will take the 'place'(as in html flow area) of popped header
        $('#containerTopPaddingBox').css({
            'height': 120 + $('.containerHeader').height()
        });
    }
    else
    {
        $('.containerHeader').removeClass('addShadow popHeader');

        //This will give back the taken place when the header returns
        $('#containerTopPaddingBox').css({
            'height': 105
        });
    }
}

function animateContainerHeader(){
    //The header pops only on 'scroll' event
    $(window).on('scroll', popTheHeader);
}

/* LOGIN PAGE jQuery Code */

//This variable stores the state information for the login/signUp boxes/buttons (box/button : true/false)
var isButtonOpen = false;

function animateLoginButton(){
    //If button is not a box (or open) then adding the classes to make it a box
    if (!isButtonOpen)
    {
        $('.loginButton').addClass('makeBox loginHeight');
        $('.loginButton .morphBox').fadeIn(500);
        $('.overlayDiv').show();
    }

    //This toggles the value of isButtonOpen variable
    isButtonOpen = !isButtonOpen;
}

function animateSignUpButton(){
    if (!isButtonOpen)
    {
        $('.signUpButton').addClass('makeBox signUpHeight');
        $('.signUpButton .morphBox').fadeIn(500);
        $('.overlayDiv').show();
    }

    isButtonOpen = !isButtonOpen;
}

function loginPageAnimation(){

    $('.loginButton').click(animateLoginButton);
    $('.signUpButton').click(animateSignUpButton);

    //This selector selects the cross ('X') at the top left of the login dialog box
    $('.loginButton .xMorphButton').click(function(){
        $('.loginButton').removeClass('makeBox loginHeight');
        $('.loginButton .morphBox').hide();
        $('.overlayDiv').hide();
    });

    //This selector selects the cross ('X') at the top left of the signup dialog box
    $('.signUpButton .xMorphButton').click(function(){
        $('.signUpButton').removeClass('makeBox signUpHeight');
        $('.signUpButton .morphBox').hide();
        $('.overlayDiv').hide();
    });

    $('.coursesOnOfferBox').click(function(){
        $(this).toggleClass('moveCourseOnOfferBox');
        $('.allCoursesBox').fadeToggle();
        $('.allCoursesBox').toggleClass('moveAllCoursesBox');
        $('.loginPageLogo').toggleClass('moveLogoTop');
        $('.loginButton').toggleClass('moveLoginButton');
        $('.signUpButton').toggleClass('moveSignUpButton');
    });
}


//This is for View/Hide All Comments feature
function animateViewComments()
{
    var show = false;

    $('.viewAllComments').each(function(){
        var spanInside = $(this).find('span');
        var totalReplies = $(this).nextAll('.innerComment').length;
        
        if (spanInside.html() == '')
        {
			//Because correct grammar is more important than anything
			if (totalReplies == 1)
			{
				spanInside.html('Show 1 Reply');
			}
			else
			{
            	spanInside.html('Show all ' + totalReplies + ' replies');
			}
        }
    });

    $('.viewAllComments').click(function(){
        var spanInside = $(this).find('span');
        var totalReplies = $(this).nextAll('.innerComment').length;
		//If it finds 'Hide' in the string it will return that else it returns null(which means false)
        if (spanInside.html().match(/Hide/g))
        {
			if (totalReplies == 1)
			{
				spanInside.html('Show 1 Reply');
			}
			else
			{
            	spanInside.html('Show all ' + totalReplies + ' replies');
			}
        }
        else
        {
			if (totalReplies == 1)
			{
				spanInside.html('Hide 1 Reply');
			}
			else
			{
            	spanInside.html('Hide all ' + totalReplies + ' replies');
			}
        }

        $(this).nextAll('.innerComment').slideToggle();

        show = !show;
    }); 
}

/**
 * This function is to remove Pagination when screen width goes <= 615.
 */
function togglePagination(viewObj){
    if ($(window).width() <= 615)
    {
        viewObj.set('controller.addPagination', false);
    }
    else
    {
        viewObj.set('controller.addPagination', true);
    }
}

function signupPage()
{
var availableTags = [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
	  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", 
	  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", 
	  "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", 
	  "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
	  "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", 
	  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", 
	  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
	  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", 
	  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", 
	  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", 
	  "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", 
	  "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", 
	  "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", 
	  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", 
	  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
	  "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", 
	  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];
    $( "#signupCountry").autocomplete({
      //source: availableTags
	     // The source option can be an array of terms.  In this case, if
         // the typed characters appear in any position in a term, then the
         // term is included in the autocomplete list.
         // The source option can also be a function that performs the search,
         // and calls a response function with the matched entries.
         source: function(req, responseFn) {
         var re = $.ui.autocomplete.escapeRegex(req.term);
         var matcher = new RegExp( "^" + re, "i" );
         var a = $.grep( availableTags, function(item,index){
            return matcher.test(item);
         });
         responseFn( a );
        }
    });
}

