'use strict';

angular.module('me')
.controller('MeCtrl', ['$scope', 'User', '$state','Me', 'Write', function ($scope, User, $state, Me, Write) {

/*
MY WRDZ 
*/
  $scope.username_ok = true;
  $scope.change = false;

  $scope.Me = Me;
  $scope.moment = moment;


  $scope.tabs = [
    { title: "Profile", state: "me.profile"},
    { title: "Following", state: "me.following"},
  ];

  $scope.$watch('$state.current.name', function (newValue) {
    if (newValue) {

      angular.forEach($scope.tabs, function (tab) {
        if ((tab.state) === newValue) {
          tab.active = true;
        } else {
          tab.active = false;
        }
      })
    }
  })

  $scope.navType = 'pills';




/*

LOGOUT

*/
  $scope.logout = function() {
    if ( User.isLoggedIn() ) {
      User.logout().
      success( function( data ) {
        Write.setCurrentDoc(null);
        User.changeUser(null);
        if (data == 'Logged out now.') {
          $state.go('write');
        }
      }).error(function(err) {
        console.log(err);
      });
    }
  };
}])

.controller('MeSettingsCtrl', ['$scope', 'User', 'Me', function ($scope, User, Me) {
  
  if ($scope.user) {
    $scope.username_copy = angular.copy($scope.user.username);
  }

  $scope.$on('userChange', function (evt, user) {
    if (user) {
      $scope.username_copy = angular.copy(user.username);
      
    }
  });

  $scope.usernameChange = function () {
    var u = $scope.username_copy;

    console.log

    $scope.change = true;
  }

  $scope.saveUsername = function () {
    if ($scope.change && $scope.username_ok) {
      var res = Me.saveUsername($scope.username_copy);
      res.then(function (res) {
        if (res.status === 200) {
          User.changeUser(res.data)
          $scope.change = false;
        }
      })
    }
  }

  $scope.$watch('username_copy', function (newValue, oldValue) {
    if (newValue) {
      if (newValue === $scope.user.username) {
        $scope.change = false;
      }
      var res = Me.testUsername(newValue);
      res.then(function (res) {
        if (res.data.message === "Username exists") {
          $scope.username_ok = false
        } else {
          $scope.username_ok = true

        }
      })
    } else {
      $scope.username_ok = false;
    }
  }, true);


  $scope.$watch('user.bio', function (newValue) {
    if (newValue) {
      
      User.update('bio', newValue);
    }
  });


  $scope.$watch('user.website', function (newValue) {
    if (newValue) {
      
      User.update('website', newValue);
    }
  });

}])

