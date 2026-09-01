function greeting(name) {
    return `hello ${name}`;
}
let currentPhase = "input";
// input -> processing -> output
// (document.getElementById("ya") as HTMLElement).innerText = greeting("world");
// async function testPredict() {
//     let imgElement : HTMLImageElement = document.getElementById("image") as HTMLImageElement;
//     let response : Response = await fetch(imgElement.src);
//     if (!response.ok) {
//         alert("error");
//         throw new Error("ugh");
//     }
//     console.log(response);
//     const blob: Blob = await response.blob();
//     console.log(blob);
//     let file: File = new File([blob], "test.png", { type: blob.type });
//     let formData: FormData = new FormData();
//     formData.append("image", file);
//     alert("aaa");
//     const resp: Response = await fetch( "https://mnist-api-74qj.onrender.com/predict-frame", {
//         method: "POST",
//         body: formData
//     });
//     if (!resp.ok) {
//         throw new Error("ughhh");
//     }
//     alert("1")
//     const data: ApiResponse = await resp.json();
//     alert(data);
//     (document.getElementById("ya") as HTMLElement).innerText = JSON.stringify(data);
// }
async function listenForImageUpload() {
    const inputTag = document.getElementById("camera-input");
    const loadingImage = document.getElementById("processing-image");
    const inputPhase = document.getElementById("input-phase");
    const processingPhase = document.getElementById("processing-phase");
    const outputPhase = document.getElementById("output-phase");
    inputTag.addEventListener("change", async (event) => {
        const file = inputTag.files?.[0];
        if (file) {
            console.log("File selected:", file);
            inputPhase.style.display = "none";
            processingPhase.style.display = "flex";
            document.getElementById("time-notice").classList.remove("show");
            setTimeout(() => {
                document.getElementById("time-notice").classList.add("show");
            }, 60000); // wait 60s and then show the nootice
            loadingImage.src = URL.createObjectURL(file);
            let formData = new FormData();
            formData.append("image", file);
            document.getElementById("file-name").innerText = file.name;
            const results = await fetch("https://mnist-api-74qj.onrender.com/predict-frame", {
                method: "POST",
                body: formData
            });
            const data = await results.json();
            processingPhase.style.display = "none";
            inputPhase.style.display = "flex";
            outputPhase.style.display = "flex";
            console.log(data);
            document.getElementById("output-image").src = "data:image/jpeg;base64," + data["preprocessed-img"];
            document.getElementById("prediction").innerText = `${parseInt(data.prediction) == -1 ? "DIGIT IS UNCLEAR" : data.prediction}`;
            document.getElementById("score").innerText = `${parseInt(data.confidence) == -1 ? "DIGIT IS UNCLEAR" : Math.round(parseFloat(data.confidence) * 10000) / 100 + "%"}`;
            let confidenceFloat = Math.min(1, Math.max(0, parseFloat(data.confidence)));
            let red = 255 - confidenceFloat * 255;
            let green = confidenceFloat * 255;
            document.getElementById("score").style.color = `rgb(${red}, ${green}, 0)`;
            document.getElementById("prediction").style.color = `rgb(${red}, ${green}, 0)`;
        }
    });
}
function listenForOutputClose() {
    const outputPhase = document.getElementById("output-phase");
    const closeButton = document.getElementById("close-icon");
    closeButton.addEventListener("click", () => {
        outputPhase.style.display = "none";
    });
}
listenForOutputClose();
listenForImageUpload();
export {};
// testPredict();
//# sourceMappingURL=script.js.map