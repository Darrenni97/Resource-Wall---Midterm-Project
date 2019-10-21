// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

// Loading pins to the home page

const loadPins = function() {
  return db.query(`
  SELECT title, description, resource_url, photo_url
  FROM pins
  `)
  .then(res => {
    console.log(res.rows)
    console.log('Success: ', renderPins(res.rows))
  })
  // .then(res => res.rows[0])
  .catch(err => console.error('query error: user = null', err.stack));
};
loadPins()
// Loading pins to the home page
const createPinElement = function(pinObject) {
  return $('#wrapper').append(
    `<div class="box">
      <img src="${pinObject.photo_url}"/>
      <h4>${pinObject.title}</h4>
      <p>${pinObject.description}</p>
    </div>`);
};
const renderPins = function(pins) {
  $('#wrapper').empty();
  for (let i = 0; i < pins.length; i++) {
    let newPin = createPinElement(pins[i]);
    $('#wrapper').prepend(newPin);
  }
};
