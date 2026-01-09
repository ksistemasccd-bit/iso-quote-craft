import { useApp } from '@/context/AppContext';
import { ClientData } from '@/types/quotation';
import { months } from '@/data/initialData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClientDataFormProps {
  data: ClientData;
  onChange: (data: ClientData) => void;
}

const ClientDataForm = ({ data, onChange }: ClientDataFormProps) => {
  const { advisors, getNextQuotationCode } = useApp();

  const handleChange = (field: keyof ClientData, value: string | number) => {
    const newData = { ...data, [field]: value };
    
    if (field === 'year' || field === 'month') {
      const year = field === 'year' ? (value as number) : data.year;
      const month = field === 'month' ? (value as string) : data.month;
      newData.codigo = getNextQuotationCode(year, month);
    }
    
    onChange(newData);
  };

  return (
    <div className="card-corporate animate-fade-in">
      <div className="section-title">
        <span className="section-number">1</span>
        <span>Datos del Cliente</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label form-label-required">RUC</label>
          <input
            type="text"
            value={data.ruc}
            onChange={(e) => handleChange('ruc', e.target.value)}
            className="input-corporate"
            placeholder="Ingrese RUC"
            maxLength={11}
          />
        </div>

        <div>
          <label className="form-label form-label-required">Razón Social</label>
          <input
            type="text"
            value={data.razonSocial}
            onChange={(e) => handleChange('razonSocial', e.target.value)}
            className="input-corporate"
            placeholder="Ingrese razón social"
          />
        </div>

        <div>
          <label className="form-label form-label-required">
            Nombre del Representante
          </label>
          <input
            type="text"
            value={data.representante}
            onChange={(e) => handleChange('representante', e.target.value)}
            className="input-corporate"
            placeholder="Ingrese nombre del representante"
          />
        </div>

        <div>
          <label className="form-label form-label-required">Celular</label>
          <input
            type="tel"
            value={data.celular}
            onChange={(e) => handleChange('celular', e.target.value)}
            className="input-corporate"
            placeholder="Ingrese celular"
            maxLength={9}
          />
        </div>

        <div>
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            value={data.correo}
            onChange={(e) => handleChange('correo', e.target.value)}
            className="input-corporate"
            placeholder="Ingrese correo electrónico"
          />
        </div>

        <div>
          <label className="form-label form-label-required">Asesor</label>
          <Select
            value={data.asesorId}
            onValueChange={(value) => handleChange('asesorId', value)}
          >
            <SelectTrigger className="input-corporate">
              <SelectValue placeholder="Seleccione asesor" />
            </SelectTrigger>
            <SelectContent>
              {advisors.map((advisor) => (
                <SelectItem key={advisor.id} value={advisor.id}>
                  {advisor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="form-label form-label-required">Año</label>
          <input
            type="number"
            value={data.year}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            className="input-corporate"
            min={2024}
            max={2100}
          />
        </div>

        <div>
          <label className="form-label form-label-required">Mes</label>
          <Select
            value={data.month}
            onValueChange={(value) => handleChange('month', value)}
          >
            <SelectTrigger className="input-corporate">
              <SelectValue placeholder="Seleccione mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="form-label form-label-required">Código (5 cifras)</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              COT-{data.year}-{data.month}-
            </span>
            <input
              type="text"
              value={data.codigo.split('-').pop() || '00001'}
              className="input-corporate w-24"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDataForm;