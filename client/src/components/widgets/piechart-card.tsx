import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface PieChartCardProps {
  title: string;
  data: {
    name: string;
    value: number;
  }[];
  colors: string[];
}
const PieChartCard = ({ title, data, colors }: PieChartCardProps) => {
  return (<Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Users className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="h-[160px] relative mt-2">
        <ResponsiveContainer width="100%" height="100%" className="relative z-40">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col z-0">
          <span className="text-4xl font-bold">{data[0].value}</span>
          <span className="text-sm text-muted-foreground">Weekly</span>
        </div>
      </div>
    </CardContent>
  </Card>
)};

export default PieChartCard;