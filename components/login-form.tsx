"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

interface LoginData {
  username: string
  password: string
}

export function LoginForm() {
  const [loginData, setLoginData] = useState<LoginData>({ username: "", password: "" })
  const [errors, setErrors] = useState<Partial<LoginData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleSubmit = async () => {
    const newErrors: Partial<LoginData> = {}

    if (!loginData.username) newErrors.username = "Username is required"
    if (!loginData.password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setLoginError(null)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Login successful!")
		console.log("Login response data:", data)
      } else {
        setLoginError(data.error || "Login failed")
      }
    } catch (err) {
      setLoginError("Login request failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center text-muted-foreground">Enter your credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={loginData.username}
              onChange={(e) => {
                setLoginData((prev) => ({ ...prev, username: e.target.value }))
                setErrors((prev) => ({ ...prev, username: undefined }))
              }}
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.username}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => {
                  setLoginData((prev) => ({ ...prev, password: e.target.value }))
                  setErrors((prev) => ({ ...prev, password: undefined }))
                }}
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
            {errors.password && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </div>
            )}
          </div>

          {loginError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {loginError}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
