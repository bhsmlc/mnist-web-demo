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
    console.log(response);
    const blob = await response.blob();
    console.log(blob);
    let file = new File([blob], "test.png", { type: blob.type });
    let formData = new FormData();
    formData.append("image", file);
    alert("aaa");
    const resp = await fetch("https://mnist-api-74qj.onrender.com/predict-frame", {
        method: "POST",
        body: formData
    });
    if (!resp.ok) {
        throw new Error("ughhh");
    }
    alert("1");
    const data = await resp.json();
    alert(data);
    document.getElementById("ya").innerText = JSON.stringify(data);
}
export {};
// testPredict()
//# sourceMappingURL=script.js.map