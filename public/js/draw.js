'use strict';

$(function () {
  var $canvas = $('canvas');
  var canvas = $canvas[0];
  var width = canvas.width;
  var height = canvas.height;

  var context2d = canvas.getContext('2d');
  var isDrawing = false;

  // 画面を真っ白にする
  context2d.fillStyle = '#FFF';
  context2d.fillRect(0, 0, width, height);

  var randomColor = [
    '#ff7f7f',
    '#ff7fbf',
    '#ff7fff',
    '#bf7fff',
    '#7f7fff',
    '#7fbfff',
    '#7fffff',
    '#7fffbf',
    '#7fff7f',
    '#bfff7f',
    '#ffff7f',
    '#ffbf7f'
  ];

  // マウスを押し始めた時
  $canvas.mousedown(function (e) {
    if($('#randomMode').prop('checked')){
      context2d.lineWidth = Math.floor( Math.random() * 100 );
      context2d.strokeStyle = randomColor[ Math.floor( Math.random() * randomColor.length ) ] ;
    }else{
      context2d.lineWidth = $('#lineWidth').val();
      context2d.strokeStyle = $('#lineColor').val();
    }

    var x = e.originalEvent.layerX; // 行き先
    var y = e.originalEvent.layerY; // 行き先

    context2d.beginPath();
    context2d.moveTo(x, y);
    isDrawing = true;
  });

  // マウスを動かしているあいだ中
  $canvas.mousemove(function (e) {

    var x = e.originalEvent.layerX; // 行き先
    var y = e.originalEvent.layerY; // 行き先
    if (isDrawing) {
      context2d.lineTo(x, y);
      context2d.stroke();
    }
  });

  // マウスを離した時
  $canvas.mouseup(function (e) {
    isDrawing = false;
  });

  // マウスがキャンバスの外に出た時時
  $canvas.mouseleave(function (e) {
    isDrawing = false;
  });

  //削除
  $("button#allDelete").on("click",function() {
      context2d.fillStyle = '#FFF';
      context2d.fillRect(0, 0, width, height);
  });

  // お手本検索
  var otehon_exist = 0
  $('button.otehon_search').click(function (e) {
    $('#otehon_canvas').empty();
    var engine_key = '001320252009995788183:wivrh8a8zeg'
    var google_search_api_key = 'AIzaSyDJrcA0GEnEi4A1owDnmWheA8xhWsNjYjs'
    var google_search_api = 'https://www.googleapis.com/customsearch/v1?key='+google_search_api_key+'&cx='+engine_key+'&searchType=image&q='
    var keyword = $('.drawbox input[name=keyword]').val();

    $.get(google_search_api + keyword, {
    }, function (result) {
      $('#otehon_canvas').prepend('<img src="'+result.items[Math.floor( Math.random() * 9 )].link+'" width="auto" height="80%" />')
      otehon_exist = 1
    });
  });

  //トレース
  $('button.traceMode').click(function () {
    $('#trace_canvas').empty();
    $('#draw_canvas').css("opacity", "0.5");
    if(otehon_exist == 1){
      var otehon_image = $("#otehon_canvas img").attr('src');
      $('#trace_canvas').prepend('<img src="'+otehon_image+'" width="auto" height="80%" />');
    }else{
      alert('お手本がないよ！');
    }
  });

  //トレース
  $('button.traceModeOff').click(function () {
    $('#trace_canvas').empty();
    $('#draw_canvas').css("opacity", "1.0");
  });

  // 保存
  $('button.save').click(function (e) {
    var dataUrl = canvas.toDataURL();
    var title = $('.drawbox input[name=title]').val();
    var eroi = 0;

    if($('#eroIllust').prop('checked')){
      eroi = 1;
    }

    $.post('/draw', {
      src: dataUrl,
      title: title,
      eroi: eroi
    }, function (result) {
      alert('保存しました！');
      // 画面を真っ白にする
      context2d.fillStyle = '#FFF';
      context2d.fillRect(0, 0, width, height);
      //リダイレクト
      location.href = '/dashboard';
    });
  });
});
