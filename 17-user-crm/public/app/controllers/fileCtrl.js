// start our angular module and inject taskService
angular.module('fileCtrl', ['fileService'])
	// article controller for the main page
	// inject the article factory
	.controller('fileController', function(File) {
		var vm = this;
		// set a processing variable to show loading things
		vm.processing = true;
		// grab all the tasks at page load
		File.all()
			.success(function(data) {
				// when all the tasks come back, remove the processing variable
				vm.processing = false;
				// bind the tasks that come back to vm.tasks
				vm.files = data;
			});

		// function to delete a article
		vm.deleteFile = function(id) {
			vm.processing = true;
			// accepts the article id as a parameter
			File.delete(id)
				.success(function(data) {
					// get all tasks to update the table
					// you can also set up your api
					// to return the list of tasks with the delete call
					File.all()
						.success(function(data) {
							vm.processing = false;
							vm.files = data;
						});
				});
		};

	})

// controller applied to article creation page
.controller('fileCreateController', function(File) {
	var vm = this;
	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';
	// function to create a article
	vm.saveFile = function() {
		vm.processing = true;
		// clear the message
		vm.message = '';
		// use the create function in the taskService
		File.create(vm.fileData)
			.success(function(data) {
				vm.processing = false;
				// clear the form
				vm.fileData = {};
				vm.message = data.message;
			});
	};
})

// controller applied to article edit page
.controller('fileEditController', function($routeParams, File) {
	var vm = this;
	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';
	// get the article data for the article you want to edit
	// $routeParams is the way we grab data from the URL
	File.get($routeParams.file_id)
		.success(function(data) {
			vm.fileData = data;
		});
	// function to save the article
	vm.saveFile = function() {
		vm.processing = true;
		vm.message = '';
		// call the taskService function to update
		File.update($routeParams.file_id, vm.fileData)
			.success(function(data) {
				vm.processing = false;
				// clear the form
				vm.fileData = {};
				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};
});