
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
var gain = context.createGain();
// Connect source to filter, filter to destination.
source.connect(gain);
gain.connect(context.destination);

$('.upload_btn').on('change', function(e){
    var file = e.target.files[0];
    $('.uploaded_file').html(file.name);
    readFile(file);
});



var handleDragOver = function(e) {
    e.preventDefault()
    e.stopPropagation()
}

var handleDrop = function(e) {
    e.preventDefault()
    e.stopPropagation()

    var file = e.dataTransfer.files[0];
    $('.uploaded_file').html(file.name);
    //readFile(file);
}

function readFile(file){
    var reader = new FileReader()
    reader.addEventListener('load', function(e) {
        var data = e.target.result
        context.decodeAudioData(data, function(buffer) {
                playSound(buffer)
            })
        })
    reader.readAsArrayBuffer(file)
}

function playSound(buffer) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}

function stopSound() {
  if (source) {
    source.stop();
  }
}