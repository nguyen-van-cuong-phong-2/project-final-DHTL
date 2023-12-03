import "../public/globals.css";
import { MyContextProvider } from "../components/context/context";
import Loading from '../components/loading';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen mx-auto bg-BGICon overflow-hidden">
        <MyContextProvider>
          {children}
          <Loading></Loading>
        </MyContextProvider>

      </body>
    </html>
  );
}
