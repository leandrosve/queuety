import APIService from './api/APIService';
import emailjs from '@emailjs/browser';
const credentials = {
  service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  user_id: import.meta.env.VITE_EMAILJS_USER_ID,
};

export default class EmailService extends APIService {
  protected static BASE_URL = `https://api.emailjs.com/api/v1.0`;

  public static async sendEmail(from: string, message: string) {
    const template = {
      email_id: from,
      message,
    };
    console.log(template, credentials)
    return emailjs.send(credentials.service_id, credentials.template_id, template, credentials.user_id);
  }
}
