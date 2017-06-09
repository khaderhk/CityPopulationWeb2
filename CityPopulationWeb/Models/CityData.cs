using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CityPopulationWeb.Models
{
    public class CityData
    {
        public string city { get; set; }
        public double[] loc { get; set; }
        public int pop { get; set; }
        public string  state { get; set; }
        public int _id { get; set; }
    }
}
