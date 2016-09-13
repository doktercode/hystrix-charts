angular.module('hystrix-charts.controllers', [])

.controller('AppCtrl', function($scope, $state, $rootScope, $ionicSideMenuDelegate) {

        $scope.stream = 'https://github-crew.herokuapp.com/hystrix.stream';
        $rootScope.data = {};
        $scope.commands = [];
        $rootScope.all = [];
        $rootScope.command = {};
        $scope.home = true;

        var handleCallback = function (msg) {
            $scope.$apply(function () {
              var obj = JSON.parse(msg.data);
              $rootScope.all.push(obj);
                if(obj.type=='HystrixCommand'){
                   if($scope.commands.indexOf(obj.name) === -1){
                     $scope.commands.push(obj.name);
                     if($scope.home){
                       $scope.home = false;
                       $ionicSideMenuDelegate.toggleLeft();
                     }
                   }
                   $rootScope.data[obj.name] = obj;
                   if($rootScope.command && $rootScope.command.name === obj.name){
                      $rootScope.command = obj;
                   }
                }
            });
        }

        $scope.retrieveData = function(){
          $scope.home = true;
          var source = new EventSource($scope.stream);
          source.addEventListener('message', handleCallback, false);
        };

})

.controller('CommandCtrl', function($scope, $rootScope, $stateParams) {

    $scope.labels = ["0", "25", "50", "75", "90", "95", "99", "99.5", "100"];
    $scope.series = ['Latency Execute', 'Latency Total'];
    $scope.chartData = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];

    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
     scales: { yAxes: [{id: 'y-axis-1',type: 'linear', display: true, position: 'left'},
         {id: 'y-axis-2',type: 'linear',display: true, position: 'right'}]}
     };

    $scope.showCommand = function(){
        $rootScope.command = $rootScope.data[$stateParams.commandId];

        if($rootScope.command){
          $scope.chartData = [[$rootScope.command.latencyExecute["0"], $rootScope.command.latencyExecute["25"],
          $rootScope.command.latencyExecute["50"], $rootScope.command.latencyExecute["75"],
          $rootScope.command.latencyExecute["90"], $rootScope.command.latencyExecute["95"],
          $rootScope.command.latencyExecute["99"], $rootScope.command.latencyExecute["99.5"],
          $rootScope.command.latencyExecute["100"]],
          [$rootScope.command.latencyTotal["0"], $rootScope.command.latencyTotal["25"],
          $rootScope.command.latencyTotal["50"], $rootScope.command.latencyTotal["75"],
          $rootScope.command.latencyTotal["90"], $rootScope.command.latencyTotal["95"],
          $rootScope.command.latencyTotal["99"], $rootScope.command.latencyTotal["99.5"],
          $rootScope.command.latencyTotal["100"]]];
        }

      };

    $scope.showCommand();
});
