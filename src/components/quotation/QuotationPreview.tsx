import { forwardRef } from 'react';
import { useApp } from '@/context/AppContext';
import { ClientData, SelectedISO } from '@/types/quotation';
import { numeroALetras } from '@/utils/numberToWords';
import { Award, Building2, FileCheck, Send, CreditCard, CheckCircle2 } from 'lucide-react';

interface QuotationPreviewProps {
  client: ClientData;
  selectedISOs: SelectedISO[];
  discount: number;
}

const QuotationPreview = forwardRef<HTMLDivElement, QuotationPreviewProps>(
  ({ client, selectedISOs, discount }, ref) => {
    const { isoStandards, advisors } = useApp();
    const advisor = advisors.find((a) => a.id === client.asesorId);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-PE');

    const getSummaryItems = () => {
      const items: { iso: typeof isoStandards[0]; type: string; amount: number; selected: SelectedISO }[] = [];
      selectedISOs.forEach((sel) => {
        const iso = isoStandards.find((i) => i.id === sel.isoId);
        if (!iso) return;
        items.push({ iso, type: 'all', amount: 0, selected: sel });
      });
      return items;
    };

    const items = getSummaryItems();
    
    const subtotal = selectedISOs.reduce((sum, sel) => {
      let total = 0;
      if (sel.certification) total += sel.certificationPrice;
      if (sel.followUp) total += sel.followUpPrice;
      if (sel.recertification) total += sel.recertificationPrice;
      return sum + total;
    }, 0);

    const igv = subtotal * 0.18;
    const totalConIGV = subtotal + igv;
    const discountAmount = totalConIGV * (discount / 100);
    const finalTotal = totalConIGV - discountAmount;

    const formatCurrency = (amount: number) => {
      return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const certificationSteps = [
      { num: 1, title: 'Cotización de servicio', icon: FileCheck },
      { num: 2, title: 'Recepción de requisitos', icon: Send },
      { num: 3, title: 'Emisión del certificado', icon: Award },
      { num: 4, title: 'Solicitud de certificación', icon: FileCheck },
      { num: 5, title: 'Transferencia Bancaria', icon: CreditCard },
      { num: 6, title: 'Gestión de la certificación', icon: CheckCircle2 },
    ];

    return (
      <div ref={ref} className="bg-white p-8 max-w-[210mm] mx-auto shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b-2 border-primary pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
              <Award className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">ACUERDO COMERCIAL</h1>
              <p className="text-sm text-muted-foreground">CCD - Centro de Capacitación y Desarrollo</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p>Día: <span className="font-semibold">{formattedDate}</span></p>
            <p className="text-gold font-semibold">Cotización válida por 48 horas</p>
            <p className="font-mono">{client.codigo}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-6 text-sm space-y-1">
          <p><span className="text-muted-foreground">Estimado(a):</span> <span className="font-semibold">{client.representante}</span></p>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="text-muted-foreground">R.U.C:</span> {client.ruc}</p>
            <p><span className="text-muted-foreground">Celular:</span> {client.celular}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="text-muted-foreground">Razón Social:</span> {client.razonSocial}</p>
            <p><span className="text-muted-foreground">Correo:</span> {client.correo}</p>
          </div>
          <p className="text-muted-foreground mt-2">
            Te compartimos la cotización correspondiente a los servicios de certificación ISO solicitados. Quedamos atento a cualquier consulta o ajuste que necesites realizar.
          </p>
        </div>

        {/* Quotation Badge */}
        <div className="mb-4">
          <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded text-sm font-semibold">
            COTIZACIÓN
          </span>
        </div>

        {/* Quotation Table */}
        <table className="w-full mb-4 text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="py-2 px-3 text-left font-semibold border border-primary">ESTÁNDAR</th>
              <th className="py-2 px-3 text-center font-semibold border border-primary">CERTIFICACIÓN</th>
              <th className="py-2 px-3 text-center font-semibold border border-primary">SEGUIMIENTO 1 Y 2</th>
              <th className="py-2 px-3 text-center font-semibold border border-primary">RECERTIFICACIÓN</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ iso, selected }, index) => (
              <tr key={index} className="border border-border">
                <td className="py-2 px-3 border border-border">
                  <div className="font-semibold text-primary">{iso.code}</div>
                  <div className="text-xs text-muted-foreground">{iso.description}</div>
                </td>
                <td className="py-2 px-3 text-center border border-border">
                  {selected.certification ? formatCurrency(selected.certificationPrice) : '-'}
                </td>
                <td className="py-2 px-3 text-center border border-border">
                  {selected.followUp ? formatCurrency(selected.followUpPrice) : '-'}
                </td>
                <td className="py-2 px-3 text-center border border-border">
                  {selected.recertification ? formatCurrency(selected.recertificationPrice) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64 text-sm">
            <div className="flex justify-between py-1 border-b border-border">
              <span>SUB TOTAL</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span>TARIFA TOTAL INCLUIDO IGV</span>
              <span className="font-semibold">{formatCurrency(totalConIGV)}</span>
            </div>
            <div className="flex justify-between py-2 bg-gold text-primary font-bold">
              <span className="px-2">TARIFA FINAL</span>
              <span className="px-2">{formatCurrency(finalTotal)}</span>
            </div>
            <div className="bg-primary/10 p-2 text-xs text-center mt-1">
              {numeroALetras(finalTotal)}
            </div>
          </div>
        </div>

        {/* Certification Flow */}
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">FLUJO DE CERTIFICACIÓN</h3>
          <div className="grid grid-cols-6 gap-2">
            {certificationSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-1">
                    {step.num}
                  </div>
                  <Icon className="w-5 h-5 text-primary mb-1" />
                  <span className="text-[10px] leading-tight">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="mb-6 p-4 bg-muted/50 rounded">
          <h3 className="font-bold text-sm mb-2">CUENTAS BANCARIAS</h3>
          <div className="flex items-start gap-3">
            <Building2 className="w-8 h-8 text-primary mt-1" />
            <div className="text-sm">
              <p className="font-bold">CENTRO DE CAPACITACIÓN GUBERNAMENTAL</p>
              <p>Cuenta corriente en soles: N° 200-3007723278</p>
              <p>CCI: 003-200-003007723278-30</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm">
            Asesor: <span className="font-semibold">{advisor?.name || 'No asignado'}</span>
          </p>
        </div>
      </div>
    );
  }
);

QuotationPreview.displayName = 'QuotationPreview';

export default QuotationPreview;