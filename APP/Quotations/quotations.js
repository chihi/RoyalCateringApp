var Quotations = angular.module('Quotations', []);
var quotationsDatatable;
var quotationUrl = 'http://dev.higheridentity.com:8686/api/v1/Quotations/';

Quotations.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/quotations', { templateUrl: 'Quotations/quotations.partial.html' })
        .when('/quotations/add', {templateUrl: 'Quotations/quotationsForm.partial.html',controller: ''})
        .when('/quotations/:id', { templateUrl: 'Quotations/quotationsForm.partial.html',controller: '' });
}]);

Quotations.factory('quotationsFactory', function ($http) {

    return {
        query: function()
        {
        	return $http.get(quotationUrl);
        },
        get: function(id)
        {
        	return $http.get(quotationUrl+id);
        },
        add: function(quotation)
        {
        	return $http.post(quotationUrl,quotation);
        },
        edit: function(id, quotation)
        {
        	return $http.put(quotationUrl+id, quotation)
        },
        delete: function(id)
        {
        	return $http.delete(quotationUrl+id);
        }
    };
});

Quotations.controller('QuotationCtrl', function($scope, $http, quotationsFactory){

	$scope.quotation = {};

});

Quotations.controller('QuotationListCtrl',function ($scope, $http, quotationsFactory){

	$scope.deleteFn = function(quotationId)
    {
        quotationsFactory.delete(quotationId)
            .success(function(data){
                //console.log(data);
                quotationsDatatable.fnReloadAjax();
                //console.log("delete success");
            })
            .error(function(error){
                console.log("delete error");
            })

    };
});

Quotations.controller('QuotationEditCtrl',function ($scope, $routeParams, $http, quotationsFactory){

	var quotationId = $routeParams.id;
	$scope.quotation = {};
	$scope.quotation.tags = "";

	$scope.select2Quotations = {
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

    $scope.select2OptionsQuotation = {
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
	
    if (quotationId)
    {
    	// $scope.show = true;
        quotationsFactory.get(quotationId)
            .success(function (data){
            	//$scope.ingredient = data;
            	//alert(angular.toJson($scope.ingredient));
                angular.copy(data[0], $scope.quotation);
                $scope.quotation.tags = data.tags;
                // alert(angular.toJson($scope.quotation));
            });
    }
    else
    {
    	// $scope.show = false;
    }

    // Add item into $scope.purchase.purchaseOrderDetailsList
    $scope.addQuotationItem = function () {
        var newQuotationItem = angular.copy($scope.newQuotationItem);

        $scope.quotation.quotationDetailsList.push(newQuotationItem);
    }
    
    // Remove item from $scope.purchase.purchaseOrderDetailsList
    $scope.removeQuotationItem = function (index) {
        $scope.quotation.quotationDetailsList.splice(index,1);
    }

    $scope.tagsChanged = function () {
        var tags = $scope.quotation.tags;

        if (angular.isArray(tags)) {
            $scope.quotation.tags = tags.join();
        }
    }

});

Quotations.directive('quotationsDatatable', [function (quotationsFactory) {

    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {

            quotationsDatatable = $(element).dataTable({
                "bProcessing": true,
                "sAjaxSource": quotationUrl,
                "sAjaxDataProp": "",
                "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "sPaginationType": "full_numbers",
                "aoColumns": [
                    { "mData": "quotationId" },
                    { "mData": "dateExpected" },
                    { "mData": "remarks" },
                    { "mData": "quotationId" }
                ],
                "aoColumnDefs": [
                     {
                         "aTargets": [3], // Column to target
                         "mRender": function (data, type, full) 
                         {
                             // 'full' is the row's data object, and 'data' is this column's data
                             // e.g. 'full[0]' is the comic id, and 'data' is the comic title
                             return '<a href="#/quotations/' + data + '" class="btn btn-success btn-sm btn-warning btn-update">Edit</a> <button type="button" class="btn btn-success btn-danger btn-sm btn-delete">Delete</button> ';
                         }
                     }
                ],
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    // Bold the grade for all 'A' grade browsers
                    //console.log($('.btn-delete' , nRow));
                    $('.btn-delete', nRow).click(function () {
                        //console.log(aData.customerId);
                        scope.deleteFn(aData.quotationId);
                    });
                }
            });
        }
    }
}]);

Quotations.directive('quotationitemsTable', function (quotationsFactory) {
    return {
        restrict: 'EA',
        replace: true,
        link: function (scope, element, attrs) {
            
        }
    }
});
