import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { QRCodeCanvas } from "qrcode.react";
import Button from "../../../../shared/components/Button";
import Input from "../../../../shared/components/Input";
import { enable2FA, verify2FA } from "../../infrastructure/repositories/AuthRepository";
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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"initial" | "verify">("initial");
  const navigate = useNavigate();

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      const response = await enable2FA();
      const data = response as TwoFactorResponse;
      if (data.otp_uri && data.secret) {
        setOtpUri(data.otp_uri);
        setSecret(data.secret);
        setStep("verify");
        toast.info("Escanea el código QR con tu aplicación de autenticación");
      } else {
        throw new Error('No se recibió la información necesaria del servidor');
      }
    } catch (err: any) {
      toast.error(err.message || "Error al activar 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || !secret) {  // Cambiamos la validación para usar secret
      notify.error("Se requiere el código de verificación");
      return;
    }

    setLoading(true);
    
    try {
      const response = await verify2FA({ 
        code: otp,
        temp_token: secret  // Usamos el secret como temp_token
      });

      notify.success("Autenticación de dos factores activada exitosamente");
      navigate("/profile", { 
        state: { 
          is2FAEnabled: true,
          successMessage: "2FA activado correctamente"
        }
      });
    } catch (err: any) {
      const errorMessage = err.message || "Error al verificar el código";
      notify.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      await disable2FA();
      setIs2FAEnabled(false);
      notify.success("Autenticación de dos factores desactivada exitosamente");
    } catch (err: any) {
      notify.error(err.message || "Error al desactivar 2FA");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Configuración de Autenticación de Dos Factores
          </h1>
          <p className="text-gray-600">
            Mejora la seguridad de tu cuenta activando la autenticación de dos factores
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === "initial" ? (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                ¿Cómo funciona?
              </h3>
              <ol className="list-decimal list-inside text-blue-700 space-y-2">
                <li>Descarga una aplicación de autenticación (Google Authenticator, Authy, etc.)</li>
                <li>Activa la autenticación de dos factores</li>
                <li>Escanea el código QR con tu aplicación</li>
                <li>Ingresa el código de verificación para confirmar</li>
              </ol>
            </div>

            <Button
              onClick={handleEnable2FA}
              variant="primary"
              fullWidth
              loading={loading}
            >
              {loading ? "Activando..." : "Activar autenticación de dos factores"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
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
                    <p className="text-xs text-gray-500">
                      O ingresa esta clave manualmente: <br />
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {secret}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <Input
                type="text"
                label="Código de verificación"
                value={otp}
                onChange={(e) => {
                  // Solo permitir dígitos
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    setOtp(value);
                  }
                }}
                placeholder="Ingresa el código de 6 dígitos"
                required
                pattern="\d{6}"
                maxLength={6}
                disabled={loading}
                className="text-center tracking-wider font-mono"
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                >
                  {loading ? "Verificando..." : "Verificar y activar"}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep("initial")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}