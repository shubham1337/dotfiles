/* Views */

App.LoginView = Ember.View.extend({
    didInsertElement: function(){
        loginPageAnimation();
		signupPage();
    }
});

/* The Quiz Page has not been decided yet, This is just for sample */
App.QuizView = Ember.View.extend({
    didInsertElement: function(){
        customButtons("Q1", "radio");
        customButtons("Q2", "checkbox");
        customButtons("Q3", "radio");
    }
});

App.ContentView = Ember.View.extend({
    didInsertElement: function(){
        animateSideMenuBar();
        animateContainerHeader();
    }
});

App.CalendarView = Ember.View.extend({
	didInsertElement: function(){
		$('#calendar').calendario();
	}
});

App.LecturesView = Ember.View.extend({
    didInsertElement: function(){
        var self = this;
        $(window).resize(function(){
            togglePagination(self);
        });
        togglePagination(self);
    }
});

App.ForumsView = Ember.View.extend({
    didInsertElement: function(){
        var self = this;
        $(window).resize(function(){
            togglePagination(self);
        });
        togglePagination(self);
    }
});

App.WikieditView = Ember.View.extend({
    didInsertElement: function(){
        //Creating a Quill Editor Object
        var editor = new Quill('.quillEditor', quillModules);
        this.set('controller.quillEditor', editor);
    }
});

/* Components */

App.TopLinksComponent = Ember.Component.extend({
    tagName: 'li',
    classNames: ['topLinks']
});

/* 
 * I wasn't able to find a way to combine all three into a single component.
 * You are free to do so yourself if you can find a way.
 */
App.SideLinksOneComponent = Ember.Component.extend({
    tagName: 'li',
    classNames: ['sideMenuBar1']
});
App.SideLinksTwoComponent = Ember.Component.extend({
    tagName: 'li',
    classNames: ['sideMenuBar2']
});
App.SideLinksThreeComponent = Ember.Component.extend({
    tagName: 'li',
    classNames: ['sideMenuBar3']
});

/* this is the generic dialog box component used by all dialog boxes */
App.DialogBoxComponent = Ember.Component.extend({
    actions: {
        closeDialogBox: function(){
            this.sendAction('closeDialogBox');
        }
    }
});

App.ContainerItemComponent = Ember.Component.extend({
    tagName: 'li'
});

App.ContainerHeaderComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: ['containerHeader']
});

App.ContainerLowerHeaderComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: ['containerLowerHeader']
});

App.ContainerSummaryHeadComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: ['containerSummaryHead']
});

App.LectureContainerItemComponent = Ember.Component.extend({
    tagName: 'li',
    actions: {
        openResourceDialogBox: function(params){
            this.sendAction('openResourceDialogBox', params);
        }
    }
});


/* Handlebar's Helpers */

/* A helper for every top link icon */
Ember.Handlebars.helper('topIcons', function(value){
    var newValue = value.charAt(0).toUpperCase() + value.slice(1);
    return new Ember.Handlebars.SafeString('<img class="icon" src="icons/' + newValue + '.png" alt="' + newValue + '" /><img class="iconActive" src="icons/' + newValue + 'Active.png" alt="' + newValue + 'Active" /><span class="iconText">' + newValue + '</span>');
});

/* A helper for the small boxes which are used for mouseover animations, the helper also includes the text */
Ember.Handlebars.helper('sideBox', function(value, group){
    var newValue = value.charAt(0).toUpperCase() + value.slice(1);
    return new Ember.Handlebars.SafeString('<div class="box' + group + '"></div><div class="text' + group + '">' + newValue + '</div>');
});

/* This helper is used for shortening the long titles which are present in container items */
Ember.Handlebars.helper('shortenTitle', function(title){
    var escapedTitle = Handlebars.Utils.escapeExpression(title);
    var maxTitleLength = 50;
    escapedTitle.trim();
    if (escapedTitle.length > maxTitleLength)
    {
        return new Ember.Handlebars.SafeString('<div title="' + escapedTitle + '">' + escapedTitle.slice(0, maxTitleLength - 2) + "...</div>");
    }
    else
    {
        return title;
    }
});

