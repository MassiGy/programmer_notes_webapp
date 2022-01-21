
const search_input = document.querySelector("#query");
const file_suggestions = document.querySelector("#file_suggestions");
const search_form = document.querySelector("#search");

search_input.addEventListener("input", async function () {
    if (search_input.value.length > 0) {
        while (file_suggestions.lastElementChild) {
            file_suggestions.removeChild(file_suggestions.lastElementChild);
        }
        const response = await fetch("/files/get_suggestions/" + search_input.value);
        const data = await response.json();
        data.forEach(element => {

            let new_sugges = document.createElement("option")
            new_sugges.value = element.toString();
            file_suggestions.append(new_sugges);
        });


    }
})
