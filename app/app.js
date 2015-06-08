// Intializing Quiz app
var ClothingFashionApp=angular.module('ClothingFashion', ['ui.router',
'ClothingFashionApp.home',
'ClothingFashionApp.Categories',
'ClothingFashionApp.Products',
'ShoppingBasket'
]);
// Ui router for routing to different stages
ClothingFashionApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        })
      	 .state('categories', {
            url: '/categories/:id',
            templateUrl: 'templates/categories.html'
        })	
        
});