/* This is probably the most usefull helper in the current code. 
 * It takes a string of resources and splits them into a usable array of objects.
 */
Ember.Handlebars.helper('splitResources', Ember.View.extend({
     init: function() {
        this._super();
        this.set('context', this);
    },
    template: Ember.Handlebars.compile('{{#each resourceButtons}} ' +
                                            '{{#if this.addMiscIcon}}' +
                                                '<img src="icons/MiscResIcon.png" {{action "openResourceDialogBox" this.model}} />' +
                                            '{{else}}' +
                                                '<a {{bind-attr href=this.resourceLink}} target="_blank"><img {{bind-attr src=this.icon}} /></a>' +
                                            '{{/if}}' +
                                        '{{/each}}'),

    resourceButtons: function(){
        if (this.get('model').resources == null)
        {
            return '';
        }
        var regex = /public:\/\/[^\.]*\.[^,]*/g;
        var resLinks = this.get('model').resources.match(regex);
        var resIcons = new Array();
        var resources = new Array();
        var filePath = URL80 + '/sites/default/files/';
        if(resLinks.length <= 1)
        {
            resIcons[0] = "icons/" + resLinks[0].split('.')[1].trim().toUpperCase() + "Icon.png";
            resources[0] = {
                resourceLink: filePath + resLinks[0].trim().substr(9),
                icon: resIcons[0]
            };
        }
        else
        {
            var newModel = this.get('model');
            newModel.allLinks = new Array();
            for(var k = 0; k < resLinks.length; ++k)
            {
                newModel.allLinks[k] = {
                    resIcon: "icons/" + resLinks[k].split('.')[1].trim().toUpperCase() + "Icon.png",
                    resLink: filePath + resLinks[k].trim().substr(9),
                    resFileName: resLinks[k].trim().substr(9)
                };
            }
            resources[0] = {
                addMiscIcon: true,
                model: newModel
            };
        }
        return resources;
    }.property('model')
}));

