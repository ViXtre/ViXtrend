import './globals.css';
import { UIProvider }       from '@/context/UIContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider }     from '@/context/AuthContext';
import Navbar               from '@/components/Navbar';

export const metadata = {
  title:       'ViXtrend — Your Business Extensions',
  description: 'Изграждаме идеята. И тя остава за Вас.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg" data-theme="dark">
      <body>
        <LanguageProvider>
          <AuthProvider>
            <UIProvider>
              <Navbar />
              <main>{children}</main>
              {/* ContactFAB е вграден в Navbar */}
            </UIProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
