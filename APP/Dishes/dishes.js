var Dishes = angular.module('Dishes', []);

Dishes.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/dishes', { templateUrl: 'Dishes/dishes.partial.html' })
        .when('/dishes/add', {templateUrl: 'Dishes/dishesForm.partial.html',controller: ''})
        // .when('/customers/:id', { templateUrl: 'CRM/Customers/CustomerDetail/customerDetail.partial.html',controller: 'CustomerCtrl' });
}]);


