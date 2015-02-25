/* ==================================== All Controllers =========================================== */

/* This Global variable might be used for storing authenticatin token information */
var userToken = new Object();
App.LoginController = Ember.ObjectController.extend({
    username: 'student',
    password: '1234',
	registerPage1:false,
	
	signupUsername:"",
	signupPassword:"",
	signupConfirmPassword:"",
    signupEmail:"",
	
	signupFullname:"",
	signupGender:"",
	signupAffiliation:"",
	signupCountry:"",
	
	errorLine1:"",
	errorLine2:"",
	errorLine3:"",
	errorLine4:"",
    actions: {
        login: function(){
            /* using 'obj' as an alias for 'this' because this object is not 
             * accessible inside the 'then' function callback
             */
            var obj = this;
            Ember.$.ajax({
                type: 'POST',
                dataType: 'json',
                url: loginURL,
                data: {
                        username: this.get('username'),
                        password: this.get('password')
                }
            }).then(function(data){
                //Setting the global variable token
                userToken = data;

                /* Setting a cookie for the token */
                setKeyToCookie('token', userToken.token);

                /* Setting a cookie for uid */
                setKeyToCookie('uid', userToken.uid);

                /* Redirecting to home page */
                obj.transitionTo('home');
            });
        },
        signUp: function()
		{
		     var usernameReg = /^[A-Za-z0-9_]{3,16}$/;
			 var fullnameReg = /^[A-Za-z_ ]{3,16}$/;
			 var passwordReg = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
			 var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
			 
			 if(this.get('registerPage1'))
			 {
			 var email=this.get('signupEmail');
			 var username=this.get('signupUsername');
			 var password=this.get('signupPassword');
			 var confirmPassword=this.get('signupConfirmPassword');
			 
			 if(email==""||!emailReg.test(email))
			 this.set('errorLine1',"Invalid email address");
			 else
			 this.set('errorLine1',"");
			 
			 if(username==""||!usernameReg.test(username))
			 this.set('errorLine2',"Invalid username");
			 else
			 this.set('errorLine2',"");
			 
			 if(password==""||!passwordReg.test(password))
			 this.set('errorLine3',"Invalid password");
			 else
			 this.set('errorLine3',"");
			 
			 if(confirmPassword!=password)
			 this.set('errorLine4',"Password doesn't match");
			 else
			 this.set('errorLine4',"");
			 
			 if(this.get('registerPage1')&&(this.get('errorLine1')=="" && this.get('errorLine2')=="" && this.get('errorLine3')=="" && this.get('errorLine4')==""))
			 {
			    var obj = this;
				var self=this;
                Ember.$.ajax({
                type: 'POST',
                dataType: 'json',
                url: signUpURL,
                data:{email:email,username:username,password:password}
                }).then(function(data){
                   console.log(data);
				   if(data.valid)
				   {
                     userToken = data;
                     setKeyToCookie('token',userToken.token);
                     setKeyToCookie('uid',userToken.uid);
				     self.set('registerPage1',false);
				   }
				   else
				   {
				     if(data.message=="Email id already in use")
					    self.set('errorLine1',data.message);
					 else
					    self.set('errorLine2',data.message);
				   }
                });      //end of ajax call
			 }           //end of if
			             console.log("Name:"+username+"  Password:="+password +"  Email:="+email);
			}            //end of if registerPage=true
			else
			{
			    var fullname=this.get('signupFullname');
				var gender=$("#signupGender").val();
				var affiliation=$("#signupAffiliation").val();
				var country=$("#signupCountry").val();
				console.log("Fullname:"+fullname+"  Gender:="+gender +"  Affiliation:="+affiliation+"  Country:="+country);
				
				if(fullname==""||!fullnameReg.test(fullname))
			    this.set('errorLine1',"Enter your fullname");
			    else
			    this.set('errorLine1',"");
				
				if(gender=="")
			    this.set('errorLine2',"Select gender");
			    else
			    this.set('errorLine2',"");
				
				if(affiliation=="")
			    this.set('errorLine3',"Select affiliation");
			    else
			    this.set('errorLine3',"");
				
				if(country=="")
			    this.set('errorLine4',"Select Country");
			    else
			    this.set('errorLine4',"");
				
				if(this.get('errorLine1')=="" && this.get('errorLine2')=="" && this.get('errorLine3')=="" && this.get('errorLine4')=="")
			    {
			        var obj = this;
					var self=this;
                    Ember.$.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url:URL+'users/saveProfile',
                    data:{fullname:fullname,gender:gender,affiliation:affiliation,country:country},
                    beforeSend: function(xhr){
                    //Adding custom headers
                    xhr.setRequestHeader('token',userToken.token);
                    xhr.setRequestHeader('uid',userToken.uid);
                    }
                    }).then(function(data){
					   self.set('registerPage1',false);
                       obj.transitionTo('home');
                    });//end of ajax call
			    }//end of if
		}//end of lese
        }//end of signup page
    }
});

/* Temporary logout feature for DEBUGGING */
App.ContentController = Ember.ObjectController.extend({
    actions: {
        logout: function(){
            var self = this;
            sendGETRequest(URL + 'logout/').then(function(){
                //Clearing the global variable
                userToken = null;

                //Deleting the cookies
                setKeyToCookie('token', '');
                setKeyToCookie('uid', '');

                self.transitionTo('login');
            });
        },
        searchMe: function(){
			if ($(window).width() <= 850)
			{
					//Makes the sidebar disappear.
					$('#sideMenuBar, .sideMenuButton').css('display', 'none');

					//Completes the animation, but, the sidebar is not visible
					toggleSideBar();

					//Makes it reappear in the DOM but not to the USER.
					$('#sideMenuBar, .sideMenuButton').css('display', '');
			}
            //Redirects to search page
            this.transitionTo('search');
        }
    
    }
});

