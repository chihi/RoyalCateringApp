var Ingredients = angular.module('Ingredients', []);
var ingredientsDatatable;
var ingredientUrl = 'http://dev.higheridentity.com:8686/api/v1/products/';

Ingredients
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/ingredients', { templateUrl: 'Ingredients/ingredients.partial.html'})
        .when('/ingredients/add', {templateUrl: 'Ingredients/ingredientsForm.partial.html',controller: ''})
        .when('/ingredients/:id', { templateUrl: 'Ingredients/ingredientsForm.partial.html',controller: '' });
}]);

Ingredients.factory('ingredientsFactory', function ($http) {

    return {
        query: function()
        {
        	return $http.get(ingredientUrl);
        },
        get: function(id)
        {
        	return $http.get(ingredientUrl+id);
        },
        add: function(ingredient)
        {
        	return $http.post(ingredientUrl,ingredient);
        },
        edit: function(id, ingredient)
        {
        	return $http.put(ingredientUrl+id, ingredient)
        },
        delete: function(id)
        {
        	return $http.delete(ingredientUrl+id);
        }
    };
});

Ingredients.controller('IngredientCtrl', function($scope, $http, ingredientsFactory){

	$scope.ingredient = {};

});

Ingredients.controller('IngredientListCtrl',function ($scope, $http, ingredientsFactory){

	$scope.deleteFn = function(ingredientId)
    {
        ingredientsFactory.delete(ingredientId)
            .success(function(data){
                //console.log(data);
                ingredientsDatatable.fnReloadAjax();
                //console.log("delete success");
            })
            .error(function(error){
                console.log("delete error");
            })

    };
});

Ingredients.controller('IngredientEditCtrl',function ($scope,$routeParams, $http, ingredientsFactory){

	var ingredientId = $routeParams.id;

    if (ingredientId)
    {
    	// $scope.show = true;
        ingredientsFactory.get(ingredientId)
            .success(function (data){
            	//$scope.ingredient = data;
            	//alert(angular.toJson($scope.ingredient));
                angular.copy(data[0], $scope.ingredient);
                //alert(angular.toJson($scope.ingredient));
            });
    }
    else
    {
    	// $scope.show = false;
    }

});

Ingredients.directive('ingredientsDatatable', [function (ingredientsFactory) {

    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {

            ingredientsDatatable = $(element).dataTable({
                "bProcessing": true,
                "sAjaxSource": ingredientUrl,
                "sAjaxDataProp": "",
                "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "sPaginationType": "full_numbers",
                "aoColumns": [
                    { "mData": "name" },
                    { "mData": "description" },
                    { "mData": "stockLevel" },
                    { "mData": "productId" }
                ],
                "aoColumnDefs": [
                     {
                         "aTargets": [3], // Column to target
                         "mRender": function (data, type, full) 
                         {
                             // 'full' is the row's data object, and 'data' is this column's data
                             // e.g. 'full[0]' is the comic id, and 'data' is the comic title
                             return '<a href="#/ingredients/' + data + '" class="btn btn-success btn-sm btn-warning btn-update">Edit</a> <button type="button" class="btn btn-success btn-danger btn-sm btn-delete">Delete</button> ';
                         }
                     }
                ],
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    // Bold the grade for all 'A' grade browsers
                    //console.log($('.btn-delete' , nRow));
                    $('.btn-delete', nRow).click(function () {
                        //console.log(aData.customerId);
                        scope.deleteFn(aData.productId);
                    });
                }
            });
        }
    }
}]);
