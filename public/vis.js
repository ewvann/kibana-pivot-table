import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';
import VisSchemasProvider from 'ui/vis/schemas';

import 'ui/autoload/styles';
import './less/main.less';

define(function(require) {
  // require('plugins/pivot_table/less/main.less');
  require('plugins/pivot_table/dist/jquery.min.js');
  require('plugins/pivot_table/dist/jquery-ui.min.js');
  require('plugins/pivot_table/dist/pivot.css');
  require('plugins/pivot_table/dist/pivot.js');
  require('plugins/pivot_table/dist/d3_renderers.js');
  require('plugins/pivot_table/dist/c3.css');
  require('plugins/pivot_table/dist/c3_renderers.js');
  function PivotTableProvider(Private) {
    const TemplateVisType = Private(require('ui/template_vis_type/template_vis_type'));
    const Schemas = Private(VisSchemasProvider);
    return new TemplateVisType({
      name: 'PivotTable', // the internal id of the visualization
      title: 'PivotTable', // the name shown in the visualize list
      icon: 'fa-table', // the class of the font awesome icon for this
      description: 'Add a PivotTable to your dashboards.', // description shown to the user
      requiresSearch: true, // linked to a search
      template: require('plugins/pivot_table/templates/pivot_table.html'), // Load the template of the visualization
      params: {
        defaults: { // Set default values for paramters (that can be configured in the editor)
          editMode: false,
          config: {
            rows: "",
            cols: "",
            aggregatorName: "Count",
            vals:""
          },
          availableAggregatorOptions:[
            "Count",
            "Count Unique Values",
            "List Unique Values",
            "Sum",
            "Integer Sum",
            "Average",
            "Minimum",
            "Maximum",
            "First",
            "Last",
            "Sum over Sum",
            "80% Upper Bound",
            "80% Lower Bound",
            "Sum as Fraction of Total",
            "Sum as Fraction of Rows",
            "Sum as Fraction of Columns",
            "Count as Fraction of Total",
            "Count as Fraction of Rows",
            "Count as Fraction of Columns"
          ],
        },
        editor: require('plugins/pivot_table/templates/pivot_table_editor.html') // Use this HTML as an options editor for this vis
      },
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Metric',
          min: 1,
          defaults: [
            { type: 'count', schema: 'metric' }
          ],
          // size: 1000
        },
        {
          group: 'buckets',
          name: 'segment',
          title: 'Split Slices',
          aggFilter: '!geohash_grid',
          min: 1,
          // max: 1
        }
      ])
    });
  }

  require('ui/registry/vis_types').register(PivotTableProvider);

  return PivotTableProvider;
});

// wiki https://github.com/nicolaskruchten/pivottable/wiki/Aggregators
var app = uiModules.get('app/pivot_table', []);

app.controller('pivotTable', function ($scope, $timeout,Private) {
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
          // rendererName: "Table",
          rendererName: $scope.table.config.rendererName,
          // turn renderName into render function
          // https://github.com/nicolaskruchten/pivottable/issues/451
          renderer: $.pivotUtilities.renderers[$scope.table.config.rendererName],
          cols: $scope.table.config.cols,
          rows: $scope.table.config.rows,
          // aggregators: $.pivotUtilities.aggregators,
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
});
