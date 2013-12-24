var Calendar = angular.module('Calendar', []);

Calendar.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/calendars', { templateUrl: 'Calendar/calendar.partial.html' });
        // .when('/customers/add', {templateUrl: 'CRM/Customers/CustomerDetail/customerDetail.partial.html',controller: 'CustomerCtrl'})
        // .when('/customers/:id', { templateUrl: 'CRM/Customers/CustomerDetail/customerDetail.partial.html',controller: 'CustomerCtrl' });
}]);


