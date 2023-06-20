
var idPersona;

var editt = false;

//// Evento para el botón "Guardar cambios" / "Agregar persona"
$('#btnGuardar').on('click', function () {
	if (editt === false) {
		console.log("gualdar");
		guardarPersonas(); // Ejecutar la función de inserción
	} else {
		console.log("edit go");
		// Obtener los valores de los campos de entrada
		var id = idPersona;
		var nombre = $("#inputNombre").val();
		var apellidoP = $("#inputApellidoP").val();
		var apellidoM = $("#inputApellidoM").val();
		var direccion = $("#inputDireccion").val();
		var telefono = $("#inputTelefono").val();

		// Crear un objeto con los datos a enviar al servidor
		var persona = {
			Id: id,
			Nombre: nombre,
			ApellidoP: apellidoP,
			ApellidoM: apellidoM,
			Direccion: direccion,
			Telefono: telefono
		};

		console.log(persona);
		// Llamar a la función sendPersonaEdit para guardar los cambios
		sendPersonaEdit(persona);
	}
});

$(function () {

	loadData();

});


var state = {

	auxId: 0,
	editar: false

};

function ErrorLog(message, description) {
	console.error(message + ": " + description);
}

$(document).ready(function () {
	
});

var error = "Ocurrió un error insesperado en el sitio, por favor intentelo mas tarde o pongase en contacto con su administrador.";
var success = "La accion se ralizó con exito";
var datosIncorrectos = "Datos incorrectos, vuelve a intentarlo.";

// Función para guardar el ID de la persona en la variable global idPersona
function guardarIdPersona(id) {
	idPersona = id;
	console.log("idPersona actualizada: " + idPersona);
}
// Función para guardar el ID de la persona en la vaiable global para Reactivar
function guardarIdReactivar(id) {
	idPersona = id;
	console.log("idPersona actualizada: " + idPersona);
	reactivar(idPersona); // Llamar a la función reactivar con el ID guardado
}

function loadData() {
	var filtro = $('#select_status').val();

	$.ajax({
		url: SITE_URL + '/Home/TablaPersonas',
		type: 'POST',
		data: { Filtro: filtro },
		dataType: 'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
			$("#tbody").empty();
		},
		error: function (error) {
			console.log(error);
			MsgAlerta("Error!", error, 3000, "error");
			LoadingOff();
		},
		success: function (data) {
			console.log(data);
			LoadingOff();

			if (data != "") {

				var TablaPersonas = "";
				console.log(data)
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
						TablaPersonas += '<button class="btn btn-danger" onclick="eliminar(' + data[i].Id + ')" title="Eliminar" type="">' +
							'<i class="fa fa-trash" aria-hidden="true"></i>' +
							'</button>' +
							'<button class="btn btn-primary" onclick="detalles(' + data[i].Id + ')"  title="Ver Detalles" type="">Ver detalles' +
							'</button></td></tr>';
					}
					if (data[i].Estatus == 0) {
						TablaPersonas += '<button class="btn btn-success" onclick="guardarIdReactivar(' + data[i].Id + ')" title="Reactivar" type="">Reactivar</button></td></tr>';
					}
				}

				$('#tbody').html(TablaPersonas);
			}
			else {
				MsgAlerta("Atencion!", "No hay personas para mostrar", 5000, "warning");
			}
		}
	});
}

