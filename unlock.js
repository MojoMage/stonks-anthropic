// Decrypts the page with the password typed in, then shows it. Nothing is sent anywhere.
(() => {
  const $ = (id) => document.getElementById(id);
  const b64 = (x) => Uint8Array.from(atob(x), (c) => c.charCodeAt(0));
  async function decrypt(password) {
    const E = window.STONKS_PAGE;
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({name: 'PBKDF2', salt: b64(E.salt), iterations: E.iterations, hash: 'SHA-256'}, material, {name: 'AES-GCM', length: 256}, false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({name: 'AES-GCM', iv: b64(E.iv)}, key, b64(E.ct));
    return JSON.parse(new TextDecoder().decode(plain));
  }
  async function submit() {
    const go = $('gate-go'), err = $('gate-err');
    go.disabled = true;
    err.hidden = true;
    let page;
    try {
      page = await decrypt($('gate-pass').value);
    } catch (e) {
      err.hidden = false;
      go.disabled = false;
      return;
    }
    window.DASH_DATA = page.data;
    $('dash-root').innerHTML = page.html;
    $('gate').remove();
    page.scripts.forEach((code) => new Function(code)());
    window.dash.runAll();
    window.scrollTo(0, 0);
  }
  $('gate-go').addEventListener('click', submit);
  $('gate-pass').addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  $('gate-pass').focus();
})();
