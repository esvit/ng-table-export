angular.module('ngTableExport', ['ngTable'])
.config(['$compileProvider', function($compileProvider) {
	// allow data links
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
}])
.directive('exportCsv', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
			var data = '';
			var csv = {
				stringify: function(str) {
					return '"' +
						str.replace(/^\s\s*/, '').replace(/\s*\s$/, '') // trim spaces
							.replace(/"/g,'""') + // replace quotes with double quotes
						'"';
				},
				generate: function() {
					//this array hold true or false for each header based on
					//whether they have the 'no-export' class or not
					var exports = [];
					data = '';
					var rows = element.find('tr');
					angular.forEach(rows, function(row, i) {
						console.log(i);
						var tr = angular.element(row),
							tds = tr.find('th'),
							rowData = '';
						if (tr.hasClass('ng-table-filters')) {
							return;
						}
						if (tds.length == 0) {
							tds = tr.find('td');
						}
						else {
							//go through the headers and check if they have the
							//'no-export' class
							for(var i = 0; i < tds.length; i++) {
								exports[i] = angular.element(tds[i]).hasClass('no-export');
							}
						}
						if (i != 1) {
							angular.forEach(tds, function(td, i) {
								//if the corresponding index in exports[] is false, this
								//header does not have the 'no-export' class and is not exported
								if(exports[i] == false) {
									rowData += csv.stringify(angular.element(td).text()) + ';';
								}
							});
							rowData = rowData.slice(0, rowData.length - 1); //remove last semicolon
						}
						data += rowData + "\n";
						
					});
				},
				link: function() {
					return 'data:text/csv;charset=UTF-8,' + encodeURIComponent(data);
				}
			};
			$parse(attrs.exportCsv).assign(scope.$parent, csv);
		}
	};
}]);
