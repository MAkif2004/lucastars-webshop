import "../components/LoginComponent";
import "@web/components/LayoutComponent";

// Create page content
const template: HTMLTemplateElement = document.createElement("template");
template.innerHTML = `
    <webshop-layout>
        <div class="page-container">
            <div class="login-page">
                <login-component></login-component>
            </div>
        </div>
    </webshop-layout>
`;

// Append to document
document.body.appendChild(template.content.cloneNode(true));

// Add page-specific styles
const style: HTMLStyleElement = document.createElement("style");
style.textContent = `
    .page-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
    
    .login-page {
        padding: 40px 20px;
        max-width: 600px;
        margin: 0 auto;
    }
`;

document.head.appendChild(style);
