var SalesOrders = angular.module('SalesOrders', []);
var salesOrdersDatatable;
var salesOrderUrl = 'http://dev.higheridentity.com:8686/api/v1/SalesOrders/';

SalesOrders.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/salesOrders', { templateUrl: 'SalesOrders/salesOrders.partial.html' })
        .when('/salesOrders/add', {templateUrl: 'SalesOrders/salesOrdersForm.partial.html',controller: ''})
        .when('/salesOrders/:id', { templateUrl: 'SalesOrders/salesOrdersForm.partial.html',controller: '' });
}]);

SalesOrders.factory('salesOrderFactory', function ($http) {

    return {
        query: function()
        {
        	return $http.get(salesOrderUrl);
        },
        get: function(id)
        {
        	return $http.get(salesOrderUrl+id);
        },
        add: function(salesOrder)
        {
        	return $http.post(salesOrderUrl,salesOrder);
        },
        edit: function(id, salesOrder)
        {
        	return $http.put(salesOrderUrl+id, salesOrder)
        },
        delete: function(id)
        {
        	return $http.delete(salesOrderUrl+id);
        }
    };
});

SalesOrders.controller('SalesOrderCtrl', function($scope, $http, salesOrderFactory){

	$scope.salesOrder = {};

});

SalesOrders.controller('SalesOrderListCtrl',function ($scope, $http, salesOrderFactory){

	$scope.deleteFn = function(salesOrderId)
    {
        salesOrderFactory.delete(salesOrderId)
            .success(function(data){
                //console.log(data);
                salesOrdersDatatable.fnReloadAjax();
                //console.log("delete success");
            })
            .error(function(error){
                console.log("delete error");
            })

    };
});

SalesOrders.controller('SalesOrderEditCtrl',function ($scope, $routeParams, $http, salesOrderFactory){

	var salesOrderId = $routeParams.id;
	$scope.salesOrder = {};
	$scope.salesOrder.tags = "";

	$scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'tags': []  // Can be empty list.
        //ajax: {
        //    url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
        //    dataType: 'jsonp',
        //    quietMillis: 100,
        //    data: function (term, page) { // page is the one-based page number tracked by Select2
        //        return {
        //            q: term, //search term
        //            page_limit: 10, // page size
        //            page: page, // page number
        //            apikey: "ju6z9mjyajq2djue3gbvv26t" // please do not use so this example keeps working
        //        };
        //    },
        //    results: function (data, page) {
        //        var more = (page * 10) < data.total; // whether or not there are more results available

        //        // notice we return the value of more so Select2 knows if more results can be loaded
        //        return { results: data.movies, more: more };
        //    }
        //},
        //formatResult: function (data) {
        //}, // omitted for brevity, see the source of this page
        //formatSelection: function (data) {
        //}, // omitted for brevity, see the source of this page
        //dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        //escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
    };

    $scope.select2OptionsProduct = {
        ajax: {
            url: "http://api.higheridentity.com",
            dataType: 'jsonp',
            quietMillis: 100,
            data: function (term, page) { // page is the one-based page number tracked by Select2
                return {
                    q: term, //search term
                    page_limit: 10, // page size
                    page: page // page number
                };
            },
            results: function (data, page) {
                var more = (page * 10) < data.total; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: data.movies, more: more };
            }
        },
        formatResult: function (data) {
        }, // omitted for brevity, see the source of this page
        formatSelection: function (data) {
        }, // omitted for brevity, see the source of this page
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
    }

    if (salesOrderId)
    {
    	// $scope.show = true;
        salesOrderFactory.get(salesOrderId)
            .success(function (data){
            	//$scope.ingredient = data;
            	//alert(angular.toJson($scope.ingredient));
                angular.copy(data[0], $scope.salesOrder);
                $scope.salesOrder.tags = data.tags;
                // alert(angular.toJson($scope.quotation));
            });
    }
    else
    {
    	// $scope.show = false;
    }

	// Add item into $scope.purchase.purchaseOrderDetailsList
    $scope.addSalesOrderItem = function () {
        var newSalesOrderItem = angular.copy($scope.newSalesOrderItem);

        $scope.salesOrder.salesOrderDetailsList.push(newSalesOrderItem);
    }
    
    // Remove item from $scope.purchase.purchaseOrderDetailsList
    $scope.removeSalesOrderItem = function (index) {
        $scope.salesOrder.salesOrderDetailsList.splice(index,1);
    }

    $scope.tagsChanged = function () {
        var tags = $scope.salesOrder.tags;

        if (angular.isArray(tags)) {
            $scope.salesOrder.tags = tags.join();
        }
    }

});

SalesOrders.directive('salesordersDatatable', [function (salesOrderFactory) {

    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {

            salesOrdersDatatable = $(element).dataTable({
                "bProcessing": true,
                "sAjaxSource": salesOrderUrl,
                "sAjaxDataProp": "",
                "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "sPaginationType": "full_numbers",
                "aoColumns": [
                    { "mData": "salesOrderNumber" },
                    { "mData": "dateExpected" },
                    { "mData": "remarks" },
                    { "mData": "salesOrderId" }
                ],
                "aoColumnDefs": [
                     {
                         "aTargets": [3], // Column to target
                         "mRender": function (data, type, full) 
                         {
                             // 'full' is the row's data object, and 'data' is this column's data
                             // e.g. 'full[0]' is the comic id, and 'data' is the comic title
                             return '<a href="#/salesOrders/' + data + '" class="btn btn-success btn-sm btn-warning btn-update">Edit</a> <button type="button" class="btn btn-success btn-danger btn-sm btn-delete">Delete</button> ';
                         }
                     }
                ],
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    // Bold the grade for all 'A' grade browsers
                    //console.log($('.btn-delete' , nRow));
                    $('.btn-delete', nRow).click(function () {
                        //console.log(aData.customerId);
                        scope.deleteFn(aData.salesOrderId);
                    });
                }
            });
        }
    }
}]);

Quotations.directive('salesorderitemsTable', function (salesOrderFactory) {
    return {
        restrict: 'EA',
        replace: true,
        link: function (scope, element, attrs) {
            
        }
    }
});
