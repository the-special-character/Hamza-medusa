const fs = require('fs')

function readAsJson(filename) {
    return JSON.parse(fs.readFileSync(filename)); 
}

function replaceStoreIdsInSeed(filename, storeIds) {
    const seedData = readAsJson(filename);
    
    //replace store ids
    for (let n=0; n<seedData.products.length; n++) {
        seedData.products[n].store_id = storeIds[0];
    }
    
    //overwrite the file 
    fs.writeFileSync(filename, JSON.stringify(seedData, null, 2)); 
    console.log("created ", filename);
}

async function main() 
{
    try {
        const authResponse = await fetch('http://localhost:9000/admin/auth', {
            method: 'POST',
            body: JSON.stringify({ email: 'admin@medusa-test.com', password:'supersecret' }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }); 
        const authData = await authResponse.json();
        console.log(authResponse.headers);
        const authCookie = authResponse.headers.get('set-cookie');
        console.log(authCookie.substring(0, authCookie.indexOf(';')));
        
        const response = await fetch('http://localhost:9000/admin/custom/user?email=goblinvendor@hamza.com&password=password', {
            method: 'GET',
            headers: { 'Cookie': authCookie.substring(0, authCookie.indexOf(';')) },
        });
        
        const data = await response.json();
        if (!data.store0) {
            console.error(data);
        }
        else {
            const storeIds = [data.store0.id];
            replaceStoreIdsInSeed("data/seed-1.json", storeIds);
        }
    }
    catch(e) {
        console.error(e);
    }
}

main();
