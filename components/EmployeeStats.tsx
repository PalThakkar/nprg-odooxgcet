'use client';

interface EmployeeStatsProps {
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    totalDepartments: number;
    avgSalary: number;
  };
}

export function EmployeeStats({ stats }: EmployeeStatsProps) {
  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      change: '+12%',
      changeType: 'positive' as const,
      icon: '👥',
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees,
      change: '+8%',
      changeType: 'positive' as const,
      icon: '✅',
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      change: '+2',
      changeType: 'positive' as const,
      icon: '🏢',
    },
    {
      title: 'Avg Salary',
      value: `$${stats.avgSalary.toLocaleString()}`,
      change: '+5%',
      changeType: 'positive' as const,
      icon: '💰',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl">{card.icon}</div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <div className="flex items-center mt-1">
                <span
                  className={`text-sm font-medium ${
                    card.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {card.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
