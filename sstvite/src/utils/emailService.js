import emailjs from 'emailjs-com';

export const sendEmail = async (toEmail, toName, fromName, message) => {
  try {
    const templateParams = {
      to_Email: toEmail,
      to_name: toName,   // Matches {{to_name}} in your template
      subject: fromName, // Matches {{from_name}} in your template
      message: message,  // Matches {{message}} in your template
    };

    const response = await emailjs.send(
      'service_0ynhc6m',  // Your actual EmailJS Service ID
      'template_yojpj0r', // Your actual EmailJS Template ID
      templateParams,
      'yw_tp6n_2KjiEqc5K' // Your actual Public Key
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
