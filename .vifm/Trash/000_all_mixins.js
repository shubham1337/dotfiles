/* ======================================== All Mixins ========================================= */

//All 3 of the below functions are used in postComment, replyComment, editComment actions in CommentsSectionMixin
function getNid(model)
{
    //This block is to check for different nid's in the model
    if (model.nid == undefined)
    {
        if (model.lid == undefined)
        {
            if (model.tid == undefined)
            {
                return 0;
            }
            else
            {
                return model.tid;
            }
        }
        else
        {
            return model.lid;
        }
    }
    else
    {
        return model.nid;
    }
}

function getSubject(text)
{
    //All the proccessing below this line is for server side performance enhancement

    //Removing HTML tags from the text
    var words = text.replace(/<[^>]*>/g, '');

    var firstSpace = words.indexOf(' ');

    //if there is no firstSpace in the words, that means there is only one word
    if(firstSpace < 0)
    {
        return words;
    }
    else
    {
        var secondSpace = words.indexOf(' ', firstSpace + 1);

        //if there is no secondSpace in the words
        if(secondSpace < 0)
        {
            secondSpace = words.length;
        }

        //Adding a subject (first 2 words), for server side performance improvement
        return words.slice(0, secondSpace);
    }
    return '';
}

function getCurrentTime()
{
    /* This date in in  Unix Epoch format, and also it was 1 hr more than the correct time so  
     * I subtracted 3600 from it.
     */
    return Math.floor(Date.now()/1000) - 3600;
}

//These are all quill modules used in the app
var quillModules = {
    modules: {
      'toolbar': {
        container: '.quillToolbar'
      }
    },
    theme: 'snow'
};

/*
 * OverlayDialogBoxMixin is used wherever you need a dialog box (overlay), 
 * The only limitations that I think with this is that it can only be used once in a page i.e.
 * you cannot make more than one type of dialog box using this Mixin that is why I had to use different Mixin for comments
 *
 * if showDialogBox property becomes true the dialog box is rendered on the screen and the opposite happens 
 * when it is false.
 *
 * resourceClicked property specifies which resource(lecture for now) was clicked.
 */
App.OverlayDialogBoxMixin = Ember.Mixin.create({
    showDialogBox: false,
    resourceClicked: null,
    actions: {
        openResourceDialogBox: function(theResource){
            this.toggleProperty('showDialogBox');
            this.set('resourceClicked', theResource);
        },
        toggleDialogBox: function(){
            this.toggleProperty('showDialogBox');
        }
    },

    //This property will contain a Quill Editor object once the watchButton property is called
    quillEditor: null,

    /* 
     * This property is called whenever 'showDialogBox' changes its value,
     * It has jQuery code which makes the dialog box draggable (using jQuery UI library)
     */
    watchButton: function(){
        if (this.get('showDialogBox')){
            var self = this;
            Ember.run.scheduleOnce('afterRender', function(){
                //This makes the dialog box draggable, it is using the jQuery UI library
                $('.dialogContents').draggable();
                $('.overlayDiv').show();

                //Creating a Quill Editor Object
                var editor = new Quill('.quillEditor', quillModules);
                self.set('quillEditor', editor);
            });
        }
        else
        {
        	$('.overlayDiv').hide();
        }
    }.observes('showDialogBox')
});

/* 
 * This Mixin is used for Forum and Lecture comments section.
 *
 * areCommentsAvailable property checks for whether the comments are available or not. If the 'model.comments' variable
 * has no comments then it saves the string 'null' which is not an array, therefore it returns false.
 *
 * getAllComments property returns a structured form of comments array to be used for the template
 * without any further alterations. You are welcome to change the algorithm for better performance/maintenance,
 * Modify at your own risk.
 * 
 */
