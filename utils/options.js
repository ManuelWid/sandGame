const row_slider = document.getElementById("rowcols");
const pinterval_slider = document.getElementById("pinterval");
const pamount_slider = document.getElementById("pamount");
const form = document.getElementById("options");

row_slider.value = localStorage.getItem("cols") ? localStorage.getItem("cols") : 125;
row_slider.nextElementSibling.innerHTML = row_slider.value;
pinterval_slider.value = localStorage.getItem("pinterval") ? localStorage.getItem("pinterval") : 100;
pinterval_slider.nextElementSibling.innerHTML = pinterval_slider.value;
pamount_slider.value = localStorage.getItem("pamount") ? localStorage.getItem("pamount") : 8;
pamount_slider.nextElementSibling.innerHTML = pamount_slider.value;

row_slider.addEventListener("input", ()=>{
    row_slider.nextElementSibling.innerHTML = row_slider.value;
});
pinterval_slider.addEventListener("input", ()=>{
    pinterval_slider.nextElementSibling.innerHTML = pinterval_slider.value;
});
pamount_slider.addEventListener("input", ()=>{
    pamount_slider.nextElementSibling.innerHTML = pamount_slider.value;
});

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    localStorage.setItem("cols", row_slider.value);
    localStorage.setItem("pinterval", pinterval_slider.value);
    localStorage.setItem("pamount", pamount_slider.value);
    form.submit();
});


// HTML
{/* <div>
    <form id="options">
        <label>
            rows/cols:
            <div>
                <input type="range" id="rowcols" min="10" max="250" value="125">
                <span>125</span>
            </div>
        </label>
        <label>
            particle interval:
            <div>
                <input type="range" id="pinterval" min="10" max="1000" value="100">
                <span>100</span>
            </div>
        </label>
        <label>
            particle per click:
            <div>
                <input type="range" id="pamount" min="1" max="100" value="5">
                <span>5</span>
            </div>
        </label>
        <input type="submit" class="btn btn-outline-secondary" value="create">
    </form>
</div> */}