import axios from 'axios';
import { PostmarkItem } from '@/helpers/emailHelper';

const postWithTemplate = async (
  to: string,
  content: PostmarkItem[]
): Promise<void> => {
  if (!process.env.POSTMARK_SECRET) {
    throw new Error(`postWithTemplate: POSTMARK_SECRET not defined!`);
  }
  try {
    const res = await axios.post(
      `https://api.postmarkapp.com/email/withTemplate`,
      {
        From: 'me@henriquebf.com',
        To: to,
        TemplateAlias: 'code-your-own',
        TemplateModel: {
          content,
        },
      },
      {
        headers: {
          Accept: `application/json`,
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': process.env.POSTMARK_SECRET,
        },
        maxRedirects: 0,
      }
    );
    console.log(`postWithTemplate: message sent to ${res.data.To}!`);
  } catch (err: any) {
    throw new Error(`postWithTemplate: ${err.message}`);
  }
};

export default postWithTemplate;
