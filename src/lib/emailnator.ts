import axios from 'axios';
import * as tough from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const jar = new tough.CookieJar();
const client = wrapper(axios.create({ jar }));

const getCookies = async () => {
  const cookies = await jar.getCookies('https://www.emailnator.com');
  const xsrfToken = cookies.find((c) => c.key === 'XSRF-TOKEN')?.value || '';
  const session =
    cookies.find((c) => c.key === 'gmailnator_session')?.value || '';
  return { xsrfToken, session };
};

const ensureCookies = async () => {
  let { xsrfToken, session } = await getCookies();
  if (!xsrfToken || !session) {
    await client.get('https://www.emailnator.com', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const newCookies = await getCookies();
    xsrfToken = newCookies.xsrfToken;
    session = newCookies.session;
  }
  if (!xsrfToken || !session) {
    throw new Error('Failed to retrieve session cookies.');
  }
  return { xsrfToken, session };
};

export async function generateTemporaryEmail() {
  const { xsrfToken, session } = await ensureCookies();
  const response = await client.post(
    'https://www.emailnator.com/generate-email',
    { email: ['dotGmail'] },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        Origin: 'https://www.emailnator.com',
        Referer: 'https://www.emailnator.com/',
        'User-Agent': 'Mozilla/5.0',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
  );
  return response.data;
}

export async function getInbox(email: string) {
  const { xsrfToken, session } = await ensureCookies();
  const response = await client.post(
    'https://www.emailnator.com/message-list',
    { email },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        Origin: 'https://www.emailnator.com',
        Referer: 'https://www.emailnator.com/inbox/',
        'User-Agent': 'Mozilla/5.0',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
  );
  return response.data;
}

export async function readEmailContent(email: string, messageID: string) {
  const { xsrfToken, session } = await ensureCookies();
  const response = await client.post(
    'https://www.emailnator.com/message-list',
    { email, messageID },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        Origin: 'https://www.emailnator.com',
        Referer: 'https://www.emailnator.com/inbox/',
        'User-Agent': 'Mozilla/5.0',
        'X-Requested-With': 'XMLHttpRequest',
      },
      responseType: 'text',
    }
  );

  const dom = new JSDOM(response.data);
  const document = dom.window.document;
  const extractText = (label: string) => {
    const node = [...document.querySelectorAll('b')].find((el) =>
      el.textContent?.includes(label)
    );
    return node?.nextSibling?.textContent?.trim() || '';
  };
  return {
    email,
    messageID,
    from: extractText('From:'),
    subject: extractText('Subject:'),
    time: extractText('Time:'),
    body:
      document.querySelector('div[dir="ltr"]')?.innerHTML ||
      document.body.innerHTML,
  };
}
