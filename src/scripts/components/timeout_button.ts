class TimeoutButton extends HTMLButtonElement {
    can_click: boolean = true;

    constructor() {
        super();
        this.addEventListener("click", () => {
            if (this.can_click) {
                this.dispatchEvent(new CustomEvent("timeout-click"));
                this.disabled = true;
                this.can_click = false;
                this.style.opacity = "0.5";
                setTimeout(() => {
                    this.can_click = true;
                    this.disabled = false;
                    this.style.opacity = "1";
                }, this.timeout);
            }
        });
    }

    get timeout(): number {
        return Number(this.getAttribute("timeout")) || 1000;
    }
}

customElements.define("timeout-button", TimeoutButton, { extends: "button" });
