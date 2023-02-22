import * as fs from 'fs';
import http from 'http';
import url from 'url';
import { replaceTemplate } from './modules/replaceTemplate.js';
import slugify from 'slugify';

const tempOverview = fs.readFileSync(`./templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`./templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`./templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`./dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((elmt) => slugify(elmt.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // overview page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj.map((elmnt) => replaceTemplate(tempCard, elmnt)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // NOT FOUND
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('server listening');
});
