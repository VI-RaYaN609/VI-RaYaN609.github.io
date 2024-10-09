var products = [];
function edit(index){
    let list = document.querySelector(".list");
    list.innerHTML = ``
    for ( let product in products){
        if (product!= index){
            console.log("product is ",product)
            list.innerHTML += `
            <li>
                <h1>${products[product].name} [ Qte = ${products[product].quantity} ] [ Price = ${products[product].price} ]  
                <button onclick="edit(${product})">Edit</button> 
                <button onclick="remove(${product})">Remove</button></h1>
            </li>`
        }
        else{
            list.innerHTML += `
            <li>
                <h1>${products[product].name} [ Qte = ${products[product].quantity} ] [ Price = ${products[product].price} ] 
                <label class="small">Name :<input class="width100px" type="text" id="nm" value="${products[product].name}"> </label>
                <label class="small">Qte :<input class="width100px" type="number" id="qte" value="${products[product].quantity}"> </label>
                <label class="small">Price :<input class="width100px" type="number" id="pr" value="${products[product].price}"> </label>
                <button onclick="save(${product})">Save</button> 
                <button onclick="remove(${product})">Remove</button></h1>
            </li>`
        }
    }
    console.log(products)
}
function save(index){
    let list = document.querySelector(".list");
    let product = {
        name:document.querySelector("#nm").value,
        quantity:document.querySelector("#qte").value,
        price:document.querySelector("#pr").value,
        amount:document.querySelector("#qte").value*document.querySelector("#pr").value,
    }
    products[index] = product;
    list.innerHTML = ``
    for ( let product in products){
            list.innerHTML += `
            <li>
                <h1>${products[product].name} [ Qte = ${products[product].quantity} ] [ Price = ${products[product].price} ]  
                <button onclick="edit(${product})">Edit</button> 
                <button onclick="remove(${product})">Remove</button></h1>
            </li>`
    }
    console.log(products);
    refreshTotals()
}
function remove(index){
    let list = document.querySelector(".list");
    list.innerHTML = ``
    for ( let product in products){
        if (product!= index){
            list.innerHTML += `
            <li>
                <h1>${products[product].name} [ Qte = ${products[product].quantity} ] [ Price = ${products[product].price} ]  
                <button onclick="edit(${product})">Edit</button> 
                <button onclick="remove(${product})">Remove</button></h1>
            </li>`
        }
    }
    products.splice(index,1)
    console.log(products)
    refreshTotals()
}
function refreshTotals(){
    let totalproducts = products.length;
    let totalquantity=0;let totalamount = 0;
    products.forEach(product => {
        totalquantity += Number(product.quantity);
        totalamount += Number(product.amount);
    })
    let items = document.querySelectorAll(".li");
    items[0].innerHTML = `I.Number of products:  ${totalproducts}`;
    items[1].innerHTML = `II.Total Quantity:  ${totalquantity}`;
    items[2].innerHTML = `III.TotalAmount:  ${totalamount}`;
}
function AddProduct(){
    // this code is written by nibou rayane abderahmane (copy right)
    const information = document.querySelectorAll(".information");
    let product = {
        name:information[0].value,
        quantity: parseFloat(information[1].value),
        price: parseFloat(information[2].value),
        amount:0,
    }
    if (isNaN(product.quantity) || isNaN(product.price) || product.name == ""){
        document.querySelector(".warning").innerHTML = "Please select NORMAL values "
    }
    else{
        product.amount = product.quantity*product.price;
        products.push(product)
        console.log(products)
        refreshTotals()
        let list = document.querySelector(".list");
        list.innerHTML += `
                       <li>
                           <h1>${products[products.length-1].name} [ Qte = ${products[products.length-1].quantity} ] [ Price = ${products[products.length-1].price} ]  
                           <button onclick="edit(${products.length-1})">Edit</button> 
                           <button onclick="remove(${products.length-1})">Remove</button></h1>
                       </li>`
        document.querySelector(".warning").innerHTML = ""
    }
}