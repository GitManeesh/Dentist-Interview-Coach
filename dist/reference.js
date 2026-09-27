// The shared knowledge pack is a separate GitHub-editable JSON file.
// Only reviewed, short summaries are published; the copyrighted textbook stays private.
export let book=null;
export let referenceTopics=[];
export let referenceStatus='loading';
export let referenceRevision='';

export async function loadReferences(){
 try{
  const response=await fetch(new URL('./knowledge/sources.json',import.meta.url),{cache:'no-store'});
  if(!response.ok)throw Error(`HTTP ${response.status}`);
  const data=await response.json();
  if(data.schemaVersion!==1||!Array.isArray(data.topics)||!data.topics.length)throw Error('Invalid source pack');
  if(!data.topics.every(t=>{try{const url=new URL(t.official);return /^[a-z0-9-]{2,40}$/.test(t.id)&&typeof t.en==='string'&&typeof t.de==='string'&&typeof t.terms==='string'&&typeof t.officialName==='string'&&url.protocol==='https:'&&['sdcep.org.uk','ada.org','rki.de','bzaek.de','anerkennung-in-deutschland.de'].some(domain=>url.hostname===domain||url.hostname.endsWith('.'+domain))}catch{return false}}))throw Error('Unreviewed source entry');
  book=data.book;
  referenceTopics=data.topics;
  referenceRevision=`${data.revision} · reviewed ${data.reviewedAt}`;
  referenceStatus='ready';
 }catch(e){referenceStatus='unavailable';referenceRevision='Source pack unavailable';console.error('Knowledge source pack could not load',e)}
 return referenceStatus;
}

function tokens(value){return String(value||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').match(/[a-zäöüß]{4,}/g)||[]}
export function matchReference(query){
 if(referenceStatus!=='ready')return [];
 const words=tokens(query);
 return referenceTopics.map(topic=>{
  const terms=tokens(`${topic.id} ${topic.terms}`);
  const score=words.filter(word=>terms.some(term=>term===word||term.startsWith(word)&&word.length>=5)).length;
  return {topic,score};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.topic);
}
export function referenceFor(q){
 if(referenceStatus!=='ready'||!q)return null;
 const title=String(q.title||'').toLowerCase();
 const id=title.includes('swelling')?'swelling':title.includes('diabetes')?'diabetes':title.includes('anticoagulants')?'anticoagulants':q.rubricKey==='licensing'?'licensing':q.rubricKey==='safety'?'hygiene':q.rubricKey==='procedures'?'caries':q.kind==='team'?'chairside':null;
 return referenceTopics.find(t=>t.id===id)||null;
}
