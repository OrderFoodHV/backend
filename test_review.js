const test = async () => {
    try {
        const res = await fetch("http://localhost:3000/orders/135/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });
        console.log("Status:", res.status);
        console.log("Text:", await res.text());
    } catch(e) {
        console.log(e);
    }
}
test();
