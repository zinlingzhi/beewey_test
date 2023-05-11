describe('TodoCtrl', function () {
    var scope, ctrl, store;
  
    beforeEach(module('todomvc'));
  
    beforeEach(inject(function ($rootScope, $controller, _store_) {
      scope = $rootScope.$new();
      store = _store_;
      ctrl = $controller('TodoCtrl', {
        $scope: scope,
        store: store
      });
    }));
  
    it('should initialize todos', function () {
      expect(scope.todos).toEqual(store.todos);
    });
  
    it('should add a new todo', function () {
      var newTodo = {
        title: 'New Todo',
        description: 'New Todo Description',
        dueDate: new Date(),
        completed: false
      };
      scope.newTodo = newTodo;
      scope.addTodo();
      expect(store.todos[store.todos.length - 1]).toEqual(newTodo);
    });
  
    it('should edit a todo', function () {
      var todo = store.todos[0];
      var updatedTodo = {
        title: 'Updated Todo',
        description: 'Updated Todo Description',
        dueDate: new Date(),
        completed: true
      };
      scope.editTodo(todo, 0);
      scope.editTodo.title = updatedTodo.title;
      scope.editTodo.description = updatedTodo.description;
      scope.editTodo.dueDate = updatedTodo.dueDate;
      scope.saveEditTodo(scope.editTodo);
      expect(store.todos[0]).toEqual(updatedTodo);
    });
  
    it('should remove a todo', function () {
      var todo = store.todos[0];
      scope.removeTodo(todo);
      expect(store.todos.indexOf(todo)).toEqual(-1);
    });
  
    it('should toggle a todo', function () {
      var todo = store.todos[0];
      scope.toggleCompleted(todo, 0);
      expect(store.todos[0].completed).toEqual(true);
    });
  });
  