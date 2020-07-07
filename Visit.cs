using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTest1
{
    public class Visit
    {
        public Int32 VisitId { get; set; }
        public Int32 PatientId { get; set; }
        public Int32 DoctorId { get; set; }
        public string DoctorSpecialization { get; set; }
        public string VisitDate { get; set; }
        public string VisitTime { get; set; }
        public string VisitPrivateNFZ { get; set; }


    }
}
