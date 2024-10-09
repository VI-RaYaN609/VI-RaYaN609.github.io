var cart = [];   // [ [ data1,index1,pageNumber1] , [data2, index2,pageNumber2] , ... ]
var gamedata =[] // [ data1, data2, ... ]
var newrealeasedata
var pageNumber = 1
var counter = 0;
var SlideShowId
let temp=0
var ThisAssureOnlyOnceRun = true
var numberPicked = []
let number
let MaxPage = 1000
const apiKey = 'ca4c16d5fca14dc68685ee99c54358fd'
const apiURL = `https://api.rawg.io/api/games`
function DrawCartContent(cartDROP,bool=true){
    const cartamount= document.querySelector(".cart-amount")
    cartamount.innerHTML = cart.length;
    cartDROP.innerHTML = `<ul class="cart-content"></ul><h2><a class="checkout-hyperlink" href="Profile/checkout.html">Check Out</a></h2>`
    const cartcontent = document.querySelector(".cart-content")
    cartcontent.innerHTML = ``
    for (let i = 0; i < cart.length; i++){
        cartcontent.innerHTML += `<li>${cart[i][0].name}<button class="remove"onclick="removeFromCart(${cart[i][1]},${cart[i][2]})">Remove</button></li>`
    }
    if(cart.length == 0){ 
        cartDROP.innerHTML = `<ul class="cart-content"><li style="opacity:0.5;display:flex;justify-content:center;font-size:15px">No-content</li></ul>`
    }
        
}
function AddToCart(index,pageNumber,bool = true){
    console.log(index,pageNumber,bool)
    let exists= false
    if( cart ) exists = cart.some(item => item[1] === index && item[2] === pageNumber);
    if(exists){
        alert("This game is already in your cart");
        return;
    }
    if (!bool) cart.push([newrealeasedata[index],index,pageNumber])//! for new release games !
    else      cart.push([gamedata[pageNumber].results[index],index,pageNumber])
    DrawCartContent(document.querySelector(".cartDrop"))
    console.log("Shopping Cart",cart)
    localStorage.setItem(`cartContent${getCookie('loginstate')}`,JSON.stringify(cart))
}
function removeFromCart(index,pageNumber){
    cart.splice(cart.findIndex(item => item[1] == index && item[2] == pageNumber),1)
    console.log(cart)
    localStorage.setItem(`cartContent${getCookie('loginstate')}`,JSON.stringify(cart))
    DrawCartContent(document.querySelector(".cartDrop"))
}
function CartCode(){
    const String = JSON.parse(localStorage.getItem(`cartContent${getCookie('loginstate')}`))
    if (String != undefined && String != null) cart = String
    if(cart ) DrawCartContent(document.querySelector(".cartDrop"))
    const cartelement = document.querySelector("#cart")
    const cartDROP = document.querySelector(".cartDrop")
    let cartBOOL = false
    cartelement.addEventListener('click',()=>{
        if (cartBOOL) {
            cartBOOL = false
            cartDROP.style.display = "none"
        }
        else{
            cartBOOL = true
            cartDROP.style.display = "block"
        }
    })

}
function SlideShowView(data,i){
    // slide image every 2.5 seconds
    document.querySelectorAll(".slideshowbut").forEach(button => {
        button.addEventListener('click',()=>{
                const num = parseInt(button.getAttribute("data-num"))
                counter += num;
                if (counter >= data.short_screenshots.length) counter = 0
                if (counter < 0) counter = data.short_screenshots.length - 1
                document.querySelector(".SlideShow-Image").src = data.short_screenshots[counter].image
                document.querySelectorAll(".SlideShow-Small-Image")[counter].classList.add("ACTIVESLIDE")
                document.querySelectorAll(".SlideShow-Small-Image")[temp].classList.remove("ACTIVESLIDE")
                temp = counter
                console.log(document.querySelectorAll(".SlideShow-Small-Image"))
                clearInterval(SlideShowId)
                startInterval()
        })
    })
    // this function is so u can stop interval when user changes slide manually
    function startInterval(){
        SlideShowId = setInterval(()=>{
            counter += 1;
            if (counter >= data.short_screenshots.length) counter = 0
            if (counter < 0) counter = data.short_screenshots.length - 1
            document.querySelector(".SlideShow-Image").src = data.short_screenshots[counter].image
            document.querySelectorAll(".SlideShow-Small-Image")[counter].classList.add("ACTIVESLIDE")
            document.querySelectorAll(".SlideShow-Small-Image")[temp].classList.remove("ACTIVESLIDE")
            temp = counter
        },2500)
    }
    startInterval()
    const small_images=document.querySelector(".SlideShow-Small-Images")
    let j = 0
    data.short_screenshots.forEach(e =>{
        small_images.innerHTML += `<img data-counter="${j}" class="SlideShow-Small-Image" src="${e.image}">`
        j++
    })  
    // small images code 
    document.querySelectorAll(".SlideShow-Small-Image").forEach(image => {
        image.addEventListener('click',()=>{
            document.querySelector(".SlideShow-Image").src = image.src
            counter = parseInt(image.getAttribute("data-counter"))
            document.querySelectorAll(".SlideShow-Small-Image")[counter].classList.add("ACTIVESLIDE")
            document.querySelectorAll(".SlideShow-Small-Image")[temp].classList.remove("ACTIVESLIDE")
            temp = counter
            clearInterval(SlideShowId)
            startInterval()
        })
    })
    
}
function BackToMainStorePage(){
    document.querySelector(".Single-Game-go-Back").addEventListener("click",()=>{
        window.location.href="store.html"
    })
}
function SingleGamePageView(bool=true,string=".game-image"){
    const game_images = document.querySelectorAll(string)
    game_images.forEach(image=>{
        image.addEventListener('click',(e)=>{  
            document.querySelector("main").classList.replace("main","newMain")
            const i = image.getAttribute("data-index") // index of the page in the page list ()
            const ArrayIndex = image.getAttribute("data-pageNumber")
            if (ArrayIndex == -1) data = newrealeasedata[i]
            else  data = gamedata[ArrayIndex-1].results[i]
            console.log(e.target,bool )
            document.querySelector("main").innerHTML = `
            <div class="game-content-container">
               <div class="images">
                  <div class="single-game-name">${data.name}</div>
                  <img class="SlideShow-Image" src="${data.short_screenshots[0].image}">
                  <div class="SlideShow-buttons">
                     <button class="slideshowbut" id="button1" data-num="-1"><</button>
                     <button class="slideshowbut" id="button2" data-num="1">></button>
                  </div>
                  <div class="SlideShow-Small-Images">
                  </div>
               </div>
               <div class="information-container">
                   <img class="single-game-image"src="${data.background_image}">
                   <div class="description">
                       <h3 style="display:flex;justify-content:center;">Reviews : ${data.rating}/5⭐ <p style="font-size:15px;">(${data.ratings_count})</p></h2>
                       <br>
                       <h3>Release Date : ${data.released}</h2>
                       <br>
                       <h3>Developer : </h2>
                   </div>
                   <div class="tags"></div>
                   <button class="single-game-addToCart"onclick="AddToCart(${i},${ArrayIndex-1},${bool})">Add To Cart</button>
               </div>
               <div class="Single-Game-go-Back">Go Back</div>
            </div>
            `
            const tags = document.querySelector(".tags")
            tags.innerHTML = ``
            for (let j = 0; j < data.genres.length; j++) {
             tags.innerHTML += `
              <p>${data.genres[j].name}</p>
             `
            } 
            SlideShowView(data,i)
            BackToMainStorePage()
                   
        })
    })

}
async function fetchdata(){
    let counter = 0
    while(1){
       number = Math.floor(Math.random()*MaxPage)
       if ( numberPicked.indexOf(number)==-1 ||counter == MaxPage){
         numberPicked.push(number)
         console.log(number)
         break
       }
       counter++
    }
    try{
       const response = await fetch(`${apiURL}?key=${apiKey}&page=${number}&page_size=24&dates=2018-07-01,2024-08-01`)
       console.log(response)
       if (!response.ok) throw new Error('Failed to fetch games');
       const data = await response.json()
       const container = document.querySelector(".container")
       //all games loading to webpage
       for(let i = 0; i < data.results.length; i++){
                let emojies = ""
                data.results[i].parent_platforms.forEach(platform => {
                if (platform.platform.name == "PlayStation") emojies += `<i class="fa-brands fa-playstation"></i>`
                if (platform.platform.name == "Xbox") emojies += `<i class="fa-brands fa-xbox"></i>`
                if (platform.platform.name == "PC") emojies += `<i class="fa-solid fa-desktop"></i>`
                })
                container.innerHTML += `
                <div class="box">
                   <img class="game-image" src="${data.results[i].background_image}" data-index="${i}" data-pageNumber="${pageNumber}">
                   <h2 class="game-price">49.99 $</h2>
                   <div class="game-information">
                       <div class="name-price">
                          <h1>${data.results[i].name.slice(0,25)}</h1>
                       </div>
                       <div class="tags"></div>
                       <p class="game-platforms">${emojies}</p>
                       <button class="buy-button"onclick="AddToCart(${i},${pageNumber-1})">Add To Cart</button>
                       <p class="game-release">release: ${data.results[i].released}</p>
                   </div>
                </div>
                `
                const tags = document.querySelectorAll(".tags")
                tags[tags.length-1].innerHTML = ``
                for (let j = 0; j < data.results[i].genres.length; j++) {
                 tags[tags.length-1].innerHTML += `
                  <p>${data.results[i].genres[j].name}</p>
                 `
                }           
                tags[tags.length-1].innerHTML += `<p>${data.results[i].rating}/5⭐</p>`
       }
       gamedata.push(data)
       pageNumber += 1 
       if (!ThisAssureOnlyOnceRun) SingleGamePageView()
    }
    catch(error){
        setTimeout(()=>{fetchdata()},500)
    }
    if ( ThisAssureOnlyOnceRun){
        // !RECOMMENDED CODE
        const recommend = document.querySelector(".recommend")
        let i = Math.floor(Math.random()*20);let k = 0
        const data = gamedata[0]
        while(k<4){
             let emojies = ""
             let pageNumber = 1
             data.results[i].parent_platforms.forEach(platform => {
                if (platform.platform.name == "PlayStation") emojies += `<i class="fa-brands fa-playstation"></i>`
                if (platform.platform.name == "Xbox") emojies += `<i class="fa-brands fa-xbox"></i>`
                if (platform.platform.name == "PC") emojies += `<i class="fa-solid fa-desktop"></i>`
             })
             recommend.innerHTML += `<div class="box">
             <img class="game-image" src="${data.results[i].background_image}" data-index="${i}" data-pageNumber="${pageNumber}">
             <h2 class="game-price">49.99 $</h2>
             <div class="game-information">
                 <div class="name-price">
                    <h1>${data.results[i].name.slice(0,25)}</h1>
                 </div>
                 <div class="tags tags1"></div>
                 <p class="game-platforms">${emojies}</p>
                 <button class="buy-button"onclick="AddToCart(${i},${pageNumber-1})">Add To Cart</button>
                 <p class="game-release">release: ${data.results[i].released}</p>
             </div>
             </div>
             `
             const tags = document.querySelectorAll(".tags1")
             tags[k].innerHTML = ``
             for (let j = 0; j < data.results[i].genres.length; j++) {
              tags[k].innerHTML += `
               <p>${data.results[i].genres[j].name}</p>
              `
             }           
             tags[k].innerHTML += `<p>${data.results[i].rating}/5⭐</p>`
             k++
             i++; if ( i == 20) i = 0
            }
            
       SingleGamePageView()
        // !NEW RELEASE CODE
        const fetchGamesByReleaseDate = async () => {
            const response = await fetch(`${apiURL}?key=${apiKey}&page=1&page_size=200&dates=2024-01-01,2024-08-01`);
            if (!response.ok) throw new Error('Failed to fetch games')
            const data = await response.json()
            return data.results
        }
        function FetchNewReleaseGames(){
        fetchGamesByReleaseDate()
            .then(games => {
                const newrealeses = document.querySelector(".newrealeses")
                let i = Math.floor(Math.random()*200);let k = 0
                const data = games
                newrealeasedata= data
                while(k<4){
                     let emojies = ""
                     let pageNumber = -1
                     data[i].parent_platforms.forEach(platform => {
                        if (platform.platform.name == "PlayStation") emojies += `<i class="fa-brands fa-playstation"></i>`
                        if (platform.platform.name == "Xbox") emojies += `<i class="fa-brands fa-xbox"></i>`
                        if (platform.platform.name == "PC") emojies += `<i class="fa-solid fa-desktop"></i>`
                     })
                     newrealeses.innerHTML += `<div class="box">
                     <img class="game-image new-image" src="${data[i].background_image}" data-index="${i}" data-pageNumber="${pageNumber}">
                     <h2 class="game-price">49.99 $</h2>
                     <div class="game-information">
                         <div class="name-price">
                            <h1>${data[i].name.slice(0,25)}</h1>
                         </div>
                         <div class="tags tags1"></div>
                         <p class="game-platforms">${emojies}</p>
                         <button class="buy-button"onclick="AddToCart(${i},-1,false)">Add To Cart</button>
                         <p class="game-release">release: ${data[i].released}</p>
                     </div>
                     </div>
                     `
                     const tags = document.querySelectorAll(".tags1")
                     tags[k].innerHTML = ``
                     for (let j = 0; j < data[i].genres.length; j++) {
                      tags[k].innerHTML += `
                       <p>${data[i].genres[j].name}</p>
                      `
                     }           
                     tags[k].innerHTML += `<p>${data[i].rating}/5⭐</p>`
                     k++
                     i++; if ( i == 200) i = 0
                    
                 }
                 SingleGamePageView(false,`.new-image`)
            })
            .catch(error => {FetchNewReleaseGames()});
        }
        FetchNewReleaseGames()
        ThisAssureOnlyOnceRun = false
    }
    
}
function createCookie(name,value,alive){
    const date = new Date()
    date.setTime(date.getTime()+(alive*24*60*60*1000))
    let expires="expires="+date.toUTCString()
    document.cookie=`${name}=${value};${expires};path=/`
}
function getCookie(cookieName){
    const decoded = decodeURIComponent(document.cookie).split("; ");//split cookie into an array
    let result
    decoded.forEach(cookie=>{
        cookieparts = cookie.split("=")
        if(cookieparts[0]==cookieName){
            result= cookie.substring(cookieName.length+1)
        }
    })
    return result
}
function sendMessage(){
    document.querySelectorAll("form").forEach(form=>form.addEventListener("submit",event=>{event.preventDefault()}))
    const inputs = document.querySelectorAll("#inputmessage")
    if ( !getCookie(`messagecount`)) createCookie(`messagecount`,1,999)
    const usernumber = getCookie(`loginstate`)
    const messagenumber = getCookie(`messagecount`)
    const imageSRC = getCookie(`ImageURL${usernumber}`)
    let message = inputs[0].value ; inputs[0].value = ``
    if (message.trim() == ``) return
    let maxlength = 120
    console.log(maxlength)
    if (message.length > maxlength){
       message= String(message).substring(0,maxlength)
    }
    const dateobj = new Date
    const date = dateobj.toUTCString()
    createCookie(`messagetext${messagenumber}`,message,999)
    createCookie(`messageusernumber${messagenumber}`,usernumber,999)
    createCookie(`messagedate${messagenumber}`,date,999)
    const username = getCookie(`username${usernumber}`)
    document.querySelector('.chat-container').innerHTML += `
       <div class="message-box">
       <label><img class="mini-profile-image" src="${imageSRC}"><p class="UserName">${username}</p><textarea class="textarea" rows="1" class=".input" type="text" readonly>${message}</textarea><b>${date}</b></label>
       <button class="remove-message" onclick="removeMessage(${messagenumber})">Remove</button>
       </div>
    `
    if ( getCookie(`isadmin${usernumber}`)==`true` ){
        const Parag=document.querySelectorAll('.UserName')
        Parag[Parag.length-1].innerHTML += `<span class="admin">Admin</span>`
    }
    createCookie(`messagecount`,parseInt(getCookie(`messagecount`))+1,999)
}
function removeMessage(messagenumber) {
   createCookie(`messagedate${messagenumber}`,null,null)   
   createCookie(`messageusernumber${messagenumber}`,null,null)   
   createCookie(`messagetext${messagenumber}`,null,null) 
//    createCookie(`messagecount`,parseInt(getCookie(`messagecount`))-1,999)  
   window.location.href=`community.html`
}
function fixImage(){
    document.body.style.backgroundAttachment = `fixed`
    document.body.style.backgroundSize = `Cover`
    document.body.style.backgroundRepeat = `no-repeat`
}
function ThemeFunction(){
    const switchMode = document.getElementById('switch-mode');
    const usernumber = getCookie("loginstate")
    const Usertheme = getCookie(`theme${usernumber}`)
    document.body.style.background = `url(images/background${Usertheme}.jpg)`
    fixImage()
    if (switchMode.checked && Usertheme == 0) switchMode.checked = false
    if ( !switchMode.checked && Usertheme == 1)switchMode.checked = true
    switchMode.addEventListener('change', function () {
        if(this.checked) {        
            createCookie(`theme${usernumber}`,1,999)
           document.body.style.background = `url(images/background1.jpg)` 
           fixImage() 
        } else {
            createCookie(`theme${usernumber}`,0,999)
            document.body.style.background = `url(images/background0.jpg)`
            fixImage()
        }
    })
}
document.addEventListener("DOMContentLoaded",()=>{
    if ( !getCookie("theme"))createCookie("theme",0,999)
    const switchMode = document.getElementById('switch-mode');
    const windowName = window.location.pathname.split("/").pop()
    if (windowName==`login.html`||windowName==`forgot.html`||windowName==`register.html`){
        console.log("Enter Login/Register website detected")
        let theme = getCookie(`theme`)
        document.body.style.background = `url(images/background${theme}.jpg)`
        fixImage()
        if (switchMode.checked && theme == 0) switchMode.checked = false
        if ( !switchMode.checked && theme == 1)switchMode.checked = true
        switchMode.addEventListener('change', function () {
            if(this.checked) {        
               createCookie(`theme`,1,999)
               document.body.style.background = `url(images/background1.jpg)`        
               fixImage() 
            } else {
                createCookie(`theme`,0,999)
                document.body.style.background = `url(images/background0.jpg)`        
                fixImage()
            }
    })
    }else{
      const usernumber = getCookie("loginstate")
      const balance = getCookie(`balance${getCookie('loginstate')}`)
      if (isNaN(balance)) createCookie(`balance${getCookie('loginstate')}`,0.1,999)
      let AdminLogo = ``
      const isadmin = getCookie(`isadmin${usernumber}`)
      if ( isadmin==`true`){ 
        AdminLogo = `<span class="AdminLogo">Admin</span>`
        if ( windowName==`funds.html`||windowName==`information.html`||windowName==`checkout.html`)
           document.querySelector('.hidden').innerHTML += `<li><a href="../admin.html"><p>Admin Menu</p></a></li>`
        else 
           document.querySelector('.hidden').innerHTML += `<li><a href="admin.html"><p>Admin Menu</p></a></li>`

      }
      document.querySelector('.Username').innerHTML = `${getCookie(`username${usernumber}`)}${AdminLogo}<p class="rotate">&#9660</p>`;
      document.querySelector('.balance').innerHTML = `${Number(getCookie(`balance${usernumber}`)).toFixed(2)} $`
      setTimeout(()=>{document.querySelector(".profile-image").src = getCookie(`ImageURL${getCookie(`loginstate`)}`)},500)
      
      CartCode()
      const rotateElement =document.querySelector('.rotate')
      rotateElement.style.transform = 'rotate(-90deg)'
      document.querySelector('.profile-information').addEventListener('mouseover',()=>{
        rotateElement.style.transform = 'rotate(0deg)'
        })
        document.querySelector('.profile-information').addEventListener('mouseout',()=>{
            rotateElement.style.transform = 'rotate(-90deg)'
      })
    }
    if ( windowName== `store.html`) {
        ThemeFunction()
        fetchdata()
    }
    if (windowName == `community.html`){
        ThemeFunction()
        const len = parseInt(getCookie(`messagecount`))
        const chatcontainer = document.querySelector('.chat-container')
        const isadmin = getCookie(`isadmin${getCookie("loginstate")}`)
        for (let i = 1; i < len;i++){
           const usernumber = getCookie(`messageusernumber${i}`)
           if (usernumber == undefined) continue
           let username;
           if (getCookie(`isbanned${usernumber}`) == `true`) username = `Banned user`   //this if user got banned message gets removed from storage
           else username = getCookie(`username${usernumber}`)
               const imageSRC = getCookie(`ImageURL${usernumber}`)
               const message = getCookie(`messagetext${i}`)
               const date = getCookie(`messagedate${i}`)
           if (isadmin == `true` ||usernumber == getCookie("loginstate")){
           chatcontainer.innerHTML += `
           <div class="message-box">
                <label><img class="mini-profile-image" src="${imageSRC}"><p class="UserName">${username}</p><textarea class="textarea" rows="1" class="input" type="text" readonly>${message}</textarea><b>${date}</b></label>
                <button class="remove-message" onclick="removeMessage(${i})">Remove</button>
           </div>
           `
           }else{
               chatcontainer.innerHTML += `
                  <div class="message-box">
                    <label><img class="mini-profile-image" src="${imageSRC}"><p class="UserName">${username}</p><textarea class="textarea" rows="1" class="input" type="text" readonly>${message}</textarea><b>${date}</b></label>
                  </div>
                `
           }
           if ( getCookie(`isadmin${usernumber}`)==`true` ){
               const Parag=document.querySelectorAll('.UserName')
               Parag[Parag.length-1].innerHTML += `<span class="admin">Admin</span>`
           }
        }
        function autoResize(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight + 2) + 'px';
        }
        document.querySelectorAll('textarea').forEach(e=>{
            setInterval(autoResize(e),1000)
        })
    }
    if(windowName == 'library.html'){
        ThemeFunction()
        Loadgames()
    }
    if (windowName == "admin.html"){
        ThemeFunction()
        if ( getCookie(`isadmin${getCookie('loginstate')}`)==`false`){
        location.href='store.html'
        return
        }
        LoadUsers()
    }   
    if ( windowName == 'support.html'){
        if ( getCookie(`loginstate`) == undefined){
            document.querySelector('.profile').innerHTML = ``
            let theme = getCookie(`theme`)
            if ( isNaN(theme)) theme = 0
            document.body.style.background = `url(images/background${theme}.jpg)`
            fixImage()
            if (switchMode.checked && Usertheme == 0) switchMode.checked = false
            if ( !switchMode.checked && Usertheme == 1)switchMode.checked = true
            switchMode.addEventListener('change', function () {
                if(this.checked) {        
                    createCookie(`theme`,1,999)
                   document.body.style.background = `url(images/background1.jpg)` 
                   fixImage() 
                } else {
                    createCookie(`theme`,0,999)
                    document.body.style.background = `url(images/background0.jpg)`
                    fixImage()
                }
            })
        }
        else{
            ThemeFunction()
        }
        
    }

    console.log("All Cookies",document.cookie)
})
function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        const [name, _] = cookie.split("=");
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    localStorage.clear();
}