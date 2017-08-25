## Pivot Table Plugin for Kibana 5

A visualization plugin for kibana 5.x .

Pivot tables are interactive tables that allow the user to group and summarize large amounts of data in a concise.

Basically a wrapper of [Nicolas Kruchten's Pivot Table](http://nicolas.kruchten.com/pivottable/).

![image](https://raw.githubusercontent.com/datavoyagerhk/kibana-pivot-table/master/image/simple_demo.gif)

## Feature

* drag and drop UI
* filtering
* charts

## Installation

```sh
cd YOUR DOWNLOAD-DIRECTORY
wget https://github.com/datavoyagerhk/kibana-pivot-table/releases/download/v0.1.0/pivot_table-v0.1.0.zip
$KIBANA_HOME/bin/kibana-plugin install file:///YOUR-DOWNLOAD-DIRECTORY/pivot_table-v0.1.0.zip
```

example for Kibana installed with RPM on CentOS
```
wget https://github.com/datavoyagerhk/kibana-pivot-table/releases/download/v0.1.0/pivot_table-v0.1.0.zip
/usr/share/bin/kibana-plugin install file:///tmp/pivot_table-v0.1.0.zip
```

## development

### Setting up development environment 

1. See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

  - `npm start`

    Start kibana and have it include this plugin

  - `npm start -- --config kibana.yml`

    You can pass any argument that you would normally send to `bin/kibana` by putting them after `--` when running `npm start`

  - `npm run build`

    Build a distributable archive

  - `npm run test:browser`

    Run the browser tests in a real web browser

  - `npm run test:server`

    Run the server tests using mocha

For more information about any of these commands run `npm run ${task} -- --help`.

2. Clone this repository to the plugins folder of kibana.

3. Modify the contents of the config.json file to point to a local Kibana installation directory.

### Coding guidelines

Please also see [wiki of Nicolas Kruchten's Pivot Table](https://github.com/nicolaskruchten/pivottable/wiki).

### Building a package 

1. First go to the directory of the plugin
	
	```
	cd $KIBANA_HOME/plugins/pivot_table
	```

2. Modify the contents of package.json

	change the 'kibana' and '@elastic/plugin-helpers' version to the version of kibana you want to deploy.

3. Then create bundled zip file
	
	```
	npm run build
	```

The bundled zip file will locate in:
```cd $KIBANA_HOME/kibana/plugins/pivot_table/build```
