'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Email, EmailMessage } from '@/types';
import {
  checkSpamAction,
  generateTemporaryEmailAction,
  getInboxAction,
  readEmailAction,
} from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Copy,
  RefreshCcw,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Inbox,
  Loader,
  ChevronsRight,
  Mail,
  ChevronRight,
  ServerCrash,
  Sparkles,
  Replace,
  Shuffle,
  MoreHorizontal,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const REFRESH_INTERVAL_SECONDS = 10 * 1000; // 10 seconds

const MailDropLogo = ({className}: {className?: string}) => (
    <svg data-logo="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 266 43" className={cn("h-7 w-auto", className)}>
    <g id="logogram" transform="translate(0, 1) rotate(0) "><path d="M13.5998 0.699913C19.6248 0.699913 24.5089 5.58408 24.5089 11.609V30.6999C24.5089 31.202 24.9159 31.609 25.418 31.609C25.9201 31.609 26.3271 31.202 26.3271 30.6999V11.609C26.3271 5.58408 31.2113 0.699913 37.2362 0.699913H51.7816C58.8107 0.699913 64.5089 6.39811 64.5089 13.4272V17.9868C64.5089 21.0489 63.4053 24.0092 61.3999 26.3231L48.939 40.6999H34.5036L53.1559 19.1783L53.2571 19.0504C53.4795 18.742 53.5998 18.3698 53.5998 17.9868V13.4272C53.5998 12.423 52.7858 11.609 51.7816 11.609H39.0544V10.6999C39.0544 10.1978 38.6474 9.79082 38.1453 9.79082C37.6432 9.79082 37.2362 10.1978 37.2362 10.6999V29.7908C37.2362 35.8157 32.352 40.6999 26.3271 40.6999H24.5089C18.484 40.6999 13.5998 35.8157 13.5998 29.7908V10.6999C13.5998 10.1978 13.1928 9.79082 12.6907 9.79082C12.1887 9.79082 11.7816 10.1978 11.7816 10.6999V40.6999H0.872559V11.609C0.872559 5.58408 5.75673 0.699913 11.7816 0.699913H13.5998Z" fill="hsl(var(--primary))"></path></g>
    <g id="logotype" transform="translate(71, 3)"><path fill="currentColor" d="M14.54 31L8.03 31L8.03 6.15L18.60 6.15L26.93 23.41L26.97 23.41L35.30 6.15L45.94 6.15L45.94 31L38.94 31L38.94 12.59L38.90 12.59L29.94 31L23.54 31L14.58 12.59L14.54 12.59L14.54 31ZM57.21 31.35L57.21 31.35Q53.53 31.35 51.26 29.93Q48.98 28.52 48.98 25.86L48.98 25.86Q48.98 23.68 50.66 22.20Q52.34 20.71 56.26 20.32L56.26 20.32L63.79 19.59L63.79 19.41Q63.79 16.96 60.04 16.96L60.04 16.96Q58.33 16.96 57.36 17.47Q56.40 17.98 56.05 19.10L56.05 19.10L49.23 18.61Q49.65 17 50.87 15.63Q52.10 14.27 54.37 13.43Q56.65 12.59 60.15 12.59L60.15 12.59Q65.22 12.59 67.90 14.38Q70.58 16.16 70.58 19.59L70.58 19.59L70.58 25.57Q70.58 26.87 70.59 27.75Q70.61 28.62 70.66 29.37Q70.72 30.13 70.82 31L70.82 31L64.34 31L64.21 29.46Q62.98 30.48 61.16 30.91Q59.34 31.35 57.21 31.35ZM55.88 25.71L55.88 25.71Q55.88 26.41 56.52 26.85Q57.17 27.29 58.68 27.29L58.68 27.29Q59.94 27.29 61.11 27.04Q62.28 26.80 63.03 26.20Q63.79 25.61 63.79 24.59L63.79 24.59L63.79 23.37L57.98 24.11Q57.00 24.24 56.44 24.59Q55.88 24.95 55.88 25.71ZM80.83 10.70L74.11 10.70L74.11 5.80L80.83 5.80L80.83 10.70ZM80.83 31L74.04 31L74.04 13.01L80.83 13.01L80.83 31ZM91.26 31L84.47 31L84.47 6.15L91.26 6.15L91.26 31ZM108.52 31L95.11 31L95.11 6.15L108.52 6.15Q113.45 6.15 116.69 7.76Q119.93 9.37 121.54 12.19Q123.15 15.00 123.15 18.61L123.15 18.61Q123.15 22.18 121.54 24.98Q119.93 27.78 116.69 29.39Q113.45 31 108.52 31L108.52 31ZM102.11 11.33L102.11 25.82L108.03 25.82Q112.12 25.82 114.10 24Q116.08 22.18 116.08 19.03L116.08 19.03L116.08 18.12Q116.08 14.90 114.10 13.11Q112.12 11.33 108.03 11.33L108.03 11.33L102.11 11.33ZM132.88 31L126.09 31L126.09 13.01L132.77 13.01L132.77 15.49Q134.00 13.99 135.85 13.29Q137.71 12.59 139.70 12.59L139.70 12.59Q140.09 12.59 140.61 12.63Q141.14 12.66 141.77 12.76L141.77 12.76L141.77 17.98Q140.82 17.88 139.65 17.80Q138.48 17.73 137.29 17.84Q136.10 17.95 135.10 18.35Q134.10 18.75 133.49 19.63Q132.88 20.50 132.88 22.00L132.88 22.00L132.88 31ZM154.47 31.42L154.47 31.42Q152.06 31.42 149.85 30.81Q147.65 30.20 145.91 29.00Q144.18 27.81 143.18 26.06Q142.19 24.31 142.19 22.00L142.19 22.00Q142.19 18.92 143.81 16.82Q145.44 14.72 148.24 13.66Q151.04 12.59 154.47 12.59L154.47 12.59Q157.90 12.59 160.68 13.66Q163.47 14.72 165.09 16.82Q166.72 18.92 166.72 22.00L166.72 22.00Q166.72 24.31 165.72 26.06Q164.73 27.81 162.99 29.00Q161.26 30.20 159.06 30.81Q156.85 31.42 154.47 31.42ZM154.47 26.80L154.47 26.80Q156.92 26.80 158.41 25.52Q159.90 24.24 159.90 22.18L159.90 22.18L159.90 21.83Q159.90 19.73 158.41 18.47Q156.92 17.21 154.47 17.21L154.47 17.21Q152.02 17.21 150.52 18.47Q149.01 19.73 149.01 21.83L149.01 21.83L149.01 22.18Q149.01 24.24 150.52 25.52Q152.02 26.80 154.47 26.80ZM176.31 36.77L169.52 36.77L169.52 13.01L176.21 13.01L176.21 14.83Q177.57 13.74 179.43 13.17Q181.28 12.59 183.28 12.59L183.28 12.59Q185.13 12.59 187.04 13.11Q188.95 13.64 190.52 14.76Q192.10 15.88 193.06 17.68Q194.02 19.48 194.02 22.00L194.02 22.00Q194.02 24.52 193.02 26.31Q192.03 28.09 190.43 29.23Q188.84 30.37 186.95 30.89Q185.06 31.42 183.28 31.42L183.28 31.42Q181.39 31.42 179.57 30.93Q177.75 30.44 176.31 29.39L176.31 29.39L176.31 36.77ZM176.31 21.73L176.31 22.28Q176.31 23.89 177.13 24.89Q177.96 25.89 179.23 26.34Q180.51 26.80 181.81 26.80L181.81 26.80Q183.31 26.80 184.52 26.26Q185.73 25.71 186.46 24.68Q187.20 23.65 187.20 22.18L187.20 22.18L187.20 21.83Q187.20 19.59 185.62 18.40Q184.05 17.21 181.81 17.21L181.81 17.21Q180.51 17.21 179.23 17.65Q177.96 18.09 177.13 19.08Q176.31 20.08 176.31 21.73L176.31 21.73Z"></path></g>
  </svg>
);

