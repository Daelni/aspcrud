$(function () {

	loadData();

});

var state = {

	auxId: 0,
	editar: false

};

/*$(document).ready(function () {
	$('.btn-primary').click(function () {
		$('#ModalAgregarPersonas').modal('show');
	});
});*/



var error = "Ocurrió un error insesperado en el sitio, por favor intentelo mas tarde o pongase en contacto con su administrador.";
var success = "La accion se ralizó con exito";
var datosIncorrectos = "Datos incorrectos, vuelve a intentarlo.";

function loadData(){

	var filtro = $('#select_status').val();

	$.ajax({
		url: SITE_URL +'/Home/TablaPersonas',
		type:'POST',
		data: { Filtro: filtro},
		dataType:'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
			$("#tbody").empty();
		},
		error: function(error){
			console.log(error);
			MsgAlerta("Error!", error, 3000, "error");
			LoadingOff();
		},
		success: function(data){
			//console.log(data);
			LoadingOff();

			if(data != ""){

				var TablaPersonas = "";

				for (var i = 0; i < data.length; i++) {
					//Console.log(data[i]);
					TablaPersonas += '<tr>';
					TablaPersonas += '<td>' + data[i].Id + '</td>';
					TablaPersonas += '<td>' + data[i].Nombre + '</td>';
					TablaPersonas += '<td>' + data[i].Direccion + '</td>';
					TablaPersonas += '<td>' + data[i].Telefono + '</td>';
					TablaPersonas += '<td>' + data[i].Estatus + '</td>';
					TablaPersonas += '<td>';
					if (data[i].Estatus == 1) {
						TablaPersonas += `
			   			<button class="btn btn-danger" onclick="eliminar(`+ data[i].id + `)" title="Eliminar" type="">
							<i class="fa fa-trash" aria-hidden="true"></i>
			   			</button>
			   			<button class="btn btn-primary" onclick="detalles(`+ data[i].id + `)"  title="Ver Detalles" type="">Ver detalles
               	    	</button></tr>`;
					}
					if (data[i].Estatus == 0) {
						TablaPersonas += `
						<button class="btn btn-success" onclick="reactivar(`+ data[i].Id + `)" title="Reactivar" type="">
							<i class="fa fa-check" aria-hidden"true"></i>
						</button></tr>`;
							
					}

				}

				$('#tbody').html(TablaPersonas);
			}
			else{
				MsgAlerta("Atencion!", "No hay personas para mostrar", 5000, "warning");
			}
		}
	});

}

function detalles(id){

	$.ajax({
		url: SITE_URL + '/Home/DetallesPersona',
		type: 'POST',
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");

		},
		error: function (error) {
			MsgAlerta("¡Error!", error, 3000, "error");
			LoadingOff();
		},
		success: function (data) {
			LoadingOff();

			if (data != "") {
				$("#inputNombre").val(data[0].Nombre);
				$("#inputApellidoP").val(data[0].ApellidoP);
				$("#inputApellidoM").val(data[0].ApellidoM);
				$("#inputDireccion").val(data[0].Direccion);
				$("#inputTelefono").val(data[0].Telefono);
			}
		}
	})
}

function guardarPersonas() {

	validarFormulario('.vfper', function (json) {

		if (json.bool) {

			let info = {};

			info.Nombre = $('#inputNombre').val();
			info.ApellidoP = $('#inputApellidoP').val();
			info.ApellidoM = $('#inputApellidoM').val();
			info.Direccion = $('#inputDireccion').val();
			info.Telefono = $('#inputTelefono').val();
			//console.log(info)

			if (state.editar == true) {
				info.Id = state.auxId;
				sendPersonaEdit(info);
			} else {
				sendPersona(info);
			}
		}
		else {

			MsAlerta("¡Atención!", "Llenar campos faltantes", 3000, "warning");
		}
	});
}

function sendPersona(info) {

	$.ajax({
		type: "POST",
		contentType: "application/x-www-form-urlencoded",
		url: SITE_URL + "/Home/Guardar",
		data: info,
		dataType: "JSON",
		beforeSend: function () {
			LoadingOn("Espere...");
		},
		success: function (date) {
			if (data) {

				LoadingOff();
				LimpiarPersonaForm();

				MsgAlerta("¡Realizado!", "Registro guardado", 3000, "success");
				$('#ModalAgregarPersonas').modal('hide');

				loadData();

			} else {
				ErrorLog("Error", "Error controlado");
				LoadingOff();
			}
		},
		error: function (error) {
			ErrorLog(error.responseText, "Error de comunicación, verifica tu conexión y vuelve a intentarlo.");
			LoadingOff();
		}

	})
}

function sedPersonaEdit(info) {

}

function eliminar(id){

}

function reactivar(id) {

}

$(document).on('change', '#select_status', function(e){
	loadData();
});


$(document).on('keyup', '#txt_busqueda', function (e) {

	$.ajax({
		url: SITE_URL + '/Home/TablaPersonasbusqueda',
		type:'POST',
		async: false,
		data: { Busqueda: $(this).val()},
		dataType:'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
			$("#tbody").empty();

		},
		error: function(error){
			//console.log(error);
			MsgAlerta("Error!", error, 5000, "error");
			LoadingOff();
		},
		success: function(data){
			console.log(data);
			LoadingOff();

			if (data != "") {

				var TablaPersonas = "";

				for (var i = 0; i < data.length; i++) {
					//Console.log(data[i]);
					TablaPersonas += '<tr>';
					TablaPersonas += '<td>' + data[i].Id + '</td>';
					TablaPersonas += '<td>' + data[i].Nombre + '</td>';
					TablaPersonas += '<td>' + data[i].Direccion + '</td>';
					TablaPersonas += '<td>' + data[i].Telefono + '</td>';
					TablaPersonas += '<td>' + data[i].Estatus + '</td>';
					TablaPersonas += '<td>';
					if (data[i].Estatus == 1) {
						TablaPersonas += `
			   			<button class="btn btn-danger" onclick="eliminar(`+ data[i].id + `)" title="Eliminar" type="">Eliminar
			   			</button>
			   			<button class="btn btn-primary" onclick="detalles(`+ data[i].id + `)"  title="Ver Detalles" type="">Ver detalles
               	    	</button></tr>`;
					}

				}

				$('#tbody').html(TablaPersonas);
			}
			else {
				MsgAlerta("Atencion!", "No hay personas para mostrar", 5000, "warning");
			}
		}
	});
});


// Función Restablecer Modal Disponibilidad
function LimpiarPersonasForm() {

	document.getElementById('lblAddPersonas').innerHTML = "";

	$(".vfper").val("");

	state.auxId = 0;
	state.editar = false;

	$(".is-invalid").removeClass('is-invalid');

}

//Abrir el modal para agregar Persona
$(document).on('click', '#btn_new', function (e) {

	e.preventDefault();
	LimpiarPersonasForm();
	document.getElementById('lblAddPersonas').innerHTML = "Nuevo Registro";
	$('#ModalAgregarPersonas').modal('show');

});

//Abrir el modal para agregar Persona
//$(document).on();




//funcion que valida el formulario de agregar Persona
//function validarFormulario(indentif, callback);

//function quitarInvalidClase(idClassAttr);

//function setError(element);

//function removerError(element);



