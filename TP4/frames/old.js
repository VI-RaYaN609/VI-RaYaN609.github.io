var price1= 100;
var price2= 100;
var price3= 100;
var quantity1= 1;
var quantity2= 1;
var quantity3= 1;
var exonerationstate = true;
var reduction = 0;
var exoneration = 0;
function result (){
    const sum  = price1*quantity1 + price2*quantity2 + price3*quantity3
    let state = true
    if(quantity1<0 ||quantity1>9999){state = false}
    if(quantity2<0 ||quantity2>9999){state = false}
    if(quantity3<0 ||quantity3>9999){state = false}
    if (exonerationstate){
        exoneration = sum*0.19
    }
    if(state){
    document.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>      
         table{
            margin-top: 20px;
         }
            th{
                font-size: 25px;
            }
            @media (max-width: 1200px) {
                th{
                    font-size: 20px;
                    transition: 0.5s ease-out;
                }
            }
            @media (max-width : 900px){
                th{
                    font-size: 17.5px;
                    transition: 0.5s ease-out;
                }
            }
            @media (max-width: 450px) {
                th{
                    font-size: 15px;
                    transition: 0.5s ease-out;
                }
            }
        </style>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <table>
            <tr>
                <th class="strong">Product</th>
                <th class="strong">Unit Price</th>
                <th class="strong">Quantity</th>
                <th class="strong">Amount</th>
            </tr>
            <tr>
                <th>Product ${price1/100}</th>
                <th>${price1} DA</th>
                <th>${quantity1}</th>
                <th>${price1*quantity1} DA</th>
            </tr>
            <tr>
                <th>Product ${price2/100}</th>
                <th>${price2} DA</th>
                <th>${quantity2}</th>
                <th>${price2*quantity2} DA</th>
            </tr>
            <tr>
                <th>Product ${price3/100}</th>
                <th>${price3} DA</th>
                <th>${quantity3}</th>
                <th>${price3*quantity3} DA</th>
            </tr>
            <tr>
                <th colspan="3">Exoneration Amount(19%)</th>
                <th>${exoneration} DA</th>
            </tr>
            <tr>
                <th colspan="3">Reduction Amount</th>
                <th>${reduction*100}% (${sum*reduction}DA)</th>
            </tr>
            <tr>
                <th colspan="2"></th>
                <th>Net Amount</th>
                <th>${sum} DA</th>
            </tr>
            <tr>
                <th colspan="2"></th>
                <th>Brut Amount</th>
                <th>${sum+exoneration-reduction*sum} DA</th>
            </tr>
        </table>
        <a class="hyperlinks" id="back" href="order.html">Other Order Entry</a>
        <script src="../index.js"></script>
    </body>
    </html>`)
}
}
function PRICE1(element){
    console.log(element)
    price1 = element.target.value*100
}
function PRICE2(element){
    console.log(element)
    price2 = element.target.value*100
}
function PRICE3(element){
    console.log(element)
    price3 = element.target.value*100
}
function Quantity1(element){
    console.log(element)
    quantity1 = element.value
}
function Quantity2(element){
    console.log(element)
    quantity2 = element.value
}
function Quantity3(element){
    console.log(element)
    quantity3 = element.value
}
function Exoneration(element){
    exonerationstate = !element.checked
    console.log(exonerationstate)
}
function REDUCTION(number) {
    console.log(number)
    reduction = number
}