"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { Can } from "@/features/permissions/components/can";
import {
  organizationSchema,
  sectors,
  type OrganizationFormData,
} from "@/features/organization/schemas/organization-schema";

type ActiveOrganization = {
  name: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  employeeCount?: number | null;
  sector?: string | null;
};

export function OrganizationSettingsForm() {
  const { data: activeOrganization, isPending, refetch } =
    authClient.useActiveOrganization();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    values: activeOrganization
      ? {
          name: activeOrganization.name,
          addressLine1: activeOrganization.addressLine1 ?? "",
          addressLine2: activeOrganization.addressLine2 ?? "",
          city: activeOrganization.city ?? "",
          state: activeOrganization.state ?? "",
          country: activeOrganization.country ?? "",
          zip: activeOrganization.zip ?? "",
          employeeCount: activeOrganization.employeeCount ?? undefined,
          sector: activeOrganization.sector ?? "",
        }
      : undefined,
  });

  async function onSubmit(values: OrganizationFormData) {
    setSubmitError(null);
    setSubmitSuccess(false);

    const { error } = await authClient.organization.update({
      data: {
        name: values.name,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2 || undefined,
        city: values.city,
        state: values.state,
        country: values.country,
        zip: values.zip,
        employeeCount: values.employeeCount,
        sector: values.sector,
      },
    });

    if (error) {
      setSubmitError(
        error.message ?? "We couldn't save your changes. Try again.",
      );
      return;
    }

    await refetch();
    setSubmitSuccess(true);
  }

  if (isPending) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (!activeOrganization) {
    return (
      <p className="text-sm text-muted-foreground">
        We couldn&apos;t load your organization. Try refreshing the page.
      </p>
    );
  }

  return (
    <Can
      action="update"
      resource="organization"
      fallback={<OrganizationReadOnlyView organization={activeOrganization} />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Sector</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeCount"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Number of employees</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      if (event.target.value === "") {
                        field.onChange(undefined);
                        return;
                      }
                      const next = event.target.valueAsNumber;
                      field.onChange(Number.isNaN(next) ? undefined : next);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormControl>
                    <Input placeholder="Suite, floor, etc. (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Zip code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {submitError ? (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          ) : null}
          {submitSuccess ? (
            <p className="text-sm text-emerald-600">Organization updated.</p>
          ) : null}

          <Button
            type="submit"
            className="w-fit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Form>
    </Can>
  );
}

function OrganizationReadOnlyView({
  organization,
}: {
  organization: ActiveOrganization;
}) {
  const sectorLabel =
    sectors.find((sector) => sector.value === organization.sector)?.label ??
    organization.sector ??
    "—";

  const fields = [
    { label: "Organization name", value: organization.name },
    { label: "Sector", value: sectorLabel },
    { label: "Number of employees", value: organization.employeeCount ?? "—" },
    { label: "Address", value: organization.addressLine1 ?? "—" },
    { label: "City", value: organization.city ?? "—" },
    { label: "State", value: organization.state ?? "—" },
    { label: "Country", value: organization.country ?? "—" },
    { label: "Zip code", value: organization.zip ?? "—" },
  ];

  return (
    <div className="grid gap-4">
      {fields.map((field) => (
        <div key={field.label} className="grid gap-1">
          <span className="text-sm font-medium">{field.label}</span>
          <span className="text-sm text-muted-foreground">{field.value}</span>
        </div>
      ))}
      <p className="text-sm text-muted-foreground">
        You don&apos;t have permission to edit organization settings.
      </p>
    </div>
  );
}