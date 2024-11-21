import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';


interface UserDoctorData {
    name: string;
    users: number;
    doctors: number;
    year: number;
    month: number
}

interface UserDoctorChartProps {
    data: UserDoctorData[]; // Array of data objects
}

const UserDoctorChart: React.FC<UserDoctorChartProps> = ({ data }) => {
    // Get the current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed, so add 1
    const currentYear = currentDate.getFullYear();

    // Filter and format data for the last 12 months
    const last12MonthsData = data
        .filter(item => {
            const itemDate = new Date(item.year, item.month - 1); // Create a date object for the item
            const monthsDiff = (currentYear - item.year) * 12 + (currentMonth - item.month); // Calculate the difference in months
            return monthsDiff >= 0 && monthsDiff < 12; // Only keep items within the last 12 months
        })
        .map(item => ({
            ...item,
            name: `${item.month}/${item.year}`, // Format the name as "MM/YYYY"
        }))
        .sort((a, b) => new Date(a.year, a.month - 1).getTime() - new Date(b.year, b.month - 1).getTime()); // Sort in ascending order

    return (
        <ResponsiveContainer width="95%" height="100%">
            <BarChart
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
                <Bar
                    dataKey="users"
                    fill="#8884d8"
                    name="Users Registered"
                    activeBar={<Rectangle fill="pink" stroke="blue" />} // Active bar style
                />
                <Bar
                    dataKey="doctors"
                    fill="#82ca9d"
                    name="Doctors Registered"
                    activeBar={<Rectangle fill="gold" stroke="purple" />} // Active bar style
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default UserDoctorChart;
