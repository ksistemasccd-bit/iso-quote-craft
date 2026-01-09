const UNIDADES = ['', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'];
const ESPECIALES = ['Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince', 'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve'];
const DECENAS = ['', 'Diez', 'Veinte', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta', 'Setenta', 'Ochenta', 'Noventa'];
const CENTENAS = ['', 'Ciento', 'Doscientos', 'Trescientos', 'Cuatrocientos', 'Quinientos', 'Seiscientos', 'Setecientos', 'Ochocientos', 'Novecientos'];

function convertirCentenas(num: number): string {
  if (num === 0) return '';
  if (num === 100) return 'Cien';
  
  const centena = Math.floor(num / 100);
  const resto = num % 100;
  
  let resultado = CENTENAS[centena];
  
  if (resto > 0) {
    if (resultado) resultado += ' ';
    resultado += convertirDecenas(resto);
  }
  
  return resultado;
}

function convertirDecenas(num: number): string {
  if (num === 0) return '';
  if (num < 10) return UNIDADES[num];
  if (num < 20) return ESPECIALES[num - 10];
  
  const decena = Math.floor(num / 10);
  const unidad = num % 10;
  
  if (unidad === 0) return DECENAS[decena];
  if (decena === 2) return `Veinti${UNIDADES[unidad].toLowerCase()}`;
  return `${DECENAS[decena]} y ${UNIDADES[unidad]}`;
}

function convertirMiles(num: number): string {
  if (num === 0) return '';
  if (num === 1000) return 'Mil';
  
  const miles = Math.floor(num / 1000);
  const resto = num % 1000;
  
  let resultado = '';
  if (miles === 1) {
    resultado = 'Mil';
  } else if (miles > 0) {
    resultado = `${convertirCentenas(miles)} Mil`;
  }
  
  if (resto > 0) {
    if (resultado) resultado += ' ';
    resultado += convertirCentenas(resto);
  }
  
  return resultado;
}

function convertirMillones(num: number): string {
  if (num === 0) return 'Cero';
  
  const millones = Math.floor(num / 1000000);
  const resto = num % 1000000;
  
  let resultado = '';
  if (millones === 1) {
    resultado = 'Un Millón';
  } else if (millones > 0) {
    resultado = `${convertirMiles(millones)} Millones`;
  }
  
  if (resto > 0) {
    if (resultado) resultado += ' ';
    resultado += convertirMiles(resto);
  }
  
  return resultado || 'Cero';
}

export function numeroALetras(monto: number): string {
  const parteEntera = Math.floor(monto);
  const centavos = Math.round((monto - parteEntera) * 100);
  
  let resultado = convertirMillones(parteEntera);
  
  if (centavos > 0) {
    resultado += ` Con ${centavos.toString().padStart(2, '0')}/100`;
  }
  
  return resultado + ' Soles Peruanos';
}