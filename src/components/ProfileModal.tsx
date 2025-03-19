
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Google } from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onOpenChange }) => {
  const handleGoogleSignIn = () => {
    // In a real app, this would integrate with Google Auth
    console.log("Google sign-in clicked");
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email sign in logic
    console.log("Email sign-in submitted");
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email sign up logic
    console.log("Email sign-up submitted");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Sign in or create an account to save your health reports and track your progress.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <Google className="h-4 w-4" />
              Sign in with Google
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input id="email-signin" type="email" placeholder="example@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input id="password-signin" type="password" />
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <Google className="h-4 w-4" />
              Sign up with Google
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-signup">Full Name</Label>
                <Input id="name-signup" type="text" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" type="email" placeholder="example@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" />
              </div>
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
