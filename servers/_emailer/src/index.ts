import { render } from '@react-email/render';
import transport from './transport';
import { templates } from './templates';

type SendMailArgs = {
  template: string;
  subject: string;
  to: string;
  data?: any;
};

export const sendMail = async ({ template, subject, to, data }: SendMailArgs) => {
  const options = {
    from: 'no-reply@pertento.ai',
    to,
    subject,
  };


  const theTemplate = templates[template];
  const templated = theTemplate(data);

  // try {
  const emailHtml = await render(templated);
  transport.sendMail({ ...options, html: emailHtml });
  // } catch (ex) {
  //   console.log("ex", ex);
  // }

};

export { templates };
