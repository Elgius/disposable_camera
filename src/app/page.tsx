import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Upload, Globe, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md mx-auto shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 bg-primary/10 p-4 rounded-full">
            <Camera className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Oracle Viewer</CardTitle>
          <CardDescription className="text-lg mt-2">
            Your personal & community image gallery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <p>
                Go to{" "}
                <Link
                  href="/my-uploads"
                  className="font-medium text-primary hover:underline"
                >
                  My Uploads
                </Link>{" "}
                to add or manage your images.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <p>
                Visit{" "}
                <Link
                  href="/photo-album"
                  className="font-medium text-primary hover:underline"
                >
                  Global Album
                </Link>{" "}
                to browse community photos.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <p>
                Need help? Use the Contact Us link in the footer for support.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-center">
            <Link href="/my-uploads">
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
