'use strict'

$(function () {
  $('button.like').click(function (e) {
    var $clicked = $(this);
    var dataId   = $clicked.data('id');
    var likes = parseInt($clicked.text());
    likes = likes + 1;

    $.post('/dashboard', {
      id: dataId,
      likes: likes
    }, function (result) {
      $clicked.text(likes);
    });
  });
});
