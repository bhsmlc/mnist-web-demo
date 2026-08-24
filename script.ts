function greeting(name: string): string {
    return `hello ${name}`
}

(document.getElementById("ya") as HTMLElement).innerText = greeting("world");

async function testPredict() {
    let imgElement : HTMLImageElement = document.getElementById("image") as HTMLImageElement;

    let response : Response = await fetch(imgElement.src);

    if (!response.ok) {
        alert("error");
        throw new Error("ugh");
    }

    const blob: Blob = await response.blob();

    let file: File = new File([blob], "test.png", { type: blob.type });

    let formData: FormData = new FormData();

    formData.append("image", file);

    interface apiResponse {
        prediction: string,
        confidence: string,
        "preprocessed-img": string
    }


    const resp: Response = await fetch("https://mnist-api-74qj.onrender.com/predict-frame", {
        method: "POST",
        body: formData
    });

    if (!resp.ok) {
        throw new Error("ughhh");
    }

    const data: apiResponse = await resp.json();
    (document.getElementById("ya") as HTMLElement).innerText = JSON.stringify(data);
}
testPredict()