"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Checkbox } from "./checkbox"
import LoadingSpinner from "../shared/LoadingSpinner"

interface Props {
    title: string;
    loading?: boolean;
    items: {
        id: string | number;
        name: string;
        checked: boolean;
        onClick?: (id: string | number) => void;
        slug: string;
    }[];
}

export default function CollapsibleMenu({ title, loading, items = [] }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-2"
        >
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex w-full justify-between p-2 h-auto font-normal hover:bg-[#F5F5F5]"
                >
                    <span>{title}</span>
                    {(isOpen && loading) ? (
                        <LoadingSpinner size="small" color="secondary" />
                    )
                        : <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
                    }
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-2">
                <div className="p-2 space-y-3">
                    {items.length > 0 && items.map(item => (
                        <div key={item.id} className="flex items-center gap-2">
                            <Checkbox
                                checked={item.checked}
                                onCheckedChange={() => item.onClick?.(item.id)} />
                            <label className="text-sm font-medium">{item.name}</label>
                        </div>
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}