using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HPRequest.Controllers
{
    public class ParentController : Controller
    {
        // GET: Parent
        public string ConnStrHPDataBase = ConfigurationManager.ConnectionStrings["ConnStrHPDataBase"].ConnectionString;
        public string ConnStrGOFCUU = ConfigurationManager.ConnectionStrings["ConnStrGOFCUU"].ConnectionString;

    }
}