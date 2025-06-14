import "./styles/global.css"; // ✅ Correct path to your global styles
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "🏠Resident Complaint System",
  description: "A system to handle resident complaints efficiently",
 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}



