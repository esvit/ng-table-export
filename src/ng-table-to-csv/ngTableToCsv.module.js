(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('ngTableToCsv.config', [])
    .config(['$compileProvider', function ($compileProvider) {
      // allow data links
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
    }])
    .value('ngTableToCsv.config', {
      debug : true
    });

  // Modules
  angular.module('ngTableToCsv.directives', []);
  angular.module('ngTableToCsv',
    [
      'ngTableToCsv.config',
      'ngTableToCsv.directives'
    ]);

})(angular);
