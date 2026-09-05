function greeting(name: string): string {
    return `hello ${name}`
}

interface ApiResponse {
    prediction: string,
    confidence: string,
    "preprocessed-img": string
}

let currentPhase: string = "input";
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

function getScale(initial: number) {
    let scale = initial;
    scale -= 50;
    scale /= 50;
    let normal: number = 1.5;
    let maxChange: number = 1;
    let calculatedScale = normal + maxChange * scale;
    return calculatedScale;
}

async function listenForImageUpload() {
    const inputTag: HTMLInputElement = document.getElementById("camera-input") as HTMLInputElement;
    const loadingImage: HTMLImageElement = document.getElementById("processing-image") as HTMLImageElement;
    const inputPhase: HTMLDivElement = document.getElementById("input-phase") as HTMLDivElement;
    const processingPhase: HTMLDivElement = document.getElementById("processing-phase") as HTMLDivElement;
    const outputPhase: HTMLDivElement = document.getElementById("output-phase") as HTMLDivElement;
    inputTag.addEventListener("change", async (event: Event) => {
        const file = inputTag.files?.[0];
        if (file) {
            console.log("File selected:", file);
            inputPhase.style.display = "none";
            processingPhase.style.display = "flex";
            (document.getElementById("time-notice") as HTMLElement).classList.remove("show");
            setTimeout(() => {
                (document.getElementById("time-notice") as HTMLElement).classList.add("show");
            }, 60000); // wait 60s and then show the nootice
            loadingImage.src = URL.createObjectURL(file);
            let formData: FormData = new FormData();
            formData.append("image", file);
            (document.getElementById("file-name") as HTMLElement).innerText = file.name;
            let results!: Response;
            let success: boolean = false;

            let inverted: boolean = localStorage.getItem("inverted") === "true";
            let scale: number = parseInt(localStorage.getItem("scale") as string);
            
            let calculatedScale = getScale(scale);
            formData.append("inverted", inverted.toString());
            formData.append("scale", calculatedScale.toString());

            while (!success) {
                try {
                    results = await fetch("https://mnist-api-nine.vercel.app/predict-frame", {//https://mnist-api-74qj.onrender.com/predict-frame", {
                        method: "POST",
                        body: formData
                    });
                    success = true;
                } catch (error) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    console.log("Trying again");
                }
            }

            const data: ApiResponse = await results.json();
            processingPhase.style.display = "none";
            inputPhase.style.display = "flex";
            outputPhase.style.display = "flex";
            console.log(data);
            (document.getElementById("output-image") as HTMLImageElement).src = "data:image/jpeg;base64," + data["preprocessed-img"];
            (document.getElementById("prediction") as HTMLElement).innerText = `${parseInt(data.prediction) == -1 ? "DIGIT IS UNCLEAR" : data.prediction}`;
            (document.getElementById("score") as HTMLElement).innerText = `${parseInt(data.confidence) == -1 ? "DIGIT IS UNCLEAR" : Math.floor(parseFloat(data.confidence) * 10000) / 100 + "%"}`;
            let confidenceFloat: number = Math.min(1, Math.max(0, parseFloat(data.confidence)));
            let red: number = 255 - confidenceFloat * 255;
            let green: number = confidenceFloat * 255;
            (document.getElementById("score") as HTMLElement).style.color = `rgb(${red}, ${green}, 0)`;
            (document.getElementById("prediction") as HTMLElement).style.color = `rgb(${red}, ${green}, 0)`;
        }
    });
}

function listenForOutputClose() {
    const outputPhase: HTMLDivElement = document.getElementById("output-phase") as HTMLDivElement;
    const closeButton: HTMLElement = document.getElementById("close-icon") as HTMLElement;
    closeButton.addEventListener("click", () => {
        outputPhase.style.display = "none";
    });
}

function allowDrop() {
    const dropArea: HTMLDivElement = document.getElementById("image-upload") as HTMLDivElement;
    const inputTag: HTMLInputElement = document.getElementById("camera-input") as HTMLInputElement;

    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    dropArea.addEventListener("dragenter", () => {
        dropArea.classList.add("file-hover");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("file-hover");
    });

    dropArea.addEventListener("drop", (e) => {
        const dt: DataTransfer = e.dataTransfer as DataTransfer;
        const files: FileList = dt?.files as FileList; // ? returns undef if dt is null or undef
        if (files && files.length > 0) {
            const file: File = files[0] as File;
            console.log("File dropped:", file);
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            inputTag.files = dataTransfer.files;
            const event: Event = new CustomEvent("change", { bubbles: true });
            inputTag.dispatchEvent(event);
        }
    });
}
function settingsMenu() {
    const settingsIcon: HTMLElement = document.getElementById("setting-icon") as HTMLElement;
    const settingsMenu: HTMLDivElement = document.getElementById("settings-menu") as HTMLDivElement;
    const invertedCheckbox: HTMLInputElement = document.getElementById("inverted") as HTMLInputElement;
    const scaleSlider: HTMLInputElement = document.getElementById("scale") as HTMLInputElement;
    const switchCircle: HTMLElement = document.getElementById("switch-circle") as HTMLElement;
    const scaleVal: HTMLElement = document.getElementById("scale-val") as HTMLElement;
    const resetButton: HTMLButtonElement = document.getElementById("reset-button") as HTMLButtonElement;

    if (localStorage.getItem("inverted") == null) {
        localStorage.setItem("inverted", "false");
    }

    let invertedCache: boolean = localStorage.getItem("inverted") === "true";
    

    if (localStorage.getItem("scale") == null) {
        localStorage.setItem("scale", "50");
    }
    let scaleCache: number = parseInt(localStorage.getItem("scale") as string);

    invertedCheckbox.checked = invertedCache;
    scaleSlider.value = scaleCache.toString();

    if (invertedCache) {
        switchCircle.classList.add("checked");
    }

    scaleVal.innerText = (Math.floor(getScale(scaleCache) * 100) / 100).toString();

    settingsIcon.addEventListener("click", () => {
        settingsMenu.classList.toggle("show");
    });

    invertedCheckbox.addEventListener("change", () => {
        const isInverted: boolean = invertedCheckbox.checked;
        localStorage.setItem("inverted", isInverted.toString());
        switchCircle.classList.toggle("checked");
    });

    scaleSlider.addEventListener("input", () => {
        const scaleValue: number = parseInt(scaleSlider.value);
        localStorage.setItem("scale", scaleValue.toString());
        scaleVal.innerText = (Math.floor(getScale(scaleValue) * 100) / 100).toString();
    });
    
    resetButton.addEventListener("click", () => {
        localStorage.setItem("inverted", "false");
        localStorage.setItem("scale", "50");
        invertedCheckbox.checked = false;
        scaleSlider.value = "50";
        switchCircle.classList.remove("checked");
        scaleVal.innerText = (Math.floor(getScale(50) * 100) / 100).toString();
    });
}


settingsMenu();
allowDrop();
listenForOutputClose();
listenForImageUpload();
// testPredict();