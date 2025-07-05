
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const { user, signUp, signIn, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    name: '',
    age: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  const validateSignupForm = () => {
    const errors: Record<string, string> = {};

    if (!signupData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) errors.email = 'Email is invalid';

    if (!signupData.name) errors.name = 'Name is required';
    if (!signupData.age) errors.age = 'Age is required';
    else if (parseInt(signupData.age) < 13 || parseInt(signupData.age) > 120) errors.age = 'Age must be between 13 and 120';

    if (!signupData.gender) errors.gender = 'Gender is required';
    if (!signupData.password) errors.password = 'Password is required';
    else if (signupData.password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (!signupData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLoginForm = () => {
    const errors: Record<string, string> = {};

    if (!loginData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errors.email = 'Email is invalid';

    if (!loginData.password) errors.password = 'Password is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await signUp(
        signupData.email, 
        signupData.password, 
        signupData.name
      );

      if (!error) {
        // Update profile with additional data
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account, then log in.",
        });
        
        // Reset form and switch to login tab
        setSignupData({
          email: '',
          name: '',
          age: '',
          gender: '',
          password: '',
          confirmPassword: ''
        });
        setActiveTab("login");
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (!error) {
        setLoginData({ email: '', password: '' });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to Expense Tracker
          </CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className={validationErrors.email ? "border-red-500" : ""}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className={validationErrors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-500">{validationErrors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign Up
                </Button>
              </p>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className={validationErrors.email ? "border-red-500" : ""}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className={validationErrors.name ? "border-red-500" : ""}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-age">Age</Label>
                  <Input
                    id="signup-age"
                    type="number"
                    placeholder="Enter your age"
                    value={signupData.age}
                    onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
                    className={validationErrors.age ? "border-red-500" : ""}
                  />
                  {validationErrors.age && (
                    <p className="text-sm text-red-500">{validationErrors.age}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-gender">Gender</Label>
                  <Select
                    value={signupData.gender}
                    onValueChange={(value) => setSignupData({ ...signupData, gender: value })}
                  >
                    <SelectTrigger className={validationErrors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.gender && (
                    <p className="text-sm text-red-500">{validationErrors.gender}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className={validationErrors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-500">{validationErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className={validationErrors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setActiveTab("login")}
                >
                  Log In
                </Button>
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
