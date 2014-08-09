angular.module('ngTableExport', [])
.config(['$compileProvider', function($compileProvider) {
    // allow data links
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
}])
.directive('exportCsv', ['$parse', '$timeout', function ($parse, $timeout) {

  var delimiter = '\t';
  var header = 'data:text/csv;charset=UTF-8,';

  return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {

          var data = '';

          /**
           * Parse the table and build up data uri
           */
          function parseTable() {
            data = '';
            var rows = element.find('tr');
            angular.forEach(rows, function(row, i) {
              var tr = angular.element(row),
                tds = tr.find('th'),
                rowData = '';
              if (tr.hasClass('ng-table-filters')) {
                return;
              }
              if (tds.length === 0) {
                tds = tr.find('td');
              }
              if (i !== 1) {
                angular.forEach(tds, function(td) {
                  // respect colspan in row data
                  rowData += csv.stringify(angular.element(td).text()) + Array.apply(null, Array(td.colSpan)).map(function () { return delimiter; }).join('');
                });
                rowData = rowData.slice(0, rowData.length - 1); //remove last semicolon
              }
              data += rowData + '\n';
            });
            // add delimiter hint for excel so it opens without having to import
            data = 'sep=' + delimiter + '\n' + data;
          }

          /**
           * Dynamically generate a link and click it
           */
          function download(dataUri, filename) {
            var link = angular.element('<a style="display:none;" href="' + dataUri + '" download="' + filename + '"></a>');
            link[0].click();
          }

          var csv = {

            stringify: function(str) {
              return '"' +
                str.replace(/^\s\s*/, '').replace(/\s*\s$/, '') // trim spaces
                    .replace(/"/g,'""') + // replace quotes with double quotes
                '"';
            },

            /**
             *  Generate data URI from table data
             */
            generate: function(event, filename) {

              event.stopPropagation();
              event.preventDefault();

              var table = scope.$parent.tableParams,
                settings = table.settings(),
                cnt = table.count(),
                total = settings.total;

              // is pager on?  if so, we have to disable it temporarily
              if (cnt < total) {
                var $off = settings.$scope.$on('ngTableAfterReloadData', function () {
                  // de-register callback so it won't continue firing
                  $off();
                  // give browser some time to re-render; FIXME - no good way to know when rendering is done?
                  $timeout(function () {
                    // generate data from table
                    parseTable();
                    // finally, restore original table cnt
                    table.count(cnt);
                    table.reload();
                    // dynamically trigger download
                    download(header + encodeURIComponent(data), filename);
                  }, 1000, false);
                });

                // disable the pager and reload the table so we get all the data
                table.count(Infinity);
                table.reload();

              } else {
                // pager isn't on, just parse the table
                parseTable();
                download(header + encodeURIComponent(data), filename);
              }

              return false;
            }
          };
          $parse(attrs.exportCsv).assign(scope.$parent, csv);
      }
  };
}]);