import Link from "next/link";
import Image from "next/image"; // Import the Image component

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container ">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Image
              src="/650a16197f1c9d8e2dc7593a_SC-Lifeform.gif" // Path to the gif in the public folder
              alt="Lifeform Animation" // Alt text for accessibility
              width={50} // Set the width of the GIF
              height={50} // Set the height of the GIF
            />
          </div>
        </div>
      </div>
    </header>
  );
}
