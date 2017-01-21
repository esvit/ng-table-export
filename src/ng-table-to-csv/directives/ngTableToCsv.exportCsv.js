(function (angular) {
  'use strict';

  angular.module('ngTableToCsv.directives')
    .directive('exportCsv', ['$parse',
      function ($parse) {
        return {
          restrict : 'A',
          scope    : false,
          link     : function (scope, element, attrs) {
            var data = '';
            var separator = attrs.separator ? attrs.separator : ',';
            var ignoreSelector = attrs.exportCsvIgnore || '.ng-table-filters';
            var csv = {
              stringify : function (str) {
                return '"' +
                  str.replace(/^\s\s*/, '').replace(/\s*\s$/, '') // trim spaces
                    .replace(/"/g, '""') + // replace quotes with double quotes
                  '"';
              },
              generate  : function () {
                data = '';
                var rows = element.find('tr');
                angular.forEach(rows, function (row, i) {
                  var tr = angular.element(row),
                    tds = tr.find('th'),
                    rowData = '';
                  if (tr.hasClass(ignoreSelector)) {
                    return;
                  }
                  if (tds.length === 0) {
                    tds = tr.find('td');
                  }
                  angular.forEach(tds, function (td, i) {
                    var value;
                    td = angular.element(td);
                    if (!td.hasClass(ignoreSelector)) {
                      value = angular.element(td).text();
                      rowData += csv.stringify(value) + separator;
                    }
                  });
                  rowData = rowData.slice(0, rowData.length - 1); //remove last separator
                  data += rowData + '\n';
                });
              },
              link      : function () {
                return 'data:text/csv;charset=UTF-8,' + encodeURIComponent(data);
              }
            };
            $parse(attrs.exportCsv).assign(scope.$parent, csv);
          }
        };
      }
    ]);
})(angular);
