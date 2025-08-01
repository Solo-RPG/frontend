export function unflattenSheetData(flatData: Record<string, any>): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(flatData)) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length; i++) {
      const part = keys[i];
      
      if (i === keys.length - 1) {
        // Última parte - adiciona o valor dentro de { value: ... }
        current[part] = { value: value };
      } else {
        // Cria a estrutura aninhada
        current[part] = current[part] || { value: {} };
        current = current[part].value;
      }
    }
  }
  
  return result;
}

export function flattenSheetData(data: any): Record<string, any> {
  const result: Record<string, any> = {};
  
  function flatten(obj: any, prefix = '') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (key === 'value') {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            // Se for um objeto dentro de value, continua flatten sem adicionar .value
            flatten(value, prefix);
          } else {
            // Valor primitivo em value
            if (prefix) result[prefix] = value;
          }
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Para objetos normais, continua o flatten adicionando o key atual ao prefixo
          flatten(value, prefix ? `${prefix}.${key}` : key);
        }
      }
    }
  }
  
  flatten(data);
  return result;
}