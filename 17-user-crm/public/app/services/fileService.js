angular.module('fileService', [])
    .factory('File', function($http) {
        // create a new object
        var fileFactory = {};
        // get a single article
        fileFactory.get = function(id) {
            return $http.get('/api/files/' + id);
        };
        // get all articles
        fileFactory.all = function() {
            return $http.get('/api/files/');
        };
        // create a article
        fileFactory.create = function(fileData) {
            return $http.post('/api/files/', fileData);
        };
        // update a article
        fileFactory.update = function(id, fileData) {
            return $http.put('/api/files/' + id, fileData);
        };
        // delete a article
        fileFactory.delete = function(id) {
            return $http.delete('/api/files/' + id);
        };
        // return our entire taskFactory object
        return fileFactory;
    });