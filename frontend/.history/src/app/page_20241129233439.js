import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/admin">Admin Access</Link>
        </Button>
      </footer>
    </div>
  );
}
