import { MailDropClient } from "@/components/maildrop/maildrop-client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Github, Instagram, Mail, Send } from "lucide-react";
import Link from "next/link";

const MailDropLogo = ({className}: {className?: string}) => (
    <svg data-logo="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 266 43" className={className || "h-7 w-auto"}>
    <g id="logogram" transform="translate(0, 1) rotate(0) "><path d="M13.5998 0.699913C19.6248 0.699913 24.5089 5.58408 24.5089 11.609V30.6999C24.5089 31.202 24.9159 31.609 25.418 31.609C25.9201 31.609 26.3271 31.202 26.3271 30.6999V11.609C26.3271 5.58408 31.2113 0.699913 37.2362 0.699913H51.7816C58.8107 0.699913 64.5089 6.39811 64.5089 13.4272V17.9868C64.5089 21.0489 63.4053 24.0092 61.3999 26.3231L48.939 40.6999H34.5036L53.1559 19.1783L53.2571 19.0504C53.4795 18.742 53.5998 18.3698 53.5998 17.9868V13.4272C53.5998 12.423 52.7858 11.609 51.7816 11.609H39.0544V10.6999C39.0544 10.1978 38.6474 9.79082 38.1453 9.79082C37.6432 9.79082 37.2362 10.1978 37.2362 10.6999V29.7908C37.2362 35.8157 32.352 40.6999 26.3271 40.6999H24.5089C18.484 40.6999 13.5998 35.8157 13.5998 29.7908V10.6999C13.5998 10.1978 13.1928 9.79082 12.6907 9.79082C12.1887 9.79082 11.7816 10.1978 11.7816 10.6999V40.6999H0.872559V11.609C0.872559 5.58408 5.75673 0.699913 11.7816 0.699913H13.5998Z" fill="hsl(var(--primary))"></path></g>
    <g id="logotype" transform="translate(71, 3)"><path fill="currentColor" d="M14.54 31L8.03 31L8.03 6.15L18.60 6.15L26.93 23.41L26.97 23.41L35.30 6.15L45.94 6.15L45.94 31L38.94 31L38.94 12.59L38.90 12.59L29.94 31L23.54 31L14.58 12.59L14.54 12.59L14.54 31ZM57.21 31.35L57.21 31.35Q53.53 31.35 51.26 29.93Q48.98 28.52 48.98 25.86L48.98 25.86Q48.98 23.68 50.66 22.20Q52.34 20.71 56.26 20.32L56.26 20.32L63.79 19.59L63.79 19.41Q63.79 16.96 60.04 16.96L60.04 16.96Q58.33 16.96 57.36 17.47Q56.40 17.98 56.05 19.10L56.05 19.10L49.23 18.61Q49.65 17 50.87 15.63Q52.10 14.27 54.37 13.43Q56.65 12.59 60.15 12.59L60.15 12.59Q65.22 12.59 67.90 14.38Q70.58 16.16 70.58 19.59L70.58 19.59L70.58 25.57Q70.58 26.87 70.59 27.75Q70.61 28.62 70.66 29.37Q70.72 30.13 70.82 31L70.82 31L64.34 31L64.21 29.46Q62.98 30.48 61.16 30.91Q59.34 31.35 57.21 31.35ZM55.88 25.71L55.88 25.71Q55.88 26.41 56.52 26.85Q57.17 27.29 58.68 27.29L58.68 27.29Q59.94 27.29 61.11 27.04Q62.28 26.80 63.03 26.20Q63.79 25.61 63.79 24.59L63.79 24.59L63.79 23.37L57.98 24.11Q57.00 24.24 56.44 24.59Q55.88 24.95 55.88 25.71ZM80.83 10.70L74.11 10.70L74.11 5.80L80.83 5.80L80.83 10.70ZM80.83 31L74.04 31L74.04 13.01L80.83 13.01L80.83 31ZM91.26 31L84.47 31L84.47 6.15L91.26 6.15L91.26 31ZM108.52 31L95.11 31L95.11 6.15L108.52 6.15Q113.45 6.15 116.69 7.76Q119.93 9.37 121.54 12.19Q123.15 15.00 123.15 18.61L123.15 18.61Q123.15 22.18 121.54 24.98Q119.93 27.78 116.69 29.39Q113.45 31 108.52 31L108.52 31ZM102.11 11.33L102.11 25.82L108.03 25.82Q112.12 25.82 114.10 24Q116.08 22.18 116.08 19.03L116.08 19.03L116.08 18.12Q116.08 14.90 114.10 13.11Q112.12 11.33 108.03 11.33L108.03 11.33L102.11 11.33ZM132.88 31L126.09 31L126.09 13.01L132.77 13.01L132.77 15.49Q134.00 13.99 135.85 13.29Q137.71 12.59 139.70 12.59L139.70 12.59Q140.09 12.59 140.61 12.63Q141.14 12.66 141.77 12.76L141.77 12.76L141.77 17.98Q140.82 17.88 139.65 17.80Q138.48 17.73 137.29 17.84Q136.10 17.95 135.10 18.35Q134.10 18.75 133.49 19.63Q132.88 20.50 132.88 22.00L132.88 22.00L132.88 31ZM154.47 31.42L154.47 31.42Q152.06 31.42 149.85 30.81Q147.65 30.20 145.91 29.00Q144.18 27.81 143.18 26.06Q142.19 24.31 142.19 22.00L142.19 22.00Q142.19 18.92 143.81 16.82Q145.44 14.72 148.24 13.66Q151.04 12.59 154.47 12.59L154.47 12.59Q157.90 12.59 160.68 13.66Q163.47 14.72 165.09 16.82Q166.72 18.92 166.72 22.00L166.72 22.00Q166.72 24.31 165.72 26.06Q164.73 27.81 162.99 29.00Q161.26 30.20 159.06 30.81Q156.85 31.42 154.47 31.42ZM154.47 26.80L154.47 26.80Q156.92 26.80 158.41 25.52Q159.90 24.24 159.90 22.18L159.90 22.18L159.90 21.83Q159.90 19.73 158.41 18.47Q156.92 17.21 154.47 17.21L154.47 17.21Q152.02 17.21 150.52 18.47Q149.01 19.73 149.01 21.83L149.01 21.83L149.01 22.18Q149.01 24.24 150.52 25.52Q152.02 26.80 154.47 26.80ZM176.31 36.77L169.52 36.77L169.52 13.01L176.21 13.01L176.21 14.83Q177.57 13.74 179.43 13.17Q181.28 12.59 183.28 12.59L183.28 12.59Q185.13 12.59 187.04 13.11Q188.95 13.64 190.52 14.76Q192.10 15.88 193.06 17.68Q194.02 19.48 194.02 22.00L194.02 22.00Q194.02 24.52 193.02 26.31Q192.03 28.09 190.43 29.23Q188.84 30.37 186.95 30.89Q185.06 31.42 183.28 31.42L183.28 31.42Q181.39 31.42 179.57 30.93Q177.75 30.44 176.31 29.39L176.31 29.39L176.31 36.77ZM176.31 21.73L176.31 22.28Q176.31 23.89 177.13 24.89Q177.96 25.89 179.23 26.34Q180.51 26.80 181.81 26.80L181.81 26.80Q183.31 26.80 184.52 26.26Q185.73 25.71 186.46 24.68Q187.20 23.65 187.20 22.18L187.20 22.18L187.20 21.83Q187.20 19.59 185.62 18.40Q184.05 17.21 181.81 17.21L181.81 17.21Q180.51 17.21 179.23 17.65Q177.96 18.09 177.13 19.08Q176.31 20.08 176.31 21.73L176.31 21.73Z"></path></g>
  </svg>
);


