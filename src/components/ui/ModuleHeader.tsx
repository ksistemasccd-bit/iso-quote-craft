import { LucideIcon } from 'lucide-react';
import { useModuleStyles } from '@/context/ModuleColorsContext';

interface ModuleHeaderProps {
  moduleId: string;
  icon: LucideIcon;
  title: string;
  description?: string;
}

const ModuleHeader = ({ moduleId, icon: Icon, title, description }: ModuleHeaderProps) => {
  const { sectionNumberStyle } = useModuleStyles(moduleId);

  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
        style={sectionNumberStyle}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-2xl font-heading font-bold text-gradient">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ModuleHeader;
