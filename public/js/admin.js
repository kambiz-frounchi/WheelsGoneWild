$(document).ready(() => {
  $(".create-bike-form").hide();
  $("#admin-menu").on("click", event => {
    event.preventDefault();
    const operation = event.target.getAttribute("data-admin-item");
    if (operation === "create-bike") {
      $(".create-bike-form").show();
      //showCreateBikeForm();
    } else if (operation === "update-bike") {
      //showUpdateBikeForm();
    } else if (operation === "delete-bike") {
      //showDeleteBikeForm();
    }
  });
});
