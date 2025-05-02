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
import { Camera, Upload, Heart, Mail, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-lg transition-all duration-300 hover:shadow-xl bg-background/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 bg-primary/10 p-4 rounded-full relative group">
            <Camera className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
            <Heart className="absolute -top-1 -right-1 h-6 w-6 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-4xl font-serif font-light tracking-wider">
            Forever Moments
          </CardTitle>
          <CardDescription className="text-lg mt-2 text-muted-foreground">
            Capture and share the magic of our special day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-6">
            <div className="flex items-start space-x-4 group">
              <div className="bg-primary/10 p-3 rounded-full mt-0.5 transition-transform duration-300 group-hover:scale-110">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="text-base leading-relaxed">
                Share your favorite moments in{" "}
                <Link
                  href="/my-uploads"
                  className="font-medium text-primary hover:underline transition-colors duration-300"
                >
                  Our Photos
                </Link>{" "}
                - upload your pictures and create lasting memories.
              </p>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="bg-primary/10 p-3 rounded-full mt-0.5 transition-transform duration-300 group-hover:scale-110">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <p className="text-base leading-relaxed">
                Browse through{" "}
                <Link
                  href="/photo-album"
                  className="font-medium text-primary hover:underline transition-colors duration-300"
                >
                  Guest Photos
                </Link>{" "}
                to see all the beautiful moments captured by our loved ones.
              </p>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="bg-primary/10 p-3 rounded-full mt-0.5 transition-transform duration-300 group-hover:scale-110">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <p className="text-base leading-relaxed">
                Need help or have questions? Use the Contact Us link in the
                footer - we're here to help make your experience special.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-center">
            <Link href="/my-uploads">
              <Button
                className="w-full group relative overflow-hidden"
                size="lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
                  Share Your Photos
                </span>
                <span className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
