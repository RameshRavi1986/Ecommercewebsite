var CategoryModel=function($http,$q){
	this.$http=$http;
	this.$q=$q;
	this.url="data/categories-data.js";
	this.model={};


}

CategoryModel.prototype.getCategories=function(){
	var deferred=this.$q.defer();
	var service=this;
	this.$http.get(this.url)
		.success(function(data){
			deferred.resolve(service.transformResponse(data));
	});
	return deferred.promise;

};

CategoryModel.prototype.transformResponse=function(categoryObj){
	var service=this;
	var categories=[];
	angular.forEach(categoryObj.categories,function(ob,key){
		categories.push(new category(ob));	
	});
	this.model.categories=categories;

};

CategoryModel.prototype.getCategory=function(id){
	var service=this;
	angular.forEach(service.model.categories,function(ob,key){
		if(typeof ob!=="undefined" && ob.id == id)
			service.model.selectedCategory=ob;
	});
};

var category=function(data){
	    if(typeof data !== "undefined"){
		this.id=data.id;
		this.image=data.image;
		this.category=data.category;
	    }

};