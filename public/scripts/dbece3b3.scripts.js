"use strict";angular.module("vendor",["ngCookies","ngResource","ngAnimate","ngSanitize","ngRoute","perfect_scrollbar","ui.bootstrap","ui.router"]),angular.module("read",[]),angular.module("write",[]),angular.module("myWrdz",[]),angular.module("models",[]),angular.module("me",[]),angular.module("shared",[]),angular.module("wrdz",["vendor","read","write","myWrdz","me","read","models","shared"]).config(["$locationProvider",function(a){a.html5Mode(!0)}]).run(["$rootScope","$state","$stateParams",function(a,b,c){a.$state=b,a.$stateParams=c}]),angular.module("shared").config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("landing",{url:"/",templateUrl:"partials/landing.html",controller:["$scope","$state",function(a,b){a.$on("userChange",function(a,c){c&&b.go("write")})}]}).state("read",{url:"/r",templateUrl:"partials/read.html","abstract":"true",controller:["$scope","$state",function(){}]}).state("read.list",{url:"",templateUrl:"partials/read-list.html"}).state("read.list.front",{url:"/f?skip",templateUrl:"partials/read-list-center.html",resolve:{docs:["Read","$stateParams",function(a,b){return a.updateQuery([{type:"topics",value:""},{type:"following",value:""},{type:"skip",value:b.skip}])}]},controller:["$scope","docs","Read","$state",function(a,b,c,d){c.setPrevState(d),a.docs=b.data}]}).state("read.list.following",{url:"/l/:userId",templateUrl:"partials/read-list-center.html",resolve:{docs:["$stateParams","User","Read",function(a,b,c){if(a.userId)return c.updateQuery([{type:"following",value:[a.userId]},{type:"topics",value:""},{type:"skip",value:""}]);var d=[];return angular.forEach(b.getUser().following,function(a){d.push(a._id)}),d.length?c.updateQuery([{type:"following",value:d},{type:"topics",value:""},{type:"skip",value:""}]):!1}]},controller:["$scope","docs","Read","$stateParams","$state",function(a,b,c,d,e){a.$on("userChange",function(b,e){if(e&&!d.userId){var f=[];angular.forEach(e.following,function(a){f.push(a._id)}),f.length?c.updateQuery([{type:"following",value:f},{type:"topics",value:""},{type:"skip",value:""}]).then(function(b){a.docs=b.data}):(console.log("not following"),a.docs=[])}}),c.setPrevState(e),a.docs=b.data}]}).state("read.list.topics",{templateUrl:"partials/read-list-center.html",url:"/t/:topicId",resolve:{docs:["$stateParams","Read","$state",function(a,b,c){return a.topicId?b.updateQuery([{type:"following",value:""},{type:"topics",value:a.topicId},{type:"skip",value:""}]):void b.refreshTopics().then(function(a){c.go("read.list.topics",{topicId:a.data[0]._id})})}]},controller:["$scope","docs","Read","$state",function(a,b,c,d){b&&(c.setPrevState(d),a.docs=b.data)}]}).state("read.doc",{url:"/:docId",templateUrl:"partials/read-doc.html",resolve:{readDoc:["Read","$stateParams",function(a,b){return a.getPubDoc(b.docId)}]},controller:["$scope","readDoc","PubDoc",function(a,b){a.readDoc=b.data}]}).state("write",{url:"/w",templateUrl:"partials/write.html"}).state("me",{url:"/m",templateUrl:"partials/me.html"}).state("me.about",{url:"/about",templateUrl:"partials/about.html"}).state("mywrdz",{url:"/d",templateUrl:"partials/mywrdz.html"}).state("password_reset",{url:"/password_reset?key",templateUrl:"partials/password-reset.html",resolve:{email:["$cookieStore","$stateParams",function(a,b){var c=a.get("pwreset");if(c){var d=c.id.slice(0,-2),e=c.email,f=b.key;if(d===f)return a.remove("pwreset"),e}return!1}]},controller:["$scope","email","User","$state","$timeout",function(a,b,c,d,e){b||(a.emailFail=!0),a.resetPass=function(d){c.resetPassword(b,d).then(function(b){console.log(b),e(function(){a.launchLogIn()},1e3)})}}]})}]),angular.module("wrdz").controller("NavbarCtrl",["$scope","$state","User",function(){}]),angular.module("shared").controller("MainCtrl",["$scope","User","$rootScope","$modal","$window","$state",function(a,b,c,d,e,f){function g(){var a=b.getUser();a&&!a.messages&&b.getCurrentUser(a._id).success(function(a){b.changeUser(a.user)}).error(function(){})}g(),a.$on("userChange",function(b,c){a.user=c?c:null}),a.goToTop=function(){e.scrollTo(0,0)},a.local_auth_form=!1,a.signup=function(c){b.isLoggedIn()||b.signup(c).success(function(a){b.getCurrentUser(a._id).success(function(a){b.changeUser(a.user),f.go("write")}).error(function(){})}).error(function(b){console.log("Username already exists"===b.errors.username.type),a.message="Bummer. That username is taken. Try another?"})},a.signin=function(c){b.isLoggedIn()||b.signin(c).success(function(a){b.getCurrentUser(a._id).success(function(a){b.changeUser(a.user),f.go("write")}).error(function(){})}).error(function(b){"Unknown user"==b&&(a.message="No one has that username on wrdz!"),"Invalid password"==b&&(a.message="Right username, wrong password...")})},a.launchLogIn=function(){d.open({templateUrl:"partials/signin.html",controller:["$scope","$modalInstance","User",function(a,b,c){a.close=function(){b.close()},a.signin=function(b){c.isLoggedIn()||c.signin(b).success(function(b){c.getCurrentUser(b._id).success(function(b){c.changeUser(b.user),a.close(),f.go("write")}).error(function(){})}).error(function(b){"Unknown user"==b&&(a.message="No one has that username on wrdz!"),"Invalid password"==b&&(a.message="Right username, wrong password...")})},a.forgotPasswordModal=function(){d.open({templateUrl:"partials/password-modal.html",controller:["$scope","$modalInstance","$http","$cookieStore",function(a,b,c,d){a.close=function(){b.close()},a.submitEmail=function(b){c.post("/forgot",{email:b}).then(function(a){d.remove("pwreset"),d.put("pwreset",{id:a.data,email:b})}),a.close()}}]})}}]})},a.launchSignUp=function(){d.open({templateUrl:"partials/signup.html",controller:["$scope","$modalInstance","User","$http",function(a,b,c){a.close=function(){b.close()},a.signup=function(b){c.isLoggedIn()||c.signup(b).success(function(b){c.getCurrentUser(b._id).success(function(b){c.changeUser(b.user),a.close(),f.go("write")}).error(function(){})}).error(function(b){console.log(b.errors.email.type),a.message="Looks like someone already has that username. Try another?"})}}]})},a.feedbackModal=function(){d.open({templateUrl:"partials/feedback-modal.html",controller:["$scope","$modalInstance","$http",function(a,b,c){a.close=function(){b.close()},a.submitFeedback=function(b){console.log(b);var d={content:b};return a.close(),c.post("/feedback",d)}}]})},a.forgotPasswordModal=function(){d.open({templateUrl:"partials/password-modal.html",controller:["$scope","$modalInstance","$http","$cookieStore",function(a,b,c,d){a.close=function(){b.close()},a.submitEmail=function(b){c.post("/forgot",{email:b}).then(function(a){d.remove("pwreset"),d.put("pwreset",{id:a.data,email:b})}),a.close()}}]})},a.twitterAuth=function(){b.twitter().success(function(a,b){console.log(a),console.log(b),console.log("callback")})}}]).controller("MenuShortcutCtrl",["$scope",function(a){a.items=[{title:"write",state:"write"},{title:"read",state:"read.list.front"},{title:"my wrdz",state:"mywrdz"},{title:"me",state:"me"}]}]),angular.module("wrdz").controller("ProfileCtrl",["$scope","User","Profile","$state",function(){}]),angular.module("read").controller("ReadCtrl",["$scope","Read","$state","$filter",function(a,b,c,d){a.Read=b,a.user&&(a.seen=a.user.meta._views),a.$on("userChange",function(b,c){c&&(a.seen=a.user.meta._views)}),a.tabs=[{title:"Front",state:"read.list.front({'skip': null})"},{title:"Following",state:"read.list.following({'skip': null})"},{title:"Topics",state:"read.list.topics({'skip': null})"}],a.navType="pills",a.moment=moment,a.$watch("$state.current.name",function(b){b&&angular.forEach(a.tabs,function(a){a.active=d("lowercase")(a.title)===b.slice(10)?!0:!1})}),a.loadNext=function(){var b=Number(a.$stateParams.skip)+10;a.$state.go(a.$state.current.name,{skip:b})},a.loadPrev=function(){var b=Number(a.$stateParams.skip)-10;a.$state.go(a.$state.current.name,{skip:b})}}]).controller("TopicsListCtrl",["$scope","Read",function(a,b){var c,d=function(){console.log("going"),b.refreshTopics().then(function(b){c=b.data;for(var d=0;d<c.length;d++)a.data.push(c[d])})};d(),a.currentPage=0,a.pageSize=5,a.data=[],a.numberOfPages=function(){return Math.ceil(a.data.length/a.pageSize)}}]).controller("ReadDocCtrl",["$scope","Read",function(a,b){function c(){a.view(),a.isHeart(),a.isVote(),a.isFollowing()}function d(){return a.user?!0:void a.launchSignUp()}a.isCollapsed=!0,a.nextDoc=function(){b.goToNextDoc()},a.goBack=function(){b.goBack()},a.isHeart=function(){return a.user.meta._hearts.indexOf(a.readDoc._id)>-1?(a.active2="active",!0):!1},a.isVote=function(){return a.user.meta._up_votes.indexOf(a.readDoc._id)>-1?(a.active1="active",!0):!1},a.isFollowing=function(){if(a.readDoc.author){var b=!1;angular.forEach(a.user.following,function(c){c._id===a.readDoc.author._id&&(b=!0)}),a.following=b?!0:!1}},a.heart=function(){d()&&("active"===a.active2?(a.readDoc.hearts--,a.active2=null,b.updatePubDoc(a.readDoc._id,"heart",!1)):(a.active2="active",b.updatePubDoc(a.readDoc._id,"heart",!0),a.readDoc.hearts++))},a.up_vote=function(){d()&&("active"===a.active1?(a.readDoc.up_votes--,a.active1=null,console.log(a.active1),b.updatePubDoc(a.readDoc._id,"up_vote",!1)):(a.active1="active",b.updatePubDoc(a.readDoc._id,"up_vote",!0),a.readDoc.up_votes++))},a.view=function(){a.user&&-1===a.user.meta._views.indexOf(a.readDoc._id)&&b.updatePubDoc(a.readDoc._id,"view",!0)},a.user&&c(),a.$on("userChange",function(a,b){b&&c()}),a.follow=function(){d()&&a.readDoc.author&&(a.following?(b.followUser(a.readDoc.author._id,!1),a.readDoc.author.followers--):(b.followUser(a.readDoc.author._id,!0),a.readDoc.author.followers++),a.following=!a.following)}}]),angular.module("write").controller("WriteCtrl",["$scope","Write","$timeout","$window","$modal",function(a,b,c,d,e){function f(a){if(a){if(a.focus(),"undefined"!=typeof d.getSelection&&"undefined"!=typeof document.createRange){var b=document.createRange();b.selectNodeContents(a),b.collapse(!1);var c=d.getSelection();c.removeAllRanges(),c.addRange(b)}else if("undefined"!=typeof document.body.createTextRange){var e=document.body.createTextRange();e.moveToElementText(a),e.collapse(!1),e.select()}d.scrollTo(0,a.scrollHeight)}}function g(){f(document.getElementById("write-content"))}function h(){f(document.getElementById("write-title"))}function i(){if(document.getElementById("write-content")){var a=document.getElementById("write-content").innerText.slice(0,1e3);return a?a:!1}}a.mediumEditorOptionsBody=angular.toJson({placeholder:"",buttons:["bold","italic","anchor","header2","orderedlist","unorderedlist"],buttonLabels:{header2:"<b>H</b>",italic:"<strong><em>i</em></strong>"},disableToolbar:!1,forcePlainText:!1,targetBlank:!0}),a.mediumEditorOptionsTitle=angular.toJson({placeholder:"",disableToolbar:!0,disableReturn:!0}),a.user&&a.user.current_doc&&b.setCurrentDoc(a.user.current_doc),a.currentDoc=b.getCurrentDoc(),a.$on("userChange",function(a,c){c&&c._userDocs[0]&&b.setCurrentDoc(c._userDocs[0])}),a.titleChange=function(){c(function(){var c=a.currentDoc.title;(c||""===c)&&b.updateUserDoc("title",c)},500)},a.bodyChange=function(){c(function(){var c=a.currentDoc.body;if(c){var d=i();d?a.currentDoc.sample=d:d=a.currentDoc.sample,b.updateUserDoc("body",{sample:d,body:a.currentDoc.body})}},500)},a.$watch(b.getCurrentDoc,function(b){b&&(a.noDoc=!1,a.currentDoc=b,c(function(){g()},200))}),a.switchDoc=function(a){b.setCurrentDoc(a)},a.newDoc=function(){b.createNewDoc()},a.switchHasTitle=function(){b.switchDocTitle(a.currentDoc._id),c(function(){h()},200)},a.switchVisible=function(){b.updateUserDoc("pubVisible",!a.currentDoc.pub_doc.is_visible),a.currentDoc.pub_doc.is_visible=!a.currentDoc.pub_doc.is_visible},a.openPubOptionsModal=function(){e.open({templateUrl:"partials/publish-options-modal.html",controller:["$scope","Write","$modalInstance","$state","doc","username",function(a,b,c,d,e,f){a.close=function(){c.close()},a.doc=e,a.username=f,a.switchVisible=function(){b.updateUserDoc("pubVisible",!a.doc.pub_doc.is_visible),a.doc.pub_doc.is_visible=!a.doc.pub_doc.is_visible,a.close()}}],resolve:{doc:function(){return a.currentDoc},username:function(){return a.user.username}}})},a.openPublishModal=function(){e.open({templateUrl:"partials/publish-modal.html",controller:["$scope","Write","$modalInstance","$state","popularTopics","docTopics","doc","username",function(a,b,c,d,e,f,g,h){a.userTopics=e,a.docTopics=f,a.username=h,a.close=function(){c.close()},a.publish=function(c){b.publishDoc(c).then(function(c){201===c.status&&(g.is_published=!0,g.pub_doc=c.data,b.setCurrentDoc(g),d.go("read.doc",{docId:c.data._id}),a.close())})}}],resolve:{popularTopics:function(){return a.user.topics},username:function(){return a.user.username},docTopics:function(){return a.currentDoc.topics},doc:function(){return a.currentDoc}}})}}]).controller("WriteLeftCtrl",["$scope","$modal","Write",function(a,b){a.isCollapsed=!0,a.openTopicModal=function(){b.open({templateUrl:"partials/topic-modal.html",controller:["$scope","$modalInstance","userTopics","docTopics","Write",function(a,b,c,d,e){a.userTopics=c,a.docTopics=d,a.close=function(){b.close()},a.removeTopic=function(b){console.log(b),e.updateTopics("remove",b.title).then(function(){a.docTopics.splice(a.docTopics.indexOf(b),1)})},a.addTopic=function(b){e.updateTopics("add",b).then(function(b){a.docTopics.push(b.data)})}}],resolve:{userTopics:function(){return a.user.topics},currentDoc:function(){return a.currentDoc},docTopics:function(){return a.currentDoc.topics}}})}}]),angular.module("me").controller("MeCtrl",["$scope","User","$state",function(a,b,c){a.user&&(a.doc=a.user.current_doc),a.currentDocs=[],a.docIds=[],a.$on("userChange",function(b,c){c&&(a.doc=a.user.current_doc)}),a.$watch("user.bio",function(a){a&&b.update("bio",a)}),a.logout=function(){b.isLoggedIn()&&b.logout().success(function(a){b.changeUser(null),"Logged out now."==a&&c.go("landing")}).error(function(a){console.log(a)})}}]),angular.module("myWrdz").controller("MyWrdzCtrl",["$scope","$modal","$state","MyWrdz","$stateParams",function(a,b,c,d){a.moment=moment,a.setToday=function(){a.dt=new Date,a.today=new Date},a.setToday(),a.filterModel="All",a.topicsModel=[],a.topicOptions=[{}],a.isCollapsed=!0;var e=["Days","Weeks","Months"];a.dtCount=0,a.dtType="Days",a.increaseCount=function(){a.dtCount++},a.decreaseCount=function(){0!==a.dtCount&&a.dtCount--},a.increaseType=function(){var b=e.indexOf(a.dtType);a.dtType=b===e.length-1?e[0]:e[b+1]},a.decreaseType=function(){var b=e.indexOf(a.dtType);a.dtType=0===b?e[e.length-1]:e[b-1]},a.getDtOther=function(){var b=a.dtCount,c=a.dtType;console.log(b),console.log(c),"Days"===c&&(a.dt=a.today-864e5*b),"Weeks"===c&&(a.dt=a.today-6048e5*b),"Months"===c&&(a.dt=a.today-262974e4*b)},a.$watch("dtCount",function(b){b&&a.getDtOther()}),a.$watch("dtType",function(b){b&&a.getDtOther()}),a.$watch("dt",function(a){a&&(console.log("updating date: "+a),d.updateQuery("date",a+43e6))}),a.$watch("filterModel",function(a){a&&d.updateQuery("filter",a)}),a.$watchCollection("topicsModel",function(a){if(a){for(var b=[],c=0;c<a.length;c++)b.push(a[c].topicId);d.updateQuery("topics",b)}}),a.user&&(d.setList(a.user._userDocs),a.topicOptions=a.user.topics),a.$on("userChange",function(b,c){c&&c._userDocs&&(d.setList(a.user._userDocs),a.topicOptions=a.user.topics)}),a.$watch(d.getList,function(b){b&&(a.docList=b)}),a.switchDoc=function(b){a.showDoc=b},a.addTopic=function(b){a.topicsModel.push(b)},a.removeTopic=function(b){a.topicsModel.splice(a.topicsModel.indexOf(b._id),1),console.log(a.topicsModel)},a.openDocInWrite=function(b){a.user.current_doc=b,c.go("write")},a.archive=function(a){d.archive(a)},a.openPubOptionsModal=function(){b.open({templateUrl:"partials/publish-options-modal.html",controller:["$scope","Write","$modalInstance","$state","doc","username",function(a,b,c,d,e,f){a.close=function(){c.close()},a.doc=e,a.username=f,a.switchVisible=function(){b.updateUserDoc("pubVisible",!a.doc.pub_doc.is_visible),a.doc.pub_doc.is_visible=!a.doc.pub_doc.is_visible,a.close()}}],resolve:{doc:function(){return a.showDoc},username:function(){return a.user.username}}})},a.openTopicModal=function(){b.open({templateUrl:"partials/topic-modal.html",controller:["$scope","$modalInstance","userTopics","docTopics","Topics","currentDoc",function(a,b,c,d,e,f){a.userTopics=c,a.docTopics=d,a.close=function(){b.close()},a.removeTopic=function(b){console.log(b),e.update(f._id,"remove",b.title).then(function(){a.docTopics.splice(a.docTopics.indexOf(b),1)})},a.addTopic=function(b){e.update(f._id,"add",b).then(function(){a.docTopics.push({title:b})})}}],resolve:{userTopics:function(){return a.user.topics},currentDoc:function(){return a.showDoc},docTopics:function(){return a.showDoc.topics}}})}}]),angular.module("wrdz").directive("mediumEditor",["$timeout",function(a){return{require:"ngModel",restrict:"AE",link:function(b,c,d,e){angular.element(c).addClass("angular-medium-editor");var f={};d.options&&(f=angular.fromJson(d.options));var g=f.placeholder;c.on("blur keypress keydown keyup change",function(){b.$apply(function(){if("<p><br></p>"==c.html()||""==c.html()||"<br>"==c.html()){f.placeholder=g;{new MediumEditor(c,f)}}a(function(){e.$setViewValue(c.html())},100)})}),e.$render=function(){if(!a){e.$isEmpty(e.$viewValue)?d.$set("data-placeholder",angular.fromJson(d.options).placeholder):(f.placeholder="",d.$set("data-placeholder",""));var a=new MediumEditor(c,f)}c.html(e.$isEmpty(e.$viewValue)?"":e.$viewValue)}}}}]),angular.module("shared").directive("joInputAdd",function(){return{restrict:"AE",templateUrl:"partials/input-add.html",scope:{name:"@name",onSubmit:"&onSubmit"},controller:["$scope",function(a){a.add=function(b){a.input="",a.onSubmit({title:b}),document.getElementById("input-add").focus()}}],link:function(){document.getElementById("input-add").focus()}}}).directive("joTopicLabel",function(){return{restrict:"AE",templateUrl:"partials/input-add.html",scope:{name:"@name",onSubmit:"&onSubmit"},controller:["$scope",function(a){a.add=function(b){a.input="",a.onSubmit({title:b}),document.getElementById("input-add").focus()}}],link:function(){document.getElementById("input-add").focus()}}}).directive("twitterButton",["$window",function(){return{restrict:"AE",replace:!0,controller:["$scope","$window",function(a,b){var c=function(){console.log("going");var a,c="https://twitter.com/intent/tweet?text=&url=http://wrdz.herokuapp.com";a={width:500,height:350},a.top=screen.height/2-a.height/2,a.left=screen.width/2-a.width/2,b.open(c,"targetWindow","toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left="+a.left+",top="+a.top+",width="+a.width+",height="+a.height)};a.open=c}],link:function(){}}}]),angular.module("wrdz").directive("shareButton",["$window",function(){return{restrict:"AE",link:function(a,b,c){angular.element(b).addClass("share-button");var d={};c.options&&(d=angular.fromJson(c.options)),new Share(".share-button",{ui:{flyout:"bottom right"}})}}}]),angular.module("shared").filter("startFrom",function(){return function(a,b){return b=+b,a.slice(b)}}),angular.module("write").factory("Write",["User","PubDoc","UserDoc","Topics",function(a,b,c,d){function e(b){k=b,g(b._id);var c=a.getUser();c.current_doc=b}function f(){return k}function g(b){a.update("currentDoc",b)}function h(a,b){return j(k._id),c.update(k._id,a,b)}function i(){var b=a.getUser();c.create().then(function(a){var c=a.data;b._userDocs.unshift(c),e(c)})}function j(b){angular.forEach(a.getUser()._userDocs,function(a){a._id===b&&(a.updated_at=Date())})}var k={};return{getCurrentDoc:f,setCurrentDoc:e,switchDocTitle:function(b){h("hasTitle",!k.has_title),k.has_title=!k.has_title,angular.forEach(a.getUser._userDocs,function(a){a._id===b&&(a.has_title=!a.has_title)})},createNewDoc:i,updateUserDoc:h,publishDoc:function(a){var c=[];angular.forEach(k.topics,function(a){console.log(a),c.push(a._id)});var d={id:k._id,is_anon:a,topics:c};return b.create(d)},updateCurrentDoc:g,updateTopics:function(a,b){return d.update(k._id,a,b)}}}]),angular.module("read").factory("Read",["$http","PubDoc","User","Topics","$state",function(a,b,c,d,e){function f(a){3>a&&g(l.docs.length)}function g(a){var b=l.query;b.length>2?b[2].value=a:b.push({type:"skip",value:a}),j(b)}function h(a){var b=l.docs;b.length&&angular.forEach(b,function(c){if(c._id===a){var d=b.indexOf(c);f(d),k=0===d?null:b[d-1]._id}})}function i(){e.go("read.doc",{docId:k})}function j(a){for(var c=0;c<a.length;c++){for(var d=!0,e=0;e<m.length;e++)m[e].type==a[c].type&&(m[e].value=a[c].value,d=!1);d&&m.push({type:a[c].type,value:a[c].value})}var f=b.list(m);return f.then(function(a){var b=0;angular.forEach(m,function(a){"skip"===a.type&&(b=a.value)}),l.docs=b>0?a.data.concat(l.docs):a.data,l.query=m}),f}var k,l={docs:[],query:[]},m=[],n={};return{setPrevState:function(a){return n.name=a.current.name,n.params=a.params,!0},getPrevState:function(){return n},getNextDocId:function(){return k},goBack:function(){var a=n;a&&e.go(a.name,a.params)},getDocs:function(){return l},setDocs:function(a){l=a},getPubDoc:function(a){return h(a),b.findOne(a)},followUser:function(a,b){var d={userId:a,bool:b};c.update("addFollowing",d)},updateQuery:j,goToNextDoc:i,updatePubDoc:function(a,c,d){return b.update(a,c,d)},refreshTopics:function(){return d.getTop()}}}]),angular.module("myWrdz").factory("MyWrdz",["$http","User","UserDoc",function(a,b,c){var d=[],e=[];return{getList:function(){return e},setList:function(a){e=a},archive:function(a){c.update(a,"archive",!0)},updateQuery:function(a,b){for(var f=!0,g=0;g<d.length;g++)d[g].type==a&&(d[g].value=b,f=!1);f&&d.push({type:a,value:b}),c.list(d).then(function(a){e=a.data})}}}]),angular.module("models").factory("User",["$http","$cookieStore","$rootScope",function(a,b,c){function d(a){e=a,c.$broadcast("userChange",a)}var e=b.get("user")||null;return b.remove("user"),{changeUser:d,isLoggedIn:function(){return e?!0:!1},getUser:function(){return e?e:void 0},setUser:function(a){a&&(e=a)},update:function(b,c){var d={data:c};return a.post("/users/"+e._id+"/?type="+b,d)},getCurrentUser:function(b){return a.get("users/"+b)},resetPassword:function(b,c){var d={email:b,password:c};return a.post("/reset",d)},signup:function(b){return a.post("/signup",b)},signin:function(b){return a.post("/login",b)},logout:function(){return a.get("/logout")},twitter:function(){return a.get("/auth/twitter")}}}]),angular.module("models").factory("UserDoc",["$http",function(a){return{create:function(){return a.post("/userDocs")},update:function(b,c,d){var e={data:d};return a.post("/userDocs/"+b+"/?type="+c,e)},list:function(b){for(var c="",d=0;d<b.length;d++)if(b[d].value instanceof Array)for(var e=0;e<b[d].value.length;e++)c=c+b[d].type+"[]="+b[d].value[e]+"&";else c=c+b[d].type+"="+b[d].value+"&";return a.get("/userDocs/?"+c)}}}]),angular.module("models").factory("PubDoc",["$http",function(a){return{create:function(b){return a.post("/pubDocs",b)},update:function(b,c,d){var e={data:d};return a.post("/pubDocs/"+b+"/?type="+c,e)},findOne:function(b){return a.get("/pubDocs/"+b)},refresh:function(){return a.get("pubDocs/")},list:function(b){for(var c="",d=0;d<b.length;d++)if(b[d].value instanceof Array)for(var e=0;e<b[d].value.length;e++)c=c+b[d].type+"[]="+b[d].value[e]+"&";else c=c+b[d].type+"="+b[d].value+"&";return a.get("/pubDocs/?"+c)}}}]),angular.module("models").factory("Topics",["$http",function(a){return{update:function(b,c,d){var e={topic:d,docId:b};return a.post("/topics/?type="+c,e)},getTop:function(){return a.get("/topics")}}}]);