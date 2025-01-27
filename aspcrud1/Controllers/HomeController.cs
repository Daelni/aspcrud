﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using aspcrud1.Models;


namespace aspcrud1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult TablaPersonas(int Filtro)
        {
            mPersonas Persona = new mPersonas();

            var x = Persona.obtenerPersonas(Filtro);
            return Json(x);
        }

        public JsonResult TablaPersonasbusqueda(string Busqueda)
        
        {
            mPersonas Persona = new mPersonas();

            var x = Persona.obtenerPersonasBusqueda(Busqueda);
            return Json(x);
        }

        public JsonResult Guardar(mPersonas newPersona)
        {

            mPersonas Persona = new mPersonas();

            var x = Persona.insertPersona(newPersona);
            return Json(x);

        }

        public JsonResult DetallesPersona(int Id)
        {
            mPersonas Persona = new mPersonas();

            var x = Persona.obtenrPersonaDetalles(Id);
            return Json(x);
        }

        public JsonResult Editar(mPersonas newPersona)
        {
            mPersonas Persona = new mPersonas();
            var x = Persona.EditarPersona(newPersona);
            return Json(x);
        }

        public JsonResult Eliminar(int Id)
        {
            mPersonas Persona = new mPersonas();
            var x = Persona.EliminarPersona(Id);
            return Json(x);
        }

        public JsonResult Reactivar(int Id)
        {
            mPersonas Persona = new mPersonas();
            var x = Persona.ReactivarPersona(Id);
            return Json(x);
        }

        public JsonResult CrearClientes(mPersonas newPersona)
        {

            mPersonas Persona = new mPersonas();
            var x = Persona.insertPersona(newPersona);
            return Json(x);
        }
    }
}