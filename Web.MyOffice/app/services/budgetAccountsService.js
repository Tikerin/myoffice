﻿(function () {

    'use strict';

    angular.module('MyOffice.app')
        .service('budgetAccountsService', ['$resource', budgetAccountsService]);

    function budgetAccountsService($resource) {
        return $resource('api/BudgetAccounts/', {}, {
            getUsersBudgets: { method: 'GET', params: {}, isArray: false },
            postCategoryList: { method: 'POST', params: {}, isArray: false },
            getCategory: { method: 'GET', params: {}, isArray: false },
            putAccount: { method: 'PUT', params: {}, isArray: false },
            deleteAccount: { method: 'DELETE', params: {}, isArray: false }
        });
    };
})();