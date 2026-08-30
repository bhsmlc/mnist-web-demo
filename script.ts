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


(document.getElementById("ya") as HTMLElement).innerText = greeting("world");

async function testPredict() {
    
    let imgElement : HTMLImageElement = document.getElementById("image") as HTMLImageElement;

    let response : Response = await fetch(imgElement.src);

    if (!response.ok) {
        alert("error");
        throw new Error("ugh");
    }
    console.log(response);
    const blob: Blob = await response.blob();
    
    console.log(blob);
    let file: File = new File([blob], "test.png", { type: blob.type });

    let formData: FormData = new FormData();

    formData.append("image", file);

    alert("aaa");
    const resp: Response = await fetch( "https://mnist-api-74qj.onrender.com/predict-frame", {
        method: "POST",
        body: formData
    });

    if (!resp.ok) {
        throw new Error("ughhh");
    }
    alert("1")
    const data: ApiResponse = await resp.json();
    alert(data);
    (document.getElementById("ya") as HTMLElement).innerText = JSON.stringify(data);
}
function listenForImageUpload() {
    const inputTag: HTMLInputElement = document.getElementById("camera-input") as HTMLInputElement;
    const inputPhase: HTMLDivElement = document.getElementById("input-phase") as HTMLDivElement;
    const processingPhase: HTMLDivElement = document.getElementById("processing-phase") as HTMLDivElement;
    const outputPhase: HTMLDivElement = document.getElementById("output-phase") as HTMLDivElement;
    inputTag.addEventListener("change", (event: Event) => {
        const file = inputTag.files?.[0];
        if (file) {
            console.log("File selected:", file);
            inputPhase.style.display = "none";
            processingPhase.style.display = "block";
        }
    });
}
listenForImageUpload();
// testPredict();