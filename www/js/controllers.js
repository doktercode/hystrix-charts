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

        $scope.retrieveData = function(stream){
          $scope.home = true;
          $rootScope.data = {};
          $scope.commands = [];
          $rootScope.all = [];
          $rootScope.command = {};
          $scope.source = undefined;
          $scope.source = new EventSource(stream);
          $scope.source.addEventListener('message', handleCallback, false);
        };



})

.controller('CommandCtrl', function($scope, $rootScope, $stateParams, observeOnScope) {

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
        $scope.refreshChart($rootScope.command);
    };

      $scope.refreshChart = function(command){
        if(command){
          $scope.chartData = [[command.latencyExecute["0"], command.latencyExecute["25"],
            command.latencyExecute["50"], command.latencyExecute["75"],
            command.latencyExecute["90"], command.latencyExecute["95"],
            command.latencyExecute["99"], command.latencyExecute["99.5"],
            command.latencyExecute["100"]],
            [command.latencyTotal["0"], command.latencyTotal["25"],
            command.latencyTotal["50"], command.latencyTotal["75"],
            command.latencyTotal["90"], command.latencyTotal["95"],
            command.latencyTotal["99"], command.latencyTotal["99.5"],
            command.latencyTotal["100"]]];
        }
      };

      observeOnScope($rootScope, 'command').subscribe(function(change) {
          $scope.refreshChart(change.newValue);
      });

    $scope.showCommand();
});
