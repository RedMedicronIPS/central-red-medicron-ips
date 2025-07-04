import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { HiUserCircle, HiOutlineMap, HiOutlinePhone } from "react-icons/hi2";

const estructura = {
  nombre: "Asamblea General de Asociados",
  persona: "Asamblea General de Asociados",
  area: "Asamblea general de Asociados",
  foto: "/fotos/asambleaGeneralAsociados.jpg",
  email: "asambleageneral@redmedicronips.com.co",
  tel: "301 123 4567",
  hijos: [
    {
      nombre: "Revisor Fiscal",
      persona: "Dr. Edgar Ojeda",
      area: "Revisoria Fiscal",
      foto: "/fotos/EdgarOjeda.jpg",
      email: "revisoriaFiscal@redmedicronips.com.co",
      tel: "302 234 5678",
      hijos: [
        {
          nombre: "Profesional Revisoria Fiscal",
          persona: "Dr. Nelly Cordoba",
          area: "Revisoria Fiscal",
          foto: "/fotos/NellyCordoba.jpg",
          email: "profesionalrevisoriafiscal@redmedicronips.com.co",
          tel: "303 345 6789",
        },
      ],
    },
    {
      nombre: "Consejo de Administracion",
      persona: "Consejo de Administracion",
      area: "Consejo de Administracion",
      foto: "/fotos/consejoAdminstracion.jpg",
      email: "consejoAdminstracion@redmedicronips.com.co",
      tel: "304 456 7890",
      hijos: [
        {
          nombre: "Control Interno",
          persona: "Dr. Nelly Cordoba",
          area: "Revisoria Fiscal",
          foto: "/fotos/NellyCordoba.jpg",
          email: "profesionalrevisoriafiscal@redmedicronips.com.co",
          tel: "303 345 6789",
          hijos: [
            {
              nombre: "Profesional Revisoria Fiscal",
              persona: "Dr. Nelly Cordoba",
              area: "Revisoria Fiscal",
              foto: "/fotos/NellyCordoba.jpg",
              email: "profesionalrevisoriafiscal@redmedicronips.com.co",
              tel: "303 345 6789",
            },
          ],
        },
        {
          nombre: "Oficial de Cumplimiento",
          persona: "Dr. David Jaramillo",
          area: "Oficial de Cumplimiento",
          foto: "/fotos/DavidJaramillo.jpg",
          email: "oficialdecumpliento@redmedicronips.com.co",
          tel: "303 345 6789",
          
        },
        {
          nombre: "Comite Contraloria Interna",
          persona: "Comite Contraloria Interna",
          area: "Comite Contraloria Interna",
          foto: "/fotos/ComiteContraloriaInterna.jpg",
          email: "Comitecontraloriainterna@redmedicronips.com.co",
          tel: "303 345 6789",
          
        },
        {
          nombre: "Director Ejecutivo",
          persona: "Dr. Maurico Enriquez",
          area: "Direccion Ejecutiva",
          foto: "/fotos/MauricioEnriquez.jpg",
          email: "direccionejecutiva@redmedicronips.com.co",
          tel: "303 345 6789",
          
        },
      ],
    },
  ],
};

function CardOrg({
  nombre,
  persona,
  area,
  foto,
  email,
  tel,
}: {
  nombre: string;
  persona: string;
  area?: string;
  foto?: string;
  email?: string;
  tel?: string;
}) {
  return (
    <div className="flex flex-col items-center bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-700 px-6 py-5 min-w-[220px] max-w-[250px] transition-transform hover:scale-105 hover:shadow-2xl backdrop-blur-md relative group">
      <div className="absolute -top-3 right-3">
        {area && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 shadow">
            {area}
          </span>
        )}
      </div>
      {foto ? (
        <img
          src={foto}
          alt={persona}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 mb-2 shadow-lg"
          onError={e => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(persona)}&background=2563eb&color=fff`)}
        />
      ) : (
        <HiUserCircle className="w-16 h-16 text-blue-400 mb-2" />
      )}
      <span className="font-bold text-blue-700 dark:text-blue-300 text-center text-base">{nombre}</span>
      <span className="text-gray-900 dark:text-gray-100 text-center text-sm font-medium">{persona}</span>
      <div className="flex flex-col items-center mt-2 gap-1">
        {email && (
          <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-200">
            <HiOutlineMap className="w-4 h-4" /> {email}
          </span>
        )}
        {tel && (
          <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-200">
            <HiOutlinePhone className="w-4 h-4" /> {tel}
          </span>
        )}
      </div>
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition-all pointer-events-none" />
    </div>
  );
}

function renderNodo(nodo: any) {
  return (
    <TreeNode
      label={
        <CardOrg
          nombre={nodo.nombre}
          persona={nodo.persona}
          area={nodo.area}
          foto={nodo.foto}
          email={nodo.email}
          tel={nodo.tel}
        />
      }
    >
      {nodo.hijos &&
        nodo.hijos.map((hijo: any, idx: number) => (
          // Agrega una key única aquí
          <React.Fragment key={hijo.nombre + "-" + idx}>
            {renderNodo(hijo)}
          </React.Fragment>
        ))}
    </TreeNode>
  );
}

export default function EstructuraOrganizacional() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 overflow-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center tracking-tight">
        Estructura Organizacional
      </h2>
      <div className="flex justify-center min-w-[350px] overflow-x-auto pb-4">
        <Tree
          lineWidth={"3px"}
          lineColor={"#2563eb"}
          lineBorderRadius={"12px"}
          label={<></>}
        >
          {renderNodo(estructura)}
        </Tree>
      </div>
      <style>
        {`
          .react-organizational-chart-node > .react-organizational-chart-node-label {
            background: transparent !important;
            box-shadow: none !important;
          }
        `}
      </style>
    </div>
  );
}