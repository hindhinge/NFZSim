using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Net.Http;
using System.Net;
using System.Text.Json;

namespace ReactTest1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PatientController : ControllerBase
    {
        private static readonly int patientAtributes = 5;
        static string password = LoginController.credentials.AdminPassword;
        static string login = LoginController.credentials.AdminLogin;
        static string userLogin = "User ID = " + login + ";";
        static string userPassword = "Password = " + password + ";";
        static string connectionString = "Data Source = localhost\\SQLEXPRESS; Initial Catalog = main;" + userLogin + userPassword;

        public List<string> getPatientsFromDB(int sorttype, int field, string value)
        {
            List<string> output = new List<string>();
            string query;
            string selectString = "SELECT * FROM dbo.Patients ";
            string whereString = "";
            string likeString = "";
            string orderString = "";
            switch (field)
            {
                case 1:
                    whereString = "WHERE dbo.Patients.Id ";
                    break;
                case 2:
                    whereString = "WHERE dbo.Patients.PatientName ";
                    break;
                case 3:
                    whereString = "WHERE dbo.Patients.PatientSurname ";
                    break;
                case 4:
                    whereString = "WHERE dbo.Patients.PatientPhone ";
                    break;
                case 5:
                    whereString = "WHERE dbo.Patients.PatientMail ";
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
                likeString = "LIKE '" + value + "' ";
            }
            switch (sorttype)
            {
                case 0:
                    orderString = "ORDER BY dbo.Patients.Id ASC";
                    break;
                case 1:
                    orderString = "ORDER BY dbo.Patients.PatientName ASC";
                    break;
                case 2:
                    orderString = "ORDER BY dbo.Patients.PatientSurname ASC";
                    break;
                case 3:
                    orderString = "ORDER BY dbo.Patients.PatientPhone ASC";
                    break;
                case 4:
                    orderString = "ORDER BY dbo.Patients.PatientMail ASC";
                    break;
                default:
                    orderString = "";
                    break;
            }
            query = selectString + whereString + likeString + orderString;
            int id = 2;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                //command.Parameters.AddWithValue("@id", id);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                int i = 0;
                while (reader.Read())
                {
                    string[] stringarray = new string[5];
                    stringarray[0] = reader[0].ToString();
                    stringarray[1] = reader[1].ToString();
                    stringarray[2] = reader[2].ToString();
                    stringarray[3] = reader[3].ToString();
                    stringarray[4] = reader[4].ToString();
                    string outputString = string.Join(",", stringarray);
                    output.Add(outputString);
                }

            }
            return output;
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<Patient> PatientData([FromQuery]int sorttype, [FromQuery]int field, [FromQuery] string value)
        {
            List<string> dbResult = getPatientsFromDB(sorttype, field, value);
            int dbResult_length = dbResult.Count();
            List<Int32> PId = new List<Int32>();
            List<string> PName = new List<string>();
            List<string> PSurname = new List<string>();
            List<Int32> PPhone = new List<Int32>();
            List<string> PMail = new List<string>();
            for (int i = 0; i < dbResult_length; i++)
            {
                string[] splitstring = dbResult[i].Split(",");
                PId.Add(Int32.Parse(splitstring[0]));
                PName.Add(splitstring[1]);
                PSurname.Add(splitstring[2]);
                PPhone.Add(Int32.Parse(splitstring[3]));
                PMail.Add(splitstring[4]);
            }

            return Enumerable.Range(0, dbResult_length).Select(index => new Patient
            {
                PatientId = PId[index],
                PatientName = PName[index],
                PatientSurname = PSurname[index],
                PatientPhone = PPhone[index],
                PatientMail = PMail[index]
            })
        .ToArray();
        }

        [HttpGet]
        [Route("[action]")] //sorttype = by what param we sort, field = by which sort we filter, value = value of field to filter
        public IEnumerable<Patient> PatientDataParamSort([FromQuery]int sorttype, [FromQuery]int field, [FromQuery]string value)
        {
            IEnumerable<Patient> output;
            output = PatientData(sorttype, field, value);
            return output;

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<Patient> PatientAdd([FromBody]Patient data)
        {
            string values = "('" + data.PatientName + "','" + data.PatientSurname + "'," + data.PatientPhone + ",'" + data.PatientMail + "')";
            string query = "INSERT INTO dbo.Patients(PatientName,PatientSurname,PatientPhone,PatientMail) VALUES " + values;
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

        [HttpPost]
        [Route("[action]")]
        public Patient PatientUpdate([FromBody]Patient data)
        {
            string updateString = "UPDATE dbo.Patients SET ";
            string setString = "dbo.Patients.PatientName ='"+data.PatientName+ "',dbo.Patients.PatientSurname='"+data.PatientSurname+ "',dbo.Patients.PatientPhone="+data.PatientPhone+ ",dbo.Patients.PatientMail='"+data.PatientMail+"' ";
            string whereString = "WHERE dbo.Patients.Id=" + data.PatientId;
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
        public object PatientDelete([FromQuery]int id)
        {
            string query = "DELETE FROM dbo.Patients WHERE dbo.Patients.Id = " + id;
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