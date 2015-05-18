ng-table-to-csv
===============

[![Build Status](http://img.shields.io/travis/kollavarsham/ng-table-to-csv.svg)](https://travis-ci.org/kollavarsham/ng-table-to-csv)
[![Code Climate](http://img.shields.io/codeclimate/github/kollavarsham/ng-table-to-csv.svg)](https://codeclimate.com/github/kollavarsham/ng-table-to-csv)
![Bower](https://img.shields.io/bower/v/ng-table-to-csv.svg)

## Angular.js Module for exporting Tables to CSV

As opposed to [the forked library](https://github.com/esvit/ng-table-export), this version does not have a dependency on `ng-table` and can export any HTML table.

## Installation

With Bower:

```shell
bower install ng-table-to-csv --save
```

## Usage

Add `export-csv` attribute directive on the table to define a new `csv` object on the scope with `generate()` and `link()` functions on them. 
Use the `separator` attribute to change the default comma separator into something else (like semicolon).

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

Check out [this plunker](http://plnkr.co/Y0r33F) to see the plugin in action.

#### License

MIT License - Copyright (c) 2015 The Kollavarsham Team

#### Original License

Code originally released under [New BSD License](https://github.com/esvit/ng-table-export/blob/master/LICENSE) by [@esvit](https://github.com/esvit) at [esvit](https://github.com/esvit)/[ng-table-export](https://github.com/esvit/ng-table-export).
