
/* These are some functions which will commonly be used in routes and controllers */

/* This function sets the cookie for a key-value pair, it is being used in LoginController */
function setKeyToCookie(key, value)
{
    document.cookie = key + '=' + value + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
}

/**
 * This function sets the global userToken variable from a cookie
 * redirects to login page if the cookie is not present
 */
function setTokenFromCookie(routeObj){
	//These are regular expressions which are getting token and uid from cookies
    var myCookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
        myCookieUid = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    /** 
     * If a cookie is already present then use that cookie 
     * else the user gets redirected to login page before making a GET request.
     */
    if (myCookieUid.length > 0)
    {
        userToken.token = myCookieToken;
        userToken.uid = myCookieUid;
    }
    else
    {
        routeObj.transitionTo('login');
    }
}

//The 'object' is the object to be posted with a POST request at 'url'
function sendPOSTRequest(url, object)
{
    return Ember.$.ajax({
        type: 'POST',
        dataType: 'json',
        url: url,
        data: object,
        beforeSend: function(xhr) {
            //Adding custom headers
            xhr.setRequestHeader('token', userToken.token);
            xhr.setRequestHeader('uid', userToken.uid);
        }
    });
}


/**
 * An 'routeObj' was necessary here because of redirecting on error feature, 
 * the 'routeObj' is a route/controller object which is used for redirecting
 */
function sendGETRequest(url, routeObj)
{  
	setTokenFromCookie(routeObj);
    return Ember.$.ajax({
        type: 'GET',
        dataType: 'json',
        url: url,
        error: function(){
            //Redirecting to login page on ANY error
            routeObj.transitionTo('login');
        },
        beforeSend: function(xhr) {
            //Adding custom headers
            xhr.setRequestHeader('token', userToken.token);
            xhr.setRequestHeader('uid', userToken.uid);
        }
    });
}

function checkTokenValidity(routeObj, data){
    //If data.valid is undefined that means that the token was valid
    if (data.valid == undefined)
    {
        return ;
    }
    //If valid == false then redirect to login page
    if (!data.valid)
    {
        routeObj.transitionTo('login');
    }
}







/* ===================================== All Routes ===================================== */

/* This route is only being used for storing search query */
App.ContentRoute = Ember.Route.extend({
    model: function(){
		setTokenFromCookie(this);
        return {
            searchQuery: '',
			userId: userToken 
        };
    }
});

App.HomeRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(homeURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data;
        });
    }
});

App.ProfileRoute = Ember.Route.extend({
	model: function(params){
		return params;
	},
	afterModel: function(user){
        var routeObj = this;
		return sendGETRequest(profileURL + user.uid, this).then(function(data){
            checkTokenValidity(routeObj, data);
			user.data = new Object();
			user.data = data[0];
			return data;
		});
	}
});

/* This route returns a model of sorted list of lectures in ascending order by lid */
App.LecturesRoute = Ember.Route.extend({
	model: function(){
        var routeObj = this;
        return sendGETRequest(lecturesSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);

            /* This adds the feature of Next/Prev lecture by adding properties 
             * (nextLecture and prevLecture) to the currentLecture object
             */
            for(var i = 0; i < data.length; ++i)
            {
                var nextLecture = null,
                    prevLecture = null,
                    currentLecture = data[i];

                if (i > 0)
                {
                    prevLecture = data[i - 1];
                }
                if (i < data.length)
                {
                    nextLecture = data[i + 1];
                }
                
                currentLecture.nextLecture = nextLecture;
                currentLecture.prevLecture = prevLecture;

                //For seriel number
                currentLecture.sno = i + 1;
            }

            return data.sort(function(a, b){ 
                return a.lid - b.lid;
            });
        });
    }
});

/* Model is an array of assignments sorted by their creation dates which are in UNIX epoch form */
App.AssignmentsRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(assignmentsSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data.sort(function(a, b){ 
                return b.creationDateTime - a.creationDateTime;
            });
        });
    }
});

App.QuizzesRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(quizzesSummaryURL, this).then(function(data){
               checkTokenValidity(routeObj, data);
            return data;
        });
    }
});

App.EventsRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(eventsURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data;
        });
    }
});

App.AnnouncementsRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(announcementsSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data;
        });
    }
});

/* Model is an array of assignments sorted by their updated on dates which are in UNIX epoch form */
App.ForumsRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(forumsSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
			
            return data.sort(function(a, b){ 
                return b.updatedOn - a.updatedOn;
            });
        });
    },
	afterModel: function(){
		
	}
});

App.WikisRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(wikisSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data;
        });
    }
});

App.SearchRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(searchURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data;
        });
    }
});

/* Routes for Single Pages start here */
/* 
 * The model here requests the summary list which the same as the previous page and then
 * searches for the correct lecture depending on the lid of the param ( which comes from 
 * the URL /lecture/<lid> )
 *
 * The afterModel requests for comments for the specified lecture
 */
