"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/reui/stepper";
import { AccountStepForm } from "@/features/auth/components/account-step-form";
import { CreateOrganizationForm } from "@/features/organization/components/create-organization-form";
import { authClient } from "@/lib/auth-client";

type SignUpStep = 1 | 2;

const indicatorClassName =
  "data-[state=active]:border-primary data-[state=active]:text-primary " +
  "data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground " +
  "data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground";

export function SignUpStepper() {
  const { data: session, isPending } = authClient.useSession();

  const [manualStep, setManualStep] = useState<SignUpStep | null>(null);

  const initialStep: SignUpStep = session ? 2 : 1;
  const step = manualStep ?? initialStep;

  if (isPending) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Stepper value={step} className="space-y-8">
      <StepperNav>
        <StepperItem step={1}>
          <StepperTrigger disabled>
            <StepperIndicator className={indicatorClassName}>
              {step > 1 ? <Check className="size-3.5" /> : 1}
            </StepperIndicator>

            <span className="text-sm font-medium">Account</span>
          </StepperTrigger>

          <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
        </StepperItem>

        <StepperItem step={2}>
          <StepperTrigger disabled>
            <StepperIndicator className={indicatorClassName}>
              2
            </StepperIndicator>

            <span className="text-sm font-medium">Organization</span>
          </StepperTrigger>
        </StepperItem>
      </StepperNav>

      <StepperPanel>
        <StepperContent value={1}>
          <AccountStepForm onSuccess={() => setManualStep(2)} />
        </StepperContent>

        <StepperContent value={2}>
          <CreateOrganizationForm />
        </StepperContent>
      </StepperPanel>
    </Stepper>
  );
}