/* Adding OverlayDialogMixin for Misc Dialog Box for lecture resources (PDF, PPT etc.) */
App.HomeController = Ember.ObjectController.extend(App.OverlayDialogBoxMixin, {

});

/*
 * A different getModel property is being used here just for adding seriel numbers
 * which overrides the OverlayDialogBoxMixin's getModel property. 
 */
App.LecturesController = Ember.ObjectController.extend(App.PaginationMixin, App.OverlayDialogBoxMixin, {

});

/* Adding OverlayDialogMixin for Misc Dialog box for lecture resources  (PDF, PPT etc.) */
App.LectureController = Ember.ObjectController.extend(App.OverlayDialogBoxMixin, App.CommentsSectionMixin, {

});

/* Adding OverlayDialogMixin for New Topic button */
App.ForumsController = Ember.ObjectController.extend(App.PaginationMixin, App.OverlayDialogBoxMixin, {
    subject: "",
    actions: {
        forumAddNewTopic: function(){

            /* the quillEditor property comes from OverlayDialogBoxMixin, 
             * the property is a Quill Editor object.
             */
            var description = this.get('quillEditor').getHTML();

            var newForumThread = {
                tid: 0,
                topic: this.get('subject'),
                description: description,
                numPosts: 0,
                updatedOn: getCurrentTime(),
                authorName: 'Me',
                authorId: userToken.uid
            };

            //Creating a new forums summary array
            var newArray = Array.prototype.concat(this.get('model'));

            //Adding the new forum thread into the new array in the beginning
            newArray.unshift(newForumThread);
            
            //Replacing the old array with the new one, using the set command will update the model
            this.set('model', newArray);

            var self = this;
            //Sends a POST request for adding a new topic to forums summary
            sendPOSTRequest(forumNewTopicURL, {
                subject: this.get('subject'),
                description: description
            }).then(function(data){
                //This is to update the tid from the response of the server
                var newArray = Array.prototype.concat(self.get('model'));
                newArray.find(function(element, index, array){
                    //forum threads have tid as 0 if they are recently added by the user
                    if (element.tid <= 0)
                    {
                        element.tid = data[0].tid;
                    }
                });
                self.set('model', newArray);
            });

            //closing the dialog box
            this.toggleProperty('showDialogBox');
        }
    }
});

/* Adding Comments section mixin for the comments section in every forum thread */
App.ForumController = Ember.ObjectController.extend(App.CommentsSectionMixin, {
    showEditForumDescriptionDialogBox: false,
    actions: {
        toggleEditForumDescriptionDialogBox: function(){
            this.toggleProperty('showEditForumDescriptionDialogBox');
        },
        editForumDescription: function(){

            var newDescription = this.get('quillEditor').getHTML();

            //This is for updating the forum's description
            var model = this.get('model');
			//This is the only dirty way to create a totaly new object in javascript that I found.
			var newModel = {
				authorAvatar: model.authorAvatar,
				authorId: model.authorId,
				authorName: model.authorName,
				comments: model.comments,
				createdOn: model.createdOn,
				description: model.description,
				numPosts: model.numPosts,
				tid: model.tid,
				topic: model.topic,
				uid: model.uid,
				updatedOn: model.updatedOn
			};
            newModel.description = newDescription;
            this.set('model', newModel);

			var tid = this.get('model').tid;
            sendPOSTRequest(forumDescriptionEditURL + tid, {
                tid: tid,
                description: newDescription
            });

            //Closing the dialog box
            this.toggleProperty('showEditForumDescriptionDialogBox');
        }
    },

    //This is to remove edit button when the user is not the author from the forum description.
    hasEditButton: function(){
        return this.get('model').authorId == userToken.uid;
    }.property('model')
});

App.WikieditController = Ember.ObjectController.extend({
    quillEditor: null,
    actions: {
        saveChanges: function(){
            var self = this;
            sendPOSTRequest(wikiEditURL, {
                nid: this.get('nid'),
                title: this.get('title'),
                description: this.get('quillEditor').getHTML()
            }).then(function(){
                self.transitionTo('wiki', this);
            });
        }
    }
});

/* Adding OverlayDialogMixin for assignment submit button */
App.AssignmentController = Ember.ObjectController.extend(App.OverlayDialogBoxMixin, {
	actions: {
		upload: function(){
			var formData = new FormData($('.fileUploadForm')[0]);
			console.log(FormData);
			var aid = this.get('model').aid;
			//File upload request
			Ember.$.ajax({
				url: URL + 'assignments/upload/' + aid,
				type: 'POST',
				// Form data
                data: formData,
                //Options to tell JQuery not to process data or worry about content-type
                cache: false,
                contentType: false,
                processData: false,
				//for the token header
        		beforeSend: function(xhr) {
		            //Adding custom headers
        		    xhr.setRequestHeader('token', userToken.token);
		            xhr.setRequestHeader('uid', userToken.uid);
        		}
			}, 'json');	
		}	
	}
});

/* Adding OverlayDialogMixin for Misc Dialog Boxes in lecture resources (PDF, PPT etc.) */
App.SearchController = Ember.ObjectController.extend(App.OverlayDialogBoxMixin, {
    needs: ['content'],
    /* This connects the search query property from the sidebar(content model) */
    searchQuery: function(){
        return this.get('controllers.content.model').searchQuery;
    }.property('controllers.content.model.searchQuery')
});


                                                       /*Quiz handling controller*/


App.QuizQuestion= Ember.Object.extend({
    quizId : "",
    questionId : "",
    answerId:""
});

App.QuizController=Ember.ObjectController.extend();