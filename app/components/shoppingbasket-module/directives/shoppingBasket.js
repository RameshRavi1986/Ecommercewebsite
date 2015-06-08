function shoppingBasket(shoppingBasketService){

return{
	restrict:'A',
	scope:{
		
	},
	templateUrl:'templates/shoppingBasket.html',
	link:function($scope, element,attributes){
		 $scope.basket=shoppingBasketService.basket;
		 
		 $scope.removeItem=function(index){
			shoppingBasketService.removeItem(index);
			$scope.products=shoppingBasketService.products;
		}
	}
}

}