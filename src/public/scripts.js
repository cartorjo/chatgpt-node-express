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

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (recognition) {
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

        audioCard.appendChild(audioElement);
        chatBox.appendChild(audioCard);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const toggleLoadingIndicator = (isLoading) => {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    };

    const handleResponse = async (response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        appendMessage(data.reply, 'bot');
        if (enableTTSCheckbox.checked && data.audioUrl) {
            createAudioCard(data.audioUrl);
        }
    };

    const sendMessage = async (message) => {
        if (!message.trim()) return;

        appendMessage(message, 'user');
        userInput.value = '';
        toggleLoadingIndicator(true);

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
            await handleResponse(response);
        } catch (error) {
            console.error('Error:', error);
            appendMessage('An error occurred. Please try again later.', 'bot');
        } finally {
            toggleLoadingIndicator(false);
        }
    };

    const setupEventListeners = () => {
        sendButton.addEventListener('click', () => sendMessage(userInput.value));

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

            languageSelect.addEventListener('change', () => {
                recognition.lang = languageSelect.value;
            });
        } else {
            startVoiceButton.disabled = true;
            stopVoiceButton.disabled = true;
            console.error('Speech recognition not supported in this browser.');
        }
    };

    setupEventListeners();
});