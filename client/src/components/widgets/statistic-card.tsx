import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideProps, TrendingDown, TrendingUp } from "lucide-react";
import { calculateTrend } from "@/helper/calculateTrend";

interface StatisticCardProps {
    title: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    data: { month: string; value: number }[];
    dataKey: string;
    unit?: string;
}

const StatisticCard = ({ title, icon: Icon, data, dataKey, unit = "" }: StatisticCardProps) => {
    const trend = Number(calculateTrend(data));

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {unit}{data[data.length - 1].value.toLocaleString()}
                </div>
                <p className={`text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-400'}`}>
                    Trending {trend > 0 ? <TrendingUp className="h-4 w-4 inline-block" /> : <TrendingDown className="h-4 w-4 inline-block" />} by {Math.abs(trend)}% this month
                </p>
                <div className="h-[120px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#888888' }}
                                padding={{ left: 10, right: 10 }}
                                interval={0}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length && payload[0].value) {
                                        return (
                                            <div className="bg-background border rounded shadow p-2 text-xs">
                                                <span className="font-bold">{payload[0].payload.month}</span>
                                                <span className="ml-5 font-mono">{unit}{payload[0].value.toLocaleString()}</span>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatisticCard