"use client";

import { useState } from "react";
import { Check } from "lucide-react";

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
import { authClient } from "@/lib/auth-client";
import { AccountStepForm } from "@/features/auth/components/account-step-form";
import { CreateOrganizationForm } from "@/features/organization/components/create-organization-form";

const indicatorClassName =
  "data-[state=active]:border-brass data-[state=active]:text-brass " +
  "data-[state=completed]:border-brass data-[state=completed]:bg-brass data-[state=completed]:text-brass-foreground " +
  "data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground";

export function SignUpStepper() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: organizations, isPending: isOrgPending } =
    authClient.useListOrganizations();

  const [manualStep, setManualStep] = useState<1 | 2 | null>(null);

  const isPending = isSessionPending || (Boolean(session) && isOrgPending);
  const resumedStep: 1 | 2 = session && (organizations?.length ?? 0) === 0 ? 2 : 1;
  const step = manualStep ?? resumedStep;

  if (isPending) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
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
          <StepperSeparator className="group-data-[state=completed]/step:bg-brass" />
        </StepperItem>
        <StepperItem step={2}>
          <StepperTrigger disabled>
            <StepperIndicator className={indicatorClassName}>2</StepperIndicator>
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