import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaLightbulb,
  FaUniversity,
  FaUsers,
  FaChartLine,
  FaReact,
  FaPython,
  FaHandsHelping,
  FaArrowLeft,
} from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa6";
import { SiTailwindcss } from "react-icons/si";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ["easeOut" as const] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const  },
  },
};

const techCardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const , type: "spring" as const, bounce: 0.4 },
  },
};

const About: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: ["easeInOut" as const] },

    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={shouldReduceMotion ? {} : containerVariants}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-800 dark:text-gray-100"
    >
      {/* Botón volver */}
      <motion.button
        variants={buttonVariants}
        whileHover={
          shouldReduceMotion
            ? {}
            : { scale: 1.05, boxShadow: "0 4px 8px rgba(37, 99, 235, 0.2)" }
        }
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        onClick={() => navigate("/menu")}
        className="mb-6 flex items-center text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
        aria-label="Volver a la página principal"
      >
        <FaArrowLeft className="mr-2 text-lg" />
        Volver
      </motion.button>

      {/* Título principal */}
      <motion.h1
        variants={sectionVariants}
        className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-10 text-center"
      >
        Portal Institucional{" "}
        <span className="text-blue-500 dark:text-blue-400">
          Red Medicron IPS
        </span>
      </motion.h1>

      {/* Sección: Descripción y contexto */}
      <motion.section
        variants={shouldReduceMotion ? {} : sectionVariants}
        className="mb-12"
      >
        <div className="flex items-center mb-4 text-blue-700 dark:text-blue-300 text-xl font-semibold">
          <FaLightbulb className="mr-2" /> ¿Qué es el Portal Institucional?
        </div>
        <p className="text-base sm:text-lg leading-relaxed text-justify text-gray-800 dark:text-gray-200">
          El <strong>Portal Institucional de Red Medicron IPS</strong> es una
          plataforma moderna diseñada para centralizar y facilitar el acceso a
          todas las tecnologías y recursos utilizados en la gestión diaria de la
          empresa. Su objetivo es ofrecer un espacio único donde los
          colaboradores puedan consultar, gestionar y visualizar información
          clave de procesos, indicadores, documentos, eventos y más.
        </p>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-justify text-gray-800 dark:text-gray-200">
          Este desarrollo responde a la necesidad de integrar la información
          institucional en un solo lugar, permitiendo una gestión eficiente,
          segura y colaborativa. El portal está pensado para adaptarse a los
          retos actuales del sector salud, promoviendo la digitalización, la
          transparencia y la mejora continua en Red Medicron IPS.
        </p>
      </motion.section>

      {/* Secciones visuales con íconos */}
      <motion.section
        variants={shouldReduceMotion ? {} : containerVariants}
        className="mb-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            {
              icon: (
                <FaLightbulb className="text-yellow-400 text-4xl mb-3 mx-auto" />
              ),
              title: "Innovación y Centralización",
              text: "Un solo lugar para acceder a todos los recursos tecnológicos y procesos institucionales.",
            },
            {
              icon: (
                <FaUsers className="text-indigo-500 text-4xl mb-3 mx-auto" />
              ),
              title: "Colaboración y Gestión",
              text: "Facilita el trabajo colaborativo y la gestión eficiente entre áreas y equipos.",
            },
            {
              icon: (
                <FaChartLine className="text-green-500 text-4xl mb-3 mx-auto" />
              ),
              title: "Indicadores y Resultados",
              text: "Visualización y seguimiento de indicadores clave para la toma de decisiones.",
            },
            {
              icon: (
                <FaUniversity className="text-blue-500 text-4xl mb-3 mx-auto" />
              ),
              title: "Desarrollo Académico",
              text: "Proyecto realizado en colaboración con pasantes SENA y bajo la dirección de un ingeniero de software.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={shouldReduceMotion ? {} : sectionVariants}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition"
            >
              {item.icon}
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                {item.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tecnologías utilizadas */}
      <motion.section
        variants={shouldReduceMotion ? {} : sectionVariants}
        className="mb-12"
      >
        <div className="flex items-center mb-4 text-blue-700 dark:text-blue-300 text-xl font-semibold">
          <FaLaptopCode className="mr-2" /> Tecnologías utilizadas
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center text-blue-700 dark:text-blue-300">
          {[
            {
              icon: <FaReact className="text-4xl mx-auto mb-2" />,
              name: "React + TypeScript",
              description:
                "Frontend moderno y dinámico para una experiencia de usuario ágil.",
            },
            {
              icon: (
                <img
                  src="https://vitejs.dev/logo.svg"
                  alt="Vite"
                  className="h-10 mx-auto mb-2"
                />
              ),
              name: "Vite",
              description:
                "Herramienta de construcción rápida para proyectos web.",
            },
            {
              icon: <FaPython className="text-4xl mx-auto mb-2" />,
              name: "Python",
              description:
                "Lenguaje robusto para el backend y lógica de negocio.",
            },
            {
              icon: (
                <img
                  src="https://static.djangoproject.com/img/logos/django-logo-negative.svg"
                  alt="Django"
                  className="h-8 mx-auto mb-2"
                />
              ),
              name: "Django + DRF",
              description:
                "Framework backend y API REST para gestión segura de datos.",
            },
            {
              icon: (
                <SiTailwindcss className="text-4xl mx-auto mb-2 text-blue-500" />
              ),
              name: "Tailwind CSS",
              description:
                "Framework CSS para estilos rápidos y personalizables.",
            },
          ].map((tech, index) => (
            <motion.div
              key={index}
              variants={shouldReduceMotion ? {} : techCardVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.1,
                      boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)",
                    }
              }
              transition={{ type: "spring", stiffness: 300 }}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow p-4 group"
            >
              {tech.icon}
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {tech.name}
              </p>
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-blue-700 dark:bg-blue-900 text-white text-xs rounded py-1 px-2 w-max max-w-xs z-10">
                {tech.description}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Créditos y agradecimientos */}
      <motion.section
        variants={shouldReduceMotion ? {} : sectionVariants}
        className="mb-12"
      >
        <div className="flex items-center mb-4 text-blue-700 dark:text-blue-300 text-xl font-semibold">
          <FaUniversity className="mr-2" /> Créditos
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipo de desarrollo */}
          <motion.div
            variants={shouldReduceMotion ? {} : cardVariants}
            whileHover={
              shouldReduceMotion
                ? {}
                : { y: -5, boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)" }
            }
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-gradient-to-br from-white dark:from-gray-900 to-blue-50 dark:to-gray-800 shadow rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <FaUniversity className="text-blue-500 dark:text-blue-300 text-2xl mr-2" />
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Equipo de desarrollo
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
              <strong>Edison Stiven Narvaez</strong>
              <br />
              Ingeniero de Software
              <br />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Lider del proyecto y responsable principal del desarrollo
              </span>
              <br />
              <br />
              <strong>Andrea Benavides</strong>
              <br />
              Pasante SENA
              <br />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Colaboración en backend y frontend del componente de proveedores
              </span>
              <br />
              <br />
              <strong>Camila Cárdenas</strong>
              <br />
              Pasante SENA
              <br />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Colaboración en backend y frontend del componente de proveedores
              </span>
              <br />
              <span className="block mt-2 text-xs text-gray-400 dark:text-gray-500">
                Año: 2025
              </span>
            </p>
          </motion.div>

          {/* Agradecimientos */}
          <motion.div
            variants={shouldReduceMotion ? {} : cardVariants}
            whileHover={
              shouldReduceMotion
                ? {}
                : { y: -5, boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)" }
            }
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-gradient-to-br from-white dark:from-gray-900 to-blue-50 dark:to-gray-800 shadow rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <FaHandsHelping className="text-blue-500 dark:text-blue-300 text-2xl mr-2" />
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Agradecimientos
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
              Agradecimientos especiales al ingeniero{" "}
              <strong>Orlando Garcia</strong> por su invaluable apoyo durante el
              desarrollo del proyecto.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default About;
