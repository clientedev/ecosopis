import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h1 className="font-display text-4xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. 
          Return to our homepage to continue shopping.
        </p>

        <Link href="/">
          <Button size="lg">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
