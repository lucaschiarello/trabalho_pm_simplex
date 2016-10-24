angular.module('AllApp', [])
  .controller('AllController', function($scope) {
    $scope.getNumber = function(num) {
		  var range = [];
			for(var i=1;i<=num;i++) {
			  range.push(i);
			}
			return range;  
		}

		$scope.placeholderText = function(num) {
			var text = '';
			for(var i=1;i<num;i++) {
			  text += 'x'+i+', ';
			}
			text += 'x'+num+' ≥ 0';

			return text;
		}
  });