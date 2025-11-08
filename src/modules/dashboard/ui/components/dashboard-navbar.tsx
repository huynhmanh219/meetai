"use client"

import { Button } from "@/components/ui/button"
import { PanelLeftIcon } from "lucide-react"

export const DashboardNavbar = ()=>{
    return (
        <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
            <Button className="size-9" variant="outline">
                <PanelLeftIcon ></PanelLeftIcon>
            </Button>
        </nav>
    )
}