angular.module('BranchServices', ['DataServices'])

  .factory('CreateBranch', function () {
    return function (user, inc_type) {
      console.log("CreateBranch user:" + user.name + " inc_type:" + inc_type.nameLong);
    }
  })

;

