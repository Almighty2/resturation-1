"use client"
import { useSession, signOut } from "next-auth/react";
import SideNav from "../ui/dashboard/sidenav";
import NotificationProvider from "../ui/information/message";
export default function DashboardLayout({children} : {children : React.ReactNode}){
    const { data: session, status } = useSession();
    console.log('status ',status,session)
    
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64 bg-gray-200">
            <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </div>
        </div>
    )
}