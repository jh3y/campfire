let rec = null;
let isRecording = false;

function startRecording() {
  if (rec && !isRecording) rec.start();
}

function stopRecording() {
  if (rec && isRecording) rec.stop();
}


// Сhecking the technology support in the browser
try {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  rec = new SpeechRecognition();
} catch(e) {
  console.log(e);
}

// If the technology is supported, then we set up the recording
if (rec) {

  rec.continuous = true;
  rec.lang = 'en-US';
  rec.interimResults = false;

  // Event after receiving voice transcription as text
  rec.onresult = function(e) {
    console.info({result: e})
    // Сode that compares what the user said with existing commands,
    // after which some action takes place with the video on the page
  }

  // The event is triggered after recording has started
  // rec.start();
  rec.onstart = function(e) {
    isRecording = true;
    console.info('begin')
  }

  // Event after recording stopped
  // rec.stop(); or after an error occurs
  rec.onend = function(e) {
    isRecording = false;
    console.info('end')
    startRecording(); // Restart recording
  }

  // Event that occurs when audio recording fails
  rec.onerror = function(e) {
    console.info('whhh')
    console.error('Speech recognition error detected: ' + e.error);
  }

  // Start recording after page load
  startRecording();
  
}