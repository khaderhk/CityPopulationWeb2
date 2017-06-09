using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Web.Hosting;
namespace CityPopulationWeb.Helpers
{
    public class JsonFileHelper
    {
        private static JsonFileHelper myInstance;
        private JsonFileHelper()
        {

        }

        public static JsonFileHelper Instance
        {
            get
            {
                if (myInstance == null)
                    myInstance = new JsonFileHelper();
                return myInstance;
            }
        }

        public string GetJsonStringFromFile()
        {
            string rawJsonData = string.Empty;

            if (!Directory.Exists(HostingEnvironment.MapPath("~/App_Data")))
            {
                Directory.CreateDirectory(HostingEnvironment.MapPath("~/App_Data"));
                File.WriteAllText(HostingEnvironment.MapPath("~/App_Data/zips.json"), null);
            }

            using (var jsonCitydata = new StreamReader(HostingEnvironment.MapPath("~/App_Data/zips.json")))
            {
                rawJsonData = jsonCitydata.ReadToEnd();
                jsonCitydata.Close();
            }
            return rawJsonData;
        }

        public void UpdateJsonFile(string jsonString)
        {
            if (!Directory.Exists(HostingEnvironment.MapPath("~/App_Data")))
            {
                Directory.CreateDirectory(HostingEnvironment.MapPath("~/App_Data"));
            }
            using (StreamWriter file = new StreamWriter(HostingEnvironment.MapPath("~/App_Data/zips.json")))
            {
                file.Write(jsonString);
            }
        }
    }
}