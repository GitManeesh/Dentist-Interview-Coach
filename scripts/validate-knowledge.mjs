import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../dist/knowledge/sources.json',import.meta.url),'utf8'));
const fail=message=>{throw Error(message)};
if(data.schemaVersion!==1||!/^\d{4}-\d{2}-\d{2}\.\d+$/.test(data.revision)||!/^\d{4}-\d{2}-\d{2}$/.test(data.reviewedAt))fail('Set a valid revision and reviewedAt date.');
if(data.book?.year!==2016||!Array.isArray(data.topics)||!data.topics.length)fail('Book metadata or topics missing.');
const ids=new Set();
for(const topic of data.topics){
 if(!/^[a-z0-9-]{2,40}$/.test(topic.id)||ids.has(topic.id))fail('Duplicate or invalid topic id: '+topic.id);
 ids.add(topic.id);
 for(const field of ['terms','en','de','officialName'])if(typeof topic[field]!=='string'||topic[field].trim().length<8||topic[field].length>1200)fail(`${topic.id}: invalid ${field}`);
 if(topic.en.includes('<')||topic.de.includes('<'))fail(`${topic.id}: write plain text summaries, not markup`);
 if(topic.page!==null&&(typeof topic.page!=='string'||topic.page.length>80))fail(`${topic.id}: invalid textbook page`);
 let url;try{url=new URL(topic.official)}catch{fail(`${topic.id}: invalid source URL`)}
 if(url.protocol!=='https:'||!['sdcep.org.uk','ada.org','rki.de','bzaek.de','anerkennung-in-deutschland.de'].some(domain=>url.hostname===domain||url.hostname.endsWith('.'+domain)))fail(`${topic.id}: source must be an approved professional domain`);
}
console.log(`Validated ${data.topics.length} entries in source pack ${data.revision}. Content still requires human source review.`);
