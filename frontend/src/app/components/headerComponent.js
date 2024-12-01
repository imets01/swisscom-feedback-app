import Link from "next/link";
import Image from "next/image"; // Import the Image component
import { ThemeSelector } from "./themeSelector";

export default function HeaderBar() {
  return (
    <header className="bg-card border-b">
      <div className="container px-2 sm:px-4 lg:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/650a16197f1c9d8e2dc7593a_SC-Lifeform.gif"
                alt="Lifeform Animation"
                width={40}
                height={40}
              />
            </Link>
          </div>

          <div className="flex items-center">{/* <ThemeSelector /> */}</div>
        </div>
      </div>
    </header>
  );
}
