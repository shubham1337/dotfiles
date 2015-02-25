App.Router.map(function(){
    this.resource('content', {path: '/'}, function(){
        this.resource('home', {path: '/'});
        this.resource('calendar');
        this.resource('feedback');
        this.resource('profile', {path: 'profile/:uid'});
		this.resource('profileedit', {path: 'profile/edit'});

        this.resource('lectures');
        this.resource('lecture', {path: 'lecture/:lid'});

        this.resource('assignments');
        this.resource('assignment', {path: 'assignment/:aid'});

        this.resource('quizzes');
        this.resource('quiz', {path: 'quiz/:qid'});

        this.resource('projects');

        this.resource('syllabus');
        this.resource('schedule');
        this.resource('events');
        this.resource('announcements');
        this.resource('announcement', {path: 'announcement/:nid'});

        this.resource('forums');
        this.resource('forum', {path: 'forum/:tid'});

        this.resource('chat');
        this.resource('wikis');
        this.resource('wiki', {path: 'wiki/:nid'});
        this.resource('wikiedit', {path: 'wiki/edit/:nid'});

        this.resource('resources');
        
        this.resource('search');
    });
    this.resource('login');
});

