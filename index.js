
var contextClass = (window.AudioContext || 
  window.webkitAudioContext || 
  window.mozAudioContext || 
  window.oAudioContext || 
  window.msAudioContext);
if (contextClass) {
  // Web Audio API is available.
  var context = new contextClass();
} else {
    $('.dz-text').css('color', '#D00202').html('Your browser does not support Web Audio Api. Sorry');    
}

// Create the source.
var source = context.createBufferSource();
// Create the gain node.
// var gain = context.createGain();
// Connect source to filter, filter to destination.
// source.connect(gain);
source.connect(context.destination);

var startTime = 0;
var file = null;
var audioBuffer = null;

$('.upload_btn').on('change', function(e){
    file = e.target.files[0];
    $('.uploaded_file').html(file.name);
    $('.stopstart').removeClass('nowplaying');
    readFile(file);
});


$('.stopstart').on('click', function(){
    if (!$(this).hasClass('disabled')){

        $(this).toggleClass('nowplaying');
        if ($(this).hasClass('nowplaying')){
            $(this).html('Stop');
            if (file) playSound(audioBuffer);    
        }
        else {
            $(this).html('Play');    
            if (file) stopSound();    

        }
    }
});


var handleDragOver = function(e) {
    e.preventDefault()
    e.stopPropagation()
    $('.dz-text').html('Drop music files here');
}

var handleDrop = function(e) {
    e.preventDefault()
    e.stopPropagation()

    file = e.dataTransfer.files[0];
    $('.uploaded_file').html(file.name);
    readFile(file);
}

function readFile(file){
    $('.dz-text').html('<div class="loading"></div>');

    var reader = new FileReader()
    reader.addEventListener('load', function(e) {
        var data = e.target.result
        context.decodeAudioData(data, function(buffer) {
                audioBuffer = buffer;
                $('.stopstart').removeClass('disabled');
                $('.dz-text').html('File loaded!');
            })
        })
    reader.readAsArrayBuffer(file)
}

function playSound(buffer) {
    // startTime = context.currentTime;
    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}

function stopSound() {
    if (source) {
        source.stop();
    }
}

function pauseSound() {
    if (source) {
        source.stop(0);
        source = null;
        var position = context.currentTime - startTime;
        this.playing = false;
    }
};
