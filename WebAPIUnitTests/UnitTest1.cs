using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using CityPopulationWeb.Controllers;
using CityPopulationWeb.Models;

namespace WebAPIUnitTests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            CityDataController ctrl = new CityDataController();
            CityData cityDt = new CityData();
            cityDt.city = "TAMPA";
            cityDt._id = 33635;
            cityDt.loc = new double[2] { -82.604822, 28.03013 };
            cityDt.pop = 8000;
            cityDt.state = "FL";

            Assert.AreEqual(true, ctrl.UpdatePopulation(cityDt));
        }
    }
}
