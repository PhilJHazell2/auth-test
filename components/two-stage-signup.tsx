"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

interface SignupData {
  username: string
  password: string
  confirmPassword: string
}

export function TwoStageSignup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [signupData, setSignupData] = useState<SignupData>({
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<SignupData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const validateUsername = (username: string) => {
    if (username.length < 3) {
      return "Username must be at least 3 characters"
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores"
    }
    return null
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { level: "weak", color: "bg-red-500", text: "Weak" }
    if (strength <= 3) return { level: "medium", color: "bg-yellow-500", text: "Medium" }
    return { level: "strong", color: "bg-green-500", text: "Strong" }
  }

  const handleUsernameChange = (value: string) => {
    setSignupData((prev) => ({ ...prev, username: value }))
    setErrors((prev) => ({ ...prev, username: undefined }))

    // Simulate username availability check
    if (value.length >= 3) {
      setTimeout(() => {
        setUsernameAvailable(value !== "admin" && value !== "test")
      }, 500)
    } else {
      setUsernameAvailable(null)
    }
  }

  const handleNextStep = () => {
    const usernameError = validateUsername(signupData.username)
    if (usernameError || !usernameAvailable) {
      setErrors({ username: usernameError || "Username is not available" })
      return
    }
    setCurrentStep(2)
  }

  const handleSubmit = async () => {
    const newErrors: Partial<SignupData> = {}

    if (signupData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupData.username,
          password: signupData.password,
        }),
      })

	  console.log("Signup response:", response);

      if (response.ok) {
        alert("Signup successful!")
        // Reset form or redirect
        setSignupData({ username: "", password: "", confirmPassword: "" })
        setCurrentStep(1)
      } else {
        throw new Error("Signup failed")
      }
    } catch (error) {
      alert("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const progressValue = currentStep === 1 ? 50 : 100

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">Step {currentStep} of 2</CardDescription>
          </div>
          <Progress value={progressValue} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={signupData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.username}
                  </div>
                )}
                {usernameAvailable === true && signupData.username.length >= 3 && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Username is available
                  </div>
                )}
                {usernameAvailable === false && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Username is not available
                  </div>
                )}
              </div>

              <Button
                onClick={handleNextStep}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={!signupData.username || !usernameAvailable}
              >
                Next
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {signupData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span>Password strength:</span>
                      <span
                        className={`font-medium ${
                          getPasswordStrength(signupData.password).level === "weak"
                            ? "text-red-600"
                            : getPasswordStrength(signupData.password).level === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {getPasswordStrength(signupData.password).text}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getPasswordStrength(signupData.password).color}`}
                        style={{
                          width: `${getPasswordStrength(signupData.password).level === "weak" ? 33 : getPasswordStrength(signupData.password).level === "medium" ? 66 : 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isLoading || !signupData.password || !signupData.confirmPassword}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
