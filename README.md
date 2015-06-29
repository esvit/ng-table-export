Export to CSV format for table
==============================

Code licensed under New BSD License.

## Installing via Bower
```
bower install ng-table-export
```

## Example

* [ngTable export to CSV](http://bazalt-cms.com/ng-table/example/15)

### This version fixes ng-table-export for Internet Explorer 9++ (maybe even 8)
### Additional Features (compared to original ng-table-export)

* **Add possibility to specify encoding of the generated csv file.**
For example:
```html
<a class="btn btn-primary" ng-mousedown="csv.generate($event)" ng-href="{{ csv.link() }}" download="test.csv">Export to CSV</a>
<table ng-href ... export-csv="csv" ng-export-encoding="latin1">
```
Alternatively (it's just a matter of taste):
```html
<a class="btn btn-primary" ng-mousedown="csv.generate($event, 'latin1')" ng-href="{{ csv.link() }}" download="test.csv">Export to CSV</a>
<table ng-href ... export-csv="csv">
```
If you omit `ng-export-encoding`, you will get the default (`UTF-8`). Right now, only UTF-8 and latin1 (i.e. ISO-8859-1 is supported).

