using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NFZsim;

namespace ReactTest1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VisitReminderController : ControllerBase
    {
        [HttpPost]
        [Route("[action]")]
        public async Task<Visit> Send([FromBody]Visit data, [FromQuery] string pmail, [FromQuery] string pname, [FromQuery] string psurname, [FromQuery] string dname, [FromQuery] string dsurname)
        {
            try
            {
                Visit vis = new Visit();
                SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
                smtpClient.Credentials = new System.Net.NetworkCredential("nfzsimulator@gmail.com", "NFZ_2020_sim");
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.EnableSsl = true;
                MailMessage mail = new MailMessage();
                mail.BodyEncoding = System.Text.Encoding.UTF8;
                string visitdate = data.VisitDate;
                string visithour = data.VisitTime;
                string intro = "Szanowny Pacjencie,\n\nprzypominamy o nadchodzącej wizycie dnia " + visitdate + " o godzinie " + visithour + ".";
                string middle = "\nWizyta została zarejestrowana na " +pname + " " + psurname + " do doktora " + dname + " " + dsurname  + ".";
                string end = "\n\nŻyczymy zdrowia i miłego dnia\nZespół Placówek Symulowanych NFZsimulator.";
                Debug.WriteLine(intro + middle + end);
                mail.Body = intro + middle + end;
                mail.Subject = "Przypomnienie o nadchodzącej wizycie";
                mail.From = new MailAddress("nfzsimulator@gmail.com", "Twoja przychodnia");
                mail.To.Add(new MailAddress(pmail));
                mail.CC.Add(new MailAddress(pmail));
                smtpClient.Send(mail);
                return vis;
            } catch (System.FormatException)
            {
                Visit vis = new Visit();
                Debug.WriteLine("Incorrect e-mail format");
                return vis;
            }
        }
    }
}