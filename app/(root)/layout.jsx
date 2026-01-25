import { Metadata } from "next"
import Header from "../../modules/home/header"
import Footer from "../../modules/home/footer"
import { cn } from "@/lib/utils";

export const metadata = {
    title: {
        template: "vibeCode-Editor",
        default: "Code Editor for VibeCoders - VibeCode"
    }
}

export default function HomeLayout({ children }) {
  return (
    <>
      <Header />

      {/* Background wrapper */}
      <div className="relative min-h-screen overflow-hidden">

        {/* Grid background */}
        {/* <div
          className={cn(
            "absolute inset-0 -z-10",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        /> */}

        {/* Radial fade */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <main className="relative z-10">
          {children}
        </main>

      </div>

      <Footer />
    </>
  );
}
