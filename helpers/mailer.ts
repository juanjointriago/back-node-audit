import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';


const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.CLIENT_ID, // Reemplaza con tu Client ID
    process.env.CLIENT_SECRET, // Reemplaza con tu Client Secret
    process.env.REDIRECT_URL // URL de redirección (puedes usar esta para obtener un token de acceso)
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

async function getAccessToken() {
    try {
        const { token } = await oauth2Client.getAccessToken();
        return token;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const transporter = async () => {
    //const accessToken = await getAccessToken();
    return nodemailer.createTransport({
        /* OAuth2 
            service: 'gmail',
            auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        }
        /* */
        /* GMAIL */
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        /* */
        /* outlook 
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL2, // tu dirección de correo de Outlook
            pass: process.env.MAIL_PASSWORD2 // la contraseña generada
        }
        /* */
    });
};
