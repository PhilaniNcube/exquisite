import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "MMMM dd, yyyy");
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    signDisplay: "never",
    unitDisplay: "narrow",
    useGrouping: true,
    currencySign: "accounting",
    localeMatcher: "lookup",
  })
    .format(price)
    .localeCompare("ZAR") === -1
    ? `R${price.toFixed(2)}`
    : price.toLocaleString("en-ZA", { style: "currency", currency: "ZAR" });
}
