angular.module('hystrix-charts.controllers', [])

.controller('AppCtrl', function($scope, $rootScope) {


//"errorPercentage": 0,
//isCircuitBreakerOpen
//latencyTotal
//latencyExecute
        $scope.stream = 'https://github-crew.herokuapp.com/hystrix.stream';
        $rootScope.data = {};
        $scope.commands = [];
        $rootScope.all = [];
        $rootScope.command = {};

        var handleCallback = function (msg) {
            $scope.$apply(function () {
              var obj = JSON.parse(msg.data);
              $rootScope.all.push(obj);
                if(obj.type=='HystrixCommand'){
                   if($scope.commands.indexOf(obj.name) === -1){
                     $scope.commands.push(obj.name);
                   }
                   $rootScope.data[obj.name] = obj;
                   if($rootScope.command && $rootScope.command.name === obj.name){
                      $rootScope.command = obj;
                   }
                }
            });
        }

        var source = new EventSource($scope.stream);
        source.addEventListener('message', handleCallback, false);

})

.controller('CommandCtrl', function($scope, $rootScope, $stateParams) {
    $scope.showCommand = function(){
      $rootScope.command = $rootScope.data[$stateParams.commandId];
    };

    $scope.showCommand();
});
