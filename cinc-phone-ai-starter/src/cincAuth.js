import fs from "fs-extra";
import fetch from "node-fetch";
import { config } from "./config.js";
const tokenFile = "data/tokens.json";
const now = () => Math.floor(Date.now()/1000);
async function post(url, body){
  const r = await fetch(url,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(body)});
  if(!r.ok){throw new Error(`Token error ${r.status}: ${await r.text()}`);}
  return r.json();
}
export async function exchangeCodeForToken(code){
  const d = await post(config.authToken,{client_id:config.clientId,client_secret:config.clientSecret,grant_type:"authorization_code",code,redirect_uri:config.redirectUri,scope:"api:read api:update"});
  const t = {access_token:d.access_token,refresh_token:d.refresh_token,expires_at: now()+Number(d.expires_in||3600)-60};
  await fs.outputJSON(tokenFile,t,{spaces:2}); return t;
}
export async function loadTokens(){ try{return await fs.readJSON(tokenFile);}catch{return {access_token:"",refresh_token:"",expires_at:0};} }
export async function refreshAccessToken(refresh_token){
  const d = await post(config.authToken,{client_id:config.clientId,client_secret:config.clientSecret,grant_type:"refresh_token",refresh_token});
  const t = {access_token:d.access_token,refresh_token:d.refresh_token||refresh_token,expires_at: now()+Number(d.expires_in||3600)-60};
  await fs.outputJSON(tokenFile,t,{spaces:2}); return t;
}
export async function getAccessToken(){
  let t = await loadTokens();
  if(!t.access_token) throw new Error("No access token. Complete OAuth first.");
  if(t.expires_at > now()) return t.access_token;
  if(!t.refresh_token) throw new Error("Token expired and no refresh token.");
  t = await refreshAccessToken(t.refresh_token); return t.access_token;
}
export function buildAuthorizeUrl(state="ap123",scope="api:read api:update"){
  const p = new URLSearchParams({response_type:"code",client_id:config.clientId,redirect_uri:config.redirectUri,scope,state});
  return `${config.authAuthorize}?${p.toString()}`;
}
