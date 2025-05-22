(function() {
  'use strict';

  // var Cookies = window.Cookies.noConflict();

  // function changeLang() {
  //   var lang = this.value;
  //   var canonical = this.dataset.canonical;
  //   var path = '/';
  //   if (lang !== 'en') path += lang + '/';

  //   Cookies.set('nf_lang', lang, { expires: 365 });
  //   location.href = path + canonical;
  // }

  // document.getElementById('lang-select').addEventListener('change', changeLang);
  // document.getElementById('mobile-lang-select').addEventListener('change', changeLang);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('figure.highlight.bash, figure.highlight.plaintext, figure.highlight.json, figure.highlight').forEach((figure) => {
    const codeBlock = figure.querySelector('td.code');
    if (!codeBlock) return;

    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-button';
    //button.innerHTML = '📋<i class="bxr bx-copy" />';
    button.innerHTML = '<i class="bxr bx-copy" style="color:#fff;font-family:boxicons;" />';


    // Style position
    figure.style.position = 'relative';
    button.style.position = 'absolute';
    button.style.top = '8px';
    button.style.right = '8px';
    button.style.background = 'transparent';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.color = '#fff';

    // Add button to the figure
    figure.appendChild(button);

    // Copy text on click
    button.addEventListener('click', () => {
      const lines = Array.from(codeBlock.querySelectorAll('.line')).map(line => line.innerText).join('\n');
      navigator.clipboard.writeText(lines).then(() => {
        button.innerHTML = '<i class="bxr bx-copy" style="color:#60b0f4;font-family:boxicons;" />';
        setTimeout(() => button.innerHTML = '<i class="bxr bx-copy" style="color:#fff;font-family:boxicons;" />', 2000);
      });
    });
  });
});


}());
