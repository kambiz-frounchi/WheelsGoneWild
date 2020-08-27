$(document).ready(() => {
  const lengthRange = document.querySelector("#lengthRange");
  const lengthNumber = document.querySelector("#lengthNumber");

  // Sync slider with textbox and vice versa
  lengthRange.addEventListener("input", syncSliderBox);
  lengthNumber.addEventListener("input", syncSliderBox);
  function syncSliderBox(event) {
    lengthRange.value = event.target.value;
    lengthNumber.value = event.target.value;
  }

  // Automatically populate data list for textbox
  const list = document.querySelector("#defaultNumbers");
  const allNum = [];
  for (let i = Number(lengthNumber.min); i <= Number(lengthNumber.max); i++) {
    allNum.push(i); // Create an array from 360 to 2000;
  }
  // Using the earlier array, create the option element in the datalist dynamically
  allNum.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    list.appendChild(option);
  });

  $("[data-order]").click(() => {
    console.log(`bikeid is ${event.target.getAttribute("data-order")}`);
  });

  document.querySelectorAll("[data-order]");

  $("#category li").click(() => {
    // window.location.href += `api/bikes/filter/category/${event.target.id}`;
    $.get("/api/bikes/filter/category/" + event.target.id, renderPage);
  });

  $("#brand li").click(() => {
    $.get("/api/bikes/filter/brand/" + event.target.id, renderPage);
  });

  $("#frameMaterial li").click(() => {
    $.get("/api/bikes/filter/frame_material/" + event.target.id, renderPage);
  });

  $("#year li").click(() => {
    $.get("/api/bikes/filter/year/" + event.target.id, renderPage);
  });

  renderPage = data => {
    console.log(data);
    $("#bikeList").empty();
    const items = data.map(ele => {
      const { id, category, name, brand, year } = ele;
      return `<div class="card mx-auto">
      <img class="card-img-top" src="/images/${id}.jpg" alt="Card image cap">
      <div class="card-body ${category}">
          <h5 class="card-title">${name}</h5>
          <p class="card-text">${brand}  ${year}</p>
  
      <div class="card-footer">
          <button type="button" class="btn btn-secondary">Order with placeholder Price</button>
      </div>
      </div>
  </div>`;
    });
    $("#searchTotal")[0].textContent = `${data.length} Found Results`;
    $("#bikeList").append(items);
  };
});
