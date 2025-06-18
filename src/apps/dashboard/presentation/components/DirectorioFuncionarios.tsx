import React from "react";

interface Funcionario {
  nombre: string;
  cargo: string;
  email: string;
  tel: string;
  foto: string;
}

interface DirectorioFuncionariosProps {
  funcionarios: Funcionario[];
}

const DirectorioFuncionarios: React.FC<DirectorioFuncionariosProps> = ({ funcionarios }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Directorio de Funcionarios
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-100">Nombre</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-100">Cargo</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-100">Correo</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-100">Teléfono</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {funcionarios.map((func) => (
            <tr key={func.email}>
              <td className="px-4 py-2 flex items-center gap-2">
                <img
                  src={func.foto}
                  alt={func.nombre}
                  className="w-8 h-8 rounded-full object-cover border border-blue-100"
                  onError={e =>
                    (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(func.nombre)}&background=1e40af&color=fff`)
                  }
                />
                <span className="text-gray-900 dark:text-gray-100">{func.nombre}</span>
              </td>
              <td className="px-4 py-2 text-blue-700 dark:text-blue-300">{func.cargo}</td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{func.email}</td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{func.tel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DirectorioFuncionarios;