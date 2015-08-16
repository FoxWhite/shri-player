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

    

var contextClass = (window.AudioContext || 
  window.webkitAudioContext || 
  window.mozAudioContext || 
  window.oAudioContext || 
  window.msAudioContext);

if (contextClass) {
  // Web Audio API is available.
  var context = new contextClass();
} 
else {
    $('.dz-text').css('color', '#D00202').html('Your browser does not support Web Audio Api. Sorry');    
}



var source = context.createBufferSource();
    // source.connect(context.destination);
    if (!source.start) {
        source.start = source.noteOn //in old browsers use noteOn method
        source.stop = source.noteOff //in old browsers use noteOff method
    };


var file = null;
var audioBuffer = null;
var animation = null;
var nowplaying = false;


$('.upload_btn').on('change', function(e){
    file = e.target.files[0];
    $('.uploaded_file').html(file.name);
    $('.stopstart').removeClass('nowplaying');
    readFile(file);
});

$('.stopstart').on('click', function(){
    if (!$(this).hasClass('disabled')){

        if (!nowplaying){
            $(this).html('Stop');
            if (file) playSound(audioBuffer);    
        }
        else {
            $(this).html('Play');    
            if (file) stopSound();    

        }
    }
});



function readFile(file){
    $('.dz-text').html('<div class="loading"></div>');

    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result
        context.decodeAudioData(data, function(buffer) {
                audioBuffer = buffer;
                $('.stopstart').removeClass('disabled');
                $('.dz-text').html('File loaded!');
            })
    };
    reader.readAsArrayBuffer(file);
}

function playSound(buffer) {
    source = context.createBufferSource();
    source.buffer = buffer;

    var analyser = context.createAnalyser();
        // analyser.smoothingTimeConstant = 0.3;
        // analyser.fftSize = 1024;

    source.connect(analyser);
    analyser.connect(context.destination);

    source.start(0);
    nowplaying = true;
    drawSpectrum(analyser);
}

function stopSound() {
    nowplaying = false;
    if (source) {
        source.stop();
    }

}

var drawSpectrum = function (analyser){
    $('.dz-text').html('');
    var ctx = $("#player_canvas").get(0).getContext("2d");
        
    var gradient = ctx.createLinearGradient(0,0,0,300);
        gradient.addColorStop(1,'#001E47');
        gradient.addColorStop(0.75,'#044FB6');
        gradient.addColorStop(0.25,'#5E9DF2');
        gradient.addColorStop(0,'#ffffff');
    
    ctx.fillStyle=gradient;

    var drawer = function(){
        var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);

        var step = Math.round(array.length / 120);
        ctx.clearRect(0, 0, 400, 300);
        
        
        for ( var i = 0; i < 120; i++ ){
            var value = array[i * step];
            ctx.fillRect(i*5,200-value,3,200);
        }

        if (!nowplaying)  {
            cancelAnimationFrame(animation);
            ctx.clearRect(0, 0, 400, 300);
        }
        else {animation = requestAnimationFrame(drawer);}
    }
    animation = requestAnimationFrame(drawer);
}
