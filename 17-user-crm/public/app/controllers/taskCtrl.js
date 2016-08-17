// start our angular module and inject taskService
angular.module('taskCtrl', ['taskService'])
// article controller for the main page
// inject the article factory
.controller('taskController', function(Task) {
var vm = this;
// set a processing variable to show loading things
vm.processing = true;
// grab all the tasks at page load
Task.all()
.success(function(data) {
// when all the tasks come back, remove the processing variable
vm.processing = false;
// bind the tasks that come back to vm.tasks
vm.tasks = data;
});

// function to delete a article
vm.deleteTask = function(id) {
vm.processing = true;
// accepts the article id as a parameter
Task.delete(id)
.success(function(data) {
// get all tasks to update the table
// you can also set up your api
// to return the list of tasks with the delete call
Task.all()
.success(function(data) {
vm.processing = false;
vm.tasks = data;
});
});
};

})

// controller applied to article creation page
.controller('taskCreateController', function(Task) {
var vm = this;
// variable to hide/show elements of the view
// differentiates between create or edit pages
vm.type = 'create';
// function to create a article
vm.saveTask = function() {
vm.processing = true;
// clear the message
vm.message = '';
// use the create function in the taskService
Task.create(vm.taskData)
.success(function(data) {
vm.processing = false;
// clear the form
vm.taskData = {};
vm.message = data.message;
});
};
})

// controller applied to article edit page
.controller('taskEditController', function($routeParams, Task) {
var vm = this;
// variable to hide/show elements of the view
// differentiates between create or edit pages
vm.type = 'edit';
// get the article data for the article you want to edit
// $routeParams is the way we grab data from the URL
Task.get($routeParams.task_id)
.success(function(data) {
vm.taskData = data;
});
// function to save the article
vm.saveTask = function() {
vm.processing = true;
vm.message = '';
// call the taskService function to update
Task.update($routeParams.task_id, vm.taskData)
.success(function(data) {
vm.processing = false;
// clear the form
vm.taskData = {};
// bind the message from our API to vm.message
vm.message = data.message;
});
};
});