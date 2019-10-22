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
    `<div class='box' id="${pinObject.id}">
      <div id="image-box">
        <a href='${pinObject.resource_url}'><img src="${pinObject.photo_url}"/></a>
        <img id="push-pin" src="https://i2.wp.com/freepngimages.com/wp-content/uploads/2014/04/DrawingPin1_Blue_2.png?fit=220%2C220"/>
      </div>
      <h4>${pinObject.title}</h4>
      <p>${pinObject.description}</p>
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
  $.ajax({method: 'GET', url: '/api/preview-pins', dataType: 'JSON'})
    .then(res => { console.log(res.pins);
      document.getElementById('modal-title').textContent = 'Pin title'
      document.getElementById('modal-body').textContent = 'Description'
      document.getElementById('modal-comment').textContent = 'This is comments'
    });
})

