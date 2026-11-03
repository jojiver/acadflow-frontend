import type { ReactNode } from "react";
import  { cn } from "@/lib/cn";

type EmptyStateProps = {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
}

function EmptyState({ title, description, icon, action, className}: EmptyStateProps) {
    return(
        <div className={cn("flex flex-ciol items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center", 
            className,
        )}
        >
            {icon && <div className="mb-3 text-slate-400">{icon}</div>}
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {description &&(
                <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
            )}
            {action  &&  <div className="mt-4">{action}</div>}
            </div>
        
    )
}