var DeliveryOrders = angular.module('DeliveryOrders', []);

DeliveryOrders.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/deliveryOrders', { templateUrl: 'DeliveryOrders/deliveryOrders.partial.html' })
        .when('/deliveryOrders/add', {templateUrl: 'DeliveryOrders/deliveryOrdersForm.partial.html',controller: ''})
        // .when('/customers/:id', { templateUrl: 'CRM/Customers/CustomerDetail/customerDetail.partial.html',controller: 'CustomerCtrl' });
}]);


