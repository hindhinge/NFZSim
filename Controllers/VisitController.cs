using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Data.SqlClient;
using NFZsim;

namespace ReactTest1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VisitController : ControllerBase
    {
        static string password = LoginController.credentials.AdminPassword;
        static string login = LoginController.credentials.AdminLogin;
        static string userLogin = "User ID = " + login + ";";
        static string userPassword = "Password = " + password + ";";
        static string connectionString = "Data Source = localhost\\SQLEXPRESS; Initial Catalog = main;" + userLogin + userPassword;
        public List<string> getDoctorsFromDB()
        {
            List<string> output = new List<string>();
            //string query = "SELECT PatientName,PatientSurname FROM dbo.Patients WHERE id = @id";
            string query;
            string selectString = "SELECT Id,DoctorName,DoctorSurname,DoctorSpecialization FROM dbo.Doctors ";
            string whereString = "";
            string likeString = "";
            string orderString = "";
            query = selectString + whereString + likeString + orderString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                int i = 0;
                while (reader.Read())
                {
                    string[] stringarray = new string[4];
                    stringarray[0] = reader[0].ToString();
                    stringarray[1] = reader[1].ToString();
                    stringarray[2] = reader[2].ToString();
                    stringarray[3] = reader[3].ToString();
                    string outputString = string.Join(",", stringarray);
                    output.Add(outputString);
                }

            }
            return output;
        }
        public List<string> getPatientsFromDB()
        {
            List<string> output = new List<string>();
            //string query = "SELECT PatientName,PatientSurname FROM dbo.Patients WHERE id = @id";
            string query;
            string selectString = "SELECT Id,PatientName,PatientSurname FROM dbo.Patients ";
            string whereString = "";
            string likeString = "";
            string orderString = "";
            query = selectString + whereString + likeString + orderString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                int i = 0;
                while (reader.Read())
                {
                    string[] stringarray = new string[3];
                    stringarray[0] = reader[0].ToString();
                    stringarray[1] = reader[1].ToString();
                    stringarray[2] = reader[2].ToString();
                    string outputString = string.Join(",", stringarray);
                    output.Add(outputString);
                }

            }
            return output;
        }
        public List<string> getVisitsFromDB(int sorttype, int field, string value)
        {
            List<string> output = new List<string>();
            //string query = "SELECT PatientName,PatientSurname FROM dbo.Patients WHERE id = @id";
            string query;
            string selectString = "SELECT * FROM dbo.Visits ";
            string whereString = "";
            string likeString = "";
            string orderString = "";
            switch (field)
            {
                case 1:
                    whereString = "WHERE dbo.Visits.Id ";
                    break;
                case 2:
                    whereString = "WHERE dbo.Visits.PatientId ";
                    break;
                case 3:
                    whereString = "WHERE dbo.Visits.DoctorId ";
                    break;
                case 4:
                    whereString = "WHERE dbo.Visits.DoctorSpecialization ";
                    break;
                case 5:
                    whereString = "WHERE dbo.Visits.Date ";
                    break;
                case 6:
                    whereString = "WHERE dbo.Visits.Time ";
                    break;
                case 7:
                    whereString = "WHERE dbo.Visits.PrivateNFZ ";
                    break;
                default:
                    whereString = "";
                    break;
            }
            if (field == 0)
            {
                likeString = "";
            }
            else
            {
                if (field == 6)
                {
                    likeString = "LIKE '" + value + ".0000000' ";
                }
                else if (field == 7) {
                    likeString = "LIKE '" + value.PadRight(10) + "' ";
                }
                else
                {
                    likeString = "LIKE '" + value + "' ";
                }
            }
            switch (sorttype)
            {
                case 0:
                    orderString = "ORDER BY dbo.Visits.Id ASC";
                    break;
                case 1:
                    orderString = "ORDER BY dbo.Visits.PatientId ASC";
                    break;
                case 2:
                    orderString = "ORDER BY dbo.Visits.DoctorId ASC";
                    break;
                case 3:
                    orderString = "ORDER BY dbo.Visits.DoctorSpecialization ASC";
                    break;
                case 4:
                    orderString = "ORDER BY dbo.Visits.Date ASC";
                    break;
                case 5:
                    orderString = "ORDER BY dbo.Visits.Time ASC";
                    break;
                case 6:
                    orderString = "ORDER BY dbo.Visits.PrivateNFZ ASC";
                    break;
                case 7:
                    orderString = "ORDER BY dbo.Visits.Id DESC";
                    break;
                case 8:
                    orderString = "ORDER BY dbo.Visits.PatientId DESC";
                    break;
                case 9:
                    orderString = "ORDER BY dbo.Visits.DoctorId DESC";
                    break;
                case 10:
                    orderString = "ORDER BY dbo.Visits.DoctorSpecialization DESC";
                    break;
                case 11:
                    orderString = "ORDER BY dbo.Visits.Date DESC";
                    break;
                case 12:
                    orderString = "ORDER BY dbo.Visits.Time DESC";
                    break;
                case 13:
                    orderString = "ORDER BY dbo.Visits.PrivateNFZ DESC";
                    break;
                default:
                    orderString = "";
                    break;
            }
            query = selectString + whereString + likeString + orderString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                try
                {
                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();
                    int i = 0;
                    while (reader.Read())
                    {
                        string[] stringarray = new string[7];
                        stringarray[0] = reader[0].ToString();
                        stringarray[1] = reader[1].ToString();
                        stringarray[2] = reader[2].ToString();
                        stringarray[3] = reader[3].ToString();
                        stringarray[4] = reader[4].ToString();
                        stringarray[5] = reader[5].ToString();
                        stringarray[6] = reader[6].ToString();
                        string outputString = string.Join(",", stringarray);
                        output.Add(outputString);
                    }
                } catch (System.Data.SqlClient.SqlException)
                {
                    return output;
                }

            }
            return output;
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<Visit> VisitData([FromQuery]int sorttype, [FromQuery]int field, [FromQuery] string value)
        {
            List<string> dbResult = getVisitsFromDB(sorttype, field, value);
            int dbResult_length = dbResult.Count();
            List<Int32> VId = new List<Int32>();
            List<Int32> PId = new List<Int32>();
            List<Int32> DId= new List<Int32>();
            List<string> DSpecialization = new List<string>();
            List<string> VDate = new List<string>();
            List<string> VTime = new List<string>();
            List<string> VPrivate = new List<string>();
            for (int i = 0; i < dbResult_length; i++)
            {
                string[] splitstring = dbResult[i].Split(",");
                VId.Add(Int32.Parse(splitstring[0]));
                PId.Add(Int32.Parse(splitstring[1]));
                DId.Add(Int32.Parse(splitstring[2]));
                DSpecialization.Add(splitstring[3]);
                VDate.Add(splitstring[4].Remove(10));
                VTime.Add(splitstring[5]);
                VPrivate.Add(splitstring[6].TrimEnd(' '));
            }
            return Enumerable.Range(0, dbResult_length).Select(index => new Visit
            {
                VisitId = VId[index],
                PatientId = PId[index],
                DoctorId = DId[index],
                DoctorSpecialization = DSpecialization[index],
                VisitDate = VDate[index],
                VisitTime = VTime[index],
                VisitPrivateNFZ = VPrivate[index]
            })
        .ToArray();
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<Patient> PatientData()
        {
            List<string> dbResult = getPatientsFromDB();
            int dbResult_length = dbResult.Count();
            List<Int32> PId = new List<Int32>();
            List<string> PName = new List<string>();
            List<string> PSurname = new List<string>();
            for (int i = 0; i < dbResult_length; i++)
            {
                string[] splitstring = dbResult[i].Split(",");
                PId.Add(Int32.Parse(splitstring[0]));
                PName.Add(splitstring[1]);
                PSurname.Add(splitstring[2]);
            }

            return Enumerable.Range(0, dbResult_length).Select(index => new Patient
            { 
                PatientId = PId[index],
                PatientName = PName[index],
                PatientSurname = PSurname[index]
            })
        .ToArray();
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<Doctor> DoctorData()
        {
            List<string> dbResult = getDoctorsFromDB();
            int dbResult_length = dbResult.Count();
            List<Int32> DId = new List<Int32>();
            List<string> DName = new List<string>();
            List<string> DSurname = new List<string>();
            List<string> DSpec = new List<string>();
            for (int i = 0; i < dbResult_length; i++)
            {
                string[] splitstring = dbResult[i].Split(",");
                DId.Add(Int32.Parse(splitstring[0]));
                DName.Add(splitstring[1]);
                DSurname.Add(splitstring[2]);
                DSpec.Add(splitstring[3]);
            }

            return Enumerable.Range(0, dbResult_length).Select(index => new Doctor
            {
                DoctorId = DId[index],
                DoctorName = DName[index],
                DoctorSurname = DSurname[index],
                DoctorSpecialization = DSpec[index]
            })
        .ToArray();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<Visit> VisitAdd([FromBody]Visit data)
        {
            string values = "('" + data.PatientId + "','" + data.DoctorId + "','" + data.DoctorSpecialization + "','" + data.VisitDate + "','" + data.VisitTime + "','" + data.VisitPrivateNFZ + "')";
            string query = "INSERT INTO dbo.Visits(PatientId,DoctorId,DoctorSpecialization,Date,Time,PrivateNFZ) VALUES " + values;
            SqlDataAdapter adapter = new SqlDataAdapter();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand(query, connection);
                adapter.InsertCommand = new SqlCommand(query, connection);
                adapter.InsertCommand.ExecuteNonQuery();
                command.Dispose();
                connection.Close();
                //command.Parameters.AddWithValue("@id", id);


            }
            return data;
        }

        [HttpPost]
        [Route("[action]")]
        public Visit VisitUpdate([FromBody]Visit data)
        {
            string password = LoginController.credentials.AdminPassword;
            string login = LoginController.credentials.AdminLogin;
            string userLogin = "User ID = " + login + ";";
            string userPassword = "Password = " + password + ";";
            string connectionString = "Data Source = localhost\\SQLEXPRESS; Initial Catalog = main;" + userLogin + userPassword;
            string updateString = "UPDATE dbo.Visits SET ";
            string setString = "dbo.Visits.PatientId =" + data.PatientId +  ",dbo.Visits.DoctorId =" + data.DoctorId + ",dbo.Visits.DoctorSpecialization='" + data.DoctorSpecialization + "',dbo.Visits.Date='" + data.VisitDate + "',dbo.Visits.Time='" + data.VisitTime + "',dbo.Visits.PrivateNFZ='" + data.VisitPrivateNFZ + "' ";
            string whereString = "WHERE dbo.Visits.Id=" + data.VisitId;
            string query = updateString + setString + whereString;
            SqlDataAdapter adapter = new SqlDataAdapter();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand(query, connection);
                adapter.InsertCommand = new SqlCommand(query, connection);
                adapter.InsertCommand.ExecuteNonQuery();
                command.Dispose();
                connection.Close();
            }
            return data;
        }

        [HttpDelete]
        [Route("[action]")]
        public object VisitDelete([FromQuery]int id)
        {
            string password = LoginController.credentials.AdminPassword;
            string login = LoginController.credentials.AdminLogin;
            string userLogin = "User ID = " + login + ";";
            string userPassword = "Password = " + password + ";";
            string connectionString = "Data Source = localhost\\SQLEXPRESS; Initial Catalog = main;" + userLogin + userPassword;
            string query = "DELETE FROM dbo.Visits WHERE dbo.Visits.Id = " + id;
            SqlDataAdapter adapter = new SqlDataAdapter();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand(query, connection);
                adapter.InsertCommand = new SqlCommand(query, connection);
                adapter.InsertCommand.ExecuteNonQuery();
                command.Dispose();
                connection.Close();
            }
            return new Response
            {
                Status = "delete",
                Message = "we did it"
            };
        }
    }
}