App.CommentsSectionMixin = Ember.Mixin.create({
    areCommentsAvailable: function(){
        return Array.isArray(this.get('model.comments'));
    }.property('model.comments'),

    /* This property makes sure that only the user with the correct uid is able to edit a comment */
    removedEditButton: function(){
        var commentsModel = Array.prototype.concat(this.get('model.comments'));
    
        for(var i = 0; i < commentsModel.length; ++i)
        {
            if (commentsModel[i].author_uid == userToken.uid)
            {
                commentsModel[i].hasEditButton = true;
            }
        }

        return commentsModel;
    }.property('model.comments'),

    getAllComments: function(){
        var structuredComments = new Array();
        var commentsModel = Array.prototype.concat(this.get('removedEditButton'));
        
        /* This loop adds all the comments with parentCommentId == 0 to the structuredComments array */
        for (var i = 0; i < commentsModel.length; ++i)
        {
            if (commentsModel[i].parentCommentId == 0)
            {
                structuredComments.push(commentsModel.splice(i, 1)[0]);
                i = -1; /*Used for resetting the loop because commentsModel.length changes 
                            whenever we splice and element from the array */
            }
        }

        //Infinite level child comments parser :-))
        /* This outer loop goes through all the elements which were added in the previous loop 
         * namely, which have parentCommentId == 0.
         */
        for (var j = 0; j < structuredComments.length; ++j)
        {
            /* This creates a new childComments array for each element of the array */
            structuredComments[j].childComments = new Array();
            /* This loop goes through our leftover commentsModel array */
            for (var i = 0; i < commentsModel.length; ++i)
            {   
                /* This variable keeps track of the current child comment */
                var childCommentCid = 0;
                /* This if block adds child comments to the corresponding parent comment*/
                if (structuredComments[j].commentId == commentsModel[i].parentCommentId)
                {
                    structuredComments[j].childComments.push(commentsModel.splice(i, 1)[0]);
                    /* Capturing the commentId of the child comment just added to the childComments array */
                    childCommentCid = structuredComments[j].childComments[structuredComments[j].childComments.length - 1].commentId;
                    i = -1;
                }
                /* After adding a child comment to the childComments array we will now add the child comments of the comment we just added above
                 * in the childComments array with commentId as childCommentCid.
                 */
                if (childCommentCid > 0)
                {
                    /* This loop will add child comments of the last added comment to the childComments array.
                     * This will go in a tree heirarchy and will add the child comments of every comment it adds to the childComments array.
                     */
                    for (var k = 0; k < commentsModel.length; ++k)
                    {
                        if (structuredComments[j].childComments[structuredComments[j].childComments.length - 1].commentId == commentsModel[k].parentId)
                        {
                            structuredComments[j].childComments.push(commentsModel.splice(k, 1)[0]);
                            k = -1;
                        }
                    }
                    /* This loop will go in reverse order of the list the above array made and will try to find any leftover child comments in 
                     * commentsModel array which have parentId == childId
                     */
                    for (var l = structuredComments[j].childComments.length - 1; l >= 0; --l)
                    {
                        for (var k = 0; k < commentsModel.length; ++k)
                        {
                            if (structuredComments[j].childComments[l].commentId == commentsModel[k].parentCommentId)
                            {
                                structuredComments[j].childComments.push(commentsModel.splice(k, 1)[0]);
                                k = -1;
                            }
                        }
                    }
                }
            }
        }
        return structuredComments;
    }.property('removedEditButton'),

    /* These properties are for opening/closing dialog boxes */
    showReplyCommentDialogBox: false,
    showEditCommentDialogBox: false,
    showPostCommentDialogBox: false,
    commentClicked: null,
    actions: {
        openReplyCommentDialogBox: function(commentClicked){
            this.toggleProperty('showReplyCommentDialogBox');
            this.set('commentClicked', commentClicked);
        },
        closeReplyCommentDialogBox: function(){
            this.toggleProperty('showReplyCommentDialogBox');
        },

        openEditCommentDialogBox: function(commentClicked){
            this.toggleProperty('showEditCommentDialogBox');
            this.set('commentClicked', commentClicked);
        },
        closeEditCommentDialogBox: function(){
            this.toggleProperty('showEditCommentDialogBox');
        },

        openPostCommentDialogBox: function(){
            this.set('commentClicked', new Object({text: ''}));
            this.toggleProperty('showPostCommentDialogBox');
        },
        closePostCommentDialogBox: function(){
            this.toggleProperty('showPostCommentDialogBox');
        },

        //Actions with POST requessts
        postComment: function(){
            
            //Creating a new comment to be added to the model
            var newComment = new Object({
                author_uid: userToken.uid,
                username: 'Me',
                creationDateTime: getCurrentTime(),
                text: this.get('quillEditor').getHTML(),
                avatar: null,
                commentId: -1,
                parentCommentId: 0
            });

            var newArray;
            if (this.get('areCommentsAvailable'))
            {
                //Creating a new comments array
                newArray = Array.prototype.concat(this.get('model.comments'));
            }
            else
            {
                newArray = new Array();
            }

            //Pushing the new comment into the new array
            newArray.push(newComment);

            //Replacing the old array with the new one
            this.set('model.comments', newArray);

            var nid = getNid(this.get('model'));

            var self = this;
            //Sending a POST request to the server with <nid> in the URL
            sendPOSTRequest(postCommentURL + nid, {
                parentCommentId: 0,
                text: newComment.text,
                subject: getSubject(newComment.text)
            }).then(function(response){

                //This is to update the commentId from the response of the server
                var newArray = Array.prototype.concat(self.get('model.comments'));

                newArray.find(function(element, index, array){
                    //comments have commentId as a negative value, if they were recently added by the user
                    if (element.commentId <= 0)
                    {
                        console.log(element);
                        element.commentId = response[0].commentId;
                    }
                });

                self.set('model.comments', newArray);
            });

            //Closing the dialog box
            this.toggleProperty('showPostCommentDialogBox');
        },
        replyComment: function(commentClicked){
            
            //All comments are explained in the postComment function above
            var newComment = new Object({
                author_uid: userToken.uid,
                username: 'Me',
                creationDateTime: getCurrentTime(),
                text: this.get('quillEditor').getHTML(),
                avatar: null,
                commentId: -2,
                parentCommentId: commentClicked.commentId
            });

            var newArray = Array.prototype.concat(this.get('model.comments'));

            newArray.push(newComment);

            this.set('model.comments', newArray);

            var nid = getNid(this.get('model'));

            var self = this;
            sendPOSTRequest(replyCommentURL + nid, {
                parentCommentId: commentClicked.commentId,
                text: this.get('quillEditor').getHTML(),
                subject: getSubject(newComment.text)
            }).then(function(response){

                //This is to update the commentId from the response of the server
                var newArray = Array.prototype.concat(self.get('model.comments'));
                newArray.find(function(element, index, array){
                    //comments have commentId as a negative value, if they were recently added by the user
                    if (element.commentId <= 0)
                    {
                        element.commentId = response[0].commentId;
                    }
                });
                self.set('model.comments', newArray);
            });

            this.toggleProperty('showReplyCommentDialogBox');
        },
        editComment: function(commentClicked){
            //All comments are explained in the postComment function above
            var newArray = Array.prototype.concat(this.get('model.comments'));

            var newText = this.get('quillEditor').getHTML();

            newArray.find(function(element, index, array){
                if (element.commentId == commentClicked.commentId)
                {
                    element.text = newText;
                }
            });

            this.set('model.comments', newArray);

            var nid = getNid(this.get('model'));

            sendPOSTRequest(editCommentURL + nid, {
                commentId: commentClicked.commentId,
                text: newText,
                subject: getSubject(newText)
            });

            this.toggleProperty('showEditCommentDialogBox');
        }
    },

    //This property will contain a Quill Editor object once the watchButton property is called
    quillEditor: null,

    /* This uses the same logic as the OverlayDialogBoxMixin and is used for draggable dialog boxes */
    watchButton: function(){
        var self = this;
        if (this.get('showReplyCommentDialogBox') || this.get('showPostCommentDialogBox') ||
             this.get('showEditCommentDialogBox') || this.get('showEditForumDescriptionDialogBox')){
            Ember.run.scheduleOnce('afterRender', function(){
                //This makes the dialog box draggable, it is using the jQuery UI library
                $('.dialogContents').draggable();
                $('.overlayDiv').show();

                /* Creating a Quill Editor Object, quillModules is a global variable declared 
                 * at the top of this file 
                 */
                var editor = new Quill('.quillEditor', quillModules);
                self.set('quillEditor', editor);
            });
        }
        else
        {
            $('.overlayDiv').hide();
        }
    }.observes('showReplyCommentDialogBox', 'showPostCommentDialogBox', 'showEditCommentDialogBox', 'showEditForumDescriptionDialogBox'),

    watchComments: function(){
        Ember.run.scheduleOnce('afterRender', function(){
            //This is for View/Hide Comments feature
            animateViewComments();
        });
    }.observes('model.comments')
});

