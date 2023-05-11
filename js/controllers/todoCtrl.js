/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store) {
		'use strict';

		var todos = $scope.todos = store.todos;

		$scope.newTodo = {
			title: '',
			description: '',
			dueDate: null
		};
		$scope.editedTodo = null;

		$scope.$watch('todos', function () {
			$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';
			$scope.statusFilter = (status === 'completed') ?
					{ completed: true } : {};
		});

		$scope.addTodo = function () {
			var newTodo = {
				title: $scope.newTodo.title.trim(),
				description: $scope.newTodo.description.trim(),
				dueDate: $filter('date')($scope.newTodo.dueDate, 'yyyy-MM-dd'),
				completed: false
			};

			if (!newTodo.title || !newTodo.description) {
				return;
			}

			$scope.saving = true;
			store.insert(newTodo)
				.then(function success() {
					$scope.newTodo = {
						title: '',
						description: '',
						dueDate: null
					};
				})
				.finally(function () {
					$scope.saving = false;
				});
		};

		$scope.editTodo = function (todo, index) {
			$scope.showEditForm = true
			$scope.editTodo = {
				id: index,
				title: todo.title,
				description: todo.description,
				dueDate: new Date(todo.dueDate)
			}
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.saveEditTodo = function (todo) {
			var updatedTodo = {
				title: todo.title.trim(),
				description: todo.description.trim(),
				dueDate: $filter('date')(todo.dueDate, 'yyyy-MM-dd'),
				completed: false
			};
			store[todo.title ? 'put' : 'delete'](updatedTodo, todo.id)
				.then(function success() { }, function error() {
					todo.title = $scope.originalTodo.title;
					todo.description = $scope.originalTodo.description;
					// todo.dueDate = $scope.originalTodo.dueDate;
				})
				.finally(function () {
					$scope.editedTodo = null;
				});
			$scope.showEditForm = false;
		}

		$scope.removeTodo = function (todo) {
			store.delete(todo);
		};

		$scope.saveTodo = function (todo) {
			store.put(todo);
		};

		$scope.toggleCompleted = function (todo, index) {
			var updatedTodo = {
				title: todo.title.trim(),
				description: todo.description.trim(),
				dueDate: $filter('date')(todo.dueDate, 'yyyy-MM-dd'),
				completed: true
			};
			store.put(updatedTodo, index)
				.then(function success() { }, function error() {
					todo.completed = !todo.completed;
				});
		};
	});
