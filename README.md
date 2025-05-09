# QBO Official Website

<!-- [![Tester](https://github.com/hexojs/site/actions/workflows/tester.yml/badge.svg)](https://github.com/hexojs/site/actions/workflows/tester.yml) -->

[![Netlify Status](https://api.netlify.com/api/v1/badges/b13e4405-737b-4093-8bb9-539879da1716/deploy-status)](https://app.netlify.com/sites/qbo-cloud/deploys)

<!-- [![Crowdin](https://badges.crowdin.net/hexo/localized.svg)](https://crowdin.com/project/hexo) -->

The website for QBO.

## Getting started

Install:

```bash
git clone https://git.qbo.io/qbo/site.git
cd site
npm install
```

Generate:

````bash
../hexo/bin/hexo generate --debug```

Run:

``` bash
../hexo/bin/hexo server
````

Update:

```bash
cd ../public
rm rm -rf ./*
cd -
rsync -a  public/ ../public/
```

# Staging
docs.levitas.dev

## Contributors

- English - [alexeadem](https://github.com/alexeadem)

## License

[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
