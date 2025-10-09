"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import PieChart from "../charts/PieChart";
import { ChartConfig } from "../ui/chart";

const salesData = [
    { date: "Mon", sales: 400 },
    { date: "Tue", sales: 300 },
    { date: "Wed", sales: 500 },
    { date: "Thu", sales: 200 },
    { date: "Fri", sales: 350 },
    { date: "Sat", sales: 600 },
    { date: "Sun", sales: 450 },
]

// const orderStatusData = [
//     { name: "Pending", value: 12 },
//     { name: "Processing", value: 30 },
//     { name: "Shipped", value: 22 },
//     { name: "Delivered", value: 50 },
//     { name: "Cancelled", value: 5 },
// ]

const topProductsData = [
    { name: "T-shirt", sales: 120 },
    { name: "Shoes", sales: 90 },
    { name: "Bag", sales: 70 },
    { name: "Cap", sales: 50 },
]

const categoryRevenueData = [
    { category: "Clothing", revenue: 3000 },
    { category: "Shoes", revenue: 2200 },
    { category: "Accessories", revenue: 1200 },
]

// const customerData = [
//     { name: "New", value: 60 },
//     { name: "Returning", value: 40 },
// ]

// const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-3)",
    },
    edge: {
        label: "Edge",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--chart-1)" },
    { browser: "safari", visitors: 200, fill: "var(--chart-2)" },
    { browser: "firefox", visitors: 187, fill: "var(--chart-3)" },
    { browser: "edge", visitors: 173, fill: "var(--chart-4)" },
    { browser: "other", visitors: 90, fill: "var(--chart-5)" },
]

const Logs = () => {
    return (
        <div className="p-6 space-y-6">
            {/* KPIs Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">$12,500</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">1,240</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Active Customers</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">860</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Today</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">$1,150</CardContent>
                </Card>
            </div>

            {/* Sales Over Time */}
            <Card>
                <CardHeader>
                    <CardTitle>Sales Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Orders by Status + Top Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PieChart
                    title="Pie Chart"
                    dataKey="visitors"
                    nameKey="browser"
                    chartData={chartData}
                    chartConfig={chartConfig}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProductsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#22c55e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue by Category + New vs Returning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryRevenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>New vs Returning Customers</CardTitle>
                    </CardHeader>
                    {/* <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={customerData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {customerData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent> */}
                </Card>
            </div>
        </div>
    )
}

export default Logs