const LoadingScreen = () => (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="animate-pulse">
            <MailDropLogo className="h-14 w-auto" />
        </div>
    </div>
);


export function MailDropClient() {
  const [emailAddress, setEmailAddress] = useState<string | null>(null);
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const { setTheme } = useTheme();

  const generateAddress = useCallback(async () => {
    setIsGenerating(true);
    setSelectedEmail(null);
    setEmails([]);
    const newAddress = await generateTemporaryEmailAction();
    if (newAddress) {
      setEmailAddress(newAddress);
    } else {
      toast({
        title: 'Error',
        description: 'Could not generate a new email address. Please try again.',
        variant: 'destructive',
      });
    }
    setIsGenerating(false);
  }, [toast]);
  
  useEffect(() => {
    // Generate an email address when the component mounts for the first time
    if (!emailAddress) {
      generateAddress();
    }
  }, [generateAddress, emailAddress]);


  const handleCopy = useCallback(() => {
    if (emailAddress) {
      navigator.clipboard.writeText(emailAddress);
      toast({ title: 'Copied to clipboard!' });
    }
  }, [emailAddress, toast]);

  const fetchNewEmails = useCallback(async () => {
    if (!emailAddress || isFetching) return;
    setIsFetching(true);

    try {
      const newMessages = await getInboxAction(emailAddress);
      const uniqueNewEmails = newMessages.filter(
        (newMsg) => !emails.some((existingMsg) => existingMsg.id === newMsg.id)
      );

      if (uniqueNewEmails.length > 0) {
        setEmails((prev) => [...uniqueNewEmails, ...prev]);
        toast({
          title: 'New Email!',
          description: `You've received ${uniqueNewEmails.length} new email(s).`,
        })
      }
    } catch (error) {
      console.error('Failed to fetch new emails:', error);
      toast({
        title: 'Error Fetching Mail',
        description: 'Could not connect to the inbox.',
        variant: 'destructive',
      });
    } finally {
      setIsFetching(false);
    }
  }, [emailAddress, toast, emails, isFetching]);
  
  const handleSelectEmail = useCallback(async (message: EmailMessage) => {
    if (!emailAddress) return;
    
    setSelectedEmail({
      ...message,
      body: '<div class="flex items-center justify-center p-8"><span class="mr-2 animate-spin"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 18V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.93 4.93L7.76 7.76" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.24 16.24L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 12H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.93 19.07L7.76 16.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span> Loading...</div>'
    });

    const fullEmail = await readEmailAction(emailAddress, message.id);
    if (fullEmail) {
      setSelectedEmail(fullEmail);
    } else {
      toast({
        title: 'Error',
        description: 'Could not load email content.',
        variant: 'destructive'
      });
      setSelectedEmail({
        ...message,
        body: '<div class="flex items-center justify-center p-8 text-destructive"><span class="mr-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 2 12C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span> Failed to load content.</div>',
      });
    }
  }, [emailAddress, toast]);


  useEffect(() => {
    const interval = setInterval(() => {
        fetchNewEmails();
    }, REFRESH_INTERVAL_SECONDS);
    fetchNewEmails(); // Initial fetch
    return () => clearInterval(interval);
  }, [fetchNewEmails]);

  if (isGenerating && !emailAddress) {
    return <LoadingScreen />;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-background text-foreground gap-4">
        <header className="sticky top-0 z-10 flex flex-row items-center justify-between gap-4 p-2 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-foreground">
            <MailDropLogo />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={generateAddress} variant="premium" size="sm" className="rounded-full">
              Premium
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex flex-col flex-1 gap-8">
          <Card className="p-4 sm:p-6 shadow-2xl bg-secondary/30 border-primary/10">
            <div className="text-center mb-6">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-primary">Your Temporary Email Address</h1>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Forget about spam, advertising mailings, hacking and attacking robots. Keep your real mailbox clean and secure. Temp Mail provides temporary, secure, anonymous, free, disposable email address.</p>
            </div>
            <div className="relative mb-6">
                <input 
                    type="text" 
                    readOnly 
                    value={emailAddress || 'Generating...'} 
                    className="w-full text-center sm:text-left bg-background/50 border-2 border-primary/20 rounded-full py-3 px-6 text-lg font-mono text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button onClick={handleCopy} size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/80 hover:text-primary hover:bg-primary/10">
                  <Copy />
                </Button>
            </div>
             <div className="flex items-center justify-center gap-2 sm:gap-4">
                <Button onClick={handleCopy} variant="ghost" className="flex-col h-auto p-2">
                  <Copy /> <span className="text-xs mt-1">Copy</span>
                </Button>
                 <Button onClick={generateAddress} variant="ghost" className="flex-col h-auto p-2">
                  <Shuffle /> <span className="text-xs mt-1">Random</span>
                </Button>
                <Button onClick={generateAddress} variant="ghost" className="flex-col h-auto p-2">
                  <Replace /> <span className="text-xs mt-1">Change</span>
                </Button>
                 <Button onClick={() => {setEmailAddress(null); generateAddress();}} variant="ghost" className="flex-col h-auto p-2">
                  <Trash2 /> <span className="text-xs mt-1">Delete</span>
                </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1 flex flex-col shadow-md bg-secondary/30 h-[500px]">
              <CardHeader className="p-4 border-b flex-row justify-between items-center">
                <h2 className="font-semibold flex items-center gap-2 text-primary text-base">
                  <Inbox className="h-5 w-5" />
                  Messages
                </h2>
                <Button onClick={fetchNewEmails} size="sm" variant="ghost" disabled={isFetching} className="gap-2">
                  {isFetching ? <Loader className="animate-spin" /> : <RefreshCcw />}
                  Refresh
                </Button>
              </CardHeader>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {isGenerating ? (
                     <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center">
                      <Loader className="h-10 w-10 animate-spin mb-4 text-primary" />
                      <p className="font-medium">Generating new address...</p>
                    </div>
                  ) : emails.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center">
                      <Mail className="h-10 w-10 mb-4 text-muted-foreground/50" />
                      <p className="font-medium">No messages</p>
                      <p className="text-sm">Waiting for incoming messages.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {emails.map((email) => (
                        <EmailListItem
                          key={email.id}
                          email={email}
                          isSelected={selectedEmail?.id === email.id}
                          onSelect={() => handleSelectEmail(email)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>

            <Card className="lg:col-span-2 flex flex-col shadow-md bg-secondary/30 h-[500px]">
              <ScrollArea className="flex-1">
                {selectedEmail ? (
                  <EmailContent email={selectedEmail} onDelete={() => {}} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <ChevronsRight className="h-12 w-12 mb-4 text-primary/50" />
                    <h3 className="text-xl font-semibold">Select an email to read</h3>
                    <p>Your emails will be displayed here once selected.</p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

const EmailListItem = ({
  email,
  isSelected,
  onSelect,
}: {
  email: EmailMessage;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left p-3 rounded-lg transition-all border-2 border-transparent duration-200 group relative',
        isSelected
          ? 'bg-primary/10 border-primary/50'
          : 'hover:bg-primary/10 hover:border-primary/30 bg-card'
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <p className="font-semibold truncate text-foreground">{email.sender}</p>
        <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
          {email.receivedAt}
        </span>
      </div>
      <div className="flex justify-between items-center gap-2">
          <p className="text-sm truncate font-medium text-left flex-1 text-muted-foreground">{email.subject}</p>
          <div className={cn("opacity-0 group-hover:opacity-100 transition-opacity", isSelected && "opacity-100")}>
            <ChevronRight className="h-5 w-5 text-primary"/>
          </div>
      </div>
    </button>
  );
};

const EmailContent = ({
  email,
  onDelete,
}: {
  email: Email;
  onDelete: (id: string) => void;
}) => {
  const [isSpam, setIsSpam] = useState<boolean | null>(null);
  const [spamReason, setSpamReason] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSpamCheck = useCallback(async () => {
    setIsChecking(true);
    const result = await checkSpamAction({
      sender: email.sender,
      subject: email.subject,
      body: email.body,
    });
    
    setIsSpam(result.isSpam);
    
    if (result.reason === 'Spam check service unavailable.') {
      setSpamReason(result.reason)
    } else {
      setSpamReason(result.reason || '');
    }

    setIsChecking(false);
  }, [email]);
  
  useEffect(() => {
    setIsSpam(null);
    setSpamReason('');
  }, [email.id]);

  const getSpamBadge = () => {
    if (isSpam === null) return null;

    if (spamReason === 'Spam check service unavailable.') {
      return (
        <Badge variant="secondary" className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
            <ServerCrash className="mr-2 h-4 w-4" />
            AI Spam Check Unavailable
        </Badge>
      );
    }
    
    return (
        <Badge variant={isSpam ? 'destructive' : 'default'} className="mb-4 bg-opacity-10 border-opacity-20">
            {isSpam ? <ShieldAlert className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            {isSpam ? 'AI Verdict: Likely Spam' : 'AI Verdict: Looks Safe'}
            {spamReason && !isSpam && `: ${spamReason}`}
        </Badge>
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col">
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold truncate pr-4">{email.subject}</h2>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSpamCheck} variant="ghost" size="icon" disabled={isChecking}>
                  {isChecking ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-primary hover:text-amber-300 transition-colors" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Run AI Spam Check</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => onDelete(email.id)} variant="ghost" size="icon">
                  <Trash2 className="h-5 w-5 hover:text-destructive transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Email</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {getSpamBadge()}

        <div className="text-sm space-y-1 text-muted-foreground">
          <p>
            <span className="font-semibold w-20 inline-block">From:</span> <span className="text-foreground">{email.sender}</span>
          </p>
          <p>
            <span className="font-semibold w-20 inline-block">Received:</span>{' '}
            {email.receivedAt}
          </p>
        </div>
        <Separator className="my-4 bg-border/50" />
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-y-auto whitespace-pre-wrap break-words">
        <div dangerouslySetInnerHTML={{ __html: email.body }} />
      </div>
    </div>
  );
};
