angular.module('ngTableExport', [])

.config(['$compileProvider', function($compileProvider) {
    // allow data links
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
}])

.directive('exportCsv', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {

            /********************************************************************************************
             * Public stuff:
             *
             * csv will be exposed within the PARENT scope.
             * This will make it available to siblings of the <table> tag.
             */
            var csv = {
                stringify: function (str) {
                    return '"' + str.replace(/^\s\s*/, '').replace(/\s*\s$/, '') // trim spaces
                        .replace(/"/g, '""') + // replace quotes with double quotes
                        '"';
                },
                extractData: function () {
                    data = '';
                    var rows = element.find('tr');
                    angular.forEach(rows, function (row, i) {
                        var tr = angular.element(row), tds = tr.find('th'), rowData = '';
                        if (tr.hasClass('ng-table-filters')) {
                            return;
                        }
                        if (tds.length == 0) {
                            tds = tr.find('td');
                        }
                        if (i != 1) {
                            angular.forEach(tds, function (td, i) {
                                if (td.hasAttribute('data-fulltext')) {
                                    rowData += csv.stringify(td.getAttribute('data-fulltext')) + ';';
                                } else {
                                    rowData += csv.stringify(angular.element(td).text()) + ';';
                                }
                            });
                            rowData = rowData.slice(0, rowData.length - 1); //remove last semicolon
                        }
                        data += rowData + "\n";
                    });
                },
                /**
                 * @param $event Handing over the $event is necessary to properly cancel event propagation in IE
                 * @param encoding If you supply this parameter, it will override the csv-export-encoding attribute
                 *                 you could alternatively have supplied together with csv-export on the table element.
                 *                 This alternative helps you in reducing code-changes in case you have the download-button
                 *                 put into a template which you re-use everywhere where you're using ng-table
                 */
                generate: function ($event, encoding) {
                    encodingOverwrite = encoding;

                    /** all browsers need to have the data prepared ...*/
                    csv.extractData();

                    /* ... but only IE will start the download here, that's why we pass $event so the normal behaviour
                     of following the href can be preventDefaulted. All other browsers will have the download triggered
                     through this normal behaviour of visiting the href ... that's where the link() function takes over */
                    csv.generateIE($event);
                },
                generateIE: function ($event) {
                    if (window.navigator.msSaveOrOpenBlob) {
                        var encoding = _getRequestedEncoding(),
                            blobObject,
                            filename;

                        /**
                         * The following logic depends on the "data" string to be UTF-8. This should usually be the case.
                         */
                        if (encoding === 'UTF-8') {
                            blobObject = _getUtf8Blob();

                        } else if (encoding === 'ISO-8859-1') {
                            blobObject = _transformUtf8ToLatin1AndGetBlob();

                        } else {
                            _logErrorEncodingNotSupported();
                        }

                        /** we need $event also to collect the filename from the "download" attribute */
                        if ($event && $event.preventDefault) {

                            filename = $event.target.attributes['download'].value;
                            window.navigator.msSaveOrOpenBlob(blobObject, filename);
                            $event.preventDefault(); // href must not be followed

                        } else {
                            console.warn('ng table export: you should pass over the $event in your expression for proper IE support, ' +
                                'e.g. via ng-click="csv.generate($event)" --- otherwise the href will be followed');
                        }
                    }
                },
                link: function () {
                    var encoding = _getRequestedEncoding();
                    if (encoding === 'UTF-8') {
                        return 'data:text/csv;charset=UTF-8,' + encodeURIComponent(data);

                    } else if (encoding === 'ISO-8859-1') {
                        return 'data:text/csv;charset=ISO-8859-1,' + escape(data);

                    } else {
                        _logErrorEncodingNotSupported();
                    }
                }
            };
            $parse(attrs.exportCsv).assign(scope.$parent, csv);


            /********************************************************************************************
             * Private stuff here
             */
            var data = '',
                encodingOverwrite = '';

            function _logErrorEncodingNotSupported() {
                console.error("ng table export: invalid encoding requested. only 'UTF-8' and 'ISO-8859-1' are supported");
            }

            /**
             * Returns the requested encoding.
             *
             * To change the encoding from the default value (UTF-8) to latin1,
             * do it like so: <table ... ng-table ... export-csv="..." export-csv-encoding="latin1">
             *
             * Actually at the moment, it does not matter what you insert into export-csv-encoding. It will always be
             * interpreted as latin1 (i.e. ISO-8859-1) as long as the value does not match to "utf".
             */
            function _getRequestedEncoding() {
                var enc = encodingOverwrite ? encodingOverwrite : attrs.exportCsvEncoding;
                if (!enc) {
                    return 'UTF-8';
                } else {
                    if (enc.match(/utf/)) {
                        return 'UTF-8';
                    } else {
                        return 'ISO-8859-1';
                    }
                }
            }

            function _transformUtf8ToLatin1AndGetBlob() {
                var utf8Text = data,
                    buffer = new ArrayBuffer(utf8Text.length),
                    uint8Array = new Uint8Array(buffer);

                for (var i = 0; i < uint8Array.length; i++) {
                    var charCode = utf8Text[i].charCodeAt(0);
                    if (charCode > 256) { // latin1 goes only from charCode 1 to 256
                        // that's why we set it to a predefined latin1 char which is easily recognizable as "this char has no representation in latin1"
                        // we "use" the paragraph sign at position %B6 (or 182 in decimal notation): ¶
                        charCode = 182; // ¶
                    }
                    uint8Array[i] = charCode; // will be transformed to correct latin1 binary representation
                }
                var blobObject = new Blob([uint8Array]);
                return blobObject;
            }

            function _getUtf8Blob() {
                return new Blob([data]);
            }
        }
    };
}]);