/* This helper is used for formatting date and time in the events page */
Ember.Handlebars.helper('eventsDateTime', function(){
    var date = moment(this.startDateAndTime, 'YYYY-MM-DDTHH:mm:ss').format('D/M/YYYY'),
        startTime = moment(this.startDateAndTime, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm');
    var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var html = '<div class="eventDateTime">' +
                    '<div class="eventYear">' +
                        date.split('/')[2] +
                    '</div>' +
                    '<div class="eventMonth">' +
                        monthNames[parseInt(date.split('/')[1]) - 1] +
                    '</div>' +
                    '<div class="eventDay">' +
                        date.split('/')[0] +
                    '</div>' +
                    '<div class="eventTime">' +
                        '<img src="icons/clockIcon@2x.png" /> ' +
                        '<span>' +
                            startTime + ' hrs' +
                        '</span>' +
                    '</div>' +
                '</div>';
    return new Ember.Handlebars.SafeString(html);
});

/* This helper is used for implementing pagination on any summary type pages 
 * The getPageNumbers property creates an array of objects which contains a page number and a class.
 * The class tells whether that page is active or not.
 *
 * A view is used inside a helper because there was no other way to create a helper with an {{action}} helper
 * inside it. That can only be done by components, but, they can't run custom javascript code on demand.
 */
Ember.Handlebars.helper('paginationHelper', Ember.View.extend({
    init: function() {
        this._super();
        this.set('context', this);
    },
    template: Ember.Handlebars.compile('<div class="pagination">' +
                                            '<ul class="paginationInnerWrapper">' +
                                                '{{#each getPageNumbers}}' +
                                                    '<li>' +
                                                        '<a {{action "changePageNo" this}}>' +
                                                            '<div {{bind-attr class=this.classNm}}>{{this.number}}</div>' +
                                                        '</a>' +
                                                    '</li>' +
                                                '{{/each}}' +
                                            '</ul>' +
                                        '</div>'),
    getPageNumbers: function(){
        var makePageButtons = new Array();
        for(var i = 0; i < this.get('totalNoOfPages'); ++i)
        {
            makePageButtons[i] = {
                number: i + 1,
                classNm: "pageNo"
            };
        }
        makePageButtons[this.get('currentPageNo') - 1].classNm = "pageNoActive";
        return makePageButtons;
    }.property('totalNoOfPages', 'currentPageNo')
}));

/* This helper uses regular expression for parsing youtube URL to and embbedable (not sure if that's even a word) form */
Ember.Handlebars.helper('getVideo', function(vurl){
    if (vurl == null)
    {
        return new Ember.Handlebars.SafeString('<iframe width="100%" height="100%" src="" frameborder="0" allowfullscreen></iframe>');
    }
    var expr = /(youtu\.be\/|v=)([^&]+)/;
    var html = '<iframe width="100%" height="100%" src="http://www.youtube.com/embed/' + vurl.match(expr)[2] + '?rel=0" frameborder="0" allowfullscreen></iframe>';
    return new Ember.Handlebars.SafeString(html);
});

/*
 * The four following helpers are used for converting dates from various formats found in
 * the backend JSON data. These use Moment.js library.
 */
Ember.Handlebars.helper('formatDateFromUnix', function(date){
    var newDate = moment.unix(date);
    return newDate.zone('-05:30').format('D/M/YYYY HH:mm');
});

/* This one only returns the date, whereas the above one returns both date and time */
Ember.Handlebars.helper('formatDateFromUnixOnlyDate', function(date){
    var newDate = moment.unix(date);
    return newDate.zone('-05:30').format('D/M/YYYY');
});

Ember.Handlebars.helper('formatDate', function(date){
    var newDate = moment(date, 'YYYY-MM-DDTHH:mm:ss');
    return newDate.zone('-05:30').format('D/M/YYYY');
});

Ember.Handlebars.helper('getTimeFromNow', function(date){
	var newDate = moment.unix(date);
	return newDate.fromNow(true);
});

Ember.Handlebars.helper('splitPrivateResources', function(){
	if (this.resources == null)
	{
		return ;
	}
	var html = '<ul>';
	var resourcesArray = this.resources.match(/private:\/\/[^\.]*\.[^,]*/g);
	for(var i = 0; i < resourcesArray.length; ++i)
	{
		html += '<li>' + resourcesArray[i].trim().substr(10) + '</li>';
	}
	return new Ember.Handlebars.SafeString(html + '</ul>');
});

Ember.Handlebars.helper('getAvatar', function(avatar){
	if(avatar == null)
	{
		return ;
	}
	var avatarPublicURL = avatar.match(/public/g);
    var filePath = URL80 + '/sites/default/files/pictures/thumb/';
	var avatarFileName;
	if (avatarPublicURL)
	{
		avatarFileName = avatar.match(/public:\/\/[^\.]*\.[^,]*/g)[0].trim().substr(18);
	}
	else
	{
		avatarFileName = avatar; 
	}
	
	return new Ember.Handlebars.SafeString('<img src="' + filePath + avatarFileName + '" />');
});



/*========================================Added by sunil=======================================================*/

Ember.Handlebars.helper('formatURL',function(fileName){
     var fileNameAtServer=fileName;
     var filePath = URL80 + 'sites/default/files/'+fileNameAtServer;
     var completeUrl='<a href='+filePath+' target="_blank"><span class="scheduleBody">'+fileName+'</a>';

     return new Ember.Handlebars.SafeString(completeUrl);
});


/*Logical operator in a handlebars*/
Handlebars.registerHelper('ifCondition', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


/*Handler for cheking truefalse question type*/
Ember.Handlebars.registerHelper('ifTrueFalse', function(user,options){
    user = Ember.Handlebars.get(this, user, options);
   
    if (user.type=="truefalse") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


/*Handler for cheking multichoice question type*/
Ember.Handlebars.registerHelper('ifMultiChoice0', function(user,options){
    user = Ember.Handlebars.get(this, user, options);
   
    if (user.type=="multichoice" && user.multiple==0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

/*Handler for cheking multioption question type*/
Ember.Handlebars.registerHelper('ifMultiChoice1', function(user,options){
    user = Ember.Handlebars.get(this, user, options);
   
    if (user.type=="multichoice" && user.multiple==1) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('removeHtmlTags', function(textData,options) {
    textData = Ember.Handlebars.get(this, textData, options);
    var text=textData;
    text = text.replace(/<br>/gi, "");
    text = text.replace(/<.p.*>/gi, "");
    text = text.replace(/(\r\n|\n|\r)/gm, "");
    return new Ember.Handlebars.SafeString(text);
});

Ember.Handlebars.helper('rawhtml', function(value, options) {
     value = value.replace(/(<([^>]+)>)/gi, "");
     value = value.replace(/<br>/gi, "");
     value = value.replace(/(\r\n|\n|\r)/gm, "");
  return new Ember.Handlebars.SafeString(value);
});





















/**
  A replacement for #each that provides an index value (and other helpful values) for each iteration.
  Unless using `foo in bar` format, the item at each iteration will be accessible via the `item` variable.
 
 http://mozmonkey.com/2014/03/ember-getting-the-index-in-each-loops/
  Simple Example
  --------------
  ```
  {{#eachIndexed bar in foo}}
    {{index}} - {{bar}}
  {{/#eachIndexed}}
  ```
 
  Helpful iteration values
  ------------------------
    * index: The current iteration index (zero indexed)
    * index_1: The current iteration index (one indexed)
    * first: True if this is the first item in the list
    * last: True if this is the last item in the list
    * even: True if it's an even iteration (0, 2, 4, 6)
    * odd: True if it's an odd iteration (1, 3, 5)
*/
Ember.Handlebars.registerHelper('eachIndexed', function eachHelper(path, options) {
  var keywordName = 'item',
      fn;
 
  // Process arguments (either #earchIndexed bar, or #earchIndexed foo in bar)
  if (arguments.length === 4) {
    Ember.assert('If you pass more than one argument to the eachIndexed helper, it must be in the form #eachIndexed foo in bar', arguments[1] === 'in');
    Ember.assert(arguments[0] +' is a reserved word in #eachIndexed', $.inArray(arguments[0], ['index', 'index+1', 'even', 'odd']));
    keywordName = arguments[0];
 
    options = arguments[3];
    path = arguments[2];
    options.hash.keyword = keywordName;
    if (path === '') { path = 'this'; }
  }
 
  if (arguments.length === 1) {
    options = path;
    path = 'this';
  }
 
  // Wrap the callback function in our own that sets the index value
  fn = options.fn;
  function eachFn(){
    var keywords = arguments[1].data.keywords,
        view = arguments[1].data.view,
        index = view.contentIndex,
        list = view._parentView.get('content') || [],
        len = list.length;
 
    // Set indexes
    keywords['index'] = index;
    keywords['index_1'] = index + 1;
    keywords['first'] = (index === 0);
    keywords['last'] = (index + 1 === len);
    keywords['even'] = (index % 2 === 0);
    keywords['odd'] = !keywords['even'];
    arguments[1].data.keywords = keywords;
 
    return fn.apply(this, arguments);
  }
  options.fn = eachFn;
 
  // Render
  options.hash.dataSourceBinding = path;
  if (options.data.insideGroup && !options.hash.groupedRows && !options.hash.itemViewClass) {
    new Ember.Handlebars.GroupedEach(this, path, options).render();
  } else {
    return Ember.Handlebars.helpers.collection.call(this, 'Ember.Handlebars.EachView', options);
  }
});