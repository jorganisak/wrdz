"use strict";angular.module("vendor",["ngCookies","ngResource","ngAnimate","ngSanitize","ngRoute","mgo-mousetrap","perfect_scrollbar","ui.bootstrap","ui.router"]),angular.module("read",[]),angular.module("write",[]),angular.module("myWrdz",[]),angular.module("models",[]),angular.module("me",[]),angular.module("shared",[]),angular.module("wrdz",["vendor","read","write","myWrdz","me","read","models","shared"]).config(["$locationProvider",function(a){a.html5Mode(!0)}]).run(["$rootScope","$state","$stateParams",function(a,b,c){a.$state=b,a.$stateParams=c}]),angular.module("shared").config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("landing",{url:"/",templateUrl:"partials/landing.html"}).state("read",{url:"/r",templateUrl:"partials/read/read.html","abstract":"true",controller:["$scope","$state",function(){}]}).state("read.list",{url:"",templateUrl:"partials/read/read-list.html"}).state("read.list.front",{url:"",templateUrl:"partials/read/read.html"}).state("read.list.new",{url:"/n",templateUrl:"partials/read/read.html"}).state("read.list.following",{url:"/f",templateUrl:"partials/read/read.html"}).state("read.list.topics",{url:"/t",templateUrl:"partials/read/read.html"}).state("read.doc",{url:"/:docId",templateUrl:"partials/read/read-doc.html",resolve:{readDoc:["Read","$stateParams",function(a,b){return a.getPubDoc(b.docId)}]},controller:["$scope","readDoc","PubDoc",function(a,b){a.readDoc=b.data}]}).state("write",{url:"/w",templateUrl:"partials/write/write.html"}).state("me",{url:"/m",templateUrl:"partials/me.html"}).state("me.about",{url:"/about",templateUrl:"partials/about.html"}).state("mywrdz",{url:"/d",templateUrl:"partials/mywrdz.html"})}]),angular.module("wrdz").controller("NavbarCtrl",["$scope","$state","User",function(a,b){a.$state=b}]),angular.module("shared").controller("MainCtrl",["$scope","User","$rootScope","$modal","$state",function(a,b,c,d,e){function f(){var a=b.isLoggedIn();a&&!a.messages&&b.getCurrentUser(a._id).success(function(a){b.changeUser(a.user)}).error(function(a){console.log(a)})}f(),a.$on("userChange",function(b,c){a.user=c?c:null}),a.launchLogIn=function(){d.open({templateUrl:"partials/signin.html",controller:["$csope","$modalInstance","User",function(a,b,c){a.close=function(){b.close()},a.signin=function(b){c.isLoggedIn()||c.signin(b).success(function(b){c.changeUser(b),a.close(),e.go("write")}).error(function(b){"Unknown user"==b&&(a.message="No one has that username on wrdz!"),"Invalid password"==b&&(a.message="Right username, wrong password, need link to change password here")})}}]})},a.launchSignUp=function(){d.open({templateUrl:"partials/signup.html",controller:["$scope","$modalInstance","User","$http",function(a,b,c,d){a.close=function(){b.close()},a.signup=function(b){c.isLoggedIn()||c.signup(b).success(function(a){c.changeUser(a),e.go("write")}).error(function(b){console.log(b.errors.email.type),a.message="Something went wrong...someone probably already has that email on here."})},a.twitter=function(){d.get("/auth/twitter")}}]})},a.feedbackModal=function(){d.open({templateUrl:"partials/feedback-modal.html",controller:["$scope","$modalInstance","$http",function(a,b,c){a.close=function(){b.close()},a.submitFeedback=function(b){console.log(b);var d={content:b};return a.close(),c.post("/feedback",d)}}]})}}]).controller("MenuShortcutCtrl",["$scope",function(a){a.items=[{title:"write",state:"write"},{title:"read",state:"read.list.front"},{title:"my wrdz",state:"mywrdz"},{title:"me",state:"me"}]}]),angular.module("wrdz").controller("ProfileCtrl",["$scope","User","Profile","$state",function(a,b,c,d){a.user&&c.setDocIds(a.user._userDocs),a.currentDocs=[],a.docIds=[],a.$on("userChange",function(a,b){b?c.setDocIds(b._userDocs):(c.setDocIds([]),c.setDocs([]))}),a.$watch(function(){return c.getDocs()},function(b){b&&(a.currentDocs=b)}),a.$watch(function(){return c.getDocIds()},function(b){b&&(a.docIds=b,c.getDocServer_20())}),a.logout=function(){b.isLoggedIn()&&b.logout().success(function(a){b.changeUser(null),"Logged out now."==a&&d.go("landing")}).error(function(a){console.log(a)})}}]),angular.module("read").controller("ReadCtrl",["$scope","Read","$state","$stateParams","$filter",function(a,b,c,d,e){a.tabs=[{title:"Front"},{title:"New"},{title:"Following"},{title:"Topics"}],a.$watch("$state.current.url",function(){angular.forEach(a.tabs,function(a){e("lowercase")(a.title)===c.current.name.slice(5)&&(a.active="true")})}),a.moment=moment,b.refreshDocs(),a.user&&(a.seen=a.user.meta._views),a.$on("userChange",function(b,c){c&&(a.seen=a.user.meta._views)}),a.docs=b.getDocs(),a.$watch(b.getDocs,function(b){b&&(console.log("loading new docs"),a.docs=b)})}]).controller("ReadDocCtrl",["$scope","PubDoc",function(a,b){function c(){a.view(),a.isHeart(),a.isVote(),a.isRepost()}a.isHeart=function(){return a.user.meta._hearts.indexOf(a.readDoc._id)>-1?(a.active2="active",!0):!1},a.isVote=function(){return a.user.meta._up_votes.indexOf(a.readDoc._id)>-1?(a.active1="active",!0):!1},a.isRepost=function(){return a.user.meta._reposts.indexOf(a.readDoc._id)>-1?(a.active3="active",!0):!1},a.heart=function(){"active"==a.active2?(a.readDoc.hearts--,a.active2=null,b.update(a.readDoc._id,"heart",!1)):(a.active2="active",b.update(a.readDoc._id,"heart",!0),a.readDoc.hearts++)},a.up_vote=function(){"active"==a.active1?(a.readDoc.up_votes--,a.active1=null,console.log(a.active1),b.update(a.readDoc._id,"up_vote",!1)):(a.active1="active",b.update(a.readDoc._id,"up_vote",!0),a.readDoc.up_votes++)},a.repost=function(){"active"==a.active3?(a.readDoc.reposts--,a.active3=null,b.update(a.readDoc._id,"repost",!1)):(a.active3="active",b.update(a.readDoc._id,"repost",!0),a.readDoc.reposts++)},a.view=function(){a.user&&-1==a.user.meta._views.indexOf(a.readDoc._id)&&b.update(a.readDoc._id,"view",!0)},a.user&&c(),a.$on("userChange",function(a,b){b&&c()})}]),angular.module("write").controller("WriteCtrl",["$scope","Write","$state","$timeout","$window",function(a,b,c,d,e){function f(b){angular.forEach(a.user._userDocs,function(a){a._id===b&&(a.has_title=!a.has_title)})}function g(b){angular.forEach(a.user._userDocs,function(a){a._id===b&&(a.updated_at=Date())})}function h(){function a(a){if(a.focus(),"undefined"!=typeof window.getSelection&&"undefined"!=typeof document.createRange){var b=document.createRange();b.selectNodeContents(a),b.collapse(!1);var c=window.getSelection();c.removeAllRanges(),c.addRange(b)}else if("undefined"!=typeof document.body.createTextRange){var d=document.body.createTextRange();d.moveToElementText(a),d.collapse(!1),d.select()}e.scrollTo(0,a.scrollHeight)}a(document.getElementById("write-content"))}function i(){var b=document.getElementById("write-content").innerText.slice(0,1e3);return b?(a.currentDoc.sample=b,b):!1}a.currentDoc=b.getCurrentDoc(),a.user&&b.setCurrentDoc(a.user.current_doc),a.$on("userChange",function(c,d){d?d.current_doc?b.setCurrentDoc(d.current_doc):(console.log("No current Doc"),a.noDoc=!0):a.noUser=!0}),a.$watch("currentDoc.title",function(c){(c||""===c)&&(b.updateUserDoc("title",a.currentDoc.title),g(a.currentDoc._id))}),a.$watch("currentDoc.body",function(c){if(c){var d=i();d||(d=a.currentDoc.sample),g(a.currentDoc._id),b.updateUserDoc("body",{sample:d,body:a.currentDoc.body})}}),a.$watch(b.getCurrentDoc,function(b){b&&(a.currentDoc=b,a.hasTitle=b.has_title,d(function(){h()},200))}),a.switchDoc=function(c){b.setCurrentDoc(c),b.updateCurrentDoc(c._id),a.user.current_doc=c},a.newDoc=function(){b.createNewDoc().then(function(c){var d=c.data;b.setCurrentDoc(d),b.updateCurrentDoc(d._id),a.user._userDocs.unshift(d),a.noDoc=!1,h()})},a.goToTop=function(){e.scrollTo(0,0)},a.switchHasTitle=function(){b.updateUserDoc("hasTitle",!a.hasTitle),b.setCurrentDoc.hasTitle=!a.hasTitle,a.hasTitle=!a.hasTitle,f(a.currentDoc._id)}}]).controller("WriteLeftCtrl",["$scope","$modal","Write",function(a,b,c){a.switchVisible=function(){c.updateUserDoc("pubVisible",!a.currentDoc.pub_doc.is_visible),a.currentDoc.pub_doc.is_visible=!a.currentDoc.pub_doc.is_visible},a.openTopicModal=function(){b.open({templateUrl:"partials/write/topic-modal.html",controller:function(a,b,c,d,e){a.userTopics=c,a.docTopics=d,a.close=function(){b.close()},a.removeTopic=function(b){console.log(b),e.updateTopics("remove",b.title).then(function(){a.docTopics.splice(a.docTopics.indexOf(b),1)})},a.addTopic=function(b){e.updateTopics("add",b).then(function(){a.docTopics.push({title:b})})}},resolve:{userTopics:function(){return a.user.topics},currentDoc:function(){return a.currentDoc},docTopics:function(){return a.currentDoc.topics}}})},a.openPublishModal=function(){b.open({templateUrl:"partials/write/publish-modal.html",controller:function(a,b,c,d,e,f,g,h){a.userTopics=e,a.docTopics=f,a.username=h,a.close=function(){c.close()},a.publish=function(c){b.publishDoc(c).then(function(b){201===b.status&&(console.log(b),g.is_published=!0,d.go("read.doc",{docId:b.data._id}),a.close())})}},resolve:{popularTopics:function(){return a.user.topics},username:function(){return a.user.username},docTopics:function(){return a.currentDoc.topics},doc:function(){return a.currentDoc}}})}}]),angular.module("me").controller("MeCtrl",["$scope","User","$state",function(a,b,c){a.user&&(a.doc=a.user.current_doc),a.currentDocs=[],a.docIds=[],a.$on("userChange",function(b,c){c&&(a.doc=a.user.current_doc)}),a.logout=function(){b.isLoggedIn()&&b.logout().success(function(a){b.changeUser(null),"Logged out now."==a&&c.go("landing")}).error(function(a){console.log(a)})}}]),angular.module("myWrdz").controller("MyWrdzCtrl",["$scope","$state","MyWrdz","$stateParams",function(a,b,c){a.moment=moment,a.setToday=function(){a.dt=new Date,a.today=new Date},a.setToday(),a.filterModel="All",a.topicsModel=[],a.topicOptions=[{}],a.isCollapsed=!0,a.$watch("dt",function(a){a&&c.updateQuery("date",a.getTime()+43e6)}),a.$watch("filterModel",function(a){a&&c.updateQuery("filter",a)}),a.$watchCollection("topicsModel",function(a){if(a){for(var b=[],d=0;d<a.length;d++)b.push(a[d].topicId);c.updateQuery("topics",b)}}),a.user&&(a.docList=a.user._userDocs,a.showDoc=a.user._userDocs[0],a.topicOptions=a.user.topics),a.$on("userChange",function(b,c){c?c._userDocs&&(a.docList=a.user._userDocs,a.showDoc=a.user._userDocs[0],a.topicOptions=a.user.topics):a.noUser=!0}),a.$watch(c.getList,function(b){b&&(a.docList=b)}),a.switchDoc=function(b){a.showDoc=b},a.addTopic=function(b){a.topicsModel.push(b)},a.removeTopic=function(b){a.topicsModel.splice(a.topicsModel.indexOf(b),1)},a.openDocInWrite=function(c){a.user.current_doc=c,b.go("write")}}]),angular.module("wrdz").directive("mediumEditor",["$timeout",function(a){return{require:"ngModel",restrict:"AE",link:function(b,c,d,e){angular.element(c).addClass("angular-medium-editor");var f={};d.options&&(f=angular.fromJson(d.options));var g=f.placeholder;c.on("blur keypress keydown keyup change",function(){b.$apply(function(){if("<p><br></p>"==c.html()||""==c.html()||"<br>"==c.html()){f.placeholder=g;{new MediumEditor(c,f)}}a(function(){e.$setViewValue(c.html())},100)})}),e.$render=function(){if(!a){e.$isEmpty(e.$viewValue)?d.$set("data-placeholder",angular.fromJson(d.options).placeholder):(f.placeholder="",d.$set("data-placeholder",""));var a=new MediumEditor(c,f)}c.html(e.$isEmpty(e.$viewValue)?"":e.$viewValue)}}}}]),angular.module("shared").directive("joInputAdd",function(){return{restrict:"AE",templateUrl:"partials/directives/input-add.html",scope:{name:"@name",onSubmit:"&onSubmit"},controller:["$scope",function(a){a.add=function(b){a.input="",a.onSubmit({title:b}),document.getElementById("input-add").focus()}}],link:function(){document.getElementById("input-add").focus()}}}).directive("joTopicLabel",function(){return{restrict:"AE",templateUrl:"partials/directives/input-add.html",scope:{name:"@name",onSubmit:"&onSubmit"},controller:["$scope",function(a){a.add=function(b){a.input="",a.onSubmit({title:b}),document.getElementById("input-add").focus()}}],link:function(){document.getElementById("input-add").focus()}}}).directive("joClickCounter",function(){return{restrict:"AE",replace:!0,link:function(a,b){a.switch=function(){console.log(b),b.hasClass("active")?b.removeClass("active"):b.addClass("active")}}}}),angular.module("write").factory("Write",["$http","User","PubDoc","UserDoc","Topics",function(a,b,c,d,e){function f(a){h=a}function g(){return h}var h={};return{getCurrentDoc:g,setCurrentDoc:f,createNewDoc:function(){return d.create()},updateUserDoc:function(a,b){return d.update(h._id,a,b)},publishDoc:function(a){var b={id:h._id,is_anon:a};return c.create(b)},updateCurrentDoc:function(a){b.update("currentDoc",a)},updateTopics:function(a,b){return e.update(h._id,a,b)}}}]),angular.module("read").factory("Read",["$http","PubDoc",function(a,b){var c=[];return{getDocs:function(){return c},refreshDocs:function(){a.get("pubDocs/").success(function(a){c=a}).error()},updatePubDoc:function(b,c){var d={type:c};return a.post("/pubDocs/"+b,d)},getPubDoc:function(a){return b.findOne(a)}}}]),angular.module("myWrdz").factory("MyWrdz",["$http","User","UserDoc",function(a,b,c){var d,e=[];return{getList:function(){return d},updateList:function(){return c.list(e)},updateQuery:function(a,b){for(var f=!0,g=0;g<e.length;g++)e[g].type==a&&(e[g].value=b,f=!1);f&&e.push({type:a,value:b}),c.list(e).then(function(a){d=a.data})}}}]),angular.module("models").factory("User",["$http","$cookieStore","$rootScope",function(a,b,c){function d(a){e=a,c.$broadcast("userChange",a)}var e=b.get("user")||null;return b.remove("user"),{changeUser:d,isLoggedIn:function(){return e?e:void 0},signup:function(b){return a.post("/signup",b)},signin:function(b){return a.post("/login",b)},logout:function(){return a.get("/logout")},update:function(b,c){var d={data:c};return a.post("/users/"+e._id+"/?type="+b,d)},user:e,getCurrentUser:function(b){return a.get("users/"+b)}}}]),angular.module("models").factory("UserDoc",["$http",function(a){return{create:function(){return a.post("/userDocs")},update:function(b,c,d){var e={data:d};return a.post("/userDocs/"+b+"/?type="+c,e)},list:function(b){for(var c="",d=0;d<b.length;d++)if(b[d].value instanceof Array){c=c+b[d].type+"=";for(var e=0;e<b[d].value.length;e++)c=c+b[d].value[e]+"&"}else c=c+b[d].type+"="+b[d].value+"&";return a.get("/userDocs/?"+c)}}}]),angular.module("models").factory("PubDoc",["$http",function(a){return{create:function(b){return a.post("/pubDocs",b)},update:function(b,c,d){var e={data:d};return a.post("/pubDocs/"+b+"/?type="+c,e)},findOne:function(b){return a.get("/pubDocs/"+b)}}}]),angular.module("models").factory("Topics",["$http",function(a){return{update:function(b,c,d){var e={topic:d,docId:b};return a.post("/topics/?type="+c,e)}}}]);