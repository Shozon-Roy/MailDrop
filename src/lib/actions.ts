'use server';

import { filterSpam, type FilterSpamInput } from '@/ai/flows/filter-spam';
import { FilterSpamOutput } from '@/ai/flows/filter-spam';
import {
  generateTemporaryEmail,
  getInbox,
  readEmailContent,
} from '@/lib/emailnator';
import { Email, EmailMessage } from '@/types';

export async function checkSpamAction(input: FilterSpamInput): Promise<FilterSpamOutput> {
  try {
    const result = await filterSpam(input);
    return result;
  } catch (error) {
    console.error('Error in checkSpamAction:', error);
    // Fail open - if the spam check fails, assume it's not spam.
    return { isSpam: false, reason: 'Spam check service unavailable.' };
  }
}

export async function generateTemporaryEmailAction(): Promise<string | null> {
  try {
    const emailData = await generateTemporaryEmail();
    if (emailData.email && emailData.email.length > 0) {
      return emailData.email[0];
    }
    return null;
  } catch (error) {
    console.error('Error generating temporary email:', error);
    return null;
  }
}

export async function getInboxAction(email: string): Promise<EmailMessage[]> {
  try {
    const inboxData = await getInbox(email);
    return (inboxData.messageData || []).map((msg) => ({
      id: msg.messageID,
      sender: msg.from,
      subject: msg.subject,
      receivedAt: msg.time, // This is a string like "Just Now"
      body: '', // Body is fetched separately
    }));
  } catch (error) {
    console.error('Error fetching inbox:', error);
    return [];
  }
}

export async function readEmailAction(email: string, messageID: string): Promise<Email | null> {
  try {
    const emailContent = await readEmailContent(email, messageID);
    return {
      id: emailContent.messageID,
      sender: emailContent.from,
      subject: emailContent.subject,
      receivedAt: emailContent.time,
      body: emailContent.body,
    };
  } catch (error) {
    console.error('Error reading email:', error);
    return null;
  }
}
