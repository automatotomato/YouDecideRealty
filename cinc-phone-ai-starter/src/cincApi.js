import fetch from "node-fetch";
import { config } from "./config.js";
import { getAccessToken } from "./cincAuth.js";
async function apiGet(path, params={}){
  const token = await getAccessToken();
  const url = new URL(`${config.apiBase}${path}`);
  Object.entries(params).forEach(([k,v])=>{ if(v!==undefined&&v!==null&&v!=="") url.searchParams.set(k,String(v));});
  const r = await fetch(url,{headers:{"Content-Type":"application/x-www-form-urlencoded","Authorization":token}});
  const txt = await r.text(); let json; try{ json = JSON.parse(txt);}catch{ throw new Error(`Non-JSON: ${txt}`); }
  if(!r.ok) throw new Error(`CINC ${r.status}: ${txt}`); return json;
}
export const getMe = () => apiGet("/me");
export const listLeadsPage = (offset=0,limit=50) => apiGet("/leads",{offset,limit});
export const getLeadById = id => apiGet(`/leads/${encodeURIComponent(id)}`);