function detalles(id) {
	editt = true;
	guardarIdPersona(id);

	$.ajax({
		url: SITE_URL + '/Home/DetallesPersona',
		type: 'POST',
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {
			LoadingOn("Obteniendo detalles...");
		},
		error: function (error) {
			MsgAlerta("Error!", error, 5000, "error");
			LoadingOff();
		},
		success: function (data) {
			LoadingOff();
			console.log(data);

			if (data != "") {
				$("#inputNombre").val(data[0].Nombre);
				$("#inputApellidoP").val(data[0].ApellidoP);
				$("#inputApellidoM").val(data[0].ApellidoM);
				$("#inputDireccion").val(data[0].Direccion);
				$("#inputTelefono").val(data[0].Telefono);

				$('#lblAddPersonas').text('Editar Persona');
				$('#btncerrarPersonas').text('Cancelar');
				$('#btnGuardar').text('Guardar Cambios');

				$('#ModalAgregarPersonas').modal('show');
			} else {
				MsgAlerta("Atencion!", "No hay personas para mostrar", 5000, "warning");
			}
		}
	});
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

			sendPersona(info);
		} else {
			console.log(json.camposInvalidos);
			MsgAlerta("¡Atención!", "Llenar campos faltantes", 3000, "warning");
		}
	});
			console.log("si llego: ");
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
		success: function (data) {
			if (data) {

				LoadingOff();
				LimpiarPersonasForm();

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

function sendPersonaEdit(persona) {
	$.ajax({
		type: 'POST',
		contentType: "application/x-www-form-urlencoded",
		url: SITE_URL + '/Home/Editar',
		data: persona,
		dataType: 'JSON',
		beforeSend: function () {
			LoadingOn("Espere...");
		},
		success: function (data) {
			if (data) {
				LoadingOff();
				LimpiarPersonasForm();
				MsgAlerta("Realizado!", "Registro Guardado", 3000, "success");
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
	});
}

function eliminar(id) {
	console.log("Valor de id:", id); // Imprime el valor de id en la consola

	$.ajax({
		type: 'POST',
		contentType: "application/x-www-form-urlencoded",
		url: SITE_URL + '/Home/Eliminar',
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {
			LoadingOn("Espere...");
		},
		success: function (data) {

			if (data) {

				LoadingOff();

				MsgAlerta("Realizado!", "Registro Eliminado", 3000, "success");

				loadData();

			} else {
				ErrorLog("Error", " Error controlado");
				LoadingOff();
			}
		},
		error: function (error) {
			ErrorLog(error.responseText, "Error de comunicación, verifica tu conexión y vuelve a intentarlo.");
			LoadingOff();
		}
	});
}

function reactivar(id) {
	console.log("Valor de id:", id); // Imprime el valor de id en la consola

	$.ajax({
		type: 'POST',
		contentType: "application/x-www-form-urlencoded",
		url: SITE_URL + '/Home/Reactivar',
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {
			LoadingOn("Espere...");
		},
		success: function (data) {

			if (data) {

				LoadingOff();

				MsgAlerta("Realizado!", "Registro Activado", 3000, "success");

				loadData();

			} else {
				ErrorLog("Error", " Error controlado");
				LoadingOff();
			}
		},
		error: function (error) {
			ErrorLog(error.responseText, "Error de comunicación, verifica tu conexión y vuelve a intentarlo.");
			LoadingOff();
		}
	});
}


$(document).on('change', '#select_status', function (e) {
	loadData();
});


$(document).on('keyup', '#txt_busqueda', function (e) {

	$.ajax({
		url: SITE_URL + '/Home/TablaPersonasbusqueda',
		type: 'POST',
		async: false,
		data: { Busqueda: $(this).val() },
		dataType: 'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
			$("#tbody").empty();

		},
		error: function (error) {
			//console.log(error);
			MsgAlerta("Error!", error, 5000, "error");
			LoadingOff();
		},
		success: function (data) {
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
					TablaPersonas += '<td class="d-flex justify-content-center">' + data[i].Estatus + '</td>';
					TablaPersonas += '<td>';
					if (data[i].Estatus == 1) {
						TablaPersonas += `
			   			<button class="btn btn-danger" onclick="eliminar(`+ data[i].Id + `)" title="Eliminar" type="">Eliminar
			   			</button>
			   			<button class="btn btn-primary" onclick="detalles(`+ data[i].Id + `)"  title="Ver detalles" type="">Ver detalles
               	    	</button></tr>s`;
					} else if (data[i].Estatus === 0) {
						TablaPersonas += `
			   			<button class="btn btn-secondary" onclick="reactivar(`+ data[i].Id + `)" title="Reactivar usuario" type="">Reactivar usuario
			   			</button> `
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


//Función Restablecer Modal
function LimpiarPersonasForm() {

	document.getElementById('lblAddPersonas').innerHTML = "";

	$(".vfper").val("");

	state.auxId = 0;
	state.editar = false;

	$(".is-invalid").removeClass('is-invalid');

}

//Abrir el modal para agregar Persona
$(document).on('click', '#btn_new', function (e) {
	editt = false;
	console.log('este es el valor de editt: ' + editt);
	e.preventDefault();

	console.log('me ejecuto')
	LimpiarPersonasForm();
	document.getElementById('lblAddPersonas').innerHTML = "Nuevo Registro";
	$('#ModalAgregarPersonas').modal('show');
	$('#btnGuardar').text('Guardar');

});

//Botón cerrar modal
function cerrarModal() {
	LimpiarPersonasForm();
	$('#ModalAgregarPersonas').modal('hide');
}

//funcion que valida el formulario de agregar Persona
function validarFormulario(formSelector, callback) {

	var campos = [
		"inputNombre",
		"inputApellidoP",
		"inputApellidoM",
		"inputDireccion",
		"inputTelefono"
	];

	var camposInvalidos = [];

	campos.forEach(function (campo) {
		var valor = $("#" + campo).val().trim();
		if (valor === "") {
			camposInvalidos.push(campo);
			$("#" + campo).addClass("is-invalid");
		} else {
			$("#" + campo).removeClass("is-invalid");
		}
	});

	if (camposInvalidos.length > 0) {
		callback({ bool: false, camposInvalidos: camposInvalidos });
	} else {
		callback({ bool: true });
	}
}