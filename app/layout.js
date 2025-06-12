import "./styles/global.css"; // ✅ Correct path to your global styles
import { Providers } from "./providers";

export const metadata = {
  title: "Resident Complaint System",
  description: "A system to handle resident complaints efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}



