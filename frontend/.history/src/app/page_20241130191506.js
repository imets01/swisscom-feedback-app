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
import { Header } from "./components/headerComponent";

export default function Home() {
  return (
    <div className=" flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-primary font-bold mb-4">
            Welcome to Our Feedback Portal
          </h1>

          <p className="text-xl text-primary mb-8">
            We value your input. Help us improve by sharing your interview
            experience.
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link href="/feedback">Start Feedback Form</Link>
          </Button>
        </div>
      </main>

      <footer className="p-4 text-center">
        <Drawer>
          <DrawerTrigger className=" h-9 w-fit rounded-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
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
                  className="h-9 w-fittransition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
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
