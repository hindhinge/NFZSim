using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTest1
{
    public class Reminder
    {
        public Int32 VisitId { get; set; }
        public Int32 PatientId{ get; set; }
        public string PatientName { get; set; }
        public string PatientSurname { get; set; }
        public Int32 DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string DoctorSurname { get; set; }
        public string VisitDate{ get; set; }

    }
}