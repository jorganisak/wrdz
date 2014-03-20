"use strict";angular.module("vendor",["ngCookies","ngResource","ngAnimate","ngSanitize","ngRoute","perfect_scrollbar","ui.bootstrap","ui.router"]),angular.module("read",[]),angular.module("write",[]),angular.module("myWrdz",[]),angular.module("models",[]),angular.module("me",[]),angular.module("shared",[]),angular.module("wrdz",["vendor","read","write","myWrdz","me","read","models","shared"]).config(["$locationProvider",function(a){a.html5Mode(!0)}]).run(["$rootScope","$state","$stateParams",function(a,b,c){a.$state=b,a.$stateParams=c}]),angular.module("shared").config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("landing",{url:"/",templateUrl:"partials/landing.html"}).state("read",{url:"/r",templateUrl:"partials/read.html","abstract":"true",controller:["$scope","$state",function(){}]}).state("read.list",{url:"",templateUrl:"partials/read-list.html"}).state("read.list.front",{url:"",templateUrl:"partials/read.html"}).state("read.list.new",{url:"/n",templateUrl:"partials/read.html"}).state("read.list.following",{url:"/f",templateUrl:"partials/read.html"}).state("read.list.topics",{url:"/t",templateUrl:"partials/read.html"}).state("read.doc",{url:"/:docId",templateUrl:"partials/read-doc.html",resolve:{readDoc:["Read","$stateParams",function(a,b){return a.getPubDoc(b.docId)}]},controller:["$scope","readDoc","PubDoc",function(a,b){a.readDoc=b.data}]}).state("write",{url:"/w",templateUrl:"partials/write.html"}).state("me",{url:"/m",templateUrl:"partials/me.html"}).state("me.about",{url:"/about",templateUrl:"partials/about.html"}).state("mywrdz",{url:"/d",templateUrl:"partials/mywrdz.html"})}]),angular.module("wrdz").controller("NavbarCtrl",["$scope","$state","User",function(){}]),angular.module("shared").controller("MainCtrl",["$scope","User","$rootScope","$modal","$state",function(a,b,c,d,e){function f(){var a=b.getUser();a&&!a.messages&&b.getCurrentUser(a._id).success(function(a){b.changeUser(a.user)}).error(function(){})}f(),a.$on("userChange",function(b,c){a.user=c?c:null}),a.signup=function(c){b.isLoggedIn()||b.signup(c).success(function(a){b.getCurrentUser(a._id).success(function(a){b.changeUser(a.user),e.go("write")}).error(function(){})}).error(function(b){console.log(b.errors.email.type),a.message="Looks like someone already has that username. Try another?"})},a.launchLogIn=function(){d.open({templateUrl:"partials/signin.html",controller:["$scope","$modalInstance","User",function(a,b,c){a.close=function(){b.close()},a.signin=function(b){c.isLoggedIn()||c.signin(b).success(function(b){c.getCurrentUser(b._id).success(function(b){c.changeUser(b.user),a.close(),e.go("write")}).error(function(){})}).error(function(b){"Unknown user"==b&&(a.message="No one has that username on wrdz!"),"Invalid password"==b&&(a.message="Right username, wrong password, need link to change password here")})}}]})},a.launchSignUp=function(){d.open({templateUrl:"partials/signup.html",controller:["$scope","$modalInstance","User","$http",function(a,b,c){a.close=function(){b.close()},a.signup=function(b){c.isLoggedIn()||c.signup(b).success(function(b){c.getCurrentUser(b._id).success(function(b){c.changeUser(b.user),a.close(),e.go("write")}).error(function(){})}).error(function(b){console.log(b.errors.email.type),a.message="Looks like someone already has that username. Try another?"})}}]})},a.feedbackModal=function(){d.open({templateUrl:"partials/feedback-modal.html",controller:["$scope","$modalInstance","$http",function(a,b,c){a.close=function(){b.close()},a.submitFeedback=function(b){console.log(b);var d={content:b};return a.close(),c.post("/feedback",d)}}]})}}]).controller("MenuShortcutCtrl",["$scope",function(a){a.items=[{title:"write",state:"write"},{title:"read",state:"read.list.front"},{title:"my wrdz",state:"mywrdz"},{title:"me",state:"me"}]}]),angular.module("wrdz").controller("ProfileCtrl",["$scope","User","Profile","$state",function(){}]),angular.module("read").controller("ReadCtrl",["$scope","Read","$state","$filter",function(a,b,c,d){a.tabs=[{title:"Front"},{title:"New"},{title:"Following"},{title:"Topics"}],a.$watch("$state.current.url",function(){angular.forEach(a.tabs,function(a){d("lowercase")(a.title)===c.current.name.slice(5)&&(a.active="true")})}),a.moment=moment,a.user&&(a.seen=a.user.meta._views),a.$on("userChange",function(b,c){c&&(a.seen=a.user.meta._views)}),b.refreshDocs(),a.docs=b.getDocs(),a.$watch(b.getDocs,function(b){b&&(a.docs=b)})}]).controller("ReadDocCtrl",["$scope","Read",function(a,b){function c(){a.view(),a.isHeart(),a.isVote(),a.isFollowing()}a.isHeart=function(){return a.user.meta._hearts.indexOf(a.readDoc._id)>-1?(a.active2="active",!0):!1},a.isVote=function(){return a.user.meta._up_votes.indexOf(a.readDoc._id)>-1?(a.active1="active",!0):!1},a.isFollowing=function(){a.readDoc.author&&(a.following=a.user.following.indexOf(a.readDoc.author._id)>-1?!0:!1)},a.heart=function(){"active"===a.active2?(a.readDoc.hearts--,a.active2=null,b.updatePubDoc(a.readDoc._id,"heart",!1)):(a.active2="active",b.updatePubDoc(a.readDoc._id,"heart",!0),a.readDoc.hearts++)},a.up_vote=function(){"active"===a.active1?(a.readDoc.up_votes--,a.active1=null,console.log(a.active1),b.updatePubDoc(a.readDoc._id,"up_vote",!1)):(a.active1="active",b.updatePubDoc(a.readDoc._id,"up_vote",!0),a.readDoc.up_votes++)},a.view=function(){a.user&&-1===a.user.meta._views.indexOf(a.readDoc._id)&&b.updatePubDoc(a.readDoc._id,"view",!0)},a.user&&c(),a.$on("userChange",function(a,b){b&&c()}),a.follow=function(){a.readDoc.author&&(a.following?b.followUser(a.readDoc.author._id,!1):b.followUser(a.readDoc.author._id,!0),a.following=!a.following)}}]),angular.module("write").controller("WriteCtrl",["$scope","Write","$timeout","$window",function(a,b,c,d){function e(a){if(a.focus(),"undefined"!=typeof d.getSelection&&"undefined"!=typeof document.createRange){var b=document.createRange();b.selectNodeContents(a),b.collapse(!1);var c=d.getSelection();c.removeAllRanges(),c.addRange(b)}else if("undefined"!=typeof document.body.createTextRange){var e=document.body.createTextRange();e.moveToElementText(a),e.collapse(!1),e.select()}d.scrollTo(0,a.scrollHeight)}function f(){e(document.getElementById("write-content"))}function g(){if(document.getElementById("write-content")){var a=document.getElementById("write-content").innerText.slice(0,1e3);return a?a:!1}}a.mediumEditorOptionsBody=angular.toJson({placeholder:"",buttons:["bold","italic","anchor","header2","orderedlist","unorderedlist"],buttonLabels:{header2:"<b>H</b>",italic:"<strong><em>i</em></strong>"},disableToolbar:!1,forcePlainText:!1,targetBlank:!0}),a.mediumEditorOptionsTitle=angular.toJson({placeholder:"",disableToolbar:!0,disableReturn:!0}),a.user&&b.setCurrentDoc(a.user.current_doc),a.currentDoc=b.getCurrentDoc(),a.$on("userChange",function(a,c){c&&c.current_doc&&b.setCurrentDoc(c.current_doc)}),a.$watch("currentDoc.title",function(c){(c||""===c)&&b.updateUserDoc("title",a.currentDoc.title)}),a.$watch("currentDoc.body",function(c){if(c){var d=g();d?a.currentDoc.sample=d:d=a.currentDoc.sample,b.updateUserDoc("body",{sample:d,body:a.currentDoc.body})}}),a.$watch(b.getCurrentDoc,function(b){b&&(a.noDoc=!1,a.currentDoc=b,c(function(){f()},200))}),a.switchDoc=function(a){b.setCurrentDoc(a)},a.newDoc=function(){b.createNewDoc()},a.goToTop=function(){d.scrollTo(0,0)},a.switchHasTitle=function(){b.switchDocTitle(a.currentDoc._id)}}]).controller("WriteLeftCtrl",["$scope","$modal","Write",function(a,b){a.openTopicModal=function(){b.open({templateUrl:"partials/topic-modal.html",controller:["$scope","$modalInstance","userTopics","docTopics","Write",function(a,b,c,d,e){a.userTopics=c,a.docTopics=d,a.close=function(){b.close()},a.removeTopic=function(b){console.log(b),e.updateTopics("remove",b.title).then(function(){a.docTopics.splice(a.docTopics.indexOf(b),1)})},a.addTopic=function(b){e.updateTopics("add",b).then(function(){a.docTopics.push({title:b})})}}],resolve:{userTopics:function(){return a.user.topics},currentDoc:function(){return a.currentDoc},docTopics:function(){return a.currentDoc.topics}}})},a.openPublishModal=function(){b.open({templateUrl:"partials/publish-modal.html",controller:["$scope","Write","$modalInstance","$state","popularTopics","docTopics","doc","username",function(a,b,c,d,e,f,g,h){a.userTopics=e,a.docTopics=f,a.username=h,a.close=function(){c.close()},a.publish=function(c){b.publishDoc(c).then(function(c){201===c.status&&(g.is_published=!0,g.pub_doc=c.data,b.setCurrentDoc(g),d.go("read.doc",{docId:c.data._id}),a.close())})}}],resolve:{popularTopics:function(){return a.user.topics},username:function(){return a.user.username},docTopics:function(){return a.currentDoc.topics},doc:function(){return a.currentDoc}}})},a.openPubOptionsModal=function(){b.open({templateUrl:"partials/publish-options-modal.html",controller:["$scope","Write","$modalInstance","$state","doc","username",function(a,b,c,d,e,f){a.close=function(){c.close()},a.doc=e,a.username=f,a.switchVisible=function(){b.updateUserDoc("pubVisible",!a.doc.pub_doc.is_visible),a.doc.pub_doc.is_visible=!a.doc.pub_doc.is_visible,a.close()}}],resolve:{doc:function(){return a.currentDoc},username:function(){return a.user.username}}})}}]),angular.module("me").controller("MeCtrl",["$scope","User","$state",function(a,b,c){a.user&&(a.doc=a.user.current_doc),a.currentDocs=[],a.docIds=[],a.$on("userChange",function(b,c){c&&(a.doc=a.user.current_doc)}),a.$watch("user.bio",function(a){b.update("bio",a)}),a.logout=function(){b.isLoggedIn()&&b.logout().success(function(a){b.changeUser(null),"Logged out now."==a&&c.go("landing")}).error(function(a){console.log(a)})}}]),angular.module("myWrdz").controller("MyWrdzCtrl",["$scope","$modal","$state","MyWrdz","$stateParams",function(a,b,c,d){a.moment=moment,a.setToday=function(){a.dt=new Date,a.today=new Date},a.setToday(),a.filterModel="All",a.topicsModel=[],a.topicOptions=[{}],a.isCollapsed=!0,a.$watch("dt",function(a){a&&d.updateQuery("date",a.getTime()+43e6)}),a.$watch("filterModel",function(a){a&&d.updateQuery("filter",a)}),a.$watchCollection("topicsModel",function(a){if(a){for(var b=[],c=0;c<a.length;c++)b.push(a[c].topicId);b.length>0&&(console.log(b),d.updateQuery("topics",b))}}),a.user&&(d.setList(a.user._userDocs),a.topicOptions=a.user.topics),a.$on("userChange",function(b,c){c&&c._userDocs&&(d.setList(a.user._userDocs),a.topicOptions=a.user.topics)}),a.$watch(d.getList,function(b){b&&(a.docList=b)}),a.switchDoc=function(b){a.showDoc=b},a.addTopic=function(b){a.topicsModel.push(b)},a.removeTopic=function(b){a.topicsModel.splice(a.topicsModel.indexOf(b),1)},a.openDocInWrite=function(b){a.user.current_doc=b,c.go("write")},a.openPubOptionsModal=function(){b.open({templateUrl:"partials/publish-options-modal.html",controller:["$scope","Write","$modalInstance","$state","doc","username",function(a,b,c,d,e,f){a.close=function(){c.close()},a.doc=e,a.username=f,a.switchVisible=function(){b.updateUserDoc("pubVisible",!a.doc.pub_doc.is_visible),a.doc.pub_doc.is_visible=!a.doc.pub_doc.is_visible,a.close()}}],resolve:{doc:function(){return a.showDoc},username:function(){return a.user.username}}})},a.openTopicModal=function(){b.open({templateUrl:"partials/topic-modal.html",controller:["$scope","$modalInstance","userTopics","docTopics","Write",function(a,b,c,d,e){a.userTopics=c,a.docTopics=d,a.close=function(){b.close()},a.removeTopic=function(b){console.log(b),e.updateTopics("remove",b.title).then(function(){a.docTopics.splice(a.docTopics.indexOf(b),1)})},a.addTopic=function(b){e.updateTopics("add",b).then(function(){a.docTopics.push({title:b})})}}],resolve:{userTopics:function(){return a.user.topics},currentDoc:function(){return a.showDoc},docTopics:function(){return a.showDoc.topics}}})}}]),angular.module("wrdz").directive("mediumEditor",["$timeout",function(a){return{require:"ngModel",restrict:"AE",link:function(b,c,d,e){angular.element(c).addClass("angular-medium-editor");var f={};d.options&&(f=angular.fromJson(d.options));var g=f.placeholder;c.on("blur keypress keydown keyup change",function(){b.$apply(function(){if("<p><br></p>"==c.html()||""==c.html()||"<br>"==c.html()){f.placeholder=g;{new MediumEditor(c,f)}}a(function(){e.$setViewValue(c.html())},100)})}),e.$render=function(){if(!a){e.$isEmpty(e.$viewValue)?d.$set("data-placeholder",angular.fromJson(d.options).placeholder):(f.placeholder="",d.$set("data-placeholder",""));var a=new MediumEditor(c,f)}c.html(e.$isEmpty(e.$viewValue)?"":e.$viewValue)}}}}]),angular.module("shared").directive("joInputAdd",function(){return{restrict:"AE",templateUrl:"partials/input-add.html",scope:{name:"@name",onSubmit:"&onSubmit"},controller:["$scope",function(a){a.add=function(b){a.input="",a.onSubmit({title:b}),document.getElementById("input-add").focus()}}],link:function(){document.getElementById("input-add").focus()}}}).directive("joTopicLabel",function(){return{restrict:"AE",templateUrl:"partials/input-add.html",scope:{name:"@name",onSubmit:"&onSubmit"},controller:["$scope",function(a){a.add=function(b){a.input="",a.onSubmit({title:b}),document.getElementById("input-add").focus()}}],link:function(){document.getElementById("input-add").focus()}}}).directive("joClickCounter",function(){return{restrict:"AE",replace:!0,link:function(a,b){a.switch=function(){console.log(b),b.hasClass("active")?b.removeClass("active"):b.addClass("active")}}}}),angular.module("wrdz").directive("shareButton",["$window",function(a){return{restrict:"AE",link:function(b,c,d){angular.element(c).addClass("share-button");var e={};d.options&&(e=angular.fromJson(d.options)),console.log(a.location.href),new Share(".share-button",{url:a.location.href})}}}]),angular.module("write").factory("Write",["User","PubDoc","UserDoc","Topics",function(a,b,c,d){function e(b){k=b,g(b._id);var c=a.getUser();c.current_doc=b}function f(){return k}function g(b){a.update("currentDoc",b)}function h(a,b){return j(k._id),c.update(k._id,a,b)}function i(){var b=a.getUser();c.create().then(function(a){var c=a.data;b._userDocs.unshift(c),e(c)})}function j(b){angular.forEach(a.getUser()._userDocs,function(a){a._id===b&&(a.updated_at=Date())})}var k={};return{getCurrentDoc:f,setCurrentDoc:e,switchDocTitle:function(b){h("hasTitle",!k.has_title),k.has_title=!k.has_title,angular.forEach(a.getUser._userDocs,function(a){a._id===b&&(a.has_title=!a.has_title)})},createNewDoc:i,updateUserDoc:h,publishDoc:function(a){var c={id:k._id,is_anon:a};return b.create(c)},updateCurrentDoc:g,updateTopics:function(a,b){return d.update(k._id,a,b)}}}]),angular.module("read").factory("Read",["$http","PubDoc","User",function(a,b,c){var d=[];return{getDocs:function(){return d},followUser:function(a,b){var d={userId:a,bool:b};c.update("addFollowing",d)},refreshDocs:function(){b.refresh().then(function(a){d=a.data})},updatePubDoc:function(a,c,d){return b.update(a,c,d)},getPubDoc:function(a){return b.findOne(a)}}}]),angular.module("myWrdz").factory("MyWrdz",["$http","User","UserDoc",function(a,b,c){var d=[],e=[];return{getList:function(){return e},setList:function(a){e=a},updateList:function(){return c.list(d)},updateQuery:function(a,b){for(var f=!0,g=0;g<d.length;g++)d[g].type==a&&(d[g].value=b,f=!1);f&&d.push({type:a,value:b}),c.list(d).then(function(a){e=a.data})}}}]),angular.module("models").factory("User",["$http","$cookieStore","$rootScope",function(a,b,c){function d(a){e=a,c.$broadcast("userChange",a)}var e=b.get("user")||null;return b.remove("user"),{changeUser:d,isLoggedIn:function(){return e?!0:!1},getUser:function(){return e?e:void 0},setUser:function(a){a&&(e=a)},update:function(b,c){var d={data:c};return a.post("/users/"+e._id+"/?type="+b,d)},getCurrentUser:function(b){return a.get("users/"+b)},signup:function(b){return a.post("/signup",b)},signin:function(b){return a.post("/login",b)},logout:function(){return a.get("/logout")}}}]),angular.module("models").factory("UserDoc",["$http",function(a){return{create:function(){return a.post("/userDocs")},update:function(b,c,d){var e={data:d};return a.post("/userDocs/"+b+"/?type="+c,e)},list:function(b){for(var c="",d=0;d<b.length;d++)if(b[d].value instanceof Array)for(var e=0;e<b[d].value.length;e++)c=c+b[d].type+"[]="+b[d].value[e]+"&";else c=c+b[d].type+"="+b[d].value+"&";return a.get("/userDocs/?"+c)}}}]),angular.module("models").factory("PubDoc",["$http",function(a){return{create:function(b){return a.post("/pubDocs",b)},update:function(b,c,d){var e={data:d};return a.post("/pubDocs/"+b+"/?type="+c,e)},findOne:function(b){return a.get("/pubDocs/"+b)},refresh:function(){return a.get("pubDocs/")}}}]),angular.module("models").factory("Topics",["$http",function(a){return{update:function(b,c,d){var e={topic:d,docId:b};return a.post("/topics/?type="+c,e)}}}]);