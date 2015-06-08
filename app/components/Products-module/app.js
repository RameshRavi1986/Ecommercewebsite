angular.module('ClothingFashionApp.Products',['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/products');
    
    $stateProvider
        .state('products', {
            url: '/products/:id/:type',
            templateUrl: 'templates/Products.html'
        })
		.state('product', {
            url: '/product/:id',
            templateUrl: 'templates/Product.html'
        })
       
})
.service("ProductCatalog",ProductCatalog)
.controller("ProductCatalogController",ProductCatalogController)
.controller("ProductController",ProductController);
