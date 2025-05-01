/* global hexo */

'use strict';

hexo.extend.tag.register('note', (args, content) => {
  const className = args.shift();
  let header = '';
  let result = '';

  if (args.length) {
    header += `<strong class="note-title">${args.join(' ')}</strong>`;
  }

  result += `<blockquote class="note ${className}">${header}`;
  result += hexo.render.renderSync({text: content, engine: 'markdown'});
  result += '</blockquote>';

  return result;
}, true);


hexo.extend.tag.register('preview', args => {
  const image = args[0];
  let result = '';
  // console.log('image = ' + image);

  result += '<div class="plugin-screenshot"><img src="/images/' + image + '" data-sizes="auto" class="plugin-screenshot-img medium-zoom-image" alt="' + image + '" data-zoom-src="/images/' + image + '" data-zoomable><div class="plugin-screenshot-mask"><i class="fa fa-eye"></i></div></div>';
  result += '<script src="https://cdn.jsdelivr.net/npm/medium-zoom@1.0.8/dist/medium-zoom.min.js"></script><script defer>mediumZoom(\'.medium-zoom-image\',{background:\'#171f26\'});</script>';
  return result;
});

