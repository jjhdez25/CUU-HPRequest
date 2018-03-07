using System.Web;
using System.Web.Optimization;

namespace HPRequest.App_Start
{
    public class BundleConfig
    {
        //To use install "Install-Package Microsoft.AspNet.Web.Optimization" NuGetPackage
        //Add this file in app_start folder
        //Add using System.Web.Optimization; and BundleConfig.RegisterBundles(BundleTable.Bundles); in Global.asax
        //Add <add namespace="System.Web.Optimization" /> in web.Config inside Views folder
        //restart visual studio
        public static void RegisterBundles(BundleCollection bundles)
        {
            //Core
            bundles.Add(new ScriptBundle("~/bundles/CoreJs").Include(
                "~/scripts/Core/jquery.min.js",
                "~/scripts/Core/bootstrap.min.js",
                "~/scripts/Core/navbar.js",
                "~/scripts/Core/sweetalert.min.js"));

            bundles.Add(new StyleBundle("~/Content/CoreCss").Include(
                     "~/css/Core/bootstrap.min.css",
                     "~/css/Core/jabilbootstrap.css",
                     "~/css/Core/Styles.css",
                     "~/css/Core/myStyle.css",
                     "~/css/Core/sweetalert.min.css"));

            //DataTables
            bundles.Add(new ScriptBundle("~/bundles/DataTables").Include(
                      "~/scripts/DataTables/jquery.dataTables.min.js",
                      "~/scripts/DataTables/dataTables.bootstrap.min.js",
                      "~/scripts/DataTables/dataTables.buttons.min.js",
                      "~/scripts/DataTables/buttons.bootstrap.min.js",
                      "~/scripts/DataTables/scriptzip.min.js",
                      "~/scripts/DataTables/pdfmake.min.js",
                      "~/scripts/DataTables/vfs_fonts.js",
                      "~/scripts/DataTables/buttons.html5.min.js",
                      "~/scripts/DataTables/buttons.print.min.js"));

            bundles.Add(new StyleBundle("~/Content/Datatables").Include(
                      "~/css/DataTables/buttons.bootstrap.min.css",
                      "~/css/DataTables/dataTables.bootstrap.min.css"));

            //JQueryScroll
            bundles.Add(new ScriptBundle("~/bundles/JQueryScroll").Include(
                      "~/scripts/JQueryScroll/jquery.slimscroll.min.js",
                      "~/scripts/JQueryScroll/jquery.scrollLock.min.js",
                      "~/scripts/JQueryScroll/jquery.placeholder.min.js",
                      "~/scripts/JQueryScroll/app.js"));

            //DatePicker
            bundles.Add(new ScriptBundle("~/bundles/DatePicker").Include("~/scripts/DatePicker/flatpickr2-3-4.js"));
            bundles.Add(new StyleBundle("~/Content/DatePicker").Include("~/css/flatpickr.min.css"));
        }
    }
}