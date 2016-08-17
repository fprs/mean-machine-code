angular.module('app.routes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
        // route for the home page
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })
            // login page
            .when('/login', {
                templateUrl: 'app/views/pages/login.html',
                controller: 'mainController',
                controllerAs: 'login'
            })
            // show all users
            .when('/users', {
                templateUrl: 'app/views/pages/users/all.html',
                controller: 'userController',
                controllerAs: 'user'
            })

        // form to create a new user
        // same view as edit page
        .when('/users/create', {
            templateUrl: 'app/views/pages/users/single.html',
            controller: 'userCreateController',
            controllerAs: 'user'
        })

        // page to edit a user
        .when('/users/:user_id', {
            templateUrl: 'app/views/pages/users/single.html',
            controller: 'userEditController',
            controllerAs: 'user'
        })

        // show all articles
        .when('/groups', {
            templateUrl: 'app/views/pages/articles/all.html',
            controller: 'articleController',
            controllerAs: 'article'
        })

        // form to create a new article
        // same view as edit page
        .when('/groups/create', {
            templateUrl: 'app/views/pages/articles/single.html',
            controller: 'articleCreateController',
            controllerAs: 'article'
        })

        // page to edit a article
        .when('/groups/:article_id', {
            templateUrl: 'app/views/pages/articles/single.html',
            controller: 'articleEditController',
            controllerAs: 'article'
        })

        // show all tasks
        .when('/tasks', {
            templateUrl: 'app/views/pages/tasks/all.html',
            controller: 'taskController',
            controllerAs: 'task'
        })

        // form to create a new task
        // same view as edit page
        .when('/tasks/create', {
            templateUrl: 'app/views/pages/tasks/single.html',
            controller: 'taskCreateController',
            controllerAs: 'task'
        })

        // page to edit a task
        .when('/tasks/:task_id', {
            templateUrl: 'app/views/pages/tasks/single.html',
            controller: 'taskEditController',
            controllerAs: 'task'
        })

        // show all files
        .when('/files', {
            templateUrl: 'app/views/pages/files/all.html',
            controller: 'fileController',
            controllerAs: 'file'
        })

        // form to create a new file
        // same view as edit page
        .when('/files/create', {
            templateUrl: 'app/views/pages/files/single.html',
            controller: 'fileCreateController',
            controllerAs: 'file'
        })

        // page to edit a file
        .when('/files/:file_id', {
            templateUrl: 'app/views/pages/files/single.html',
            controller: 'fileEditController',
            controllerAs: 'file'
        });

        // get rid of the hash in the URL
        $locationProvider.html5Mode(true);
    });