$(document).ready(() => {
  const cart = new Set();

  // Profile Menu
  // $("#profile").click(() => {
  // event.preventDefault();
  // $.get("/api/user_data").then(data => {
  //   console.log(data);
  // });
  // });

  // Event listener for shopping cart on menubar
  $("#cartParent").click(() => {
    event.preventDefault();
  });

  // Event listener for when a bike's order is clicked
  $("#bikeList, .incOrder").click(() => {
    event.stopPropagation();
    console.log(`bike id is ${event.target.getAttribute("data-order")}`);
    if (event.target.getAttribute("data-order") !== null) {
      cart.add(event.target.getAttribute("data-order"));
      $.post("/api/orderItem", {
        bikeId: event.target.getAttribute("data-order")
      });

      // Increment counter
      $counter = $(".cartCounter");
      val = parseInt($counter.text());
      val++;
      // Animation for badge counter
      $counter
        .css({ opacity: 0 })
        .text(val)
        .css({ top: "-10px" })
        .animate({ top: "11px", opacity: 1 });
    }
  });

  $(".decOrder").click(() => {
    console.log(`bike id is ${event.target.getAttribute("data-order")}`);
    $("#shoppingCart").modal("show");
  });

  // Get user's shopping cart on page load and populate menu modal
  const menuShoppingCart = () => {
    // $.get("/api/orderItems").then(data => {console.log(data)});
  };

  // Event listeners for left side filters
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
    const items = data.map(element => {
      const { id, category, name, brand, year, price } = element;
      return `<div class="card mx-auto">
      <img class="card-img-top" src="/images/${id}.jpg" alt="Card image cap">
      <div class="card-body ${category}">
      <h5 class="card-title">${name}</h5>
          <div class="row">
          <div class="col-5">
          <p class="card-text cardPrice"><i class="fas fa-dollar-sign"> ${price}</i> </p>
          </div>
          <div class="col">
          <p class="card-text cardYear">${brand} ${year}</p>
          </div>
      </div>
      <div class="card-footer">
          <button type="button" data-order="${id}" class="btn btn-secondary cardCart"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
      </div>
      </div>
  </div>`;
    });
    $("#searchTotal")[0].textContent = `${data.length} Found Results`;
    $("#bikeList").append(items);
  };

  // Menu handling when browser width is reduced
  mobileMenu = () => {
    const menu = document.getElementById("menu");
    if (menu.className === "menu") {
      menu.className += " responsive";
    } else {
      menu.className = "menu";
    }
  };

  // Code for syncing slider and textbox value
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

  menuShoppingCart();
});
