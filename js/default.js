angular.module('AllApp', [])
  .controller('AllController', function($scope) {
  	$scope.function_z = [];
  	$scope.restriction = [];
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

		$scope.collectData = function(){
			console.log($scope.function_z);
			console.log($scope.restriction);
		}

		$scope.initSimplex = function() {

			// Variável global table;
			var table = [];

			//Linha Z
			var z_line = [1];

			// //Inverte valor da função objetivo Z
			$scope.function_z.forEach(function(value, key) {
				z_line.push(value*-1);
      });

			for(var i=1;i<=$scope.inputRestrictions;i++) {
				z_line.push(0);
      }
			z_line.push(0);

			table.push(z_line); //Joga a linha função Z para a tabela final

			var count = 1;
			$scope.restriction.forEach(function(value, key) {
				var restrict = [0];
				for(var i=1;i<=$scope.inputVariables;i++) {
				  restrict.push(value[i]);
				}
				for(var i=1;i<=$scope.inputRestrictions;i++) {
				  if (i == count) {
					  restrict.push(1);
				  } else {
				  	restrict.push(0);
				  }
				}
				restrict.push(value['result']);
				count += 1;

				table.push(restrict);
			});

			// Mostra a tabela número 1
			$("#table_show1").html("");
			var table_show1 = document.getElementById("table_show1");
	    for (var i=0; i<table.length; i++) {
        var row = table_show1.insertRow();
        for (var j=0; j<table[i].length; j++) {
          var cell = row.insertCell();
          cell.appendChild(document.createTextNode(table[i][j]));
        }
	    }

			

		}



  });