/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    if (!window.angular) {
        alert("angular library is required to use this lib");
    }
    var module = angular.module('com.naga.basic', []);
    module.component("searchBox", {
        bindings: {
            config: '<',
            list: '<'
        },
        template: '<div class="box">'
                + '<h3>Naga</h3>'
                + '<table class="table">'
                + '<thead>'
                + '<tr>'
                + '<th ng-if="$ctrl.config.selectable">#</th>'
                + '<th ng-repeat="col in $ctrl.config.header">{{col}}</th>'
                + '</tr>'
                + '</thead>'
                + '<tbody>'
                + '<tr ng-repeat="row in $ctrl.list">'
                + '<th ng-if="$ctrl.config.selectable"><input type="checkbox" /></th>'
                + '<td ng-repeat="key in $ctrl.config.keys">{{row[key]}}</td>'
                + '</tr>'
                + '</tbody>'
                + '</table>'
                + '</div>',
        controller: function () {
        }
    });

    module.component("toDo", {
        bindings: {
            config: '<',
            list: '<'
        },
        template: '<ul class="todo-list">'
                + '<li ng-repeat="item in $ctrl.list"><to-do-item item="item"></to-do-item></li>'
                + '</ul>',
        controller: function () {
        }
    });

    module.component('toDoItem', {
        require: {parent: '^toDo'},
        bindings: {
            item: '<'
        },
        template: ''
                + '<input type="checkbox" value="">'
                + '<span class="text">{{$ctrl.item.task}}</span>'
                + '<small class="label label-danger"><i class="fa fa-clock-o"></i> 2 mins</small>'
                + '<div class="tools">'
                + '<i class="fa fa-edit"></i>'
                + '<i class="fa fa-trash-o"></i>'
                + '</div>'
                + ''
    });


    module.component("bsSearchInput", {
        bindings: {
            onupdate: '&',
            placeholder: '@'
        },
        template: '<input type="text" ng-model="search" class="form-control input-sm" placeholder="{{$ctrl.placeholder}}">'
                + '<span workflow-search-btn="" class="input-group-addon btn btn-default">'
                + '<i class="fa fa-search"></i>'
                + '</span>',
        controller: function () {
            console.log(this);
            this.onupdate();
        }
    });

})();

