import "../public/globals.css";
import { MyContextProvider } from "../components/context/context";
import Loading from '../components/loading';
import Notifications from "../components/popup/notification";
import { functions } from "../functions/functions";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = new functions().getTokenFromClientSide();
  return (
    <html lang="en">
      <body className=" bg-BGICon no-scrollbar">
        <MyContextProvider>
          <Loading></Loading>
          {children}
          <Notifications></Notifications>
        </MyContextProvider>

      </body>
    </html>
  );
}
