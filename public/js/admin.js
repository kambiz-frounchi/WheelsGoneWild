$(document).ready(() => {
  const createBikeForm = $("form.create-bike-form");
  const deleteBikeForm = $("form.delete-bike-form");
  const updateBikeForm = $("form.update-bike-form");

  createBikeForm.on("submit", event => {
    event.preventDefault();
    const nameInput = $("input#name");
    const brandSelect = $("select#brand");
    const categorySelect = $("select#category");
    const colourInput = $("input#colour");
    const frameSizeInput = $("input#framesize");
    const frameMaterialSelect = $("select#framematerial");
    const yearSelect = $("select#year");
    const priceInput = $("input#price");
    const image = "1.jpg"; //TODO: add image select functionality

    const bikeData = {
      name: nameInput.val().trim(),
      brand: brandSelect.val(),
      category: categorySelect.val(),
      colour: colourInput.val().trim(),
      framesize: frameSizeInput.val().trim(),
      framematerial: frameMaterialSelect.val().trim(),
      year: parseInt(yearSelect.val()),
      price: parseFloat(priceInput.val().trim()),
      image: image
    };

    console.log(bikeData);

    $.post("/api/bikes", {
      bike: bikeData
    })
      .then(() => {
        window.location.replace("/admin");
        // If there's an error, log the error
      })
      .catch(err => {
        console.log(err);
      });
  });

  deleteBikeForm.on("submit", event => {
    event.preventDefault();
    const nameSelect = $("select#deletename");
    console.log(`${nameSelect.val()}`);

    $.ajax({
      type: "DELETE",
      url: `/api/bikes/${nameSelect.val()}`
    })
      .then(() => {
        window.location.replace("/admin");
      })
      .catch(err => {
        console.log(err);
      });
  });

  updateBikeForm.on("submit", event => {
    event.preventDefault();
    const nameSelect = $("select#updatename");
    const priceInput = $("input#updateprice");

    $.ajax(`/api/bikes/${nameSelect.val()}`, {
      type: "Put",
      data: {
        price: parseFloat(priceInput.val().trim())
      }
    })
      .then(() => {
        window.location.replace("/admin");
      })
      .catch(err => {
        console.log(err);
      });
  });

  createBikeForm.hide();
  deleteBikeForm.hide();
  updateBikeForm.hide();

  $("#admin-menu").on("click", event => {
    event.preventDefault();
    const operation = event.target.getAttribute("data-admin-item");
    if (operation === "create-bike") {
      deleteBikeForm.hide();
      updateBikeForm.hide();
      createBikeForm.show();
    } else if (operation === "update-bike") {
      createBikeForm.hide();
      deleteBikeForm.hide();
      updateBikeForm.show();
    } else if (operation === "delete-bike") {
      createBikeForm.hide();
      updateBikeForm.hide();
      deleteBikeForm.show();
    }
  });
});
