import { uiModules } from 'ui/modules';

uiModules.get('app/pivot_table', [])
.directive('ngpivottable',function(){
  var instances = 0;
  return{
    restrict:"E",
    scope:{
      vis:"=",
      uiState:"=",
      esResponse:"="
    },
    link: function($scope,element){
      $scope.instance=element;
      instances++;
    },
    controller: 'tableControler'
  };
});
