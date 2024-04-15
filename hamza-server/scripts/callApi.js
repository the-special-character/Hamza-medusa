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

//auth call first
fetch('http://localhost:9000/admin/auth', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@medusa-test.com', password:'supersecret' }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
}).then((response) => response.json())
.then((json) => {
    //call to create records 
    fetch('http://localhost:9000/admin/custom/user?email=goblinvendor@hamza.com&password=password', {
        method: 'GET',
        headers: { 'Cookie': 'connect.sid=s%3AWa1xUWUBc_6S8ZmJxcLDmSXXXVCOGbdU.Rfmyt4%2BSWR%2Bw7WGnBSESFhgoPvo6kGVPph03%2BOI0Wpw', 'Content-type': 'application/json; charset=UTF-8' },
    }).then((response) => response.json())
    .then((json) => {
        console.log(json.store0.id);
        
        //get the store IDs
        const storeIds = [json.store0.id]; 
        
        //write them to seed-1
        replaceStoreIdsInSeed("data/seed-1.json", storeIds);
    }).catch(error => {
        console.log(error)
    });
}).catch(error => {
    console.log(error)
});