App.LectureRoute = Ember.Route.extend({
    model: function(param){
        var routeObj = this;
        return sendGETRequest(lecturesSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);

            /* This is doing the same thing as the LecturesRoute above */
            for(var i = 0; i < data.length; ++i)
            {
                var nextLecture = null,
                    prevLecture = null,
                    currentLecture = data[i];

                if (i > 0)
                {
                    prevLecture = data[i - 1];
                }
                if (i < data.length)
                {
                    nextLecture = data[i + 1];
                }
                
                currentLecture.nextLecture = nextLecture;
                currentLecture.prevLecture = prevLecture;

                //For serial number
                currentLecture.sno = i + 1;
            }

            return data.find(function(element, index, array){
                return param.lid == element.lid;
            });
        });
    },
    afterModel: function(lecture){
        return sendGETRequest(URL + 'lectures/comments/' + lecture.lid, this).then(function(allComments){
            /* If allComments[0].data is 'null' it shows "No Comments have been made yet." on 
             * the lecture page 
             */
            if(allComments[0].data == 'null')
            {
                lecture.comments = 'null';
            }
            else
            {
                lecture.comments = allComments;
				//For making the usernames linkable to the profile page
				lecture.comments.forEach(function(element, index, array){
					element.uid = element.authorUid;
				});
            }
            return allComments;
        });
    }
});

/* It works with the same logic as the LectureRoute */
App.AssignmentRoute = Ember.Route.extend({
    model: function(param){
        var routeObj = this;
        return sendGETRequest(assignmentsSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data.find(function(element, index, array){
                return param.aid == element.aid;
            });
        });
    },
    afterModel: function(assignment){
        return sendGETRequest(URL + 'assignments/status/' + assignment.aid, this).then(function(data){
            return data;
        });
    }
});



/* It works with the same logic as the LectureRoute */
App.AnnouncementRoute = Ember.Route.extend({
    model: function(param){
        var routeObj = this;
        return sendGETRequest(announcementsSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data.find(function(element, index, array){
                return param.nid == element.nid;
            });
        });
    }
});

/* It works with the same logic as the LectureRoute, same for the comments too */
App.ForumRoute = Ember.Route.extend({
    model: function(param){
        var routeObj = this;
        return sendGETRequest(forumsSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data.find(function(element, index, array){
                return param.tid == element.tid;
            });
        });
    },
    afterModel: function(forum){
		//For making the forum author's profile a link to the profile page
		forum.uid = forum.authorId;

        return sendGETRequest(URL + 'forums/comments/' + forum.tid, this).then(function(allComments){
            if(allComments[0].author_uid == null)
            {
                forum.comments = 'null';
            }
            else
            {
                forum.comments = allComments;
				//For making the usernames linkable to the profile page
				forum.comments.forEach(function(element, index, array){
					element.uid = element.author_uid;
				});
            }
            return allComments;
        });
    }
});

/* It works with the same logic as the LectureRoute */
App.WikiRoute = Ember.Route.extend({
    model: function(param){
        var routeObj = this;
        return sendGETRequest(wikisSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data.find(function(element, index, array){
                return param.nid == element.nid;
            });
        });
    }
});

/* It works with the same logic as the LectureRoute */
App.WikieditRoute = Ember.Route.extend({
    model: function(param){
        var routeObj = this;
        return sendGETRequest(wikisSummaryURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data.find(function(element, index, array){
                return param.nid == element.nid;
            });
        });
    }
});

/* =====================================================================Routes added by sunil=============================================================*/

/* Syllabus Route */
App.SyllabusRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(syllabusURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data;
        });
    }
});

/* Schedule Route*/
App.ScheduleRoute = Ember.Route.extend({
    model: function(){
        var routeObj = this;
        return sendGETRequest(scheduleURL, this).then(function(data){
            checkTokenValidity(routeObj, data);
            return data;
        });
    }
});

/* Quiz Route */
App.QuizRoute = Ember.Route.extend({
   model: function(param){
       var routeObj = this;
       return sendGETRequest(quizzesSummaryURL, this).then(function(data){
           checkTokenValidity(routeObj, data);
           return data.find(function(element, index, array){
               return param.qid == element.qid;
           });
       });
   },
    afterModel: function(quiz){
        return sendGETRequest(URL + 'quiz/' + quiz.qid, this).then(function(data){
             quiz.questions = data; //results
            return data;
        });
    },

    actions: {
    deleteTodo: function(todo) {
      //var todos = this.modelFor('index').todos;
      //todos.removeObject(todo);
      alert(todo);
    }
  }
});





var results=[
    {
        "title": "This is a multioption question. This is a multioption question. This is a multioption question. This is a multioption question. This is a multioption question. This is a multioption question.",
        "type": "multioption",
        "options":[{aid:0,value:'Answer1'},{aid:1,value:'Answer2'},{aid:1,value:'Answer3'},{aid:1,value:'Answer4'}],
        "qid": 1769,
        "quiz_id": 839,
        "_id": "53baed6c4755ec5c1baef282"
    },
    {
        "title": "This is a multichoice question. This is a multichoice question. This is a multichoice question. This is a multichoice question. This is a multichoice question. This is a multichoice question.",
        "type": "multichoice",
        "options": [
        {"aid":5,"value":"Programming in C"},
        {"aid":6,"value":"Problem solving with a computer"},
        {"aid":7,"value":"Building web-sites"},
        {"aid":8,"value":"Java programming"}],
        "qid": 840,
        "quiz_id": 839,
        "_id": "53baed6c4755ec5c1baef284"
    },
    {
        "title": "This is truefalse question. This is truefalse question. This is truefalse question. This is truefalse question. This is truefalse question. This is truefalse question.",
        "type": "truefalse",
        "options":[{aid:0,value:'false'},{aid:1,value:'true'}],
        "qid": 1768,
        "quiz_id": 839,
        "_id": "53baed6c4755ec5c1baef282"
    },
]