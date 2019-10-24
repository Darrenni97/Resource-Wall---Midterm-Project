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
  // console.log(pinObject)
  let htmlFirst =  `<div class='box' data-id="${pinObject.id}">
  <div id="image-box">
    <a href='${pinObject.resource_url}' target="_blank" ><img id="pin-image" src="${pinObject.photo_url}"/></a>
    <img id="push-pin" src="https://i.ibb.co/j37fHg7/588891f2bc2fc2ef3a1860a5.png"/>
  </div>
  <div class='pin-description'>
    <h4>${pinObject.title}</h4>
    <p>${pinObject.description}</p>
  </div>
  <div id="like-comment-button">
    <button type="button" class="comment-button" class="btn btn-primary" data-toggle="modal" data-target="#modal">
        <i class="fa fa-comments" aria-hidden="true"></i>
      </button>
    <button class="like-button" class="btn btn-primary" type="button"><i class="fa fa-heart" aria-hidden="true"></i></button>
  </div>
  <div class='rating-likes'>
  `
  let htmlSecond = `  <div class='likes-count'>${pinObject.num_likes} Likes
  </div>
</div>`
  if(pinObject.rating_average !== null) {
    return $('#wrapper').prepend(htmlFirst + ` <div> ${pinObject.rating_average} Stars</div>` + htmlSecond)
  } else {
    return $('#wrapper').prepend(htmlFirst + `<div> 0.00 Stars</div>` + htmlSecond)
  }
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

//Create comment template
const createCommentElement = function(commentObject) {
  return(
    `
    <div>@${commentObject.username}</div>
    <div>${commentObject.body}</div>
    `)
};
//View pin popup
$('#wrapper').on('click', '.box', function () {
  const id = $(this).attr('data-id')
  $.ajax({method: 'GET', url: `/api/preview-pins/${id}`, dataType: 'JSON'})
    .then(res => {
      console.log('hello', res)
      document.getElementById('modal-title').textContent = `${res.pins[0].title}`
      document.getElementById('modal-body').textContent = `${res.pins[0].description}`
      document.getElementById('modal-img').src = `${res.pins[0].photo_url}`
      document.getElementById('modal-amount-of-likes').textContent = `${res.pins[0].count} likes`
      document.getElementById('submit-button').setAttribute("data-id", `${res.pins[0].id}`);
      document.getElementById('modal-avg-rating').textContent = `${res.pins[0].average_rating} Stars`
    });
  $.ajax({method: 'GET', url: `/api/comments/${id}`, dataType: 'JSON'})
  .then(res => {
    $('#modal-comments').empty();
    if (res.comments.length > 0) {
      $('#modal-comments').empty();
      for (const comment of res.comments) {
        const newComment = createCommentElement(comment);
        $('#modal-comments').prepend(newComment);
      }
    }
  })
})

$('#submit-button').on('click', () => {
  const id = $('#submit-button').attr('data-id')
  const comment = $('#comment').val()
  $.ajax({method: 'POST', url: `/api/addComment/${id}`, dataType: 'JSON', data: {text: comment}})
  .then(res => {
    $('#modal-comments').prepend(createCommentElement(res.comments));
    $("#comment").val('');
  })
})


//Like and log to db when like button is clicked
$('#wrapper').on('click', '.like-button', function(e) {
  const box = $(this).closest('.box');
  const id = box.attr('data-id');

   $.ajax({method: 'POST', url: `/api/likes/${id}`, dataType: 'JSON'})
    .then(({ likes }) => {
      box.find('.likes-count').text(`${likes} Likes`);
    })
})

//Rate and log to db when like button is clicked
$('.star__radio').on('click', (event) => {
  const rating = $(event.target).attr('data-id')
  const id = $('#submit-button').attr('data-id')
  // const box = $(event.target).closest('#modal-avg-rating');
  $.ajax({method: 'POST', url: `/api/rating/${id}`, dataType: 'JSON', data: {rating: rating}})
    .then(({ rating }) => {
      box.find('.likes-count').text(`${rating} Likes`);
    })
})

// Scroll button that takes user to top of page when clicked
$(window).scroll(function() {
  if (($(window).scrollTop()) >= 250) {
    $("#scroll-button").removeClass("before-scroll");
    $("#scroll-button").addClass("after-scroll");
  } else {
    $("#scroll-button").addClass("before-scroll");
    $("#scroll-button").removeClass("after-scroll");
  }
});

$("#scroll-button").on("click", function(event) {
  event.preventDefault();
  $('html').animate({scrollTop: 0}, 'medium');
});
