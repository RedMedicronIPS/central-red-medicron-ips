import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import Button from "../../../../shared/components/Button";
import { enable2FA, disable2FA } from "../../infrastructure/repositories/AuthRepository";
import { notify } from '../../../../shared/utils/notifications';

interface TwoFactorResponse {
  message: string;
  secret: string;
  otp_uri: string;
  is_2fa_enabled: boolean;
}

export default function Configure2FA() {
  const [otpUri, setOtpUri] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is_2fa_enabled || false);

  // Cargar la configuración 2FA al montar el componente
  useEffect(() => {
    if (!user.is_2fa_enabled) {
      handleEnable2FA();
    }
  }, []);

  const handleEnable2FA = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await enable2FA();
      const data = response as TwoFactorResponse;
      
      if (data.otp_uri && data.secret) {
        setOtpUri(data.otp_uri);
        setSecret(data.secret);
        notify.success("2FA configurado exitosamente. Escanea el código QR con tu aplicación de autenticación");
        notify.info("Se ha enviado un correo con la información de respaldo y los pasos de configuración");
      } else {
        throw new Error('No se recibió la información necesaria del servidor');
      }
    } catch (err: any) {
      const errorMessage = err.message || "Error al configurar 2FA";
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm("¿Estás seguro de que deseas desactivar la autenticación de dos factores?")) {
      return;
    }

    setLoading(true);

    try {
      await disable2FA();
      setIs2FAEnabled(false);
      notify.success("Autenticación de dos factores desactivada exitosamente");
      navigate("/profile", { 
        state: { 
          is2FAEnabled: false,
          successMessage: "2FA desactivado correctamente" 
        }
      });
    } catch (err: any) {
      notify.error(err.message || "Error al desactivar 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    notify.info("Recuerda usar el código de tu aplicación de autenticación en tu próximo inicio de sesión");
    navigate("/profile", { 
      state: { 
        is2FAEnabled: true,
        successMessage: "2FA configurado correctamente" 
      }
    });
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración de Autenticación de Dos Factores
        </h1>
        <p className="text-gray-600">
          {is2FAEnabled 
            ? "Gestiona tu configuración de autenticación de dos factores" 
            : "Mejora la seguridad de tu cuenta configurando la autenticación de dos factores"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {is2FAEnabled ? (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800">
              <p className="font-medium">2FA está actualmente activado</p>
              <p className="text-sm mt-1">Puedes desactivarlo o reconfigurarlo si lo necesitas</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="danger"
                onClick={handleDisable2FA}
                loading={loading}
              >
                {loading ? "Desactivando..." : "Desactivar 2FA"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleEnable2FA}
                disabled={loading}
              >
                Reconfigurar 2FA
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                Pasos a seguir:
              </h3>
              <ol className="list-decimal list-inside text-blue-700 space-y-2">
                <li>Descarga una aplicación de autenticación como Google Authenticator, Microsoft Authenticator, Authy u otra de tu preferencia</li>
                <li>Abre la aplicación y selecciona añadir una nueva cuenta</li>
                <li>Escanea el código QR que aparece abajo o introduce manualmente la clave secreta</li>
                <li>Guarda la clave secreta en un lugar seguro como respaldo</li>
                <li>Se te ha enviado un correo con esta información y los pasos detallados</li>
              </ol>
            </div>

            {otpUri && (
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white border rounded-lg">
                  <QRCodeCanvas 
                    value={otpUri}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Escanea este código QR con tu aplicación de autenticación
                  </p>
                  {secret && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Clave de respaldo:</p>
                      <p className="font-mono bg-gray-100 px-4 py-2 rounded mt-1 text-sm">
                        {secret}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Guarda esta clave en un lugar seguro. La necesitarás si pierdes acceso a tu aplicación de autenticación.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                type="button"
                variant="primary"
                onClick={handleFinish}
                disabled={loading || !otpUri}
              >
                He configurado la autenticación
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/profile")}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}