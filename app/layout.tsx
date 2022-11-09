import { Space_Mono } from "@next/font/google";
import localFont from "@next/font/local";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const nouvelle = localFont({
  src: [
    {
      path: "./fonts/nouvelle/NNNouvelleGroteskSTD-Normal.woff2",
      weight: "400",
    },
    {
      path: "./fonts/nouvelle/NNNouvelleGroteskSTD-Medium.woff2",
      weight: "500",
    },
  ],
  display: "block",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceMono.className} ${nouvelle.className}`}>
      <body>{children}</body>
    </html>
  );
}
