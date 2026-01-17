import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Lock, LogIn } from 'lucide-react';
import logoCcd from '@/assets/logo-ccd.jpg';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, advisor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (advisor) {
      navigate('/');
    }
  }, [advisor, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: 'Error',
        description: 'Ingrese usuario y contraseña',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await signIn(username.trim(), password);
    
    if (error) {
      toast({
        title: 'Error de inicio de sesión',
        description: error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: '¡Bienvenido!',
        description: 'Inicio de sesión exitoso',
      });
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center">
            <img
              src={logoCcd}
              alt="CCD Logo"
              className="h-16 mx-auto mb-4 rounded-lg"
            />
            <h1 className="text-2xl font-bold text-primary-foreground">
              Sistema de Cotizaciones
            </h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Ingrese sus credenciales de asesor
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="form-label form-label-required">Usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  className="pl-10"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="form-label form-label-required">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Iniciar Sesión
            </Button>
          </form>

          <div className="px-6 pb-6 text-center">
            <p className="text-xs text-muted-foreground">
              Solicite sus credenciales al administrador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
