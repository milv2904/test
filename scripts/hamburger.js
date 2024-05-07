const hamburger = document.querySelector(".hamburger");
const navTab =document.querySelector(".nav-tabs");
hamburger.addEventListener("click", ()=>{
    hamburger.classList.toggle("active");
    navTab.classList.toggle("active");
})
document.querySelectorAll(".nav-link").forEach(n=> n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navTab.classList.remove("active");
}))