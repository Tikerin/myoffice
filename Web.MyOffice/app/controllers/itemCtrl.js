﻿(function () {

    'use strict';

    angular.module('MyOffice.app')
        .controller('itemCtrl', ['$scope', 'ModalWindowService', 'itemService', 'motionService', itemCtrl]);

    function itemCtrl($scope, ModalWindowService, itemService, motionService) {

        //"_____________________*** Infrastructure section ***_____________________"
        $scope.windowOpen = function (name, size) {
            var setSize = '';
            if (size === undefined) {
                setSize = 'modal-sm';
            } else {
                setSize = size;
            }
            ModalWindowService.open('ExpenditureController', name, $scope, setSize);
        };
        $scope.windowClose = function (name) {
            ModalWindowService.close(name);
        };

        $scope.getItems = function (categories) {
            var items = [];
            if (categories instanceof Array) {
                for (var i = 0; i < categories.length; i++) {
                    for (var j = 0; j < categories[i].Items.length; j++) {
                        items.push(categories[i].Items[j]);
                    }
                }
            } else {
                for (var z = 0; z < categories.Items.length; z++) {
                    items.push(categories.Items[z]);
                }
            }
            return items;
        };
        $scope.getMotions = function (items) {
            var motions = [];
            if (items instanceof Array) {
                for (var i = 0; i < items.length; i++) {
                    for (var j = 0; j < items[i].Motions.length; j++) {
                        motions.push(items[i].Motions[j]);
                    }
                }
            } else {
                for (var z = 0; z < items.Motions.length; z++) {
                    motions.push(items.Motions[z]);
                }
            }
            return motions;
        };
        $scope.sortByProp = function (array, prop) {
            var sorter = function (prev, next) {
                if (prev[prop] < next[prop]) {
                    return -1;
                } else if (prev[prop] > next[prop]) {
                    return 1;
                } else {
                    return 0;
                };
            };
            return array.sort(sorter);
        };

        $scope.selectCategory = function (category) {
            if (category === null) {
                $scope.displayItems = $scope.sortByProp($scope.getItems($scope.Categories), 'Name');
            } else {
                $scope.displayItems = $scope.sortByProp($scope.getItems(category), 'Name');
            }
        };

        $scope.deleteCategory = function (category) {
            if (category === null) {
                $scope.displayItems = $scope.sortByProp($scope.getItems($scope.Categories), 'Name');
            } else {
                $scope.displayItems = $scope.sortByProp($scope.getItems(category), 'Name');
            }
        };

        $scope.getItemCategory = function (item) {
                return $scope.Categories.find(function(category) {
                    return category.Id === item.CategoryId;
                });
        };

        //"_____________________*** Data update section ***_____________________"
        $scope.refresh = function () {
            $scope.model = itemService.categoryList({}, function () {
                $scope.Categories = $scope.model.Categories;
                $scope.Budgets = $scope.model.Budgets;
                $scope.displayItems = $scope.sortByProp($scope.getItems($scope.Categories), 'Name');
                $scope.Categories = $scope.sortByProp($scope.Categories, 'Name');
            });
        };

        //"_____________________*** Items section ***_____________________"
        $scope.addItemDialog = function () {
            $scope.newItem = {};
            $scope.windowOpen('ItemAdd');
        };
        $scope.itemEditDialog = function (newItem) {
            $scope.newItem = newItem;
            $scope.windowOpen('ItemAdd');
        };
        $scope.addItem = function (item) {
            if (item.Category !== undefined) {
                if (typeof item.Category !== 'object') {
                    item.CategoryId = item.Category;
                    item.BudgetId = $scope.Categories.find(function (category) {
                        return category.Id === item.CategoryId;
                    }).BudgetId;
                };
                itemService.itemAdd(item, function () {
                    $scope.windowClose('ItemAdd');
                    $scope.refresh();
                });
            };
        };
        $scope.itemDelete = function (item) {
            itemService.itemDelete({ deleteId:item.Id }, function () {
                $scope.refresh();
            });
        };
        $scope.itemAdd = function (item) {
            itemService.itemAdd(item, function () {
                $scope.windowClose('ItemAdd');
                $scope.refresh();
            });
        };

        //"_____________________*** Motions section ***_____________________"
        $scope.itemMotionList = function (item) {
            $scope.Motions = $scope.getMotions(item);
            $scope.windowOpen('MotionsList');
        };

        $scope.motionUpdateList = [];
        $scope.addToUpdateList = function (motion) {
            var editMotion = $scope.motionUpdateList.find(function(_motion) {
                return _motion.Id === motion.Id;
            });
           if (editMotion) {
               $scope.motionUpdateList = $scope.motionUpdateList.filter(function (_motion) {
                   return _motion.Id === motion.Id;
               });
           } else {
               $scope.motionUpdateList.push(motion);
           }
            motion.Deleted = !motion.Deleted;
        };

        $scope.MotionUpdate = function (motion) {
            motionService.MotionUpdate($scope.motionUpdateList, function () {
                $scope.windowClose('MotionsList');
                $scope.motionUpdateList = [];
                $scope.refresh();
            });
        };
        $scope.MotionDelete = function (motion) {
            $scope.Motions = $scope.Motions.filter(function (_motion) {
                return _motion.Id !== motion.Id;
            });
            motionService.MotionDelete({ motionId: motion.Id }, function () {
                $scope.refresh();
            });
        };
        $scope.MotionMergeDialog = function (item) {
            $scope.selectedItem = item;
            $scope.mainItem = { Name: '', Category: { Name: '' }, Description: '', Deleted: false };
            $scope.windowOpen('ItemList');
        };
        $scope.selectMainItem = function(item) {
            $scope.mainItem = item;
        };
        $scope.itemMerge = function () {
            motionService.MotionMerge({ mainItem: $scope.mainItem, selectedItem: $scope.selectedItem },
                function() {
                    $scope.refresh();
                });
        };

        //"_____________________*** Category section ***_____________________"
        $scope.CategoryItemEditDialog = function (category) {
            $scope.newCategory = undefined;
            if (category === undefined) {
                $scope.newCategory = {};
            } else {
                $scope.newCategory = category;
            }
            $scope.windowOpen('CategoryItemEdit');
        };
        $scope.CategoryItemsDialog = function (category) {
            $scope.windowOpen('CategoryItems');
        };
        $scope.newCategorySave = function (category) {
            if (category.BudgetId === undefined) {
                category.BudgetId  = $category.Id;
            }
            itemService.CategoryPost(category, function() {
                $scope.refresh();
                $scope.windowClose('CategoryItemEdit');
            });
        };
        $scope.CategoryDelete = function(category) {
            itemService.CategoryDelete({ deleteId: category.Id }, function () {
                $scope.refresh();
                $scope.windowClose('CategoryItemEdit');
            });
        };
    };
})();