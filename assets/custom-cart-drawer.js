class CustomCartDrawer extends HTMLElement {
  constructor() {
    super();

    this.openTrigger = document.querySelector(`#${this.dataset.openTrigger}`);
    this.overlay = this.querySelector("#CustomCartOverlay");
    this.closeButton = this.querySelector("[data-close]");
    this.cartCount = document.querySelector(".cart-item-count");
  }

  connectedCallback() {
    this.openTrigger?.addEventListener("click", this.handleOpen.bind(this));
    this.closeButton?.addEventListener("click", this.closeDrawer.bind(this));

    document.addEventListener("click", (event) => {
      if (event.target === this.overlay) {
        this.closeDrawer();
      }
    });

    // cart:rerender listener should be outside the click event
    document.addEventListener("cart:rerender", this.cartRerender.bind(this));
  }

  handleOpen(event) {
    event.preventDefault();
    this.openDrawer();
  }

  openDrawer() {
    this.setAttribute("open", "");
  }

  closeDrawer() {
    this.removeAttribute("open");
  }

  cartRerender(event) {
    // handle cart rerender logic here
    console.log("Cart rerender event triggered", event.detail);
    const fakeElement = document.createElement('div');
    const fakeCount = document.createElement('div');

    const newElement = event.detail.sections["custom-cart-drawer"];
    const newCount = event.detail.sections["custom-cart-count"];

    fakeElement.innerHTML = newElement;
    fakeCount.innerHTML = newCount;

    this.querySelector('.custom-cart-drawer__inner').innerHTML = fakeElement.querySelector('.custom-cart-drawer__inner').innerHTML;
    this.cartCount.innerHTML = fakeCount.querySelector('.cart-item-count').innerHTML;
    this.openDrawer()
  }

}

// Define the custom element
customElements.define("custom-cart-drawer", CustomCartDrawer);




class AtcButton extends HTMLElement {
  constructor() {
    super();
    this.formSubmit = this.querySelector('form[action="/cart/add"]');
  }
  connectedCallback() {
    this.formSubmit.addEventListener('submit', this.handleSubmit.bind(this))
  }
  handleSubmit(e) {
    e.preventDefault();

    let formData = {
      'items': [{
        'id': this.formSubmit.querySelector('input[name="id"]').value,
        'quantity': parseInt(this.formSubmit.querySelector('input[name="quantity"]').value) // Ensure quantity is a number
      }],
      sections: "custom-cart-drawer,custom-cart-count"
    };


    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        document.documentElement.dispatchEvent(
          new CustomEvent("cart:rerender", {
            detail: data,
            bubbles: true
          })
        )
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

customElements.define('atc-button', AtcButton)


class CartActions extends HTMLElement {
  constructor() {
    super();
    this.plusButton = this.querySelector("[data-plus]");
    this.minusButton = this.querySelector("[data-minus]");
    this.removeButton = this.querySelector("[data-remove]")
  }

  connectedCallback() {
    this.plusButton?.addEventListener('click', this.handleChange.bind(this));
    this.minusButton?.addEventListener('click', this.handleChange.bind(this));
    this.removeButton?.addEventListener('click', this.handleChange.bind(this));
  }
  handleChange(event) {
    const formData = {
      'line': parseInt(this.dataset.line, 10),
      'quantity': parseInt(event.currentTarget.dataset.quantity, 10),
      'sections': "custom-cart-drawer,custom-cart-count",
      'sections_url': window.location.pathname
    };
    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        document.documentElement.dispatchEvent(
          new CustomEvent("cart:rerender", {
            detail: data,
            bubbles: true
          })
        )
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

customElements.define('cart-actions', CartActions)