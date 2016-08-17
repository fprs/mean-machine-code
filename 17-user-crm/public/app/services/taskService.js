angular.module('taskService', [])
    .factory('Task', function($http) {
        // create a new object
        var taskFactory = {};
        // get a single article
        taskFactory.get = function(id) {
            return $http.get('/api/tasks/' + id);
        };
        // get all articles
        taskFactory.all = function() {
            return $http.get('/api/tasks/');
        };
        // create a article
        taskFactory.create = function(taskData) {
            return $http.post('/api/tasks/', taskData);
        };
        // update a article
        taskFactory.update = function(id, taskData) {
            return $http.put('/api/tasks/' + id, taskData);
        };
        // delete a article
        taskFactory.delete = function(id) {
            return $http.delete('/api/tasks/' + id);
        };
        // return our entire taskFactory object
        return taskFactory;
    });