// Loading pins to the home page
const getPins = function() {
  $.ajax({method: 'GET', url: '/api/pins', dataType: 'JSON'})
    .then(res => {
      renderPins(res.pins)
    });
};

const getLikedPins = function() {
  $.ajax({method: 'GET', url: '/api/liked-pins/profile', dataType: 'JSON'})
    .then(res => {
      renderLikedPins(res.pins)
    });
};

// Render pins to the home page
const createPinElement = function(pinObject) {
  return $('#wrapper').prepend(
    `<div class='box' data-id="${pinObject.id}">
      <div id="image-box">
        <a href='${pinObject.resource_url}'><img src="${pinObject.photo_url}"/></a>
        <img id="push-pin" src="https://i2.wp.com/freepngimages.com/wp-content/uploads/2014/04/DrawingPin1_Blue_2.png?fit=220%2C220"/>
      </div>
      <h4>${pinObject.title}</h4>
      <p>${pinObject.description}</p>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal">
          <i class="fa fa-comments" aria-hidden="true"></i>
        </button>
        <button class="btn btn-primary"><i class="fa fa-heart" aria-hidden="true"></i></button>
      <div>0 Likes</div>
    </div>`)
}
const renderPins = function(pins) {
  for (let i = 0; i < pins.length; i++) {
    let newPin = createPinElement(pins[i]);
    $('#wrapper').prepend(newPin);
  }
};

const renderLikedPins = function(pins) {
  for (let i = 0; i < pins.length; i++) {
    let newPin = createPinElement(pins[i]);
    $('#wrapper').prepend(newPin);
  }
};

if (window.location.pathname === "/") {
  getPins()
}
if (window.location.pathname === "/profile"){
  getLikedPins()
}

//View pin popup
$('#wrapper').on('click', '.box', function () {
  const id = $(this).attr('data-id')
  $.ajax({method: 'GET', url: `/api/preview-pins/${id}`, dataType: 'JSON'})
    .then(res => {
      console.log(res.pins[0])
      document.getElementById('modal-title').textContent = `${res.pins[0].title}`
      document.getElementById('modal-body').textContent = `${res.pins[0].description}`
      document.getElementById('modal-comment').textContent = `${res.pins[0].body}`
      document.getElementById('modal-img').src = `${res.pins[0].photo_url}`
    });
})

