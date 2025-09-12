import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";

interface TooltipWrapperProps {
  children: ReactNode; // element that triggers tooltip
  content: string; // text inside tooltip
  side?: "top" | "right" | "bottom" | "left"; // optional tooltip placement
  align?: "start" | "center" | "end"; // optional alignment
}

export default function TooltipWrapper({
  children,
  content,
  side = "top",
  align = "center",
}: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
