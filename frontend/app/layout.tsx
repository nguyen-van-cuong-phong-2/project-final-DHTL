import "../public/globals.css";
import { MyContextProvider } from "../components/context/context";
import Loading from '../components/loading';
import Notifications from "../components/popup/notification"
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
          <Notifications></Notifications>
        </MyContextProvider>

      </body>
    </html>
  );
}
