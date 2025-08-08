async function modelList() {
  const resp = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await resp.json();
  console.log(data);
}
