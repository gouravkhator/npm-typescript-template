import "mocha/mocha";
mocha.setup("tdd");

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(Error("Script load error"));
    document.body.appendChild(script);
  });
}

(async function () {
  await loadScript("./main.js");
  mocha.run();
})();
