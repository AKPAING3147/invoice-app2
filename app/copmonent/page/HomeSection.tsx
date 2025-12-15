import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Icon components for the features
const Icons = {
  Logo: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Tracking: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Analytics: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Check: () => (
    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  )
};

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Icons.Logo />
            <span>InventoryApp</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex cursor-pointer">
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild className="cursor-pointer">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-36">
           {/* Background Decorative Blob */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
           
          <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl">
                  Inventory management <br className="hidden lg:block"/>
                  <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">simplified.</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0 leading-relaxed">
                  Track, manage, and organize your inventory with ease. Designed for small businesses and startups to scale efficiently.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 shadow-lg shadow-primary/20 rounded-full">
                  <a href="#signup">Get Started</a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8 rounded-full">
                  <a href="#demo">View Demo</a>
                </Button>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icons.Check />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Check />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-[500px] lg:max-w-none relative perspective-[2000px]">
              {/* Abstract Dashboard UI Mockup */}
              <div className="relative rounded-xl border bg-card text-card-foreground shadow-2xl overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-700 ease-out">
                <div className="p-3 bg-muted/50 border-b flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80"/>
                  <div className="w-3 h-3 rounded-full bg-green-400/80"/>
                  <div className="ml-4 h-4 w-64 bg-background/50 rounded-md text-[10px] flex items-center px-2 text-muted-foreground">inventory-app.com/dashboard</div>
                </div>
                
                <div className="bg-background aspect-[4/3] p-6 space-y-6">
                    {/* Mock Header */}
                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                        <div className="space-y-1">
                          <div className="h-5 w-32 bg-foreground/10 rounded" />
                          <div className="h-3 w-20 bg-muted-foreground/20 rounded" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-primary/10 rounded-full" />
                          <div className="h-8 w-8 bg-muted rounded-full" />
                        </div>
                    </div>

                    {/* Mock Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-muted/30 p-3 rounded-lg space-y-2 border border-border/50">
                          <div className="h-3 w-12 bg-muted-foreground/20 rounded" />
                          <div className="h-6 w-16 bg-foreground/10 rounded" />
                        </div>
                      ))}
                    </div>

                    {/* Mock List */}
                    <div className="space-y-3 pt-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-12 w-full bg-muted/20 rounded-lg border border-border/50 flex items-center px-3 gap-3">
                             <div className="h-8 w-8 bg-primary/10 rounded-md" />
                             <div className="space-y-1.5 flex-1">
                                <div className="h-2.5 w-1/3 bg-foreground/10 rounded" />
                                <div className="h-2 w-1/4 bg-muted-foreground/20 rounded" />
                             </div>
                             <div className="h-6 w-16 bg-muted rounded" />
                          </div>
                        ))}
                    </div>
                </div>
              </div>
               
               {/* Decorative elements behind */}
               <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
               <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to scale</h2>
              <p className="text-muted-foreground text-lg">
                Manage your products, customers, and orders from a single intuitive dashboard.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Real-time Tracking", description: "Monitor your inventory levels instantly and avoid stock-outs with automated alerts.", icon: Icons.Tracking },
                { title: "Reports & Analytics", description: "Get deep insights on your inventory trends and make data-driven decisions.", icon: Icons.Analytics },
                { title: "Team Collaboration", description: "Invite your team, assign roles, and manage access permissions seamlessly.", icon: Icons.Users },
              ].map((feature, i) => (
                <Card key={i} className="bg-background border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <feature.icon />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
             <div className="container mx-auto px-4 md:px-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-8 md:p-20 text-center max-w-5xl mx-auto relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to transform your business?</h2>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                            Join thousands of businesses that trust InventoryApp to manage their stock efficiently.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 h-12 px-8 font-semibold rounded-full">
                                <a href="#signup">Start your free trial</a>
                            </Button>
                            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 hover:text-white h-12 px-8 font-semibold rounded-full bg-transparent">
                                <a href="#contact">Contact Sales</a>
                            </Button>
                        </div>
                    </div>
                    
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/30 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl opacity-50" />
                </div>
             </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Icons.Logo />
            <span>InventoryApp</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2025 InventoryApp. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
