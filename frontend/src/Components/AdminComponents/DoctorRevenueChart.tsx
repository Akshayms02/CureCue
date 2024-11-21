import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// Define the interface for the data prop
interface RevenueData {
    name: string; // This represents the name or label for each data point
    doctorRevenue: number; // Revenue generated by doctors
    adminRevenue: number; // Revenue generated by the admin
}

interface RevenueChartProps {
    data: RevenueData[]; // Array of revenue data objects
}

const getLast12MonthsData = (data: any[]) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // JS months are 0-indexed

    // Filter data for the last 12 months
    const last12MonthsData = data
        .filter(item => {
            const itemDate = new Date(item.year, item.month - 1); // Create date from year and month
            const oneYearAgo = new Date(currentYear, currentMonth - 12);
            return itemDate >= oneYearAgo && itemDate <= today;
        })
        .map(item => ({
            ...item,
            name: `${item.year}-${item.month < 10 ? '0' : ''}${item.month}` // Format year-month as YYYY-MM
        }))
        .sort((a, b) => (a.year - b.year) || (a.month - b.month)); // Sort by year then month

    return last12MonthsData;
};

const DoctorRevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    const last12MonthsData = getLast12MonthsData(data);
    console.log("Filtered Data:", last12MonthsData);

    return (
        <ResponsiveContainer width="95%" height="100%">
            <LineChart
                data={last12MonthsData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickCount={12} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="doctorRevenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Doctor Revenue"
                />
                <Line
                    type="monotone"
                    dataKey="adminRevenue"
                    stroke="#82ca9d"
                    name="Admin Revenue"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DoctorRevenueChart;
