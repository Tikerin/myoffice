﻿(function () {
    'use strict';

    angular.module('MyOffice.app').service('itemService', ['$resource', itemService]);

    function itemService($resource) {
        return $resource('api/expenditures/', {}, {
            categoryList: { method: 'GET', params: {}, isArray: false },
            itemAdd: { method: 'PUT', params:{}, isArray: false },
            itemDelete: { method: 'DELETE', params: {}, isArray: false },
            CategoryPost: { method: 'POST', params:{}, isArray: false },
            CategoryDelete: { method: 'GET', params: {}, isArray: false }
        });
    }
})();