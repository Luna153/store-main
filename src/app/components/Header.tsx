import React from 'react';
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiShoppingCart, FiLogOut,FiLogIn } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';

import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";


export default function Header() {

    const components: { title: string; href: string; description: string; }[] = [
        {
            title: "Alert Dialog",
            href: "/docs/primitives/alert-dialog",
            description:
                "A modal dialog that interrupts the user with important content and expects a response.",
        },
        {
            title: "Hover Card",
            href: "/docs/primitives/hover-card",
            description:
                "For sighted users to preview content available behind a link.",
        },
        {
            title: "Progress",
            href: "/docs/primitives/progress",
            description:
                "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
        },
        {
            title: "Scroll-area",
            href: "/docs/primitives/scroll-area",
            description: "Visually or semantically separates content.",
        },
        {
            title: "Tabs",
            href: "/docs/primitives/tabs",
            description:
                "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
        },
        {
            title: "Tooltip",
            href: "/docs/primitives/tooltip",
            description:
                "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
        },
    ];

    return (
        <>
            <div className="bg-slate-100 w-full h-16 flex justify-between items-center px-10">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    {/* <AvatarFallback>CN</AvatarFallback> */}
                </Avatar>
                <div className="flex items-center gap-5">
                    {/* <NavigationMenu viewport={false}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="#">ABOUT US</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-4">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">A</Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">B</Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">C</Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu> */}
                    <FaUser />
                    <FiShoppingCart />
                    <FiLogOut />
                    {/* <FiLogIn /> */}
                    
                </div>
            </div>
        </>
    );
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
