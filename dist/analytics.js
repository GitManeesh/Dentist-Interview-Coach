export const historyKey='dentalCoachSessionsV1';
export const categories=['Clinical cases','Patient safety','Communication','CV and HR','Other'];
export function categoryOf(r){
 if(r.kind==='case')return 'Clinical cases';
 if(r.kind==='safety'||r.kind==='ethics')return 'Patient safety';
 if(r.kind==='communication'||r.kind==='team')return 'Communication';
 if(r.kind==='cv'||r.kind==='motivation')return 'CV and HR';
 if(r.kind==='clinical')return 'Clinical cases';
 return 'Other';
}
export function analyse(sessions){
 const rows=sessions.flatMap(s=>s.results||[]);
 const topics=categories.map(name=>{const items=rows.filter(r=>categoryOf(r)===name);return {name,count:items.length,score:items.length?Math.round(items.reduce((n,r)=>n+Number(r.score||0),0)/items.length*10):null}}).filter(t=>t.count);
 const missing=new Map();for(const r of rows)for(const point of r.missing||[])missing.set(point,(missing.get(point)||0)+1);
 const priorities=[...missing].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([point,count])=>({point,count}));
 const trend=sessions.slice(-12).map(s=>({date:s.date,score:Number(s.total)||0,count:s.results?.length||0,mode:s.mode}));
 return {topics,priorities,trend,answered:rows.filter(r=>!r.skipped).length,skipped:rows.filter(r=>r.skipped).length,sourceMapped:rows.filter(r=>r.sourceMapped).length,sourceUnmapped:rows.filter(r=>['case','clinical','safety'].includes(r.kind)&&!r.sourceMapped).length};
}
