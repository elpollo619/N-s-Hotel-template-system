/* Persistenz per localStorage — Entwürfe, Bilder, Einstellungen. */
const NS = 'nsvz:';

export function load(key, fallback){
  try{
    const raw = localStorage.getItem(NS + key);
    return raw == null ? fallback : JSON.parse(raw);
  }catch(_){ return fallback; }
}

export function save(key, value){
  try{
    localStorage.setItem(NS + key, JSON.stringify(value));
    return true;
  }catch(err){
    // Quota voll (meist zu grosse Bilder) — Entwurf geht nicht verloren,
    // er wird nur nicht gespeichert.
    console.warn('[Vorlagen-Zentrale] Konnte nicht speichern:', err && err.name);
    return false;
  }
}

export function remove(key){
  try{ localStorage.removeItem(NS + key); }catch(_){}
}

export function keys(){
  const out = [];
  try{
    for (let i = 0; i < localStorage.length; i++){
      const k = localStorage.key(i);
      if (k && k.startsWith(NS)) out.push(k.slice(NS.length));
    }
  }catch(_){}
  return out;
}
