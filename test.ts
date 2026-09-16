import { AuvoraReportSchema } from './src/lib/ai/schemas';
function z2j(s: any): any {
  if(!s || !s._def) return {};
  const d = s._def;
  switch(d.type) {
    case 'string': return {type:'string'};
    case 'number': return {type:'number'};
    case 'boolean': return {type:'boolean'};
    case 'array': return {type:'array', items: z2j(d.element)};
    case 'enum': return {type:'string', enum: Object.keys(d.entries)};
    case 'object': {
      const p: any = {}; const req: string[] = [];
      for (const [k, v] of Object.entries(d.shape)) {
        const vd = (v as any)._def;
        if (vd && vd.type === 'optional') {
          p[k] = z2j(vd.innerType);
        } else {
          p[k] = z2j(v);
          req.push(k);
        }
      }
      return { type: 'object', properties: p, required: req.length > 0 ? req : undefined, additionalProperties: false };
    }
    case 'optional': case 'nullable': return z2j(d.innerType);
    default: return {};
  }
}
console.log(JSON.stringify(z2j(AuvoraReportSchema), null, 2));