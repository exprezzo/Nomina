using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Nomina.Models;
using System.Web.Script.Serialization;
using System.IO;
using System.Text;

namespace Nomina.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Home()
        {
            return View();
        }

        public JsonResult listar(int limit, int start)
        {
            MARPAC_PruebaEntities corp = new MARPAC_PruebaEntities();
            List<Dictionary<string, object>> datos = new List<Dictionary<string, object>>();
            
            var a = corp.RegimenesFiscales.ToList().Skip(start).Take(limit);// paginado
            var total = corp.RegimenesFiscales.Count();
            foreach (var item in a)
            {
                Dictionary<string, object> elemento = new Dictionary<string, object>();
                elemento["CodigoRegimen"] = item.CodigoRegimen;
                elemento["NombreRegimen"] = item.NombreRegimen;
                elemento["PideCURP"] = item.PideCURP;
                elemento["Activo"] = item.Activo;
                datos.Add(elemento);
            }

            Dictionary<string, object> resultado = new Dictionary<string, object>();
            resultado["success"] = true;
            resultado["msg"] = "Datos servidos y alborotados";
            resultado["total"] = total;
            resultado["datos"] = datos;
            return this.Json(resultado);
        }


        public JsonResult obtener(int codigoRegimen)
        {
            MARPAC_PruebaEntities corp = new MARPAC_PruebaEntities();
            Dictionary<string, object> elemento = new Dictionary<string, object>();
            elemento = new Dictionary<string, object>();
            Dictionary<string, object> data = new Dictionary<string, object>();
            var regimen = corp.RegimenesFiscales.SingleOrDefault(a => a.CodigoRegimen == codigoRegimen);
            data["CodigoRegimen"] = regimen.CodigoRegimen;
            data["NombreRegimen"] = regimen.NombreRegimen;
            data["PideCURP"] = regimen.PideCURP;
            data["Activo"] = regimen.Activo;

            elemento["success"] = true;
            elemento["data"] = data;
            return this.Json(elemento);
        }

        public JsonResult guardar12(int CodigoRegimen, string NombreRegimen, string PideCURP, string Activo)
        {
            MARPAC_PruebaEntities corp = new MARPAC_PruebaEntities();
            Dictionary<string, object> elemento = new Dictionary<string, object>();
            elemento = new Dictionary<string, object>();
            Dictionary<string, object> data = new Dictionary<string, object>();
            RegimenesFiscale regimen = corp.RegimenesFiscales.SingleOrDefault(a => a.CodigoRegimen == CodigoRegimen);
            regimen.CodigoRegimen = CodigoRegimen;
            regimen.NombreRegimen = NombreRegimen;
            regimen.PideCURP = PideCURP;
            regimen.Activo = Activo;
            corp.SaveChanges();

            elemento["success"] = true;
            return this.Json(elemento);
        }

        public JsonResult guardar(string datos)
        {
            MARPAC_PruebaEntities corp = new MARPAC_PruebaEntities();

            var jsSerializer = new JavaScriptSerializer();
            RegimenesFiscale myPerson = jsSerializer.Deserialize<RegimenesFiscale>(datos);
            
            Dictionary<string, object> elemento = new Dictionary<string, object>();
            elemento = new Dictionary<string, object>();
            RegimenesFiscale regimen = corp.RegimenesFiscales.SingleOrDefault(a => a.CodigoRegimen == myPerson.CodigoRegimen);
            regimen.CodigoRegimen = myPerson.CodigoRegimen;
            regimen.NombreRegimen = myPerson.NombreRegimen;
            regimen.PideCURP = myPerson.PideCURP;
            regimen.Activo = myPerson.Activo;
            corp.SaveChanges();

            elemento["success"] = true;
            return this.Json(elemento);
        }


        public JsonResult eliminar()
        {
            MARPAC_PruebaEntities corp = new MARPAC_PruebaEntities();
            Dictionary<string, object> elemento = new Dictionary<string, object>();
            elemento = new Dictionary<string, object>();
            Dictionary<string, object> data = new Dictionary<string, object>();


            elemento["success"] = true;

            return this.Json(elemento);
        } 



    }
}
