import { HiUserGroup, HiCheckCircle, HiTrendingUp } from "react-icons/hi";

const INDICADORES = [
  {
    label: "Satisfacción Usuarios",
    value: "94%",
    icon: <HiUserGroup className="w-7 h-7" />,
    color: "green",
    trend: "+2%",
  },
  {
    label: "Atenciones este mes",
    value: "1,230",
    icon: <HiCheckCircle className="w-7 h-7" />,
    color: "blue",
    trend: "+5%",
  },
  {
    label: "Metas cumplidas",
    value: "87%",
    icon: <HiTrendingUp className="w-7 h-7" />,
    color: "yellow",
    trend: "+1%",
  },
];

export default function IndicadoresKPI() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {INDICADORES.map((kpi) => (
        <div key={kpi.label} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 flex flex-col items-center">
          <div className={`p-3 rounded-full bg-${kpi.color}-100 dark:bg-${kpi.color}-900 mb-2`}>
            {kpi.icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpi.value}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.label}</p>
          <span className={`mt-1 text-xs font-semibold text-${kpi.color}-700 dark:text-${kpi.color}-300`}>{kpi.trend}</span>
        </div>
      ))}
    </div>
  );
}