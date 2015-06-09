var shoppingBasketService=function(){
	this.basket={};
	this.products=[];
	this.total=0;
	
};

shoppingBasketService.prototype.addToCart=function(obj){
  if(obj.stock > 0){
	this.products.push(new BasketItem(obj));
	this.total+=obj.price;
	this.basket.products=this.products;
	this.basket.total=this.total;
  }
};

shoppingBasketService.prototype.removeItem=function(index){
	var tempArray=[];
	var total=0;
	angular.forEach(this.products,function(ob,key){
		
		if(key !== index){
			tempArray.push(ob);
			total+=ob.price;
		}
	});
	this.basket.products=tempArray;
	this.basket.total=total;

};
var BasketItem=function(obj){
	this.item=obj;
}