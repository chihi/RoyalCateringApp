var GNM = angular.module('GNM', []);

GNM.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    // TODO
}]);

GNM.factory('CreditTermFactory', function ($http) {
    var url = 'http://dev.higheridentity.com:8585/api/v1/creditterms/';
    return {
        query: function () {
            return $http.get(url);
        }
    };
});

/*
Get all the creditTerms information
- $scope.deleteFn is called to delete a particular creditTerm
- creditTermId is stored once user click on delete button
*/
GNM.controller('CreditTermCtrl', function ($scope, $http, CreditTermFactory) {

});

GNM.controller('CreditTermAddCtrl', function ($scope, $http, $location, CreditTermFactory) {
});
/*
Handle customer update
- init to get the existing customer information
- existing customer id is pass through when user click on edit button
- new customer information is saved on $scope.new_customer
*/
GNM.controller('CreditTermUpdateCtrl', function ($scope, $http, $location, CreditTermFactory) {
    $scope.creditTerm = {};
});

GNM.directive('credittermsDropdown', function (CreditTermFactory) {
    return {
        restrict: 'E',
        replace: true,
        template: '' +
            '<select ng-options="c.creditTermId as c.code for c in creditTermArr">' +
                '<option value="">Loading Credit Terms</option>' +
            '</select>',
        link: function (scope, element, attrs) {
            CreditTermFactory.query().then(function (data) {
                // Once ajax loaded, change first option text to "Please Select"
                element[0].options[0].text = 'Please Select';

                if (data.data.length <= 0) {
                    // alert('Please add a Credit Term first');
                    // TODO Redirect to adding Supplier or popup
                    return false;
                }
                scope.creditTermArr = (data.data);
            });
        }
    };
});