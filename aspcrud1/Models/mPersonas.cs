﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Data.SqlClient;
using System.Web;

namespace aspcrud1.Models
{
    public class mPersonas
    {
        SqlClass miSqlClass = new SqlClass();

        public int Id { get; set; }
        public string Nombre { get; set; }
        public string ApellidoP { get; set; }
        public string ApellidoM { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public int Estatus { get; set; }

        List<mPersonas> lsPersonas = new List<mPersonas>();

        public List<mPersonas> obtenerPersonas(int Estatus)
        {
            DataTable dtTemp = new DataTable();
            dtTemp.CaseSensitive = true;
            miSqlClass.conectar();

            string consulta = "SELECT Id, CONCAT(Nombres, ' ', ApellidoP, ' ', ApellidoM) Nombre, Telefono, Direccion, Estatus " +
                              "FROM Personas_Daniel";

            if (Estatus != 2)
            {
                consulta += " WHERE Estatus = '" + Estatus + "'";
            }

            consulta += " ORDER BY Id ASC";

            var a = miSqlClass.SqlConsulta(consulta, ref dtTemp);

            List<mPersonas> miLista = (from rw in dtTemp.AsEnumerable()
                                       select new mPersonas
                                       {
                                           Id = Convert.ToInt32(rw["Id"]),
                                           Nombre = Convert.ToString(rw["Nombre"]),
                                           Telefono = Convert.ToString(rw["Telefono"]),
                                           Direccion = Convert.ToString(rw["Direccion"]),
                                           Estatus = Convert.ToInt32(rw["Estatus"])
                                       }).OrderBy(persona => persona.Id).ToList();

            return miLista;
        }


        public List<mPersonas> obtenerPersonasBusqueda(string Busqueda)
        { //obtiene todas las personas de la base de datos

            DataTable dtTemp = new DataTable();
            dtTemp.CaseSensitive = true;
            miSqlClass.conectar();

            var a = miSqlClass.SqlConsulta("SELECT Id, CONCAT(Nombres, ' ',ApellidoP,' ',ApellidoM) Nombre, Telefono, Direccion, Estatus" +
                           "  FROM Personas_Daniel" +
                           " WHERE Nombres LIKE '%" + Busqueda + "%'" +
                           " OR ApellidoP LIKE '%" + Busqueda + "%'" +
                           " OR ApellidoM LIKE '%" + Busqueda + "%'" , ref dtTemp);

            List<mPersonas> miLista = new List<mPersonas>();

            miLista = (from rw in dtTemp.AsEnumerable()
                       select new mPersonas
                       {
                           Id = Convert.ToInt32(rw["Id"]),
                           Nombre = Convert.ToString(rw["Nombre"]),
                           Telefono = Convert.ToString(rw["Telefono"]),
                           Direccion = Convert.ToString(rw["Direccion"]),
                           Estatus = Convert.ToInt32(rw["Estatus"])
                       }).ToList();
            return miLista;
        }

        public bool insertPersona(mPersonas newPersona)
        {

            miSqlClass.conectar();

            miSqlClass.SqlConsulta(" INSERT INTO Personas_Daniel (Nombres, ApellidoP, ApellidoM, Direccion, Telefono, Estatus) VALUES ('" + newPersona.Nombre + "','" + newPersona.ApellidoP+
                "','" + newPersona.ApellidoM + "','" + newPersona.Direccion + "','" + newPersona.Telefono + "', 1)");

            return true;

        }

        public List<mPersonas> obtenrPersonaDetalles(int Id)
        {
            DataTable dtTemp = new DataTable();
            dtTemp.CaseSensitive = true;
            miSqlClass.conectar();

            var a = miSqlClass.SqlConsulta("SELECT Id, Nombres, ApellidoP, ApellidoM, Direccion, Telefono, Estatus FROM Personas_Daniel WHERE Id = " + Id, ref dtTemp);

            List<mPersonas> miLista = new List<mPersonas>();

            miLista = (from rw in dtTemp.AsEnumerable()
                       select new mPersonas
                       {
                           Id = Convert.ToInt32(rw["Id"]),
                           Nombre = Convert.ToString(rw["Nombres"]),
                           ApellidoP = Convert.ToString(rw["ApellidoP"]),
                           ApellidoM = Convert.ToString(rw["ApellidoM"]),
                           Direccion = Convert.ToString(rw["Direccion"]),
                           Telefono = Convert.ToString(rw["Telefono"]),
                           Estatus = Convert.ToInt32(rw["Estatus"])
                       }).ToList();
            return miLista;
        }


        public bool EditarPersona(mPersonas newPersona)
        {
            miSqlClass.conectar();
            var a = miSqlClass.SqlConsulta("UPDATE Personas_Daniel SET Nombres = '" + newPersona.Nombre + "', ApellidoP = '" + newPersona.ApellidoP + "', ApellidoM = '" + newPersona.ApellidoM +
                "', Direccion = '" + newPersona.Direccion + "', Telefono = '" + newPersona.Telefono + "' WHERE Id = " + newPersona.Id);

            return true;
        }


        public bool EliminarPersona(int Id)
        {
            miSqlClass.conectar();
            miSqlClass.SqlConsulta(" UPDATE Personas_Daniel SET Estatus = '0' WHERE Id = '" + Id + "'");
            return true;
        }

        public bool ReactivarPersona(int Id)
        {
            miSqlClass.conectar();
            miSqlClass.SqlConsulta(" UPDATE Personas_Daniel SET Estatus = '1' WHERE Id = '" + Id + "'");
            return true;
        }
    }
}