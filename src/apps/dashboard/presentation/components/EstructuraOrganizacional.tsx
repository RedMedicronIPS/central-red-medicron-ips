import React from "react";

const ORGANIGRAMA = [
  { cargo: "Gerente General", nombre: "Dra. Ana Martínez", foto: "/fotos/ana.jpg", email: "ana@redmedicronips.com.co", tel: "301 123 4567" },
  { cargo: "Director Médico", nombre: "Dr. Juan Pérez", foto: "/fotos/juan.jpg", email: "juan@redmedicronips.com.co", tel: "302 234 5678" },
  { cargo: "Jefe de Enfermería", nombre: "Enf. Laura Gómez", foto: "/fotos/laura.jpg", email: "laura@redmedicronips.com.co", tel: "303 345 6789" },
  // Agrega más cargos según tu estructura real
];

export default function EstructuraOrganizacional() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Estructura Organizacional</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ORGANIGRAMA.map((persona) => (
          <div key={persona.email} className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
            <img
              src={persona.foto}
              alt={persona.nombre}
              className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-blue-200"
              onError={e => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(persona.nombre)}&background=1e40af&color=fff`)}
            />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{persona.nombre}</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">{persona.cargo}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{persona.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{persona.tel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}