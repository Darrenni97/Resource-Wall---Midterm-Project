$(document).ready(function() {
  $('#comment').keyup(function() {
    const text = $(this).val();
    const buttonValue = 140;
    $(this).siblings(".counter").text(buttonValue - text.length);
    if (text.length > 140) {
      $(this).siblings(".counter").css("color", "red");
    } else {
      $(this).siblings(".counter").css("color", "#545149");
    }
  });
});
