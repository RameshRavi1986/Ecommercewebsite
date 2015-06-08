var ProductController=function(ProductCatalog,$stateParams){
this.model=ProductCatalog.model;
ProductCatalog.getSelectedProduct($stateParams.id);

	this.addToCart=function(){
		ProductCatalog.addToCart();
	}
}