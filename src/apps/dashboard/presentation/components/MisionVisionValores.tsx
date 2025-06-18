const MISION = "Brindar servicios de salud con calidad, humanización y eficiencia, contribuyendo al bienestar de nuestros usuarios y la comunidad.";
const VISION = "Ser reconocidos como una IPS líder en atención integral, innovación y compromiso social en el sector salud.";
const VALORES = ["Ética", "Respeto", "Compromiso", "Innovación", "Trabajo en equipo"];

export default function MisionVisionValores() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">Misión</h2>
        <p className="text-gray-700 dark:text-gray-200">{MISION}</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">Visión</h2>
        <p className="text-gray-700 dark:text-gray-200">{VISION}</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 flex flex-col">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">Valores</h2>
        <ul className="flex flex-wrap gap-2 mt-2">
          {VALORES.map(valor => (
            <li key={valor} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              {valor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}