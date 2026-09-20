import './globals.css';
import { UIProvider }       from '@/context/UIContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar               from '@/components/Navbar';
import ContactFAB           from '@/components/ContactFAB';

export const metadata = {
  title:       'ViXtrend — Your Business Extensions',
  description: 'Изграждаме идеята. И тя остава за Вас.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg" data-theme="dark">
      <body>
        <LanguageProvider>
          <UIProvider>
            <Navbar />
            <main>{children}</main>
            <ContactFAB />
          </UIProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
