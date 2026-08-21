/* ==========================================================================
   Teilen-Link
   --------------------------------------------------------------------------
   Ein fertiger Aushang steckt sonst nur im Browser der Person, die ihn
   gemacht hat (localStorage). Wer ihn weitergeben will, musste bisher die
   Entwurfsdatei verschicken.

   Hier wird der ganze Zustand in die Adresse gepackt:

       …/#/t/hinweis?d=zXQAAA…

   Wer den Link anklickt, sieht denselben Aushang. Es geht nichts an einen
   Server — die Daten stehen in der Adresse selbst, sonst nirgends.

   Aufbau der Nutzlast:  1 Zeichen Kennung + Base64url
     z…  mit deflate-raw gepackt (Normalfall)
     p…  ungepackt, wenn der Browser CompressionStream nicht kennt

   Bilder (Data-URIs) bleiben draussen. Ein einziges Foto sprengt jede
   Adresszeile; dafür gibt es "Entwurf sichern".
   ========================================================================== */

/* Ab hier wird der Link für Mailprogramme und Chats unzuverlässig.
   Erfahrungswert: Browser schlucken weit mehr, Outlook und WhatsApp
   schneiden lange Adressen ab. */
export const TEILEN_MAX = 7000;

function teilenB64enc(bytes){
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function teilenB64dec(txt){
  const s = atob(txt.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function teilenPack(bytes){
  if (typeof CompressionStream !== 'function') return null;
  try{
    const cs = new CompressionStream('deflate-raw');
    const stream = new Blob([bytes]).stream().pipeThrough(cs);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }catch(_){ return null; }
}

async function teilenUnpack(bytes){
  const ds = new DecompressionStream('deflate-raw');
  const stream = new Blob([bytes]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Bilder aus dem Zustand nehmen. Gibt {rein, bilder} zurück. */
export function teilenOhneBilder(state){
  let bilder = 0;
  const gehe = v => {
    if (typeof v === 'string') return v.startsWith('data:') ? (bilder++, '') : v;
    if (Array.isArray(v)) return v.map(gehe);
    if (v && typeof v === 'object'){
      const o = {};
      for (const k in v) o[k] = gehe(v[k]);
      return o;
    }
    return v;
  };
  return { rein: gehe(state), bilder };
}

/**
 * Zustand zu einer Nutzlast machen.
 * @returns {Promise<{payload:string, bilder:number}>}
 */
export async function teilenKodieren(state){
  const { rein, bilder } = teilenOhneBilder(state);
  const roh = new TextEncoder().encode(JSON.stringify(rein));
  const packed = await teilenPack(roh);
  /* Bei sehr kurzen Zuständen ist der Deflate-Kopf grösser als der Gewinn. */
  const nimmPack = packed && packed.length < roh.length;
  return {
    payload: (nimmPack ? 'z' : 'p') + teilenB64enc(nimmPack ? packed : roh),
    bilder
  };
}

/** Nutzlast zurück in einen Zustand. Wirft bei kaputten Links. */
export async function teilenLesen(payload){
  const art = payload[0];
  const bytes = teilenB64dec(payload.slice(1));
  const roh = art === 'z' ? await teilenUnpack(bytes) : bytes;
  const obj = JSON.parse(new TextDecoder().decode(roh));
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)){
    throw new Error('Kein Zustand');
  }
  return obj;
}

/** Vollständige Adresse zu einer Vorlage bauen. */
export function teilenAdresse(id, payload){
  const basis = location.href.split('#')[0];
  return `${basis}#/t/${id}?d=${payload}`;
}

/** In die Zwischenablage legen. Fällt auf das alte execCommand zurück. */
export async function teilenKopieren(text){
  try{
    if (navigator.clipboard && window.isSecureContext){
      await navigator.clipboard.writeText(text);
      return true;
    }
  }catch(_){ /* weiter mit dem Notnagel */ }
  try{
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }catch(_){ return false; }
}
