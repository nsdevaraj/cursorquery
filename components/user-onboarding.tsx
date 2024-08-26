import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getNextButtonColor = () => {
    switch (currentStep) {
      case 1:
        return 'bg-emerald-400 hover:bg-emerald-500'
      case 2:
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 3:
        return 'bg-emerald-600 hover:bg-emerald-700'
      case 4:
        return 'bg-emerald-700 hover:bg-emerald-800'
      default:
        return 'bg-primary hover:bg-primary/90'
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Welcome to Our App!</h2>
            <p>Let&apos;s get you set up with a few simple steps.</p>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Preferences</h2>
            <RadioGroup defaultValue="light">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark Mode</Label>
              </div>
            </RadioGroup>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">You&apos;re All Set!</h2>
            <p>Thank you for completing the onboarding process. Enjoy using our app!</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>User Onboarding</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="h-2 bg-muted rounded-full">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        <Button
          className={`text-white ${getNextButtonColor()} transition-colors duration-300`}
          onClick={handleNext}
          disabled={currentStep === totalSteps}
        >
          {currentStep === totalSteps ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  )
}