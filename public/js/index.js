$(document).ready(() => {
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
