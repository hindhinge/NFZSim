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
    public class DrugController : ControllerBase
    {
        static string password = LoginController.credentials.AdminPassword;
        static string login = LoginController.credentials.AdminLogin;
        static string userLogin = "User ID = " + login + ";";
        static string userPassword = "Password = " + password + ";";
        static string connectionString = "Data Source = localhost\\SQLEXPRESS; Initial Catalog = main;" + userLogin + userPassword;
        public List<string> getDrugsFromDB()
        {
            List<string> output = new List<string>();
            string query;
            string selectString = "SELECT * FROM dbo.Drugs ";
            string whereString = "";
            string likeString = "";
            string orderString = "ORDER BY dbo.Drugs.Id ASC";
            query = selectString + whereString + likeString + orderString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                //command.Parameters.AddWithValue("@id", id);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
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


        [HttpGet]
        [Route("[action]")]
        public IEnumerable<Drug> DrugData()
        {
            List<string> dbResult = getDrugsFromDB();
            int dbResult_length = dbResult.Count();
            List<Int32> DId = new List<Int32>();
            List<Int32> PId = new List<Int32>();
            List<string> DName = new List<string>();
            for (int i = 0; i < dbResult_length; i++)
            {
                string[] splitstring = dbResult[i].Split(",");
                DId.Add(Int32.Parse(splitstring[0]));
                PId.Add(Int32.Parse(splitstring[1]));
                DName.Add(splitstring[2]);
            }

            return Enumerable.Range(0, dbResult_length).Select(index => new Drug
            {
                DrugId = DId[index],
                PatientId = PId[index],
                DrugName = DName[index]
            })
        .ToArray();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<Drug> DrugAdd([FromBody]Drug data)
        {
            string values = "('" + data.DrugName+ "',"+data.PatientId+")";
            string query = "INSERT INTO dbo.Drugs(DrugName,PatientId) VALUES " + values;
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

        [HttpDelete]
        [Route("[action]")]
        public object DrugDelete([FromQuery]int id)
        {
            string query = "DELETE FROM dbo.Drugs WHERE dbo.Drugs.Id = " + id;
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
