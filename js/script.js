// Initialize random seed
let today = new Date();
today = today.toISOString().split('T')[0];
Math.seedrandom(today);

const inputBox = document.querySelector("#wort");
const resultsList = document.querySelector("#results");
const shareButton = document.querySelector("#shareButton");
const invalidDialog = document.querySelector("#invalid");

// Ein Wort mit 3 bis 19 Buchstaben
const rateWort = WORTLISTE[Math.floor(Math.random() * WORTLISTE.length)];
console.log(rateWort);

// Closing the invalid dialog
invalidDialog.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    invalidDialog.close();
});

document.querySelectorAll(".key").forEach(function (key) {
    key.addEventListener("click", function () {
        const key = this.innerText;
        let newWort = "";

        if(key === "Löschen") {
            newWort = inputBox.innerText.slice(0, -1)
        } else if (key === "Enter") {
            check();
            return
        } else {
            newWort = inputBox.innerText + key;
        }

        inputBox.innerHTML = newWort
			.split('')
			.map((letter) => `<span class='letter'>${letter}</span>`)
			.join('');
    });
});

function check() {
    const rateVersuch = inputBox.innerText.toLowerCase();

    // Check if the word is a valid word
    if (
		!WORTLISTEALLE.includes(rateVersuch) &&
		!WORTLISTE.includes(rateVersuch)
	) {
        invalidDialog.showModal();

		return;
	}

    // Check the lengths
    let lengthString = "";
    if (rateVersuch.length > rateWort.length) {
        lengthString = 'Zu lang.';
    } else if (rateVersuch.length < rateWort.length) {
        lengthString = 'Zu kurz.';
    } else if (rateVersuch === rateWort) {
        lengthString = 'Richtiges Wort!';

        // Do everything to indicate the correct word
        shareButton.classList.remove('hidden'); // share button
        confetti.start(2000); // display confetti for 2 seconds
    } else {
        lengthString = 'Richtige Länge!';
    }

    // Highlight the letters and add them to the results list
    let rateWortArray = rateWort.split('');
    const output = new Array(rateVersuch.length).fill('wrong');
    // check for match of letter and position
    for (let i = 0; i < rateVersuch.length; i++) {
        if (rateVersuch[i] === rateWort[i]) {
			// remove this match, so the next occurrence of the letter is not highlighted
            rateWortArray[i] = '';
			output[i] = 'correct';

            // indicate the correctness on the key
            const key = document.querySelector(`.key-${rateVersuch[i]}`);
            key.classList.remove('almost');
            key.classList.add('correct');
		}
    }
    // check for general letter match
    for (let i = 0; i < rateVersuch.length; i++) {
        if (output[i] !== 'correct' && rateWortArray.includes(rateVersuch[i])) {
			// remove this match, so the next occurrence of the letter is not highlighted
			rateWortArray[rateWortArray.indexOf(rateVersuch[i])] = '';
			output[i] = 'almost';

			// indicate the correctness on the key
            const key = document.querySelector(`.key-${rateVersuch[i]}`);
            if (!key.classList.contains('correct')) {
                document
                    .querySelector(`.key-${rateVersuch[i]}`)
                    .classList.add('almost');
            }
		}
    }
    // highlight the letters with the correct class
    for (let i = 0; i < rateVersuch.length; i++) {
		output[
			i
		] = `<span class='letter ${output[i]}'>${rateVersuch[i]}</span>`;

		// indicate the correctness on the key
		const key = document.querySelector(`.key-${rateVersuch[i]}`);
        if (!key.classList.contains('correct') && !key.classList.contains('almost')) {
            key.classList.add('wrong');
        }
	}

    resultsList.innerHTML += `<div class='result'><span class='wort'>${output.join('')}</span> <span class='laenge'>${lengthString}</span></div>`;

    // Clear the input box
    inputBox.innerText = '';
}

// Share button
shareButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const numTries = document.querySelectorAll(".result").length;
    navigator.share({
		title: 'KOBSle',
		text: `Ich habe das KOBSle vom ${new Date().toLocaleDateString('de-DE')} in ${numTries} Versuchen geschafft!`,
	});
});
