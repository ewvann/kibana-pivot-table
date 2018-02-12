import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas';

import 'ui/autoload/styles';
import './less/main.less';
import './controller/directive_provider.js';
import './controller/tableCtrl.js';


define(function(require) {
  require('plugins/pivot_table/dist/jquery.min.js');
  require('plugins/pivot_table/dist/jquery-ui.min.js');
  require('plugins/pivot_table/dist/pivot.css');
  require('plugins/pivot_table/dist/pivot.js');
  require('plugins/pivot_table/dist/d3_renderers.js');
  require('plugins/pivot_table/dist/c3.css');
  require('plugins/pivot_table/dist/c3_renderers.js');
  function PivotTableProvider(Private) {
    const VisFactory = Private(VisFactoryProvider);
    const Schemas = Private(VisSchemasProvider);
    return VisFactory.createAngularVisualization({
      name: 'PivotTable', // the internal id of the visualization
      title: 'PivotTable', // the name shown in the visualize list
      icon: 'fa-table', // the class of the font awesome icon for this
      description: 'Add a PivotTable to your dashboards.', // description shown to the user
      category: CATEGORY.DATA,
      requiresSearch: true, // linked to a search
      visConfig: {
        template: require('plugins/pivot_table/templates/pivot_table.html'), // Load the template of the visualization
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
      },
      editorConfig: {
        optionsTemplate: require('plugins/pivot_table/templates/pivot_table_editor.html'), // Use this HTML as an options editor for this vis
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
      }
    });
  }

  VisTypesRegistryProvider.register(PivotTableProvider);
});
