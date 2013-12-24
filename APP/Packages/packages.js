var Packages = angular.module('Packages', []);

Packages.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/packages', { templateUrl: 'Packages/packages.partial.html' })
        .when('/packages/add', {templateUrl: 'Packages/packagesForm.partial.html',controller: ''})
        // .when('/customers/:id', { templateUrl: 'CRM/Customers/CustomerDetail/customerDetail.partial.html',controller: 'CustomerCtrl' });
}]);


