﻿import Link from "next/link";
import Image from "next/image"; // Import the Image component
import { ThemeSelector } from "./themeSelector";

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/650a16197f1c9d8e2dc7593a_SC-Lifeform.gif" // Path to the gif in the public folder
                alt="Lifeform Animation" // Alt text for accessibility
                width={40} // Set the width of the GIF
                height={40} // Set the height of the GIF
              />
            </Link>
          </div>
          {/* Displaying GIF with Image component */}
          <div className="flex items-center">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
