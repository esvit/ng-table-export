ng-table-to-csv
===============

[![Build Status](http://img.shields.io/travis/kollavarsham/ng-table-to-csv.svg)](https://travis-ci.org/kollavarsham/ng-table-to-csv)
[![Code Climate](http://img.shields.io/codeclimate/github/kollavarsham/ng-table-to-csv.svg)](https://codeclimate.com/github/kollavarsham/ng-table-to-csv)
![Bower](https://img.shields.io/bower/v/ng-table-to-csv.svg)

## Angular.js Module for exporting Tables to CSV

As opposed to [the forked library](https://github.com/esvit/ng-table-export), this version does not have a dependency on `ng-table` and can export any HTML table.


## Demo

[Live Demo on Plunker](http://plnkr.co/VT5Eps)

## Getting Started / Usage

Install module via bower (or download the files from the `dist` folder in the repo):

```shell
bower install ng-table-to-csv --save
```

Add a reference to `dist/ng-table-to-csv.js` into your HTML pages.

Add `ngTableToCsv` as a dependency to your module:

```js
angular.module('your_app', ['ngTableToCsv']);
```

Add `export-csv` attribute directive on the `table` to define a new `csv` object on the scope with `generate()` and `link()` functions on them. 

Options:
 - Use the `separator` attribute to change the default comma separator into something else (like semicolon).
 - Use the `export-csv-ignore` attribute to set the selector that will be used for prevent `tr`/`th`/`td` to be stringified.

To create an `Export` button from an anchor tag, use the `generate()` and `link()` functions mentioned above from `ng-click` and `ng-href` attributes of an anchor tag.  

See below: 

```html
      <a class="btn" title="Export Table" ng-click='csv.generate()' ng-href="{{ csv.link() }}"
         download="myTable.csv">
        <i class="glyphicon glyphicon-new-window"></i> &#160;Export
      </a>
      <table class="table table-bordered" export-csv="csv" separator=";">
        <!-- table contents -->
      </table>
```

### FAQ

1. [How can multiple tables on a page be supported?](https://github.com/kollavarsham/ng-table-to-csv/issues/9)
2. [How can specific columns on a table be ignored?](https://github.com/kollavarsham/ng-table-to-csv/issues/6)

#### License

MIT License - Copyright (c) 2015 The Kollavarsham Team

#### Original License

Code originally released under [New BSD License](https://github.com/esvit/ng-table-export/blob/master/LICENSE) by [@esvit](https://github.com/esvit) at [esvit](https://github.com/esvit)/[ng-table-export](https://github.com/esvit/ng-table-export).
