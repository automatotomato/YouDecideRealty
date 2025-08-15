import { listLeadsPage } from "./cincApi.js";
const norm = s => String(s||"").replace(/\D/g,"");
export async function findLeadMatches({phone,email,maxPages=10}){
  const want = phone ? norm(phone) : null;
  const wantEmail = email ? String(email).toLowerCase() : null;
  const hits = []; let offset = 0, limit = 50;
  for(let i=0;i<maxPages;i++){
    const data = await listLeadsPage(offset,limit);
    const leads = data?.body?.leads || data?.body || [];
    for(const lead of leads){
      const c = lead?.info?.contact || lead?.contact || {};
      const phones = [c?.phone_numbers?.cell_phone,c?.phone_numbers?.home_phone,c?.phone_numbers?.office_phone,c?.phone_numbers?.work_phone].filter(Boolean);
      const phoneHit = want && phones.some(p=> norm(p)===want);
      const emailHit = wantEmail && (c?.email||"").toLowerCase()===wantEmail;
      if(phoneHit || emailHit){ hits.push({id:lead.id,name:`${c?.first_name||""} ${c?.last_name||""}`.trim(),email:c?.email||null,phones}); }
    }
    const next = data?.header?.next_offset; if(!next) break; offset = next;
  }
  return hits;
}
