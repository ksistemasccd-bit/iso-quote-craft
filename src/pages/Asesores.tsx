import { useState } from 'react';
import { Plus, Pencil, Trash2, Users, Key } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';
import { useModuleStyles } from '@/context/ModuleColorsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import DeleteWithCodeDialog from '@/components/ui/DeleteWithCodeDialog';
import { Advisor } from '@/types/quotation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Asesores = () => {
  const { advisors, addAdvisor, updateAdvisor, deleteAdvisor } = useApp();
  const { toast } = useToast();
  const { sectionNumberStyle, colors } = useModuleStyles('asesores');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);
  const [passwordAdvisor, setPasswordAdvisor] = useState<Advisor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', username: '' });
    setEditingAdvisor(null);
  };

  const resetPasswordForm = () => {
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setPasswordAdvisor(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (advisor: Advisor) => {
    setEditingAdvisor(advisor);
    setFormData({
      name: advisor.name,
      email: advisor.email,
      phone: advisor.phone,
      username: (advisor as any).username || '',
    });
    setIsDialogOpen(true);
  };

  const openPasswordDialog = (advisor: Advisor) => {
    setPasswordAdvisor(advisor);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setIsPasswordDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre es obligatorio',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.username.trim()) {
      toast({
        title: 'Error',
        description: 'El usuario es obligatorio',
        variant: 'destructive',
      });
      return;
    }

    // Check if username is unique
    const existingAdvisor = advisors.find(
      a => (a as any).username?.toLowerCase() === formData.username.trim().toLowerCase() 
        && a.id !== editingAdvisor?.id
    );
    
    if (existingAdvisor) {
      toast({
        title: 'Error',
        description: 'Este nombre de usuario ya está en uso',
        variant: 'destructive',
      });
      return;
    }

    if (editingAdvisor) {
      // Update advisor with username
      const { error } = await supabase
        .from('advisors')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          username: formData.username.trim().toLowerCase(),
        })
        .eq('id', editingAdvisor.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'No se pudo actualizar el asesor',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Asesor actualizado',
        description: 'Los datos del asesor se han actualizado correctamente',
      });
    } else {
      // Create new advisor with username
      const { error } = await supabase
        .from('advisors')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          username: formData.username.trim().toLowerCase(),
        });

      if (error) {
        toast({
          title: 'Error',
          description: 'No se pudo crear el asesor',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Asesor agregado',
        description: 'El nuevo asesor se ha agregado correctamente',
      });
    }

    setIsDialogOpen(false);
    resetForm();
    // Refresh advisors list
    window.location.reload();
  };

  const handlePasswordSubmit = async () => {
    if (!passwordAdvisor) return;

    if (!passwordData.newPassword) {
      toast({
        title: 'Error',
        description: 'Ingrese la nueva contraseña',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 4) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 4 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }

    setSavingPassword(true);

    try {
      const { data, error } = await supabase.functions.invoke('advisor-auth', {
        body: {
          action: 'set-password',
          advisorId: passwordAdvisor.id,
          newPassword: passwordData.newPassword,
        },
      });

      if (error || !data?.success) {
        toast({
          title: 'Error',
          description: data?.message || 'No se pudo actualizar la contraseña',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Contraseña actualizada',
        description: 'La contraseña del asesor se ha actualizado correctamente',
      });

      setIsPasswordDialogOpen(false);
      resetPasswordForm();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error de conexión',
        variant: 'destructive',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAdvisor(deleteId);
      toast({
        title: 'Asesor eliminado',
        description: 'El asesor se ha eliminado correctamente',
      });
      setDeleteId(null);
    }
  };

  return (
    <Layout>
      <div className="card-corporate">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="section-title mb-0">
            <span className="section-number" style={sectionNumberStyle}>
              <Users className="w-4 h-4" />
            </span>
            <span>Gestión de Asesores</span>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2" style={{ backgroundColor: colors.accentColor }}>
            <Plus className="w-4 h-4" />
            Nuevo Asesor
          </Button>
        </div>

        {advisors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay asesores registrados</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {advisors.map((advisor) => (
              <div
                key={advisor.id}
                className="bg-muted/30 rounded-lg p-4 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div 
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold"
                    style={sectionNumberStyle}
                  >
                    {advisor.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openPasswordDialog(advisor)}
                      title="Configurar contraseña"
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(advisor)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(advisor.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{advisor.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {(advisor as any).username && (
                    <p className="font-mono">@{(advisor as any).username}</p>
                  )}
                  <p>{advisor.email}</p>
                  <p>{advisor.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAdvisor ? 'Editar Asesor' : 'Nuevo Asesor'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="form-label form-label-required">Nombre</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="form-label form-label-required">Usuario</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/\s/g, '') })}
                placeholder="nombre_usuario"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                El usuario será usado para iniciar sesión
              </p>
            </div>
            <div>
              <label className="form-label">Correo Electrónico</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className="form-label">Teléfono</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="999999999"
                maxLength={9}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingAdvisor ? 'Guardar Cambios' : 'Agregar Asesor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Configurar Contraseña - {passwordAdvisor?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="form-label form-label-required">Nueva Contraseña</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="form-label form-label-required">Confirmar Contraseña</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordSubmit} disabled={savingPassword}>
              {savingPassword ? 'Guardando...' : 'Guardar Contraseña'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteWithCodeDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar asesor?"
        description="Esta acción no se puede deshacer. El asesor se eliminará permanentemente."
      />
    </Layout>
  );
};

export default Asesores;
