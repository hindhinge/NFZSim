using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

namespace ReactTest1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        static public Login credentials = new Login();

        [HttpGet]
        [Route("[action]")]
        public async Task<Response> Logout()
        {
            Response response = new Response();
            LoginController.credentials = new Login();
            response.Status = "LOGOUT";
            response.Message = "Logged out";
            Debug.WriteLine("Logged out");
            return response;
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<Response> AdminLogin([FromQuery]string login, [FromQuery]string password)
        {
                MD5 md5Hash = MD5.Create();   
                string hash = GetMd5Hash(md5Hash, password);

                Response response = new Response();
                string userLogin = "User ID =" + login + ";";
                string userPassword = "Password =" + password + ";";
                string connectionString = "Data Source = localhost\\SQLEXPRESS; Initial Catalog = main;" + userLogin + userPassword;
                string query = "SELECT * FROM dbo.ADMINS WHERE dbo.Admins.Login = '" + login + "' AND dbo.Admins.Password = '" + hash + "'";
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    bool correctCredentials = false;
                    try
                    {
                        SqlCommand command = new SqlCommand(query, connection);
                        connection.Open();
                        correctCredentials = true;
                    }
                    catch (SqlException ex)
                    {
                        response.Status = "DENIED";
                        response.Message = "Login failed";
                    }
                    if (correctCredentials == true)
                    {
                        SqlCommand command = new SqlCommand(query, connection);
                        SqlDataReader reader = command.ExecuteReader();
                        if (reader.Read())
                        {
                            string DBId = reader[0].ToString();
                            string DBLogin = reader[1].ToString();
                            string DBPassword = reader[2].ToString();
                            if (DBLogin == login && DBPassword == hash)
                            {
                                response.Status = "GRANTED";
                                response.Message = "Logged in succesfully";
                                LoginController.credentials.AdminId = Int32.Parse(DBId);
                                LoginController.credentials.AdminLogin = login;
                                LoginController.credentials.AdminPassword = password;
                            }
                        }
                        reader.Close();
                    }
                }
                return response;
        }

        static string GetMd5Hash(MD5 md5Hash, string input)
        {

            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }

        static bool VerifyMd5Hash(MD5 md5Hash, string input, string hash)
        {
            string hashOfInput = GetMd5Hash(md5Hash, input);
            StringComparer comparer = StringComparer.OrdinalIgnoreCase;

            if (0 == comparer.Compare(hashOfInput, hash))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}