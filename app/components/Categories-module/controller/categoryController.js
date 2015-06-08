var CategoryController=function(CategoryModel,$stateParams){
	this.model=CategoryModel.model;
	
	CategoryModel.getCategories().then(function(){;
		CategoryModel.getCategory($stateParams.id);
	});
}