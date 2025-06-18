const DOCUMENTOS = [
  { nombre: "Manual de Convivencia", url: "/docs/manual-convivencia.pdf" },
  { nombre: "Política de Vacaciones", url: "/docs/politica-vacaciones.pdf" },
  { nombre: "Formato de Permisos", url: "/docs/formato-permisos.pdf" },
];

export default function DocumentosRecursosRapidos() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Recursos Rápidos</h2>
      <ul className="space-y-2">
        {DOCUMENTOS.map((doc) => (
          <li key={doc.nombre}>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 dark:text-blue-300 hover:underline"
            >
              {doc.nombre}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}