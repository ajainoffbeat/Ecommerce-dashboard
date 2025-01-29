import Header from "@/components/header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Line, LineChart, ResponsiveContainer, CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, Pie, PieChart, Cell, AreaChart, Area, Legend, LabelList } from "recharts"
import { Activity, CreditCard, DollarSign, Package, ShoppingCart, Users } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import StatisticCard from "@/components/widgets/statistic-card"
import PieChartCard from "@/components/widgets/piechart-card"
import { revenueData, ordersData, productsData, activeCustomersData, COLORS, chartData, recentOrders } from "@/constant/widget";

const salesByCategory = [
  { name: "Electronics", value: 40 },
  { name: "Clothing", value: 25 },
  { name: "Home & Garden", value: 20 },
  { name: "Books", value: 15 }
]

const customerAcquisition = [
  { month: "Jan", organic: 800, paid: 700, referral: 300 },
  { month: "Feb", organic: 1000, paid: 900, referral: 700 },
  { month: "Mar", organic: 1200, paid: 600, referral: 1000 },
  { month: "Apr", organic: 900, paid: 1150, referral: 700 },
  { month: "May", organic: 1400, paid: 900, referral: 1300 },
  { month: "Jun", organic: 1500, paid: 1000, referral: 900 }
]

const averageOrderValue = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 125 },
  { month: "Mar", value: 132 },
  { month: "Apr", value: 130 },
  { month: "May", value: 139 },
  { month: "Jun", value: 145 }
]

const topProducts = [
  { name: "Iphone 15", sales: 1200 },
  { name: "Samsung S24", sales: 980 },
  { name: "Nike Dunk Low", sales: 850 },
  { name: "Realme NARZO", sales: 780 },
  { name: "New Balance 9060", sales: 650 },
]

const retentionRate = [
  { month: "Jan", rate: 45 },
  { month: "Feb", rate: 60 },
  { month: "Mar", rate: 52 },
  { month: "Apr", rate: 79 },
  { month: "May", rate: 58 },
  { month: "Jun", rate: 67 }
]


const CATEGORY_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Dashboard() {
  return (
    <SidebarInset>
      <Header />
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="flex-1 space-y-4 p-4 md:p-4 pt-4">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatisticCard title="Total Revenue" icon={DollarSign} data={revenueData} dataKey="value" unit="$" />
                <StatisticCard title="Orders" icon={ShoppingCart} data={ordersData} dataKey="value" />
                <StatisticCard title="Products Sold" icon={Package} data={productsData} dataKey="value" />
                <PieChartCard title="Visitor Activity Status" data={activeCustomersData} colors={COLORS} />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={chartData}>
                        <XAxis
                          dataKey="month"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length && payload[0].value) {
                              return (
                                <div className="bg-background border rounded shadow p-2 text-xs">
                                  <span className="font-bold">{payload[0].payload.month}</span>
                                  <span className="ml-5 font-mono">${payload[0].value.toLocaleString()}</span>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <CartesianGrid vertical={false} />
                        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-[#2563eb]" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <p>You have {recentOrders.length} orders this month.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={`/placeholder.svg?text=${order.customer.charAt(0)}`} alt="Avatar" />
                            <AvatarFallback>{order.customer.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">{order.product}</p>
                          </div>
                          <div className="ml-auto font-medium">${order.amount}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sales by Category - Donut Chart */}
                <Card className="col-span-1 row-span-1">
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                    <CardDescription>Distribution of sales across product categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={salesByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {salesByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} margin={{ top: 10, left: 0, right: 0, bottom: 0 }} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border rounded shadow p-2 text-xs">
                                    <span className="w-4 h-4 rounded" style={{ backgroundColor: payload[0].payload.fill }}> &nbsp; &nbsp;  &nbsp;</span>
                                    <span className="font-normal ml-2">{payload[0].name}</span>
                                    <span className="font-bold ml-4 font-mono">{payload[0].value}</span>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Acquisition - Line Chart */}
                <Card className="col-span-1 md:col-span-2 row-span-1">
                  <CardHeader>
                    <CardTitle>Customer Acquisition</CardTitle>
                    <CardDescription>Source of new customers over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={customerAcquisition}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          {/* <Tooltip /> */}
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border rounded shadow p-2 text-xs">
                                    {payload.map((item , i) => {
                                      return (<div className="flex justify-between mt-1" key={i}>
                                        <div>
                                          <span className="w-4 h-4 rounded" style={{ backgroundColor: item.stroke }}> &nbsp; &nbsp;  &nbsp;</span>
                                          <span className="font-normal ml-2">{item.name}</span>
                                        </div>
                                        <span className="font-bold ml-4 font-mono">{item.value}</span>
                                      </div>)
                                    })}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line type="monotone" dataKey="organic" stroke="#2563eb" name="Organic" />
                          <Line type="monotone" dataKey="paid" stroke="#16a34a" name="Paid" />
                          <Line type="monotone" dataKey="referral" stroke="#d97706" name="Referral" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Average Order Value - Area Chart */}
                <Card className="col-span-1 md:col-span-2 row-span-1">
                  <CardHeader>
                    <CardTitle>Average Order Value</CardTitle>
                    <CardDescription>Trend of average order value over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={averageOrderValue}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#93c5fd" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products - Bar Chart */}
                <Card className="col-span-1 row-span-1">
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best selling products by volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] overflow-y-auto">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={topProducts} layout="vertical" >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} hide />
                          {/* <Tooltip /> */}
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border rounded shadow p-2 text-xs">
                                    <span className="font-normal">{payload[0].name}</span>
                                    <span className="font-bold ml-4 font-mono">{payload[0].value}</span>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="sales" fill="#2563eb" >
                            <LabelList dataKey="name" position="center" style={{ fill: '#fff' , fontSize: '10px'}} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue by Channel */}
                <Card className="col-span-1 row-span-1 ">
                  <CardHeader>
                    <CardTitle>Revenue by Channel</CardTitle>
                    <CardDescription>Distribution of revenue across sales channels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Online Store', value: 4000 },
                              { name: 'Marketplace', value: 3000 },
                              { name: 'Social Media', value: 2000 },
                              { name: 'Retail', value: 1000 },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {CATEGORY_COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border rounded shadow p-2 text-xs">
                                    <span className="w-4 h-4 rounded" style={{ backgroundColor: payload[0].payload.fill }}> &nbsp; &nbsp;  &nbsp;</span>
                                    <span className="font-normal ml-2">{payload[0].name}</span>
                                    <span className="font-bold ml-4 font-mono">{payload[0].value}</span>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend className="text-sm" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Retention Rate - Line Chart */}
                <Card className="col-span-1 md:col-span-2 row-span-1">
                  <CardHeader>
                    <CardTitle>Customer Retention Rate</CardTitle>
                    <CardDescription>Percentage of returning customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={retentionRate}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="rate" stroke="#2563eb" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarInset>
  );
}

