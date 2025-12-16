"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components//ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/app/store/useAccountStore';
import { useLanguageStore } from "@/app/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { fetchProducts, Product } from '@/app/service/product';
import { fetchVouchers, Voucher } from '@/app/service/voucher';
import { getUserProfile, UserProfile } from '@/app/service/user';
import { Sidebar } from "@/components/Sidebar";
import { Package, ShoppingCart, Users, Search, Bell } from "lucide-react";

export function DashboardSection() {
  const router = useRouter();
  const { token, logout } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [user, setUser] = useState<UserProfile | null>(null);

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    stock: 0,
    customers: 0
  });

  const [recentSales, setRecentSales] = useState<Voucher[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        // Fetch Dashboard Stats
        const statsRes = await fetch('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats({
            revenue: 0, // Keeping 0 for now as it needs voucher aggregation or another API field
            orders: data.voucherCount,
            stock: data.productCount,
            customers: data.customerCount
          });
          setUser({ ...user, name: data.userName, email: user?.email || "" } as UserProfile);
        }

        // Load Products for Low Stock
        const productData = await fetchProducts(token);
        const products: Product[] = Array.isArray(productData) ? productData : productData.data || [];
        const lowStockItems = products.filter(p => (p.stock || 0) < 10);
        setLowStock(lowStockItems);

        // Load Recent Vouchers
        const voucherData = await fetchVouchers(token);
        const vouchers: Voucher[] = Array.isArray(voucherData) ? voucherData : voucherData.data || [];
        setRecentSales(vouchers.slice(0, 5));

        // Calculate Revenue manually from fetched vouchers for now
        const revenue = vouchers.reduce((acc: number, v: any) => acc + (Number(v.total) || 0), 0);
        setStats(prev => ({ ...prev, revenue: revenue }));

      } catch (e) {
        console.error("Dashboard load error", e);
      }
    };

    loadData();
  }, [token, router]);

  return (
    <div className="flex h-screen bg-muted/20 font-sans">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur flex items-center justify-between px-6 z-10">
          <h1 className="text-lg font-semibold">{t.dashboard}</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t.search} className="pl-9 h-9 bg-muted/40" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: t.total + " " + t.paid, value: `$${stats.revenue.toLocaleString()}`, change: t.grand_total, icon: ShoppingCart },
              { label: t.total + " " + t.orders, value: stats.orders, change: t.orders, icon: ShoppingCart },
              { label: t.inventory, value: stats.stock, change: t.stock, icon: Package },
              { label: t.customers, value: stats.customers, change: t.customers, icon: Users },
            ].map((stat, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">
                    <stat.icon className="h-4 w-4" />
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

            {/* Recent Orders */}
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle>{t.orders}</CardTitle>
                <CardDescription>
                  {t.no_orders_found}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.length === 0 ? <p className="text-sm text-muted-foreground">{t.no_orders_found}</p> : recentSales.map((order, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {(order as any).customer_name?.charAt(0) || "C"}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{(order as any).customer_name || `Customer #${order.customerId}`}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.date ? new Date(order.date).toLocaleDateString() : 'No Date'} · {(order as any).customer_email || "No Email"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-medium text-sm">+${Number(order.total).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Low Stock Alert */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Low Stock Alert ({lowStock.length})</CardTitle>
                <CardDescription>
                  {t.out_of_stock}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStock.length === 0 ? <p className="text-sm text-muted-foreground">{t.no_products}</p> : lowStock.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-red-500 font-medium">Restock needed</p>
                      </div>
                      <div className="h-8 w-8 rounded-md bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                        {item.stock}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline" size="sm" onClick={() => router.push("/product")}>
                  {t.inventory}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
