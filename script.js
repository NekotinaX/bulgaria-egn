document.getElementById("generateEgn").addEventListener("click", function () {
    const birthDate = document.getElementById("birthDate").value;
    const regionRange = document.getElementById("region").value;
    const gender = document.getElementById("gender").value;

    if (!birthDate || !regionRange) {
        alert("Please enter valid data.");
        return;
    }

    const [regionStart, regionEnd] = regionRange.split("-").map(Number);
    const egnList = generatePossibleEgns(birthDate, regionStart, regionEnd, gender);
    displayEgns(egnList);
});

function generatePossibleEgns(birthDate, regionStart, regionEnd, gender) {
    const egns = new Set(); // Using Set for uniqueness
    const date = new Date(birthDate);
    const year = date.getFullYear().toString().slice(-2);
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Adjusting the month based on the century
    const fullYear = date.getFullYear();
    if (fullYear >= 2000) {
        month = (parseInt(month) + 40).toString().padStart(2, "0");
    } else if (fullYear < 1900) {
        month = (parseInt(month) + 20).toString().padStart(2, "0");
    }

    // Generating possible EGNs
    for (let region = regionStart; region <= regionEnd; region++) {
        const individualNum = region.toString().padStart(3, "0");
        const genderDigit = gender === "male" ? 0 : 1;

        // Checking the last digit for gender
        if (parseInt(individualNum[2]) % 2 !== genderDigit) continue;

        const baseEgn = `${year}${month}${day}${individualNum}`;
        const controlDigit = calculateControlDigit(baseEgn);

        if (controlDigit !== null) {
            egns.add(`${baseEgn}${controlDigit}`); // Adding only unique EGNs
        }
    }

    return Array.from(egns); // Converting back to an array
}

function calculateControlDigit(egn) {
    const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += parseInt(egn[i]) * weights[i];
    }

    const remainder = sum % 11;
    return remainder < 10 ? remainder : 0;
}

function displayEgns(egnList) {
    const egnListElement = document.getElementById("egnList");
    egnListElement.innerHTML = "";

    if (egnList.length === 0) {
        egnListElement.innerHTML = "<li>No EGNs found.</li>";
        return;
    }

    egnList.forEach(egn => {
        const listItem = document.createElement("li");
        listItem.textContent = egn;
        egnListElement.appendChild(listItem);
    });
}

document.getElementById("searchButton").addEventListener("click", function () {
    const searchValue = document.getElementById("searchEgn").value.trim();
    const egnListItems = document.querySelectorAll("#egnList li");
    let found = false;  // Flag to check if an element was found

    egnListItems.forEach(item => {
        if (item.textContent.includes(searchValue)) {
            item.classList.add("highlight");
            item.scrollIntoView({ behavior: "smooth", block: "center" });  // Scroll to the element
            found = true;  // If a match is found, set the flag to true
        } else {
            item.classList.remove("highlight");
        }
    });

    if (found) {
        console.log(`Found an EGN matching: ${searchValue}`);
    } else {
        console.log(`No EGN found matching: ${searchValue}`);
    }
});
