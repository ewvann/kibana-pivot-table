import moment from 'moment';
import { uiModules } from 'ui/modules';
import { VisSchemasProvider } from 'ui/vis/schemas';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';
import visTemplate from './templates/pivot_table.html';
import editorTemplate from './templates/pivot_table_editor.html';

import 'ui/autoload/styles';
import './less/main.less';
import './controller/directive_provider.js';
import './controller/tableCtrl.js';
import './dist/jquery.min.js';
import './dist/jquery-ui.min.js';
import './dist/pivot.css';
import './dist/pivot.js';
import './dist/d3_renderers.js';
import './dist/c3.css';
import './dist/c3_renderers.js';


VisTypesRegistryProvider.register(PivotTableProvider);
function PivotTableProvider(Private) {
  const TemplateVisType = Private(TemplateVisTypeProvider);
  const Schemas = Private(VisSchemasProvider);
  return new TemplateVisType({
    name: 'PivotTable', // the internal id of the visualization
    title: 'PivotTable', // the name shown in the visualize list
    icon: 'fa-table', // the class of the font awesome icon for this
    description: 'Add a PivotTable to your dashboards.', // description shown to the user
    requiresSearch: true, // linked to a search
    template: visTemplate, // Load the template of the visualization
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
      editor: editorTemplate // Use this HTML as an options editor for this vis
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

export default PivotTableProvider;
