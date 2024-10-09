const lock = document.querySelectorAll(`.passlock`)
var TotalPrice
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

function createCookie(name,value,alive){
    const date = new Date()
    date.setTime(date.getTime()+(alive*24*60*60*1000))
    let expires="expires="+date.toUTCString()
    document.cookie=`${name}=${value};${expires};path=/`
}
function submitForm(number=null){
    const inputs  = document.querySelectorAll("input");
    const select = document.querySelectorAll("select");
    let adminchange = true
    if(number==null) {adminchange=false;number =getCookie("loginstate")}
    createCookie(`ImageURL${number}`,inputs[1].value,999)
    createCookie(`username${number}`,inputs[2].value,999)
    createCookie(`firstname${number}`,inputs[3].value,999)
    createCookie(`lastname${number}`,inputs[4].value,999)
    createCookie(`email${number}`,inputs[5].value,999)
    createCookie(`phone${number}`,inputs[6].value,999)
    createCookie(`bday${number}`,inputs[8].value,999)
    createCookie(`gender${number}`,select[1].value,999)
    document.querySelector(".WARNING").innerHTML=`User Information Changed Successfully`
    document.querySelector(".Profile-image").src = getCookie(`ImageURL${number}`)
    if(!adminchange){
        document.querySelectorAll("img")[1].src = getCookie(`ImageURL${number}`)
        setTimeout(()=>{window.location.href=`information.html`},2000)
    }
    else{
        let newBalance = parseFloat(inputs[9].value)+parseFloat(getCookie(`balance${number}`))
        if (!isNaN(newBalance))
           createCookie(`balance${number}`,newBalance,999)
        document.querySelector('.Check-out-container').innerHTML = `<div class="cart-games-container"></div>`
        console.log("Changed by admin")
        LoadUsers()
    }
}
function CancelChanges(){
    document.querySelector('.Check-out-container').innerHTML = `<div class="cart-games-container"></div>`
    LoadUsers()
}
function addFunds(){
    document.querySelector("form").addEventListener("submit",e=>{e.preventDefault()})
    const warning = document.querySelector(".FUNDS-TEXT")
    const inputs  = document.querySelectorAll("input");
    const serialkey = inputs[1].value
    const number =getCookie("loginstate")
    if ( serialkey.toLowerCase().trim()==``){
        warning.innerHTML = `Serial Number cannot be empty`
        setTimeout(()=>{warning.innerHTML =``},2500)
        return
    }
    else if(serialkey==`8362-5974-1023-4487`){
        warning.innerHTML = `Funds Added Successfully`
        createCookie(`balance${number}`,Number(getCookie(`balance${number}`))+10,999)
        warning.innerHTML = `10 $ GiftCard Redeemed Successfully`
        setTimeout(()=>{window.location.href=`funds.html`},1000)
        return
    }
    else if(serialkey==`7519-3046-6182-9351`){
        warning.innerHTML = `Funds Added Successfully`
        createCookie(`balance${number}`,Number(getCookie(`balance${number}`))+50,999)
        warning.innerHTML = `50 $ GiftCard Redeemed Successfully`
        setTimeout(()=>{window.location.href=`funds.html`},1000)
        return
    }
    else if ( getCookie(`isadmin${getCookie(`loginstate`)}`)== `true`){
          if (isNaN(serialkey)){
            warning.innerHTML = `Please enter a valid Number <br>(Admin enter only amount of funds)`
            setTimeout(()=>{warning.innerHTML =``},3500)
            return
          }
          createCookie(`balance${number}`,Number(getCookie(`balance${number}`))+Number(serialkey),999)
          warning.innerHTML = `Funds Added Successfully`
          setTimeout(()=>{window.location.href=`funds.html`},500)
        
    }
    else{
        warning.innerHTML = `Invalid Serial Number`
        setTimeout(()=>{warning.innerHTML =``},2500)
        return
    }
}
function Buygames(){
    const balance = getCookie(`balance${getCookie('loginstate')}`)
    const warning = document.querySelector(".warning")
    if (balance < TotalPrice){ 
       warning.innerHTML = `You don't have enough funds to complete action`
       warning.style.opacity=`1`
       setTimeout(()=>{warning.innerHTML=``;warning.style.opacity=`0`},1500)
       return
    }
    const newBalance = balance - TotalPrice
    createCookie(`balance${getCookie('loginstate')}`,newBalance,999)
    const cart = JSON.parse(localStorage.getItem(`cartContent${getCookie('loginstate')}`))
    const oldGames = JSON.parse(localStorage.getItem(`usergames${getCookie('loginstate')}`))
    let newGames
    if ( oldGames!= null){
        newGames = [...oldGames,...cart]
    }else{
         newGames = [...cart]
    }
    console.log(newGames)
    localStorage.setItem(`usergames${getCookie('loginstate')}`,JSON.stringify(newGames))
    localStorage.removeItem(`cartContent${getCookie('loginstate')}`)
    warning.innerHTML = `Thank you for the purchase!`
    warning.style.opacity=`1`
    setTimeout(()=>{warning.innerHTML=``;warning.style.opacity=`0`;location.href=`../library.html`},1500)
}
function Loadgames() {
    const storedData = localStorage.getItem(`usergames${getCookie('loginstate')}`)
    const games = storedData ? JSON.parse(storedData) : null;
    const checkoutcontainer = document.querySelector(".cart-games-container")
    if(games == null ) {
        checkoutcontainer.innerHTML = `<h1>You have no games in account</h1>`
        return
    }
    for ( let i = 0; i < games.length; i++ ){
        let emojies = ""
        const data = games[i][0]
        data.parent_platforms.forEach(platform => {
           if (platform.platform.name == "PlayStation") emojies += `<i class="fa-brands fa-playstation"></i>`
           if (platform.platform.name == "Xbox") emojies += `<i class="fa-brands fa-xbox"></i>`
           if (platform.platform.name == "PC") emojies += `<i class="fa-solid fa-desktop"></i>`
        })
        checkoutcontainer.innerHTML += `
            <div class="INFORMATION-container">
               <img class="game-image"src="${data.background_image}">
               <div class="game-info">
                   <h1>${data.name}</h1>
                   <h3 style="display:flex">Overall reviews :${data.rating}/5⭐ <p style="font-size:15px;">(${data.ratings_count})</p></h2>
                   <br>
                   <h3>Release Date : ${data.released}</h2>
                   <br>
                   <p class="game-platforms">${emojies}</p>
                   <div class="tags" style="justify-content:flex-start;gap:25px;"></div>
               </div>
               <button class="download" onclick="">Download</button>
            </div>
        `
        const tags = document.querySelectorAll(".tags")
        for (let j = 0; j < data.genres.length; j++) {
         tags[i].innerHTML += `
          <p>${data.genres[j].name}</p>
         `
        }
    }
}
function LoadUsers(){
    const usercount = getCookie('usercount')
    const checkoutcontainer = document.querySelector(".cart-games-container")
    const BigContainer = document.querySelector(".Check-out-container")
    for ( let i = 1 ; i< usercount ; i++){
        if ( !getCookie(`username${i}`)) continue
        let isadmin = ""
        const StorageData = localStorage.getItem(`usergames${i}`)
        let usergame = StorageData?  JSON.parse(StorageData).length: 0
        let isbanned = getCookie(`isbanned${i}`) ; let isbannedtext
        if (isbanned == null || isbanned == undefined) {isbanned = false; isbannedtext = `Ban`}
        else {isbannedtext = `Unban ` ;isbanned = true}
        let buttonString = `<div class="fui" style="display:flex;gap:25px;"><button class="check-out ban" onclick="Banuser(${i},${isbanned})">${isbannedtext}</button>`
        if (getCookie(`isadmin${i}`)==`true`) {isadmin = `<span class="AdminLogo">Admin</span>`}
        else buttonString += `<button class="check-out promote" onclick='(promoteuser(${i}))'>Promote</button>`
        buttonString += `</div>`
        checkoutcontainer.innerHTML += `
            <div class="INFORMATION-CONTAINER" data-usernumber="${i}">
               <img class="user-Profile-image"src="${getCookie(`ImageURL${i}`)}">
               <div class="user-info">
                   <h1>${getCookie(`username${i}`)+` `+isadmin}<p>${parseFloat(getCookie(`balance${i}`)).toFixed(2)}$</p></h1>
                   <br>
                   <h2>Password: ${getCookie(`password${i}`)}</h2>
                   <br>
                   <h3>Games Owned : ${usergame}</h3>
                   <h4>Total Spent : ${(usergame*49.99).toFixed(2)} $</h4>
                   <div class="tags" style="justify-content:flex-start;gap:25px;"></div>
               </div>
               ${buttonString}
            </div>
        `
        //remove ban button for current user
        const ban = document.querySelectorAll(".ban")
        if ( getCookie(`loginstate`)==i) {
            ban[ban.length-1].style.opacity = 0
            ban[ban.length-1].style.pointerevents =`none` 
        }
    }
    //Event Listeners for each userBox
    const userContainers = document.querySelectorAll('.INFORMATION-CONTAINER')
    userContainers.forEach(userContainer=>{
        userContainer.addEventListener('click',(e)=>{
            if( e.target.classList.contains('promote')||e.target.classList.contains('promote'))return
            const usernumber = userContainer.getAttribute('data-usernumber')
            const username = getCookie(`username${usernumber}`)
            BigContainer.innerHTML = `
            <div class="personal-information-container">
                <div class="Profile-Imge-container">
                    <img class="Profile-image"src="">
                    <div class="small-username">${username}</div>
                    <div class="admin"></div>
                    <label><input class="image-url-input" type="text" placeholder="New Image URL"></label>
                    <button onclick="submitForm(${usernumber})">Update Profile</button>
                    <button onclick="CancelChanges()">Cancel Changes</button>
                    <h2  style="font-size: 15px;" class="WARNING"></h2>
                </div>
                <form>
                    <label>UserName :<input type="text"></label>
                    <div class="Names">
                        <label>First Name :<input type="text"></label>
                        <label>Last Name :<input type="text"></label>
                    </div>
                    <label>Email :<input type="text"></label>
                    <label>Mobile : <select class="country-number"><option value="213">+213</option></select><input class="mobile" type="tel"></label>
                    <label>Password :<input type="text" readonly><i class='bx bxs-lock passlock' data-i="6"></i></label>
                    <label>BirthDay :<input type="date" style="text-align: center;"></label>
                    <label>Gendre :<select><option value="0">Male</option><option value="1">Female</option></select></label>
                    <label>Add Funds:<input type="number" style="text-align: center;"></label>
                </form>
            </div>
            `
            const select = document.querySelectorAll("select");
            const admintag= document.querySelector(`.admin`)
            const inputs  = document.querySelectorAll("input");
            inputs[1].value = getCookie(`ImageURL${usernumber}`)
            inputs[2].value = getCookie(`username${usernumber}`)
            inputs[3].value = getCookie(`firstname${usernumber}`)
            inputs[4].value = getCookie(`lastname${usernumber}`)
            inputs[5].value = getCookie(`email${usernumber}`)
            inputs[6].value = getCookie(`phone${usernumber}`)
            inputs[7].value = getCookie(`password${usernumber}`)
            inputs[8].value = getCookie(`bday${usernumber}`)
            select[1].value = getCookie(`gender${usernumber}`)
            if ( getCookie(`isadmin${usernumber}`)==`true`) admintag.innerHTML = `Admin`
            else admintag.style.border = `none`
          
            document.querySelector(".Profile-image").src = getCookie(`ImageURL${usernumber}`)
            
        })
    })
}
function promoteuser(index){
    createCookie(`isadmin${index}`,`true`,999)
    location.href = location.href
}
function Banuser(index, state=false){
    if (!state) createCookie(`isbanned${index}`,'true',999)
    else createCookie(`isbanned${index}`,null,null)
    location.href = location.href
}
document.addEventListener("DOMContentLoaded", ()=>{
    if (lock){
     lock.forEach( e => {
        e.addEventListener("click",()=>{
            console.log(1)
            if(e.classList=="bx bxs-lock passlock"){
                e.classList='bx bxs-lock-open passlock'
                inputs[e.getAttribute("data-i")].type="text"
            }
            else{
                e.classList='bx bxs-lock passlock'
                inputs[e.getAttribute("data-i")].type="password"
            }
            })
        })
    }

    const windowName = window.location.pathname.split("/").pop()
    const number =getCookie("loginstate")
    const inputs  = document.querySelectorAll("input");
    //Personal information WebPage JS
    if (windowName == "information.html"){
      const Usertheme = getCookie(`theme${number}`)
      document.body.style.background = `url(../images/background${Usertheme}.jpg)`
      fixImage()
      const switchMode = document.getElementById('switch-mode');
      if (switchMode.checked && Usertheme == 0) switchMode.checked = false
      if ( !switchMode.checked && Usertheme == 1)switchMode.checked = true
      switchMode.addEventListener('change', function () {
          if(this.checked) {        
              createCookie(`theme${number}`,1,999)
             document.body.style.background = `url(../images/background1.jpg)` 
             fixImage() 
          } else {
              createCookie(`theme${number}`,0,999)
              document.body.style.background = `url(../images/background0.jpg)`
              fixImage()
          }
      })
      const select = document.querySelectorAll("select");
      const admintag= document.querySelector(`.admin`)
      inputs[1].value = getCookie(`ImageURL${number}`)
      inputs[2].value = getCookie(`username${number}`)
      inputs[3].value = getCookie(`firstname${number}`)
      inputs[4].value = getCookie(`lastname${number}`)
      inputs[5].value = getCookie(`email${number}`)
      inputs[6].value = getCookie(`phone${number}`)
      inputs[7].value = getCookie(`password${number}`)
      inputs[8].value = getCookie(`bday${number}`)
      select[1].value = getCookie(`gender${number}`)
      if ( getCookie(`isadmin${number}`)==`true`) admintag.innerHTML = `Admin`
      else admintag.style.border = `none`

      document.querySelector(".Profile-image").src = getCookie(`ImageURL${number}`)
    }
    if (windowName == "funds.html"){
        const Usertheme = getCookie(`theme${number}`)
        document.body.style.background = `url(../images/background${Usertheme}.jpg)`
        fixImage()
        const switchMode = document.getElementById('switch-mode');
        if (switchMode.checked && Usertheme == 0) switchMode.checked = false
        if ( !switchMode.checked && Usertheme == 1)switchMode.checked = true
        switchMode.addEventListener('change', function () {
            if(this.checked) {        
                createCookie(`theme${number}`,1,999)
               document.body.style.background = `url(../images/background1.jpg)` 
               fixImage() 
            } else {
                createCookie(`theme${number}`,0,999)
                document.body.style.background = `url(../images/background0.jpg)`
                fixImage()
            }
        })
        document.querySelector(".currentFunds").innerHTML = `${Number(getCookie(`balance${number}`)).toFixed(2)} $`
    }
    if (windowName == "checkout.html"){
        const Usertheme = getCookie(`theme${number}`)
        document.body.style.background = `url(../images/background${Usertheme}.jpg)`
        fixImage()
        const switchMode = document.getElementById('switch-mode');
        if (switchMode.checked && Usertheme == 0) switchMode.checked = false
        if ( !switchMode.checked && Usertheme == 1)switchMode.checked = true
        switchMode.addEventListener('change', function () {
            if(this.checked) {        
                createCookie(`theme${number}`,1,999)
               document.body.style.background = `url(../images/background1.jpg)` 
               fixImage() 
            } else {
                createCookie(`theme${number}`,0,999)
                document.body.style.background = `url(../images/background0.jpg)`
                fixImage()
            }
        })
        const cart = JSON.parse(localStorage.getItem(`cartContent${getCookie('loginstate')}`))
        const checkoutcontainer = document.querySelector(".cart-games-container")
        if ( cart==undefined|| cart.length <= 0){
            checkoutcontainer.innerHTML += `<h1 style="margin-bottom:50px;margin-top:140px">You Have no VideoGames in your Cart</h1>`
            document.querySelector(".total-price").innerHTML = ``
            setTimeout(()=>{window.location.href="../store.html"},15000)
        }
        else{
         for ( let i = 0; i < cart.length; i++ ){
            let emojies = ""
            const data = cart[i][0]
            data.parent_platforms.forEach(platform => {
               if (platform.platform.name == "PlayStation") emojies += `<i class="fa-brands fa-playstation"></i>`
               if (platform.platform.name == "Xbox") emojies += `<i class="fa-brands fa-xbox"></i>`
               if (platform.platform.name == "PC") emojies += `<i class="fa-solid fa-desktop"></i>`
            })
            checkoutcontainer.innerHTML += `
                <div class="INFORMATION-container">
                   <img class="game-image"src="${data.background_image}">
                   <div class="game-info">
                       <h1>${data.name}</h1>
                       <h3 style="display:flex">Overall reviews :${data.rating}/5⭐ <p style="font-size:15px;">(${data.ratings_count})</p></h2>
                       <br>
                       <h3>Release Date : ${data.released}</h2>
                       <br>
                       <p class="game-platforms">${emojies}</p>
                       <div class="tags" style="justify-content:flex-start;gap:25px;"></div>
                   </div>
                   <p class="game-price">49.99$</p>
                   <button class="check-out"onclick="removeFromCart(${cart[i][1]},${cart[i][2]});window.location.href='checkout.html'">remove</button>
                </div>
            `
            const tags = document.querySelectorAll(".tags")
            for (let j = 0; j < data.genres.length; j++) {
             tags[i].innerHTML += `
              <p>${data.genres[j].name}</p>
             `
            }
            TotalPrice = cart.length*49.99
            document.querySelector(".total-price").innerHTML= TotalPrice.toFixed(2) +` $`
         }
        }
    } 
})
