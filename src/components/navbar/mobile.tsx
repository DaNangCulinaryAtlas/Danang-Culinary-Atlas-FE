"use client"
import React, {useState} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@/components/ui/sheet';
  import { ScrollArea } from '@/components/ui/scroll-area';
  import { Menu } from 'lucide-react';
 import menuItems from "@/types/navbar.items";
export default function  MobileMenu(){
    const [open, setOpen] = useState(false);
    return( 
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="md:hidden bg-[#69C3CF] w-10 rounded-none hover:bg-[#55a1a7]">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="flex justify-between items-center">
                    <SheetTitle className="font-mulish font-bold text-lg">Menu</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="text-lg font-mulish text-[#495560] hover:opacity-90 transition-opacity block mb-4"
                        >
                            {item.label}
                        </Link>
                    ))}
                </ScrollArea>
                </SheetContent>
            </Sheet>
    )
}