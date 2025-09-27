export type Email = {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedAt: string; // This can be a relative time string like "Just Now"
};

// Represents the message preview from the inbox list
export type EmailMessage = {
  id: string;
  sender: string;
  subject: string;
  receivedAt: string;
  body: string; // Preview, might be empty
};