export default function Home() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <MailDropClient />

      <div className="mt-8">
        <Card className="bg-secondary/30 border-none shadow-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-semibold text-primary/90">What is a Disposable Temporary E-mail?</AccordionTrigger>
                        <AccordionContent className="space-y-4 text-muted-foreground pt-2">
                        <p>
                            Disposable email is a free email service that allows you to receive email at a temporary address that self-destructs after a certain time elapses. It is also known by names like: tempmail, 10minutemail, 10minmail, throwaway email, fake-mail, fake email generator, burner mail, or trash-mail.
                        </p>
                        <p>
                            Many forums, Wi-Fi owners, websites, and blogs ask visitors to register before they can view content, post comments, or download something. Temp-Mail is the most advanced throwaway email service that helps you avoid spam and stay safe.
                        </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg font-semibold text-primary/90">Forget about spam and stay secure</AccordionTrigger>
                        <AccordionContent className="space-y-4 text-muted-foreground pt-2">
                        <p>
                            Forget about spam, advertising mailings, hacking, and attacking robots. Keep your real mailbox clean and secure.
                        </p>
                        <p>
                            Our service provides a temporary, secure, anonymous, free, disposable email address to protect your privacy. Use it for any website or service you don't trust with your real email address.
                        </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg font-semibold text-primary/90">How does the AI spam filter work?</AccordionTrigger>
                        <AccordionContent className="space-y-4 text-muted-foreground pt-2">
                          <p>
                            Our advanced AI analyzes incoming emails for common spam characteristics, such as suspicious links, unusual formatting, and blacklisted keywords. It then provides a verdict on whether the email is likely to be spam, helping you to identify and ignore unwanted messages quickly.
                          </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-lg font-semibold text-primary/90">Is my privacy protected?</AccordionTrigger>
                        <AccordionContent className="space-y-4 text-muted-foreground pt-2">
                          <p>
                            Absolutely. We are committed to protecting your privacy. We don't require any personal information to generate a temporary email address, and all emails are automatically deleted after a short period.
                          </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-lg font-semibold text-primary/90">Can I recover a deleted email?</AccordionTrigger>
                        <AccordionContent className="space-y-4 text-muted-foreground pt-2">
                          <p>
                            Once an email or a temporary address is deleted, it is gone forever. There is no way to recover it. This is a key feature of our privacy-focused service, ensuring that your temporary communications leave no trace.
                          </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
      </div>
      <footer className="mt-12 border-t pt-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-4 md:col-span-1">
            <MailDropLogo className="h-8 w-auto" />
            <p className="text-muted-foreground">
              Your go-to solution for temporary, secure, and anonymous email. Keep your primary inbox clean and your privacy intact.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Quick Links</h3>
              <ul className="space-y-1">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
               <h3 className="font-semibold text-primary">Connect With Us</h3>
               <div className="flex space-x-4">
                  <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary"><Send /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary"><Github /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary"><Mail /></Link>
               </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground pb-4">
          <p>&copy; {new Date().getFullYear()} MailDrop. Developed by Shozon Roy.</p>
        </div>
      </footer>
    </div>
  );
}
