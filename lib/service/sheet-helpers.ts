/**
 * Achata um objeto aninhado em um objeto plano com chaves separadas por pontos
 */
export function flattenSheetData(data: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};

  if (!data || typeof data !== 'object') {
    return result;
  }

  for (const key in data) {
    if (!data.hasOwnProperty(key)) continue;

    const value = data[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Se for um objeto, continua o flatten recursivamente
      Object.assign(result, flattenSheetData(value, newKey));
    } else {
      // Se for um valor primitivo ou array, adiciona ao resultado
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * Reconstrói um objeto aninhado a partir de um objeto plano
 */
export function unflattenSheetData(flatData: Record<string, any>): any {
  const result: any = {};

  for (const [key, value] of Object.entries(flatData)) {
    const keys = key.split('.');
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const part = keys[i];

      if (i === keys.length - 1) {
        // Última parte - adiciona o valor diretamente
        current[part] = value;
      } else {
        // Cria a estrutura aninhada se não existir
        if (!current[part] || typeof current[part] !== 'object') {
          current[part] = {};
        }
        current = current[part];
      }
    }
  }

  return result;
}