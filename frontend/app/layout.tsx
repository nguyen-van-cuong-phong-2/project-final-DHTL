import "../public/globals.css";
import { MyContextProvider } from "@/components/context/context";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen mx-auto bg-BGICon">
        <MyContextProvider>{children}</MyContextProvider>
      </body>
    </html>
  );
}
