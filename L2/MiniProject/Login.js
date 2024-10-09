const inputs = document.querySelectorAll(".input")
const form = document.querySelector("form")
const lock = document.querySelectorAll(".passlock")
const check = document.querySelector("#check")
const alive = 1 
function Incorrect(text){
    document.querySelector(".WRONG").innerHTML = text
    setTimeout(()=>{document.querySelector(".WRONG").innerHTML =``},4000)
}
function Register(){
    form.addEventListener("submit",event=>{event.preventDefault()})
    //create usercount cookie if is doesn't exist
    if ( !getCookie("usercount"))createCookie("usercount",1,999)
    if (String(inputs[0].value).trim()==``){
        Incorrect(`Username cannot be empty`)
        return
    }
    if ( String(inputs[1].value).trim() == ``){
        Incorrect(`Email Incorrect`)
        return
    }
    if( inputs[2].value != inputs[3].value || (inputs[2].value).trim()==`` ) {
        Incorrect(`Passwords do not match! Please enter a password correctly`)
        return
    }
    if ( !inputs[4].checked){
        Incorrect(`You must agree to the terms and conditions`)
        return
    }
    
    
    //creating the account
    if(inputs[0].value!="" && inputs[1].value!=""){
        let usernumber = parseInt(getCookie("usercount"));
        let balance = 0.1
        if ( inputs[5].checked) {
            createCookie(`isadmin${usernumber}`,"true",999)
            balance = 9999
        }else createCookie(`isadmin${usernumber}`,"false",999)
        let theme = getCookie("theme")
        createCookie(`username${usernumber}`,inputs[0].value,999)
        createCookie(`firstname${usernumber}`,``,999)
        createCookie(`lastname${usernumber}`,``,999)
        createCookie(`email${usernumber}`,inputs[1].value,999)
        createCookie(`password${usernumber}`,inputs[2].value,999)
        createCookie(`balance${usernumber}`,balance,999)
        createCookie(`phone${usernumber}`,``,999)
        createCookie(`bday${usernumber}`,`0001-01-01`,999)
        createCookie(`ImageURL${usernumber}`,`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmQu8uL_XymUNXuWzjD1pb0hvoQuTBWSQJE1QJtIConA&s`,999)
        createCookie(`gender${usernumber}`,`0`,999)
        createCookie(`theme${usernumber}`,theme,999)
        
        // set login status and useraccount number and clear rememberme token
        createCookie(`loginstate`,`${usernumber}`,1)
        createCookie(`usercount`,usernumber+1,999)
        createCookie("rememberme",`false`,1)
        setTimeout(()=>{window.location.href='store.html'},900)
        document.querySelector(".WRONG").innerHTML=``
        console.log("All Cookies = ",document.cookie)
    }
}
function Login(){
    form.addEventListener("submit",event=>{event.preventDefault()})
    const username = inputs[0].value
    const password = inputs[1].value
    let i = parseInt(getCookie("usercount"))-1
    console.log(i)
    if (isNaN(i)){
        Incorrect(`you don't have any account Create Account`)
        return
    }
    while( i > 0){
        if(username==getCookie(`username${i}`) && password==getCookie(`password${i}`)){
            if ( getCookie(`isbanned${i}`) == `true`){
            document.querySelector(".WRONG").innerHTML = "you are banned"
            return; 
            }
            createCookie(`loginstate`,`${i}`,1)
            if ( inputs[2].checked)
               createCookie("rememberme",`${i}`,1)
            else 
               createCookie("rememberme",`false`,1)
            window.location.href="store.html"
            return
        }
        i--
    }
    document.querySelector(".WRONG").innerHTML = "Incorrect Username or Password"
}
function changePassword(){
    form.addEventListener("submit",event=>{event.preventDefault()})
    const username = inputs[0].value
    const ConfirmationCode = inputs[1].getAttribute("data-code")
    if( String(username).trim() == ``){
        Incorrect(`username Cannot Be Empty`)
        removeEventListener
    }
    if ( ConfirmationCode!=inputs[1].value) {
        Incorrect(`Confirmation Code Incorrect !`)
        return
    }
    if ( inputs[2].value == ``){
        document.querySelector(".WRONG").innerHTML = `New Password cannot be empty`
        return
    }
    if ( inputs[2].value != inputs[3].value) {
        Incorrect("Passwords do not match ! Try again")
        return
    }
    
    let i = parseInt(getCookie("usercount"))-1
    while( i > 0){
        if(username==getCookie(`username${i}`)){
            createCookie(`password${i}`,inputs[2].value,999)
            document.querySelector(".WRONG").innerHTML = `Password Changed Successfully`
            setTimeout(() => {
                window.location.href="login.html"
            }, 1500);
            return
        }
        i--
    }
}
function deleteAccount(usernumber){
    deleteCookie(`isadmin${usernumber}`)
    deleteCookie(`username${usernumber}`)
    deleteCookie(`firstname${usernumber}`)
    deleteCookie(`lastname${usernumber}`)
    deleteCookie(`email${usernumber}`)
    deleteCookie(`password${usernumber}`)
    deleteCookie(`balance${usernumber}`)
    deleteCookie(`phone${usernumber}`)
    deleteCookie(`bday${usernumber}`)
    deleteCookie(`ImageURL${usernumber}`)
    deleteCookie(`gender${usernumber}`)
}
function createCookie(name,value,alive){
    const date = new Date()
    date.setTime(date.getTime()+(alive*24*60*60*1000))
    let expires="expires="+date.toUTCString()
    document.cookie=`${name}=${value};${expires};path=/`
}
function deleteCookie(cookieName) {
    createCookie(cookieName,null,null)
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

document.addEventListener("DOMContentLoaded",()=>{
    deleteCookie("loginstate")// Remove SESSION TOKEN
    //REMEMBER ME CODE
    if(window.location.pathname.split("/").pop() == `login.html`){
       let i = parseInt(getCookie("rememberme"))
       let username = getCookie(`username${i}`)
       let password = getCookie(`password${i}`)
       if(username!=undefined && password!=undefined && getCookie("rememberme")!="false"){
           inputs[0].value= username
           inputs[1].value= password
       }
    }
    
    //Password locks
    lock.forEach( e => {
    e.addEventListener("click",()=>{
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
})