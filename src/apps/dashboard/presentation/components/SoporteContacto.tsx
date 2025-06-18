export default function SoporteContacto() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Soporte y Contacto</h2>
      <ul className="space-y-2">
        <li>
          <span className="font-semibold text-blue-700 dark:text-blue-300">Talento Humano:</span>
          <span className="ml-2 text-gray-700 dark:text-gray-200">talentohumano@redmedicronips.com.co</span>
        </li>
        <li>
          <span className="font-semibold text-blue-700 dark:text-blue-300">Soporte TIC:</span>
          <span className="ml-2 text-gray-700 dark:text-gray-200">tics@redmedicronips.com.co</span>
        </li>
        <li>
          <span className="font-semibold text-blue-700 dark:text-blue-300">Teléfono:</span>
          <span className="ml-2 text-gray-700 dark:text-gray-200">+57 (317) 498-0971</span>
        </li>
      </ul>
    </div>
  );
}