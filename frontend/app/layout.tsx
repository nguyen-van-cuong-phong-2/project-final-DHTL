import "../public/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen mx-auto ">{children}</body>
    </html>
  );
}
