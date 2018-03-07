using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ClassLibrary;

namespace HPRequest.Controllers
{
    public class LogInController : Controller
    {
        // GET: LogIn
        public ActionResult Index()
        {
            @ViewBag.title = "HP Request System";
            @ViewBag.UrlImgHeader = "img/photos/photo3@2x.jpg";

            return View("LogIn");
        }
    }
}