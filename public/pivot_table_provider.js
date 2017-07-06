uiModules.get('app/pivot_table', [])
.directive('ngPivotTable',function(){
  var num = 0;
  return{
    restrict:"E",
    templateUrl:"./templates/pivot_table_instance.html",
    scope:{
      visParams:"=",
      uiState:"=",
      esResponse:"="
    },
    controller:function($scope, $timeout,Private){
      $scope.title = 'Pivot Table';
      $scope.description = 'pivot_table';

      //
      //Pivot Table
      //

      //the table below is the config for initialize
      $scope.table = {
        data: [],
        config: {
                rows: [],
                cols: [],
                aggregatorName: "Count",
                vals: []
              },
        editMode: false,
        pristine: true
      };
      // by default, edit mode must be false during initialization, otherwise it will cause Kibana to crash
      $scope.vis.params.editMode = false;
      $scope.table.editMode = $scope.vis.params.editMode;

      //PivotTable renderer
      $scope.renderPivotTable = function() {
          $(pivotOutput).pivot($scope.table.data, {
              renderers: $.extend(
                $.pivotUtilities.renderers,
                $.pivotUtilities.c3_renderers
              ),
              rendererName: $scope.table.config.rendererName,
              // turn renderName into render function
              // https://github.com/nicolaskruchten/pivottable/issues/451
              renderer: $.pivotUtilities.renderers[$scope.table.config.rendererName],
              cols: $scope.table.config.cols,
              rows: $scope.table.config.rows,
              aggregator: $.pivotUtilities.aggregators[$scope.table.config.aggregatorName]($scope.table.config.vals),
              vals: $scope.table.config.vals,
              onRefresh: function(config) {
                  console.log("renderPivotTable onRefresh");
                  var config_copy = JSON.parse(JSON.stringify(config));
                  //delete some values which are functions
                  delete config_copy["aggregators"];
                  delete config_copy["renderers"];
                  delete config_copy["derivedAttributes"];
                  //delete some bulky default values
                  delete config_copy["rendererOptions"];
                  delete config_copy["localeStrings"];
                  $scope.table.config = config_copy;
                  $scope.$apply();
              }
          });
      };

      //PivotTable renderer with drag and drop UI
      $scope.renderPivotUITable = function() {
          $(pivotOutput).pivotUI($scope.table.data, {
              renderers: $.extend(
                $.pivotUtilities.renderers,
                $.pivotUtilities.c3_renderers
              ),
              // rendererName: "Table",
              rendererName: $scope.table.config.rendererName,
              renderer: $.pivotUtilities.renderers[$scope.table.config.rendererName],
              cols: $scope.table.config.cols,
              rows: $scope.table.config.rows,
              // aggregators: $.pivotUtilities.aggregators,
              aggregatorName: $scope.table.config.aggregatorName,
              vals: $scope.table.config.vals,
              onRefresh: function(config) {
                  console.log("renderPivotUITable onRefresh");
                  var config_copy = JSON.parse(JSON.stringify(config));
                  //delete some values which are functions
                  delete config_copy["aggregators"];
                  delete config_copy["renderers"];
                  delete config_copy["derivedAttributes"];
                  //delete some bulky default values
                  delete config_copy["rendererOptions"];
                  delete config_copy["localeStrings"];
                  $scope.table.config = config_copy;
                  $scope.$apply();
              }
          });
      };

      $scope.updateUI = function(){
        if ($scope.vis.params.editMode) {
            $scope.renderPivotUITable();
        } else {
            $scope.renderPivotTable();
        }
      };
      //update UI when new config apply
      $scope.$watch('vis.params.editMode', function(newValue, oldValue) {
        console.log("vis.params.editMode $watch", $scope.vis.params.editMode);
        $scope.updateUI();
      }, true);
      $scope.$watch('table.config', function(newValue, oldValue) {
        console.log("table.config $watch");
        $scope.updateUI();
        if($scope.table.pristine==false){
          $scope.uiState.set('config',$scope.table.config);
          console.log("$scope.uiState.set", $scope.table.config);
        }
      }, true);
      //update the config of table when open a saved visualization
      $scope.$watch('uiState', function(newValue, oldValue) {
        console.log("uiState $watch");
        $scope.table.config=$scope.uiState.get('config',{rows: [],cols: [],aggregatorName: "Count",vals: []});
        $scope.table.pristine=false;
      }, true);


      //
      //process the data from ES
      //
      //after process each entry, it would return a array of object
      //eg.[{ "ip: Descending": "28.168.231.16", "memory: Descending": 19400, "Count": 1 },
      //    { "ip: Descending": "140.87.53.85", "memory: Descending": 98560, "Count": 1 },
      //    { "ip: Descending": "140.87.53.85", "memory: Descending": 140960, "Count": 1 }]
      var processEntry = function(tabifyData){
        var columnsName =[];
        var result = [];
        for (var i = 0; i < tabifyData.tables[0]["columns"].length; i++) {
          columnsName.push(tabifyData.tables[0]["columns"][i]["title"]);
        }
        for (var rows = 0; rows < tabifyData.tables[0]["rows"].length; rows++) {
          var tempObj={};
          for (var columns = 0; columns < columnsName.length; columns++) {
            tempObj[columnsName[columns]]=tabifyData.tables[0]["rows"][rows][columns];
          }
          result.push(tempObj);
        }
        console.log("process result:",result);
        return result;
      };

      //process data and update UI after query elastic search
      $scope.$watch('esResponse', function (resp) {
        if (resp) {
          console.log("esResponse",resp);
          var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));
          var tabifyData = tabifyAggResponse($scope.vis, resp);

          $scope.table.data=processEntry(tabifyData);
          $scope.updateUI();
        }
      });

    }
  };
});
