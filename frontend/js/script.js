document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const targetAudience = document.getElementById('target-audience');
    const convertButton = document.getElementById('convert-button');
    const buttonText = document.getElementById('button-text'); // Added for spinner
    const loadingSpinner = document.getElementById('loading-spinner'); // Added for spinner
    const outputText = document.getElementById('output-text');
    const copyButton = document.getElementById('copy-button');
    const currentCharCount = document.getElementById('current-char-count');
    const errorMessage = document.getElementById('error-message');
    const feedbackSection = document.getElementById('feedback-section');
    const feedbackHelpful = document.getElementById('feedback-helpful');
    const feedbackNotHelpful = document.getElementById('feedback-not-helpful');
    const copySuccessMessage = document.getElementById('copy-success-message');

    const MAX_CHAR_COUNT = 500;

    // Function to update character count
    const updateCharCount = () => {
        const currentLength = inputText.value.length;
        currentCharCount.textContent = currentLength;
        if (currentLength > MAX_CHAR_COUNT) {
            inputText.value = inputText.value.substring(0, MAX_CHAR_COUNT);
            currentCharCount.textContent = MAX_CHAR_COUNT;
        }
    };

    // Event Listener for input text to update character count
    inputText.addEventListener('input', updateCharCount);

    // Function to show error message
    const showErrorMessage = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    };

    // Function to hide error message
    const hideErrorMessage = () => {
        errorMessage.style.display = 'none';
    };

    // Handle Convert Button Click
    convertButton.addEventListener('click', async () => {
        hideErrorMessage();
        copySuccessMessage.style.display = 'none';
        outputText.value = '변환 중...';
        convertButton.disabled = true; // Disable button during conversion
        buttonText.classList.add('hidden'); // Hide button text
        loadingSpinner.classList.remove('hidden'); // Show spinner
        copyButton.style.display = 'none'; // Hide copy button during conversion
        feedbackSection.style.display = 'none'; // Hide feedback section

        const textToConvert = inputText.value.trim();
        const selectedTarget = targetAudience.value; // Correctly uses select element

        if (!textToConvert) {
            showErrorMessage('변환할 내용을 입력해주세요.');
            outputText.value = '';
            convertButton.disabled = false;
            buttonText.classList.remove('hidden'); // Show button text
            loadingSpinner.classList.add('hidden'); // Hide spinner
            return;
        }

        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textToConvert, target: selectedTarget }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '알 수 없는 오류가 발생했습니다.');
            }

            const data = await response.json();
            outputText.value = data.converted_text;
            
            copyButton.style.display = 'inline-block'; // Show copy button after conversion
            feedbackSection.style.display = 'block'; // Show feedback section
        } catch (error) {
            console.error('Conversion error:', error);
            showErrorMessage('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            outputText.value = '';
        } finally {
            convertButton.disabled = false; // Re-enable button
            buttonText.classList.remove('hidden'); // Show button text
            loadingSpinner.classList.add('hidden'); // Hide spinner
        }
    });

    // Handle Copy Button Click
    copyButton.addEventListener('click', () => {
        outputText.select();
        outputText.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        copySuccessMessage.style.display = 'block';
        setTimeout(() => {
            copySuccessMessage.style.display = 'none';
        }, 2000); // Hide success message after 2 seconds
    });

    // Handle Feedback Button Clicks
    feedbackHelpful.addEventListener('click', () => {
        alert('피드백 감사합니다! 서비스 개선에 반영하겠습니다.');
        feedbackSection.style.display = 'none'; // Hide after feedback
    });

    feedbackNotHelpful.addEventListener('click', () => {
        alert('피드백 감사합니다. 더 나은 변환을 위해 노력하겠습니다.');
        feedbackSection.style.display = 'none'; // Hide after feedback
    });

    // Initial character count update
    updateCharCount();
});
