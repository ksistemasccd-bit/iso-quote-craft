-- Add implementation and IGV fields to quotations table
ALTER TABLE public.quotations 
ADD COLUMN include_igv boolean NOT NULL DEFAULT true,
ADD COLUMN implementation_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN implementation_company_size text DEFAULT 'pequeña',
ADD COLUMN implementation_unit_price numeric NOT NULL DEFAULT 0,
ADD COLUMN implementation_quantity integer NOT NULL DEFAULT 1,
ADD COLUMN implementation_total numeric NOT NULL DEFAULT 0;