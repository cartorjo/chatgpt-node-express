document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const startVoiceButton = document.getElementById('start-voice');
    const stopVoiceButton = document.getElementById('stop-voice');
    const enableTTSCheckbox = document.getElementById('enable-tts');
    const voiceSelect = document.getElementById('voice-select');
    const languageSelect = document.getElementById('language-select');
    const loadingIndicator = document.getElementById('loading-indicator');

    let recognition;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = languageSelect.value;
    }

    const appendMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const createAudioCard = (audioUrl) => {
        const audioCard = document.createElement('div');
        audioCard.className = 'audio-card';

        const audioElement = document.createElement('audio');
        audioElement.src = audioUrl;
        audioElement.controls = true;

        const playButton = document.createElement('button');
        playButton.innerText = 'Play';
        playButton.addEventListener('click', () => {
            audioElement.play();
        });

        audioCard.appendChild(audioElement);
        audioCard.appendChild(playButton);
        chatBox.appendChild(audioCard);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const showLoading = () => {
        loadingIndicator.style.display = 'block';
    };

    const hideLoading = () => {
        loadingIndicator.style.display = 'none';
    };

    const sendMessage = async (message) => {
        appendMessage(message, 'user');
        userInput.value = '';

        showLoading();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    enableTTS: enableTTSCheckbox.checked,
                    voice: voiceSelect.value,
                    language: languageSelect.value
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            hideLoading();
            appendMessage(data.reply, 'bot');

            if (enableTTSCheckbox.checked && data.audioUrl) {
                createAudioCard(data.audioUrl);
            }
        } catch (error) {
            console.error('Error:', error);
            hideLoading();
            appendMessage('An error occurred. Please try again later.', 'bot');
        }
    };

    sendButton.addEventListener('click', () => {
        sendMessage(userInput.value);
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage(userInput.value);
        }
    });

    if (recognition) {
        startVoiceButton.addEventListener('click', () => {
            recognition.start();
            startVoiceButton.disabled = true;
            stopVoiceButton.disabled = false;
        });

        stopVoiceButton.addEventListener('click', () => {
            recognition.stop();
            startVoiceButton.disabled = false;
            stopVoiceButton.disabled = true;
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            sendMessage(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event);
            startVoiceButton.disabled = false;
            stopVoiceButton.disabled = true;
        };

        recognition.onend = () => {
            startVoiceButton.disabled = false;
            stopVoiceButton.disabled = true;
        };
    } else {
        startVoiceButton.disabled = true;
        stopVoiceButton.disabled = true;
        console.error('Speech recognition not supported in this browser.');
    }

    // Update recognition language when languageSelect changes
    languageSelect.addEventListener('change', () => {
        if (recognition) {
            recognition.lang = languageSelect.value;
        }
    });
});