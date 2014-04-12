"use strict";angular.module("vendor",["ngCookies","ngResource","ngAnimate","ngSanitize","ngRoute","perfect_scrollbar","ui.bootstrap","ui.router","pickadate"]),angular.module("read",[]),angular.module("write",[]),angular.module("myWrdz",[]),angular.module("models",[]),angular.module("me",[]),angular.module("shared",[]),angular.module("wrdz",["vendor","read","write","myWrdz","me","read","models","shared"]).config(["$locationProvider",function(a){a.html5Mode(!0)}]).run(["$rootScope","$state","$stateParams",function(a,b,c){a.$state=b,a.$stateParams=c}]),angular.module("shared").config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("picture-test",{url:"/pic-test",templateUrl:"partials/picture-test.html"}).state("read",{url:"/r",templateUrl:"partials/read.html","abstract":"true",controller:["$scope","$state",function(){}]}).state("read.list",{url:"",templateUrl:"partials/read-list.html"}).state("read.list.front",{url:"/f?skip",templateUrl:"partials/read-list-center.html",resolve:{docs:["Read","$stateParams",function(a,b){return a.updateQuery([{type:"topics",value:""},{type:"following",value:""},{type:"hearts",value:""},{type:"skip",value:b.skip}])}]},controller:["$scope","docs","Read","$state",function(a,b,c,d){a.hideStats=!0,a.showUser=!1,c.setPrevState(d),a.docs=b.data}]}).state("read.list.following",{url:"/l/:userId",templateUrl:"partials/read-list-center.html",resolve:{docs:["$stateParams","User","Read",function(a,b,c){if(a.userId)return c.updateQuery([{type:"following",value:[a.userId]},{type:"topics",value:""},{type:"skip",value:""}]);var d=[];return angular.forEach(b.getUser().following,function(a){d.push(a._id)}),d.length?c.updateQuery([{type:"following",value:d},{type:"hearts",value:""},{type:"topics",value:""},{type:"skip",value:""}]):!1}]},controller:["$scope","docs","Read","$stateParams","$state",function(a,b,c,d,e){a.hideStats=!0,a.showUser=!1,a.$on("userChange",function(b,e){if(e&&!d.userId){var f=[];angular.forEach(e.following,function(a){f.push(a._id)}),f.length?c.updateQuery([{type:"following",value:f},{type:"topics",value:""},{type:"hearts",value:""},{type:"skip",value:""}]).then(function(b){a.docs=b.data}):(console.log("not following"),a.docs=[])}}),c.setPrevState(e),a.docs=b.data}]}).state("read.list.hearts",{url:"/h",templateUrl:"partials/read-list-center.html",resolve:{docs:["$stateParams","User","Read",function(a,b,c){var d=c.getHearts();return d?d.length?c.updateQuery([{type:"hearts",value:d},{type:"following",value:""},{type:"topics",value:""},{type:"skip",value:""}]):!1:!0}]},controller:["$scope","docs","Read","$stateParams","$state",function(a,b,c,d,e){a.$on("userChange",function(b,d){if(d){var e=c.getHearts();c.updateQuery([{type:"hearts",value:e},{type:"topics",value:""},{type:"following",value:""},{type:"skip",value:""}]).then(function(b){a.docs=b.data})}}),c.setPrevState(e),a.docs=b.data}]}).state("read.list.topics",{templateUrl:"partials/read-list-center.html",url:"/t/:topicId",resolve:{docs:["$stateParams","Read","$state",function(a,b,c){return a.topicId?b.updateQuery([{type:"following",value:""},{type:"topics",value:a.topicId},{type:"skip",value:""}]):void b.refreshTopics().then(function(a){c.go("read.list.topics",{topicId:a.data[0]._id})})}]},controller:["$scope","docs","Read","$state",function(a,b,c,d){b&&(c.setPrevState(d),a.docs=b.data)}]}).state("read.list.user",{templateUrl:"partials/read-list-center.html",url:"/u/:userId",resolve:{docs:["$stateParams","User","Read",function(a,b,c){return a.userId?c.updateQuery([{type:"following",value:[a.userId]},{type:"topics",value:""},{type:"hearts",value:""},{type:"skip",value:""}]):!1}]},controller:["$scope","docs","Read","$stateParams","$state","$rootScope",function(a,b,c,d,e){c.setPrevState(e),a.docs=b.data,a.docs[0]&&a.docs[0].author._id===d.userId&&a.$emit("author_info",a.docs[0].author)}]}).state("read.doc",{url:"/:docId",templateUrl:"partials/read-doc.html",resolve:{readDoc:["Read","$stateParams",function(a,b){return a.getPubDoc(b.docId)}]},controller:["$scope","readDoc","PubDoc","$rootScope",function(a,b,c,d){a.doc=b.data;var e="";e=a.doc.doc.has_title?a.doc.doc.title:a.doc.doc.sample.slice(0,20),d.$broadcast("changePageTitle",e)}]}).state("write",{url:"/",templateUrl:"partials/write.html"}).state("mywrdz",{url:"/d",templateUrl:"partials/mywrdz.html"}).state("me",{url:"/m",templateUrl:"partials/me.html","abstract":"true"}).state("me.profile",{url:"/profile",templateUrl:"partials/me-settings.html"}).state("me.following",{url:"/f",templateUrl:"partials/me-following.html",controller:["$scope","User",function(a,b){a.unfollow=function(c){var d={userId:c,bool:!1};b.update("addFollowing",d),angular.forEach(a.user.following,function(b){b._id===c&&a.user.following.splice(a.user.following.indexOf(b),1)})}}]}).state("me.hearts",{url:"/hearts",templateUrl:"partials/me-hearts.html",resolve:{docs:["Me","$state",function(a){var b=a.getHearts();return b?b:!0}]},controller:["$scope","docs","Me",function(a,b,c){a.currentPage=0,a.pageSize=6,a.data=[],a.numberOfPages=function(){return Math.ceil(a.data.length/a.pageSize)};var d=function(b){if(b.data)for(var c=0;c<b.data.length;c++)a.data.push(b.data[c])};d(b),a.$on("userChange",function(a,b){if(b){var e=c.getHearts();e.then(function(a){d(a)})}})}]}).state("password_reset",{url:"/password_reset?key",templateUrl:"partials/password-reset.html",resolve:{email:["$cookieStore","$stateParams",function(a,b){var c=a.get("pwreset");if(c){var d=c.id.slice(0,-2),e=c.email,f=b.key;if(d===f)return a.remove("pwreset"),e}return!1}]},controller:["$scope","email","User","$state","$timeout",function(a,b,c,d,e){b||(a.emailFail=!0),a.resetPass=function(d){c.resetPassword(b,d).then(function(b){console.log(b),e(function(){a.launchLogIn()},1e3)})}}]})}]),angular.module("wrdz").controller("NavbarCtrl",["$scope","$state","User",function(){}]),angular.module("shared").controller("MainCtrl",["$scope","User","$rootScope","$modal","$window","$state","$timeout",function(a,b,c,d,e,f,g){function h(){var a=b.getUser();a&&!a._userDocs&&b.getCurrentUser(a._id).success(function(a){b.changeUser(a.user)}).error(function(){})}a.$on("changePageTitle",function(b,c){a.pageTitle=c?c:"wrdz"}),a.$watch("$state.current.name",function(b){"read.doc"!==b&&(a.pageTitle="wrdz")}),a.pageTitle="wrdz",a.landingCopy="<h4 style='text-align:center'>Welcome to Wrdz</h4><p><br></p><p><span style='font-size: 22px; line-height: 1.25;'>This is a web app that provides a simple and clean place to write. <br><br> <strong>(Try highlighting this text.)</strong></span><br><br></p><p><em>With Wrdz, you can:&nbsp;</em></p><p></p><ul><li>Write whatever's in your head</li><li>Easily browse and organize by date and tag</li><li>Share your writing, anonymously if you'd like</li></ul>",a.mediumEditorOptionsBody=angular.toJson({placeholder:"",buttons:["bold","italic","anchor","header2","orderedlist","unorderedlist"],buttonLabels:{header2:"<b>H</b>",anchor:"<span><span class='icon ion-link'></span></span>",bold:"<strong>B</strong>",italic:"<em>i</em>"},disableToolbar:!1,forcePlainText:!1,targetBlank:!0}),h(),a.$on("userChange",function(b,c){a.user=c?c:null}),a.goToTop=function(){e.scrollTo(0,0)},a.local_auth_form=!1,a.signup=function(c){b.isLoggedIn()||b.signup(c).success(function(a){b.getCurrentUser(a._id).success(function(a){b.changeUser(a.user),f.go("write")}).error(function(){})}).error(function(b){"Username already exists"===b.errors.username.type&&(a.message="Bummer. That username is taken. Try another?")})},a.closeWindow=function(){g(function(){console.log("closing"),e.close()},1e3)},a.signin=function(c){b.isLoggedIn()||b.signin(c).success(function(a){b.getCurrentUser(a._id).success(function(a){b.changeUser(a.user),f.go("write")}).error(function(){})}).error(function(b){"Unknown user"==b&&(a.message="No one has that username on wrdz!"),"Invalid password"==b&&(a.message="Right username, wrong password...")})},a.launchLogIn=function(){d.open({templateUrl:"partials/signin.html",controller:["$scope","$modalInstance","User",function(a,b,c){a.close=function(){b.close()},a.signin=function(b){c.isLoggedIn()||c.signin(b).success(function(b){c.getCurrentUser(b._id).success(function(b){c.changeUser(b.user),a.close(),f.go("write")}).error(function(){})}).error(function(b){"Unknown user"==b&&(a.message="No one has that username on wrdz!"),"Invalid password"==b&&(a.message="Right username, wrong password...")})},a.forgotPasswordModal=function(){d.open({templateUrl:"partials/password-modal.html",controller:["$scope","$modalInstance","$http","$cookieStore",function(a,b,c,d){a.close=function(){b.close()},a.submitEmail=function(b){c.post("/forgot",{email:b}).then(function(a){d.remove("pwreset"),d.put("pwreset",{id:a.data,email:b})}),a.close()}}]})}}]})},a.launchSignUp=function(){d.open({templateUrl:"partials/signup.html",controller:["$scope","$modalInstance","User","$http",function(a,b,c){a.close=function(){b.close()},a.signup=function(b){c.isLoggedIn()||c.signup(b).success(function(b){c.getCurrentUser(b._id).success(function(b){c.changeUser(b.user),a.close(),f.go("write")}).error(function(){})}).error(function(b){"Username already exists"===b.errors.username.type&&(a.message="Bummer. That username is taken. Try another?")})}}]})},a.aboutModal=function(){d.open({templateUrl:"partials/about-modal.html",controller:["$scope","$modalInstance","$http",function(a,b){a.close=function(){b.close()},a.feedbackModal=function(){a.close();d.open({templateUrl:"partials/feedback-modal.html",controller:["$scope","$modalInstance","$http",function(a,b,c){a.close=function(){b.close()},a.submitFeedback=function(b){console.log(b);var d={content:b};return a.close(),c.post("/feedback",d)}}]})}}]})},a.forgotPasswordModal=function(){d.open({templateUrl:"partials/password-modal.html",controller:["$scope","$modalInstance","$http","$cookieStore",function(a,b,c,d){a.close=function(){b.close()},a.submitEmail=function(b){c.post("/forgot",{email:b}).then(function(a){d.remove("pwreset"),d.put("pwreset",{id:a.data,email:b})}),a.close()}}]})},a.twitterAuth=function(){b.twitter().success(function(a,b){console.log(a),console.log(b),console.log("callback")})}}]),angular.module("wrdz").controller("ProfileCtrl",["$scope","User","Profile","$state",function(){}]),angular.module("read").controller("ReadCtrl",["$scope","Picture","Read","$state","$filter","$location","$window","$timeout","$modal",function(a,b,c,d,e,f,g,h,i){function j(){return a.user?!0:void a.launchSignUp()}function k(b){if(a.user){var c=!1;angular.forEach(a.user.following,function(a){a._id===b&&(c=!0)}),a.following=c?!0:!1}}a.Read=c,a.tabs=[{title:"Front",state:"read.list.front({'skip': null})"},{title:"Following",state:"read.list.following({'skip': null})"},{title:"Hearts",state:"read.list.hearts({'skip': null})"}],a.navType="pills",a.moment=moment,a.left_xs_collapsed=!0,a.$watch("$state.current.name",function(b){b&&angular.forEach(a.tabs,function(a){a.active=e("lowercase")(a.title)===b.slice(10)?!0:!1})}),a.loadNext=function(){var b=Number(a.$stateParams.skip)+10;a.$state.go(a.$state.current.name,{skip:b})},a.loadPrev=function(){var b=Number(a.$stateParams.skip)-10;a.$state.go(a.$state.current.name,{skip:b})},a.$on("userChange",function(b,c){c&&a.author_info&&k(a.author_info._id)}),a.$on("author_info",function(b,c){a.author_info=c}),a.switchDoc=function(b,c){c?a.readDoc=null:(a.readDoc=b,b.author&&(a.author_info=b.author,k(b.author._id),a.showUser=!0),h(function(){var a=document.getElementById(b._id).getBoundingClientRect().top,c=g.pageYOffset;$("html,body").animate({scrollTop:a+c-80},200)},600))},a.openDoc=function(b){a.$state.go("read.doc",{docId:b})},a.follow=function(){j()&&a.author_info&&(a.following?(c.followUser(a.author_info,!1),a.author_info.followers--):(c.followUser(a.author_info,!0),a.author_info.followers++),a.following=!a.following)},a.openPictureModal=function(a){i.open({templateUrl:"partials/picture-modal.html",controller:["$scope","$modalInstance","$state",function(b,c){b.close=function(){c.close()},html2canvas(document.getElementById(a),{onrendered:function(b){b.toBlob&&b.toBlob(function(b){console.log(b),s3_upload(b,a)},"image/jpeg")}})}],resolve:{}})}}]).controller("ReadDocCtrl",["$scope","Read",function(a,b){function c(){a.view(),a.isHeart(),a.isVote(),a.isFollowing()}function d(){return a.user?!0:void a.launchSignUp()}a.isCollapsed=!0,a.nextDoc=function(){b.goToNextDoc()},a.goBack=function(){b.goBack()},a.isHeart=function(){return a.user.meta._hearts.indexOf(a.doc._id)>-1?(a.active2="active",!0):!1},a.isVote=function(){return a.user.meta._up_votes.indexOf(a.doc._id)>-1?(a.active1="active",!0):!1},a.isFollowing=function(){if(a.doc.author){var b=!1;angular.forEach(a.user.following,function(c){c._id===a.doc.author._id&&(b=!0)}),a.following=b?!0:!1}},a.heart=function(){d()&&("active"===a.active2?(a.doc.hearts--,a.active2=null,b.updatePubDoc(a.doc._id,"heart",!1)):(a.active2="active",b.updatePubDoc(a.doc._id,"heart",!0),a.doc.hearts++,a.user.meta._hearts.push(a.doc._id)))},a.up_vote=function(){d()&&("active"===a.active1?(a.doc.up_votes--,a.active1=null,console.log(a.active1),b.updatePubDoc(a.doc._id,"up_vote",!1)):(a.active1="active",b.updatePubDoc(a.doc._id,"up_vote",!0),a.doc.up_votes++))},a.view=function(){a.user&&-1===a.user.meta._views.indexOf(a.doc._id)&&b.updatePubDoc(a.doc._id,"view",!0)},a.user&&c(),a.$on("userChange",function(a,b){b&&c()}),a.follow=function(){d()&&a.doc.author&&(a.following?(b.followUser(a.doc.author,!1),a.doc.author.followers--):(b.followUser(a.doc.author,!0),a.doc.author.followers++),a.following=!a.following)}}]),angular.module("write").controller("WriteCtrl",["$scope","Write","$timeout","$window","$modal","Picture",function(a,b,c,d,e){function f(a){if(a){if(a.focus(),"undefined"!=typeof d.getSelection&&"undefined"!=typeof document.createRange){var b=document.createRange();b.selectNodeContents(a),b.collapse(!1);var c=d.getSelection();c.removeAllRanges(),c.addRange(b)}else if("undefined"!=typeof document.body.createTextRange){var e=document.body.createTextRange();e.moveToElementText(a),e.collapse(!1),e.select()}d.scrollTo(0,a.scrollHeight)}}function g(){f(document.getElementById("write-content"))}function h(){f(document.getElementById("write-title"))}function i(){if(document.getElementById("write-content")){var a=document.getElementById("write-content").innerText.slice(0,1e3);return a?a:!1}}function j(c){angular.forEach(a.user._userDocs,function(d){if(d._id===c){var e=a.user._userDocs.indexOf(d),f=a.user._userDocs[e+1];a.user._userDocs.splice(e,1),b.setCurrentDoc(f)}})}a.mediumEditorOptionsBody=angular.toJson({placeholder:"Write here",buttons:["bold","italic","anchor","header2","orderedlist","unorderedlist"],buttonLabels:{header2:"<b>H</b>",anchor:"<span><span class='icon ion-link'></span></span>",bold:"<strong>b</strong>",italic:"<em>i</em>"},disableToolbar:!1,forcePlainText:!1,targetBlank:!0}),a.mediumEditorOptionsTitle=angular.toJson({placeholder:"Title",disableToolbar:!0,disableReturn:!0}),a.isCollapsed=!0,a.user?a.user.current_doc?(b.setCurrentDoc(a.user.current_doc),b.setDocs(a.user._userDocs)):a.user._userDocs[0]||b.createFirstDoc():(b.setCurrentDoc(b.getFirstDoc()),b.setDocs([b.getFirstDoc()])),a.currentDoc=b.getCurrentDoc(),a.$on("userChange",function(c,d){d&&(b.setDocs(a.user._userDocs),a.user._userDocs[0]?b.setCurrentDoc(a.user._userDocs[0]):b.createFirstDoc())}),a.titleChange=function(){c(function(){var c=a.currentDoc.title;(c||""===c)&&a.user&&b.updateUserDoc("title",c)},500)},a.bodyChange=function(){c(function(){var c=a.currentDoc.body;if(c){var d=i();d?a.currentDoc.sample=d:d=a.currentDoc.sample,a.user&&b.updateUserDoc("body",{sample:d,body:a.currentDoc.body})}},500)},a.$watch(b.getCurrentDoc,function(b){b&&(a.currentDoc=b,"Welcome to Wrdz"!==b.title&&c(function(){g()},200))}),a.$watchCollection(b.getDocs,function(b){b&&(a.docs=b)}),a.hideRecent=function(){c(function(){a.showRecent=!1},500),a.showLeft===!0&&c(function(){a.showLeft===!0&&(a.showLeft=!1)},500)},a.switchDoc=function(a){b.setCurrentDoc(a)},a.newDoc=function(){b.createNewDoc()},a.switchHasTitle=function(){b.switchDocTitle(a.currentDoc._id),a.currentDoc.has_title=!a.currentDoc.has_title,c(function(){h()},200)},a.archive=function(c){var d=a.currentDoc.is_archived;a.currentDoc.is_archived=!d,b.updateUserDoc("archive",!d),j(c)},a.switchVisible=function(){b.updateUserDoc("pubVisible",!a.currentDoc.pub_doc.is_visible),a.currentDoc.pub_doc.is_visible=!a.currentDoc.pub_doc.is_visible},a.openPublishModal=function(){if(!a.currentDoc.is_published){e.open({templateUrl:"partials/publish-modal.html",controller:["$scope","Write","$modalInstance","$state","doc","user","Picture",function(a,b,c,d,e,f,g){a.user=f,a.anon=!1,a.twitterShareCollapsed=!1;var h="";f&&(a.username=f.username),a.close=function(){c.close()},a.publish=function(c,i){b.publishDoc(c).then(function(c){201===c.status&&(i&&g.tweetPic(f,h,c.data._id),e.is_published=!0,e.pub_doc=c.data,b.setCurrentDoc(e),d.go("read.doc",{docId:c.data._id}),a.close())})},html2canvas(document.getElementById("write-center"),{onrendered:function(a){document.getElementById("twitter-share").appendChild(a),h=a.toDataURL("image/png"),console.log(h)}})}],resolve:{user:function(){return a.user},doc:function(){return a.currentDoc}}})}},a.openTopicModal=function(){e.open({templateUrl:"partials/topic-modal.html",controller:["$scope","$modalInstance","userTopics","docTopics","Write",function(a,b,c,d,e){a.userTopics=c,a.docTopics=d,a.close=function(){b.close()},a.removeTopic=function(b){console.log(b),e.updateTopics("remove",b.title).then(function(){a.docTopics.splice(a.docTopics.indexOf(b),1)})},a.addTopic=function(b){e.updateTopics("add",b).then(function(b){a.docTopics.push(b.data)})}}],resolve:{userTopics:function(){return a.user.topics},currentDoc:function(){return a.currentDoc},docTopics:function(){return a.currentDoc.topics}}})}}]),angular.module("me").controller("MeCtrl",["$scope","User","$state","Me","Write",function(a,b,c,d,e){a.username_ok=!0,a.change=!1,a.Me=d,a.moment=moment,a.tabs=[{title:"Profile",state:"me.profile"},{title:"Following",state:"me.following"}],a.$watch("$state.current.name",function(b){b&&angular.forEach(a.tabs,function(a){a.active=a.state===b?!0:!1})}),a.navType="pills",a.logout=function(){b.isLoggedIn()&&b.logout().success(function(a){e.setCurrentDoc(null),b.changeUser(null),"Logged out now."==a&&c.go("write")}).error(function(a){console.log(a)})}}]).controller("MeSettingsCtrl",["$scope","User","Me",function(a,b,c){a.user&&(a.username_copy=angular.copy(a.user.username)),a.$on("userChange",function(b,c){c&&(a.username_copy=angular.copy(c.username))}),a.usernameChange=function(){a.username_copy;console.log,a.change=!0},a.saveUsername=function(){if(a.change&&a.username_ok){var d=c.saveUsername(a.username_copy);d.then(function(c){200===c.status&&(b.changeUser(c.data),a.change=!1)})}},a.$watch("username_copy",function(b){if(b){b===a.user.username&&(a.change=!1);var d=c.testUsername(b);d.then(function(b){a.username_ok="Username exists"===b.data.message?!1:!0})}else a.username_ok=!1},!0),a.$watch("user.bio",function(a){a&&b.update("bio",a)}),a.$watch("user.website",function(a){a&&b.update("website",a)})}]),angular.module("myWrdz").controller("MyWrdzCtrl",["$scope","$modal","$state","MyWrdz","$stateParams","$timeout","$window",function(a,b,c,d,e,f,g){a.moment=moment,a.setToday=function(){a.date=moment(Date.now()).format("YYYY-MM-DD"),a.today=a.date,a.maxDate=a.today},a.setToday(),a.filterModel="All",a.topicsModel=[],a.topicOptions=[{}],a.$watch("date",function(b){console.log(b),a.dt=moment(b).add("days",1)._d,console.log(a.dt)}),a.isCollapsed=!0,a.topicCollapse=!0,a.dateCollapsed=!0,a.editCollapsed=!0;var h=["Days","Weeks","Months"];a.dtCount=0,a.dtType="Days",a.increaseCount=function(){a.dtCount++},a.decreaseCount=function(){0!==a.dtCount&&a.dtCount--},a.increaseType=function(){var b=h.indexOf(a.dtType);a.dtType=b===h.length-1?h[0]:h[b+1]},a.decreaseType=function(){var b=h.indexOf(a.dtType);a.dtType=0===b?h[h.length-1]:h[b-1]},a.getDtOther=function(){var b=a.dtCount,c=a.dtType;"Days"===c&&(a.dt=a.today-864e5*b),"Weeks"===c&&(a.dt=a.today-6048e5*b),"Months"===c&&(a.dt=a.today-262974e4*b)},a.$watch("dtCount",function(b){b&&a.getDtOther()}),a.$watch("dtType",function(b){b&&a.getDtOther()}),a.$watch("dt",function(a){a&&d.updateQuery("date",a+43e6)}),a.$watch("filterModel",function(a){a&&d.updateQuery("filter",a)}),a.$watchCollection("topicsModel",function(a){if(a){for(var b=[],c=0;c<a.length;c++)b.push(a[c].topicId);d.updateQuery("topics",b)}}),a.user&&(d.setList(a.user._userDocs),a.topicOptions=a.user.topics),a.$on("userChange",function(b,c){c&&c._userDocs&&(d.setList(a.user._userDocs),a.topicOptions=a.user.topics)}),a.$watch(d.getList,function(b){b&&(a.docList=b,i(b))}),a.pageSize=6,a.numberOfPages=function(){return Math.ceil(a.data.length/a.pageSize)};var i=function(b){a.data=[];for(var b=d.getList(),c=0;c<b.length;c++)a.data.push(b[c]);a.currentPage=0,a.starting=a.currentPage*a.pageSize};a.$watch("currentPage",function(b){a.starting=a.pageSize*b}),a.switchDoc=function(b,c){c?a.showDoc=null:(a.showDoc=b,b.author&&a.$emit("read_list_author_info",b.author),f(function(){var a=document.getElementById(b._id).getBoundingClientRect().top,c=g.pageYOffset;$("html,body").animate({scrollTop:a+c-80},250)},600))},a.addTopic=function(b){var c=!0;angular.forEach(a.topicsModel,function(d){b._id===d._id&&(a.topicsModel.splice(a.topicsModel.indexOf(d),1),c=!1)}),c&&a.topicsModel.push(b)},a.openDocInWrite=function(b){a.user.current_doc=b,c.go("write")},a.archive=function(b){var c=a.showDoc.is_archived;d.archive(b,!c),a.showDoc=null},a.switchVisible=function(a){d.switchVisible(a._id,!a.pub_doc.is_visible),a.pub_doc.is_visible=!a.pub_doc.is_visible},a.openTopicModal=function(){b.open({templateUrl:"partials/topic-modal.html",controller:["$scope","$modalInstance","userTopics","docTopics","Topics","currentDoc",function(a,b,c,d,e,f){a.userTopics=c,a.docTopics=d,a.close=function(){b.close()},a.removeTopic=function(b){e.update(f._id,"remove",b.title).then(function(){a.docTopics.splice(a.docTopics.indexOf(b),1)})},a.addTopic=function(b){e.update(f._id,"add",b).then(function(){a.docTopics.push({title:b})})}}],resolve:{userTopics:function(){return a.user.topics},currentDoc:function(){return a.showDoc},docTopics:function(){return a.showDoc.topics}}})}}]),angular.module("wrdz").directive("mediumEditor",["$timeout",function(a){return{require:"ngModel",restrict:"AE",link:function(b,c,d,e){angular.element(c).addClass("angular-medium-editor");var f={};d.options&&(f=angular.fromJson(d.options));var g=f.placeholder;c.on("blur keypress keydown keyup change",function(){b.$apply(function(){if("<p><br></p>"==c.html()||""==c.html()||"<br>"==c.html()){f.placeholder=g;{new MediumEditor(c,f)}}a(function(){e.$setViewValue(c.html())},100)})}),e.$render=function(){if(!a){e.$isEmpty(e.$viewValue)?d.$set("data-placeholder",angular.fromJson(d.options).placeholder):(f.placeholder="",d.$set("data-placeholder",""));var a=new MediumEditor(c,f)}c.html(e.$isEmpty(e.$viewValue)?"":e.$viewValue)}}}}]),angular.module("shared").directive("joInputAdd",function(){return{restrict:"AE",templateUrl:"partials/input-add.html",scope:{name:"@name",onSubmit:"&onSubmit"},controller:["$scope",function(a){a.add=function(b){a.input="",a.onSubmit({title:b}),document.getElementById("input-add").focus()}}],link:function(){document.getElementById("input-add").focus()}}}).directive("joTopicLabel",function(){return{restrict:"AE",templateUrl:"partials/input-add.html",scope:{name:"@name",onSubmit:"&onSubmit"},controller:["$scope",function(a){a.add=function(b){a.input="",a.onSubmit({title:b}),document.getElementById("input-add").focus()}}],link:function(){document.getElementById("input-add").focus()}}}).directive("topicFilter",function(){return{restrict:"AE",link:function(a){a.$watchCollection("topicsModel",function(b){if(b){var c=!0;angular.forEach(b,function(b){b._id===a.top._id&&(console.log("Its me!"),c=!1,a.active=!0)}),c&&(a.active=!1)}})}}}).directive("twitterButton",["$window",function(){return{restrict:"AE",replace:!0,controller:["$scope","$window",function(a,b){var c=function(a){console.log("going");var c,d="https://twitter.com/intent/tweet?text=&url=http://wrdz.co/r/"+a;c={width:500,height:350},c.top=screen.height/2-c.height/2,c.left=screen.width/2-c.width/2,b.open(d,"targetWindow","toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left="+c.left+",top="+c.top+",width="+c.width+",height="+c.height)};a.open=c}],link:function(){}}}]).directive("pictureUpload",function(){return{restrict:"AE",link:function(){}}}),angular.module("wrdz").directive("shareButton",["$window",function(){return{restrict:"AE",link:function(a,b,c){angular.element(b).addClass("share-button");var d={};c.options&&(d=angular.fromJson(c.options)),new Share(".share-button",{ui:{flyout:"bottom right"}})}}}]),angular.module("shared").filter("startFrom",function(){return function(a,b){return b=+b,a.slice(b)}}),angular.module("write").factory("Write",["User","PubDoc","UserDoc","Topics",function(a,b,c,d){function e(){return s}function f(){return t}function g(a){t=a}function h(b){a.update("currentDoc",b)}function i(b){if(b){s=b,b._id&&h(b._id);var c=a.getUser();c&&(c.current_doc=b)}else s={}}function j(a,b){return m(s._id),c.update(s._id,a,b)}function k(){var b=a.getUser();b?c.create().then(function(a){var c=a.data;b._userDocs.unshift(c),i(c),console.log(c)}):(t.unshift(r),i(r))}function l(){var b=a.getUser();c.create().then(function(a){var c=a.data;c.title="My First Wrdz",b._userDocs.unshift(c),i(c),j("title","My First Wrdz"),n(c._id)})}function m(b){angular.forEach(a.getUser()._userDocs,function(a){a._id===b&&(a.updated_at=Date())})}function n(b){a.getUser()&&j("hasTitle",!s.has_title),console.log(b),s.has_title=!s.has_title,angular.forEach(t,function(a){a._id===b&&(a.has_title=!a.has_title)})}function o(a){var c={id:s._id,is_anon:a};return b.create(c)}function p(a,b){return d.update(s._id,a,b)}var q={body:"<p><b>1. Highlight this text.</b></p><p>2. You see? Its <i>editable</i>. &nbsp;This is a writing surface!</p><p>3. Delete this text (but not before you read all the steps!) and change the title, and write something awesome.</p><p><i>then</i></p><p>5. Sign in with Twitter (link) to share your writing as a picture (if over 200 words, then a link). (sign in at any points)</p><p>6. <b style='font-style: italic;'>Or don't share!</b>&nbsp; No pressure dude.&nbsp;Just sign in with Twitter <i>or email</i>&nbsp;and you'll be able to save your writing prvately.</p>",created_at:Date(),has_title:!0,is_archived:!1,is_published:!1,sample:"1. Highlight this text.↵↵2. You see? Its editable.  This is a writing surface!↵↵3. Delete this text (but not before you read all the steps!) and change the title, and write something awesome.↵↵then↵↵5. Sign in with Twitter (link) to share your writing as a picture (if over 200 words, then a link). (sign in at any points)↵↵6. Or don't share!  No pressure dude. Just sign in with Twitter or email and you'll be able to save your writing prvately.↵↵",title:"Welcome to Wrdz",topics:Array[0],updated_at:Date()},r={body:"",created_at:Date(),has_title:!1,is_archived:!1,is_published:!1,sample:"",title:"",topics:Array[0],updated_at:Date()},s={},t=[];return{getFirstDoc:function(){return q},createFirstDoc:l,getCurrentDoc:e,setCurrentDoc:i,switchDocTitle:n,createNewDoc:k,updateUserDoc:j,publishDoc:o,updateCurrentDoc:h,updateTopics:p,getDocs:f,setDocs:g}}]),angular.module("read").factory("Read",["$http","PubDoc","User","Topics","$state",function(a,b,c,d,e){function f(a){l.docs.length-a<3&&g(l.docs.length)}function g(a){var b=l.query;b.length>2?b[2].value=a:b.push({type:"skip",value:a}),j(b)}function h(a){var b=l.docs;b.length&&angular.forEach(b,function(c){if(c._id===a){var d=b.indexOf(c);console.log(d),f(d),k=d===b.length-1?null:b[d+1]._id}})}function i(){e.go("read.doc",{docId:k})}function j(a){for(var c=0;c<a.length;c++){for(var d=!0,e=0;e<m.length;e++)m[e].type==a[c].type&&(m[e].value=a[c].value,d=!1);d&&m.push({type:a[c].type,value:a[c].value})}var f=b.list(m);return f.then(function(a){var b=0;angular.forEach(m,function(a){"skip"===a.type&&(b=a.value)}),l.docs=b>0?l.docs.concat(a.data):a.data,l.query=m}),f}var k,l={docs:[],query:[]},m=[],n={};return{setPrevState:function(a){return n.name=a.current.name,n.params=a.params,!0},getPrevState:function(){return n},getNextDocId:function(){return k},goBack:function(){var a=n;a&&e.go(a.name,a.params)},getDocs:function(){return l},setDocs:function(a){l=a},getPubDoc:function(a){return h(a),b.findOne(a)},followUser:function(a,b){var d={userId:a._id,bool:b};c.update("addFollowing",d)},getHearts:function(){var a=c.getUser();return a.meta?a.meta._hearts:!1},updateQuery:j,goToNextDoc:i,updatePubDoc:function(a,c,d){return b.update(a,c,d)}}}]),angular.module("myWrdz").factory("MyWrdz",["$http","User","UserDoc",function(a,b,c){var d=[],e=[];return{getList:function(){return e},setList:function(a){e=a},switchVisible:function(a,b){c.update(a,"pubVisible",b)},archive:function(a,b){c.update(a,"archive",b),angular.forEach(e,function(b){b._id===a&&e.splice(e.indexOf(b),1)})},updateQuery:function(a,b){for(var f=!0,g=0;g<d.length;g++)d[g].type==a&&(d[g].value=b,f=!1);f&&d.push({type:a,value:b}),c.list(d).then(function(a){e=a.data})}}}]),angular.module("write").factory("Me",["$http","User","UserDoc","PubDoc",function(a,b){return{testUsername:function(a){return b.testUsername(a)},saveUsername:function(a){return b.update("username",a)}}}]),angular.module("shared").factory("Picture",["$http",function(a){return{tweetPic:function(b,c,d,e){var f="http://www.wrdz.co/r/"+d,g={user:b,pic:c,url:f,message:e};a.post("/twitterPic",g).success(function(a){console.log(a)})}}}]),angular.module("models").factory("User",["$http","$cookieStore","$rootScope",function(a,b,c){function d(a){e=a,c.$broadcast("userChange",a)}var e=b.get("user")||null;return b.remove("user"),{changeUser:d,isLoggedIn:function(){return e?!0:!1},getUser:function(){return e?e:void 0},setUser:function(a){a&&(e=a)},update:function(b,c){var d={data:c};return a.post("/users/"+e._id+"/?type="+b,d)},getCurrentUser:function(b){return a.get("users/"+b)},resetPassword:function(b,c){var d={email:b,password:c};return a.post("/reset",d)},testUsername:function(b){var c={username:b};return a.post("/usernametest",c)},signup:function(b){return a.post("/signup",b)},signin:function(b){return a.post("/login",b)},logout:function(){return a.get("/logout")},twitter:function(){return a.get("/auth/twitter")}}}]),angular.module("models").factory("UserDoc",["$http",function(a){return{create:function(){return a.post("/userDocs")},update:function(b,c,d){var e={data:d};return a.post("/userDocs/"+b+"/?type="+c,e)},list:function(b){for(var c="",d=0;d<b.length;d++)if(b[d].value instanceof Array)for(var e=0;e<b[d].value.length;e++)c=c+b[d].type+"[]="+b[d].value[e]+"&";else c=c+b[d].type+"="+b[d].value+"&";return a.get("/userDocs/?"+c)}}}]),angular.module("models").factory("PubDoc",["$http",function(a){return{create:function(b){return a.post("/pubDocs",b)},update:function(b,c,d){var e={data:d};return a.post("/pubDocs/"+b+"/?type="+c,e)},findOne:function(b){return a.get("/pubDocs/"+b)},refresh:function(){return a.get("pubDocs/")},getHearts:function(b){var c={docIds:b};return a.post("pubDocs/hearts",c)},list:function(b){for(var c="",d=0;d<b.length;d++)if(b[d].value instanceof Array)for(var e=0;e<b[d].value.length;e++)c=c+b[d].type+"[]="+b[d].value[e]+"&";else c=c+b[d].type+"="+b[d].value+"&";return a.get("/pubDocs/?"+c)}}}]),angular.module("models").factory("Topics",["$http",function(a){return{update:function(b,c,d){var e={topic:d,docId:b};return a.post("/topics/?type="+c,e)},getTop:function(){return a.get("/topics")}}}]);