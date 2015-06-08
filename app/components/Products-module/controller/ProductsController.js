var ProductCatalogController=function(ProductCatalog,$stateParams){
this.model=ProductCatalog.model;
ProductCatalog.getProducts().then(function(){
	ProductCatalog.getProductList($stateParams.id+$stateParams.type);
});

};