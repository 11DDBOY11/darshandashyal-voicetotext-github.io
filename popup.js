let recognition;
let isRecording = false;

const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const transcript = document.getElementById('transcript');

// this will store everything you've spoken so far
let fullTranscript = '';

function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Web Speech API not supported in this browser');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;      // keep listening even with pauses
  recognition.interimResults = true;  // show words while you are speaking
  recognition.lang = 'en-IN';         // you can change this

  recognition.onstart = () => {
    console.log('Listening...');
  };

  recognition.onresult = (event) => {
    let interim = '';
    // loop over new results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const resultText = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        // add final text permanently
        fullTranscript += resultText + ' ';
      } else {
        // temporary text while speaking
        interim += resultText;
      }
    }
    // show permanent + temporary
    transcript.value = fullTranscript + interim;
  };

  recognition.onerror = (event) => {
    console.error('Error:', event.error);
    stopRecording();
  };

  // If Chrome stops listening automatically, start again
  recognition.onend = () => {
    if (isRecording) {
      recognition.start();
    } else {
      stopRecording();
    }
  };
}

startBtn.onclick = () => {
  if (isRecording) return;

  // only init once
  if (!recognition) {
    initRecognition();
  }
  if (!recognition) return; // in case browser not supported

  isRecording = true;
  recognition.start();

  startBtn.disabled = true;
  stopBtn.disabled = false;
  startBtn.textContent = 'Listening...';
};

stopBtn.onclick = () => {
  if (!recognition) return;
  isRecording = false;
  recognition.stop();
};

function stopRecording() {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  startBtn.textContent = 'Start Recording';
}
