document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const startVoiceButton = document.getElementById('start-voice');
    const stopVoiceButton = document.getElementById('stop-voice');

    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    }

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    const appendMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const sendMessage = async (message) => {
        appendMessage(message, 'user');
        userInput.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            appendMessage(data.reply, 'bot');
            speakText(data.reply);
        } catch (error) {
            console.error('Error:', error);
            appendMessage('An error occurred. Please try again later.', 'bot');
        }
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    sendButton.addEventListener('click', () => {
        sendMessage(userInput.value);
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage(userInput.value);
        }
    });

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
});