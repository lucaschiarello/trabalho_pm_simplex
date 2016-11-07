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
			// console.log($scope.function_z);
			// console.log($scope.restriction);
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
        var row = table_show1.insertRow(); //linha
        for (var j=0; j<table[i].length; j++) {
          var cell = row.insertCell(); //coluna
          cell.appendChild(document.createTextNode(table[i][j]));
        }
	    }

			// Aqui inicia o cálculo do Simplex
			var table = calcSimplex(table);
	    for (var i=0; i<table[0].length; i++) { 
	    	//console.log(table[0][i]);
	    	if (table[0][i] < 0) {
	    		var table = calcSimplex(table);
	    	}
			}

			//Agora mostra as váriaveis finais do cálculo
			var not_basic = []; //Variáveis não básicas
			var basic = []; //Variáveis básicas
			var columm_content = []; //Array com as colunas que já foram passadas
			for (var i=0; i<table.length; i++) { 
        for (var j=1; j<table[i].length-1; j++) {
      		if (table[i][j] !=0 && table[i][j] != 1 && !columm_content.includes(j)) {
      			columm_content.push(j);
      			if (j<=$scope.inputVariables) {
	      			not_basic.push({columm: j, value: parseFloat(table[i][table[i].length-1]).toFixed(3), table: "x"});
	      		} else {
      				not_basic.push({columm: j-$scope.inputVariables, value: parseFloat(table[i][table[i].length-1]).toFixed(3), table: "xF"});
	      		}
      		} else if(table[i][j] != 0 && !columm_content.includes(j)) {
      			columm_content.push(j);
      			if (j<=$scope.inputVariables) {
      				basic.push({columm: j, value: parseFloat(table[i][table[i].length-1]).toFixed(3), table: "x"});
      			} else {
      				basic.push({columm: j-$scope.inputVariables, value: parseFloat(table[i][table[i].length-1]).toFixed(3), table: "xF"});
      			}
      		}
        }
	    }

	    // console.log("basicas");
	    $scope.basics = basic;
	    $scope.not_basics = not_basic;
	    $scope.z_value = parseFloat(table[0][table[0].length-1]).toFixed(3);

	  //   $.each(basic, function(index, value) {
		 //    console.log(value);
			// }); 

		}

		

});

function calcSimplex(table) {
 
	// Pega o menor valor negativo da linha Z (linha 1)
	min = Math.min.apply(Math, table[0]); //Pega o valor mínimo da linha
	var min_key = table[0].indexOf(min); //Pega a key da coluna que entra
	
	// Agora pega o valor b da coluna e divide pelo valor da coluna que entra(min_key)
	var temp=10000000;
	var key_pivo=0;
	// console.log("valor do id coluna = "+min_key);
  for (var i=1; i<table.length; i++) { 
		// Pega o ultimo valor da linha e divide pelo min_key
		var value = table[i][table[i].length-1]/table[i][min_key];
		if (value > 0 && value < temp) {
			temp = value;
			key_pivo = i;
		}
  }
  // console.log(temp); //Mostra o valor da divisão do pivo
  // alert(key_pivo); //Mostra a key do pivo

  // console.log("Valor do do id da linha = "+ key_pivo);
  var pivo_value = table[key_pivo][min_key];
  //Pega todos os elementos da linha pivo e divide pelo valor do pivo
  for (var i=0; i<table[key_pivo].length; i++) {
  	// console.log(table[key_pivo][i]+"/"+pivo_value);
  	table[key_pivo][i] = table[key_pivo][i]/pivo_value;
  }

  $("#table_show2").html("");
	var table_show2 = document.getElementById("table_show2");
  for (var i=0; i<table.length; i++) { 
    var row = table_show2.insertRow(); //linha
    for (var j=0; j<table[i].length; j++) {
      var cell = row.insertCell(); //coluna
      cell.appendChild(document.createTextNode(parseFloat(table[i][j]).toFixed(3)));
    }
  }

	// Cria uma nova table com os valores antigos
	table_temp = [];
  for (var i=0; i<table.length; i++) { 
		var cell = [];
    for (var j=0; j<table[i].length; j++) {
      cell.push(table[i][j]);
    }
    table_temp.push(cell);
  }
  // console.log(table_temp);

 	for (var i=0; i<table.length; i++) { 
    if (i!=key_pivo) {
    	for (var j=0; j<table[i].length; j++) {
    		table[i][j]=(table[key_pivo][j]*((table_temp[i][min_key])*-1))+table_temp[i][j];
    		// console.log((table[key_pivo][j]+"*"+((table_temp[i][min_key])*-1))+"+"+table_temp[i][j]);
    	}
    }
  }

  $("#table_show3").html("");
	var table_show3 = document.getElementById("table_show3");
  for (var i=0; i<table.length; i++) { 
    var row = table_show3.insertRow(); //linha
    for (var j=0; j<table[i].length; j++) {
      var cell = row.insertCell(); //coluna
      cell.appendChild(document.createTextNode(parseFloat(table[i][j]).toFixed(3)));
    }
  }

	return table;
}