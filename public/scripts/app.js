// Loading pins to the home page
const getPins = function(query) {
  $.ajax({method: 'GET', url: '/api/pins', dataType: 'JSON'})
    .then(res => {
      renderPins(res.pins, query)
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
    `<div class="box">
      <div id="image-box">
        <img src="${pinObject.photo_url}"/>
        <img id="push-pin" src="https://i2.wp.com/freepngimages.com/wp-content/uploads/2014/04/DrawingPin1_Blue_2.png?fit=220%2C220"/>
      </div>
      <h4>${pinObject.title}</h4>
      <p>${pinObject.description}</p>
    </div>`)
};
const renderPins = function(pins, query) {
  if (!!query === true) {
    pins = pins.filter((pin) => pin.tag === query);
  }

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

const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

if (window.location.pathname === "/") {
  const query = getUrlParameter('tags');
  getPins(query)
}
if (window.location.pathname === "/profile"){
  getLikedPins()
}
