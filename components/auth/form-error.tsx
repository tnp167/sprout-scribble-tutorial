import { AlertCircle } from "lucide-react";

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className=" flex text-xs font-medium items-center my-4 gap-2 bg-destructive/25 text-secondary-foreground p-3 rounded-medium">
      <AlertCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
