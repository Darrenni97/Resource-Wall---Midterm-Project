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
  let htmlSecond = `  <div class='likes-count'>${pinObject.num_likes} 💚
  </div>
</div>`
  if(pinObject.rating_average !== null) {
    return $('#wrapper').prepend(htmlFirst + ` <div class="rating-avg" > ${pinObject.rating_average} ⭐️ (${pinObject.num_rating})</div>` + htmlSecond)
  } else {
    return $('#wrapper').prepend(htmlFirst + ` <div class="rating-avg" > 0.00 ⭐️</div>` + htmlSecond)
  }
};

const renderPins = (pins, query) => {
  if (!!query === true) {
    pins = pins.filter((pin) => pin.tag === query);
  }

  for (const pin in pins) {
    let newPin = createPinElement(pins[pin]);
    $('#wrapper').prepend(newPin);
  }
};

const renderLikedPins = (pins) => {
  for (const pin in pins) {
    let newPin = createPinElement(pins[pin]);
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
const createCommentElement = (commentObject) => {
  return(`
  <div class='comment-post'>
    <div>@${commentObject.username}</div>
    <div>${commentObject.body}</div>
  <div>
  `)
};

let clickedPin = null

//View pin popup
$('#wrapper').on('click', '.box', function () {
  const id = $(this).attr('data-id')
  clickedPin = $(this).find('.rating-avg')

  // Method to get specific pin information into modal
  $.ajax({method: 'GET', url: `/api/preview-pins/${id}`, dataType: 'JSON'})
    .then(res => {
      document.getElementById('modal-title').textContent = `${res.pins[0].title}`
      document.getElementById('modal-body').textContent = `${res.pins[0].description}`
      document.getElementById('modal-img').src = `${res.pins[0].photo_url}`
      document.getElementById('modal-amount-of-likes').textContent = `${res.pins[0].num_likes} 💚`
      document.getElementById('submit-button').setAttribute("data-id", `${res.pins[0].id}`);
      if (res.pins[0].average_rating === null) {
        document.getElementById('modal-avg-rating').textContent = `0 ⭐️`
      } else {
        document.getElementById('modal-avg-rating').textContent = `${res.pins[0].average_rating} ⭐️ (${res.pins[0].num_rating})`
      }
    });

  //Method to get render comments into modal
  $.ajax({method: 'GET', url: `/api/comments/${id}`, dataType: 'JSON'})
  .then(res => {
    $('#modal-comments').empty();
    if (res.comments.length > 0) {
      $('#modal-comments').empty();
      for (const comment of res.comments) {
        const dbComment = createCommentElement(comment);
        $('#modal-comments').prepend(dbComment);
      }
    }
  })
})

//adds new comment to database and prepends it to comment box
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
  const numLikes = box.find('.likes-count').text().split(' ')
  box.find('.likes-count').text(`${Number(numLikes[0]) + 1} 💚`);
   $.ajax({method: 'POST', url: `/api/likes/${id}`, dataType: 'JSON'})
})

//Rate and log to db when rate button is clicked
$('.star__radio').on('click', (event) => {
  const rating = $(event.target).attr('data-id')
  const id = $('#submit-button').attr('data-id')
  const avgRating = clickedPin.text().split(' ')
  let ratingCount = (Number(avgRating[3].replace(/\(|\)/g,''))+1)
  let ratingNum = (Number(avgRating[1]) + (Number(rating)* Number(avgRating[3].replace(/\(|\)/g,''))))
  let newRating = Math.round((ratingNum/ratingCount), 2).toFixed(2)
  clickedPin.text(`${newRating} Stars (${ratingCount})`)
  let avgRatingModal = $(event.target).parent().parent().find('#modal-avg-rating')
  avgRatingModal.text(`${newRating} Stars (${ratingCount})`)
  $.ajax({method: 'POST', url: `/api/rating/${id}`, dataType: 'JSON', data: {rating: rating}})
    .then(({ rating }) => {
      box.find('.likes-count').text(`${rating} 💚`);
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
