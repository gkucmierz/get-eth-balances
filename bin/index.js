#!/usr/bin/env node

const args = require('args');
 
args
  .option('input', 'The file with ETH addresses, that will be processed');
 
const flags = args.parse(process.argv);

const API = addr => `https://api.etherscan.io/api?module=account&action=balancemulti&address=${addr}&tag=latest&apikey=YourApiKeyToken`;

const fs = require('fs');
const request = require('request');


let addresses = (fs.readFileSync(flags.i)+'').match(/0x[0-9a-f]{40}/ig);

// console log balances
(function loop() {

  let chunk = addresses.splice(0, 20);
  let joined = chunk.join(',').toLowerCase();
  
  request(API(joined), function (error, response, body) {
    if (error) {
      console.error(error);
    }
    
    let parsed = JSON.parse(body);
    if (parsed.status === '0') {
      console.error(parsed.result);
      console.error(joined);
    } else {
      JSON.parse(body).result.map(acc => {
        console.log(`${acc.account}  ${acc.balance}`);
      });

      if (addresses.length) {
        loop();
      }      
    }

  });

}());


