import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components//ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from 'next/link';

// Internal Icon components for the Dashboard to avoid external dependencies
const Icons = {
  Logo: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-6 w-6", className)} {...props}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Dashboard: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
  ),
  Package: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Cart: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
  ),
  Users: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Settings: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.35a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Search: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("text-muted-foreground", className)} {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Bell: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  LogOut: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  )
};

interface DashboardProps {
  onLogout: () => void;
}

export function DashboardSection({ onLogout }: DashboardProps) {
  return (
    <div className="flex h-screen bg-muted/20 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border/40 hidden md:flex flex-col">
        <div className="p-6 h-16 flex items-center border-b border-border/40">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Icons.Logo />
           <Link href="/">InventoryApp</Link>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3 font-medium">
            <Icons.Dashboard /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-normal text-muted-foreground hover:text-foreground">
            <Icons.Package /> Inventory
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-normal text-muted-foreground hover:text-foreground">
            <Icons.Cart /> Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-normal text-muted-foreground hover:text-foreground">
            <Icons.Users /> Customers
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-normal text-muted-foreground hover:text-foreground">
            <Icons.Settings /> Settings
          </Button>
        </nav>

        <div className="p-4 border-t border-border/40">
           <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                JD
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@example.com</p>
              </div>
           </div>
           <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive" onClick={onLogout}>
             <Icons.LogOut /> Log out
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur flex items-center justify-between px-6 z-10">
          <h1 className="text-lg font-semibold">Dashboard Overview</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4" />
              <Input placeholder="Search..." className="pl-9 h-9 bg-muted/40" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Icons.Bell />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month", icon: Icons.Cart },
              { label: "Active Orders", value: "+573", change: "+201 since last hour", icon: Icons.Cart },
              { label: "Products in Stock", value: "1,203", change: "-4% from last week", icon: Icons.Package },
              { label: "Active Customers", value: "2,350", change: "+180 new this month", icon: Icons.Users },
            ].map((stat, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">
                    <stat.icon />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            
            {/* Recent Sales Table */}
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", status: "Success" },
                    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", status: "Processing" },
                    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", status: "Success" },
                    { name: "William Kim", email: "will@email.com", amount: "+$99.00", status: "Success" },
                    { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", status: "Processing" },
                  ].map((order, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {order.name.charAt(0)}{order.name.split(' ')[1].charAt(0)}
                         </div>
                         <div className="space-y-1">
                           <p className="text-sm font-medium leading-none">{order.name}</p>
                           <p className="text-xs text-muted-foreground">{order.email}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-xs px-2 py-1 rounded-full ${order.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.status}
                        </div>
                        <div className="font-medium text-sm">{order.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>
                  Items below threshold.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {[
                      { name: "Wireless Headphones", stock: 2 },
                      { name: "Mechanical Keyboard", stock: 5 },
                      { name: "USB-C Hub", stock: 8 },
                      { name: "Monitor Stand", stock: 4 },
                    ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-red-500 font-medium">Restock needed</p>
                          </div>
                          <div className="h-8 w-8 rounded-md bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                            {item.stock}
                          </div>
                       </div>
                    ))}
                </div>
                <Button className="w-full mt-6" variant="outline" size="sm">
                  View Inventory
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}