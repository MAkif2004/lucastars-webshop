// Load Mermaid
const mermaidScript = document.createElement("script");
mermaidScript.type = "module";
mermaidScript.innerHTML = "import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid/+esm';";

document.head.appendChild(mermaidScript);

document.addEventListener("DOMContentLoaded", () => {
    // Hide Copy button on Mermaid blocks
    document.querySelectorAll(".mermaid").forEach(e => {
        e.parentNode.querySelector("button").remove();
    });

    // All external links should open in a new tab
    document.querySelectorAll("a").forEach(e => {
        console.log(e.href);

        if(e.href.match(/^http(s){0,1}:\/\//)) {
            e.target = "_blank";
            e.rel = "nofollow noopener";
        }
    });
});