/* 
 * This is being used in lectures summary page and forums summary page as of this writing.
 * The algorithm is pretty straight forward, The whole page changing mechanism is done by
 * the paginationHelper (in views_components_helpers.js).
 */
App.PaginationMixin = Ember.Mixin.create({
    currentPageNo: 1,
    itemsPerPage: 10,
    totalNoOfPages: function(){
        var modelLength = this.get('model').length,
            itemsPerPage = this.get('itemsPerPage');

        if (modelLength % 10 == 0)
        {
            return (modelLength / itemsPerPage);
        }
        return Math.floor(modelLength / itemsPerPage) + 1;
    }.property('itemsPerPage', 'model'),
    getModel: function(){
        var currentPageNo = this.get('currentPageNo'),
            itemsPerPage = this.get('itemsPerPage'),
            model = this.get('model');
        if (this.get('addPagination'))
        {
            return model.slice((currentPageNo - 1) * itemsPerPage, currentPageNo * itemsPerPage);
        }
        return model;
    }.property('currentPageNo', 'itemsPerPage', 'model', 'addPagination'),
    actions: {
        changePageNo: function(newPage){
            this.set('currentPageNo', newPage.number);
        }
    },

    /* This property is used for removing pagination when window's width is <=615 */
    addPagination: true
});
