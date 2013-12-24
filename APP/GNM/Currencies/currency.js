GNM.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    // TODO
}]);

GNM.factory('CurrenciesFactory', function ($http) {
    var url = 'http://dev.higheridentity.com:8585/api/v1/Currencies/';
    return {
        query: function () {
            return $http.get(url);
        }
    };
});

/*
Get all the Currenciess information
- $scope.deleteFn is called to delete a particular Currencies
- CurrenciesId is stored once user click on delete button
*/
GNM.controller('CurrenciesCtrl', function ($scope, $http, CurrenciesFactory) {

});

GNM.controller('CurrenciesAddCtrl', function ($scope, $http, $location, CurrenciesFactory) {
});
/*
Handle customer update
- init to get the existing customer information
- existing customer id is pass through when user click on edit button
- new customer information is saved on $scope.new_customer
*/
GNM.controller('CurrenciesUpdateCtrl', function ($scope, $http, $location, CurrenciesFactory) {
    $scope.Currencies = {};
});

GNM.directive('currenciesDropdown', function (CurrenciesFactory) {
    return {
        restrict: 'E',
        replace: true,
        template: '' +
            '<select ng-options="c.currencyId as c.code for c in Currencies">' +
                '<option value="">Loading Currency</option>' +
            '</select>',
        link: function (scope, element, attrs) {
            CurrenciesFactory.query().then(function (data) {
                // Once ajax loaded, change first option text to "Please Select"
                element[0].options[0].text = 'Please Select';

                if (data.data.length <= 0) {
                    alert('Please add a Currency first');
                    // TODO Redirect to adding Supplier or popup
                    return false;
                }
                scope.Currencies = (data.data);
            });
        }
    };
});