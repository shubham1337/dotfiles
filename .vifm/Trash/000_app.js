App = Ember.Application.create();


var URL = 'http://202.3.77.145:3000/',
	URL80 = 'http://172.26.118.51/';

//GET URLs
var	//homeURL = 'JSON_Objects_home.txt',
	homeURL = URL + 'home/',
	searchURL = 'JSON_Objects_search.txt',
	profileURL = URL + 'users/',
	//lecturesSummaryURL = 'JSON_Objects_lectures_summary.txt',
	lecturesSummaryURL = URL + 'lectures/summary/',
	//assignmentsSummaryURL = 'JSON_Objects_assignments_summary.txt',
	assignmentsSummaryURL = URL + 'assignments/summary/',
	//quizzesSummaryURL = 'JSON_Objects_quizzes_summary.txt',
	quizzesSummaryURL = URL + 'quiz/summary/',
	//eventsURL = 'JSON_Objects_events.txt',
	eventsURL = URL + 'events/',
	//announcementsSummaryURL = 'JSON_Objects_announcements_summary.txt',
	announcementsSummaryURL = URL + 'announcement/summary/',
	//forumsSummaryURL = 'JSON_Objects_forums_summary.txt',
	forumsSummaryURL = URL + 'forums/summary/',
	//wikisSummaryURL = 'JSON_Objects_wikis_summary.txt';

	wikisSummaryURL = URL + 'wiki/summary/',


   //added by sunil
    syllabusURL = URL + 'syllabus',
    scheduleURL = URL + 'schedule'

	//end of added by sunil
	;

	//For File Downloads: 'http://172.26.118.54/sites/default/files/[filename]'
    


//POST URLs
var loginURL = URL + 'login',
	signUpURL =URL+'register';

var forumNewTopicURL = URL + 'addForum/',
	forumDescriptionEditURL = URL + 'editForum/',
	assignmentSubmissionURL = '',
	postCommentURL = URL + 'comments/',
	replyCommentURL = URL + 'comments/',
	editCommentURL = URL + 'comments/edit/',
	wikiEditURL = URL + '';
