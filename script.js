function greeting(name) {
    return `hello ${name}`;
}
document.getElementById("ya").innerText = greeting("world");
async function testPredict() {
    let imgElement = document.getElementById("image");
    let response = await fetch(imgElement.src);
    if (!response.ok) {
        alert("error");
        throw new Error("ugh");
    }
    const blob = await response.blob();
    let file = new File([blob], "test.png", { type: blob.type });
    let formData = new FormData();
    formData.append("image", file);
    const resp = await fetch("https://mnist-api-74qj.onrender.com/predict-frame", {
        method: "POST",
        body: formData
    });
    if (!resp.ok) {
        throw new Error("ughhh");
    }
    const data = await resp.json();
    document.getElementById("ya").innerText = JSON.stringify(data);
}
testPredict();
export {};
//# sourceMappingURL=script.js.map