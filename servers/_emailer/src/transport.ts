import { createTransport } from 'nodemailer';
const { MAIL_TRANSPORT } = process.env;

const transport = createTransport(MAIL_TRANSPORT);

export default transport;
