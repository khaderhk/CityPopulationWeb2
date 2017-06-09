using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CityPopulationWeb.Models;
using Newtonsoft.Json;
using CityPopulationWeb.Helpers;

namespace CityPopulationWeb.Controllers
{

    public class CityDataController : ApiController
    {
        [HttpGet]
        [Route("api/CityData/Get/")]
        public IEnumerable<CityData> Get()
        {
            return JsonConvert.DeserializeObject<List<CityData>>(JsonFileHelper.Instance.GetJsonStringFromFile());
        }

        [HttpPost]
        [Route("api/CityData/UpdatePopulation/")]
        public bool UpdatePopulation(CityData data)
        {
            bool success;
            try
            {
                var jsonData = JsonConvert.DeserializeObject<List<CityData>>(JsonFileHelper.Instance.GetJsonStringFromFile());
                jsonData.RemoveAll(m => m._id == data._id);
                jsonData.Add(data);

                JsonFileHelper.Instance.UpdateJsonFile(JsonConvert.SerializeObject(jsonData.OrderBy(m => m._id).ToList()));
                success = true;
            }
            catch
            {
                success = false;           
            }
            return success;
        }
    }
}
