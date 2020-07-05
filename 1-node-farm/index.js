const fs = require('fs')
const http = require('http')
const url = require('url')

const replaceTemplate = require('./modules/replaceTemplate')

// Blocking, synchronous way ------------------------------------------------------------
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way -------------------------------------------------------
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written 😁');
//       })
//     });
//   });
// });
// console.log('Will read file!');

// Server -----------------------------------------------------------------------------------------
const Overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const Product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const Card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer( ( req, res ) => {
    const { query, pathname } = url.parse(req.url, true)

    // Home route ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    if( pathname === '/' || pathname === '/overview' ) {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cardsHtml = dataObj.map( prod => replaceTemplate(Card, prod)).join('');
        const output = Overview.replace('{%PRODUCTS_CARDS%}', cardsHtml);
        res.end(output);

    // Product route ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    } else if( pathname === '/product' ) {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const prod = dataObj[query.id];
        const output = replaceTemplate(Product, prod)
        res.end(output);

    // Api route ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    } else if( pathname === '/api' ) {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

    // Not found route ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    } else {
        res.writeHead(404);
        res.end('Page not found!');
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
})