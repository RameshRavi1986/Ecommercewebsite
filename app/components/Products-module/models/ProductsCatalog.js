var ProductCatalog=function($http,$q,shoppingBasketService){
	this.$http=$http;
	this.$q=$q;
	this.url="data/products-data.js";
	this.model={};
	this.shoppingBasketService=shoppingBasketService;

};

ProductCatalog.prototype.getProducts=function(){
	var deferred=this.$q.defer();
	var service=this;
	this.$http.get(this.url)
		.success(function(data){
			deferred.resolve(service.transformResponse(data));
	});
	return deferred.promise;
};
ProductCatalog.prototype.transformResponse=function(productsObj){
	var service=this;
	var products=[];
	angular.forEach(productsObj.ProductList,function(ob,key){
		products.push(new product(ob));	
	});
	this.model.productList=products;

};

ProductCatalog.prototype.getProductList=function(productId){
	var service=this;
	angular.forEach(this.model.productList,function(ob,key){
		if(productId === ob.productId)
			service.model.selectedProducts=ob.products;	
	});

};
ProductCatalog.prototype.getSelectedProduct=function(id){
	var service=this;
	angular.forEach(this.model.selectedProducts,function(ob,key){
		if(key === Number(id))
			service.model.selectedProduct=ob;	
	});


};
ProductCatalog.prototype.addToCart=function(){
	this.shoppingBasketService.addToCart(this.model.selectedProduct);

};
var product=function(obj){
	if(typeof obj!=="undefined"){
		this.productId=obj.id+obj.type;
		this.products=obj.Products;
		
		
	}
}