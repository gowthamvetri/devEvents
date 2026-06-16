import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/ui/LightRay";
import Navbar from "@/components/Navbar";
import { PostHogProvider } from "./providers";
import { PostHogPageView } from "./posthog-pageview";
import { Suspense } from "react";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martinMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Event Hub",
  description: "This is a hub for developer to celebrate together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("min-h-screen", "antialiased", schibstedGrotesk.variable, martinMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <Navbar/>
          <div className="absolute z-[-1] inset-0 top-0 min-h-screen">
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={1}
              lightSpread={0.5}
              rayLength={3}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0}
              distortion={0}
              className="custom-rays"
              pulsating={false}
              fadeDistance={1}
              saturation={1}
            />
          </div>
          <section>
            {children}
          </section>
        </PostHogProvider>
      </body>
    </html>
  );
}
