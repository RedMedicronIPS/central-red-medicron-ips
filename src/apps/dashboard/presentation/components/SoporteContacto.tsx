import { HiOutlineMap, HiOutlinePhone, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const SOPORTE = [
  {
    canal: "Correo electrónico",
    valor: "soporte@redmedicronips.com.co",
    icono: <HiOutlineMap className="w-8 h-8 text-blue-600" />,
    link: "mailto:soporte@redmedicronips.com.co",
    color: "from-blue-50/80 to-blue-100/60 dark:from-blue-900/60 dark:to-blue-800/40"
  },
  {
    canal: "WhatsApp",
    valor: "+57 317 498 0971",
    icono: <HiOutlineChatBubbleLeftRight className="w-8 h-8 text-green-600" />,
    link: "https://wa.me/573174980971",
    color: "from-green-50/80 to-green-100/60 dark:from-green-900/60 dark:to-green-800/40"
  },
  {
    canal: "Teléfono",
    valor: "(2) 724 5678",
    icono: <HiOutlinePhone className="w-8 h-8 text-yellow-600" />,
    link: "tel:+5727245678",
    color: "from-yellow-50/80 to-yellow-100/60 dark:from-yellow-900/60 dark:to-yellow-800/40"
  },
];

export default function SoporteContacto() {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center tracking-tight">
        Soporte y Contacto
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        ¿Tienes dudas o necesitas ayuda? Nuestro equipo de soporte está disponible de lunes a viernes de 8:00 a.m. a 6:00 p.m.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {SOPORTE.map((item) => (
          <a
            key={item.canal}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex flex-col items-center justify-between rounded-xl shadow-xl bg-gradient-to-br ${item.color} transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none border border-white/30 dark:border-gray-800/40 p-6 min-h-[180px]`}
          >
            <div className="mb-2">{item.icono}</div>
            <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1 text-center">
              {item.canal}
            </div>
            <div className="text-gray-700 dark:text-gray-200 text-center text-base mb-3">{item.valor}</div>
            <span className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-700 dark:text-blue-200 text-xs font-medium shadow group-hover:bg-blue-200 group-hover:text-blue-900 transition">
              Contactar
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}