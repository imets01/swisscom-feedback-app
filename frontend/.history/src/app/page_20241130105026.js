import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import LoginPage from "./login/page";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Our Feedback Portal
          </h1>
          <p className="text-xl mb-8">
            We value your input. Help us improve by sharing your interview
            experience.
          </p>
          <Button asChild size="lg">
            <Link href="/feedback">Start Feedback Form</Link>
          </Button>
        </div>
      </main>

      <footer className="p-4 text-center">
        <Drawer>
          <DrawerTrigger className=" h-9 w-fit rounded-md px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent">
            Admin Access
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle></DrawerTitle>
              <DrawerDescription></DrawerDescription>
              <LoginPage />
            </DrawerHeader>
            <DrawerFooter className="flex justify-center items-center">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="h-9 w-fit rounded-md px-3  gap-2  text-sm font-medium transition-colors  text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </footer>
    </div>
  );
}
