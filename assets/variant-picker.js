// class VariantPicker extends HTMLElement {
//    constructor() {
//      super();
//      console.log("variant-picker");
//    }
 
//    get sectionId() {
//      return this.getAttribute("data-section-id");
//    }
 
//    connectedCallback() {

//        this.variantPicker = this.querySelector('select[name="id"]');
//        if (!this.variantPicker) {
//          console.warn("No <select name='id'> found inside <variant-picker>");
//          return;
//        }
 
//        this.variantPicker.addEventListener("change",this.handleChange.bind(this));

//    }
 
//    handleChange(event) {
//      const select = event.currentTarget;
//      console.log(select,'select');
//      const url = `${window.location.pathname}?variant=${select.value}&section_id=${this.sectionId}`;
//      console.log(url);
//      fetch(url)
//      .then(response => response.text())
//      .then((html)=>{
//        const tempDiv = document.createElement('div');
//        tempDiv.innerHTML = html;
//        document.querySelector('.swatches-product-section').innerHTML = tempDiv.querySelector('.swatches-product-section').innerHTML;

//        const newUrl = new URL(url, window.location.origin);
//        newUrl.searchParams.delete('section_id');
//        window.history.pushState({}, "", newUrl.toString());
//      })
//    }
//  }
 
//  customElements.define("variant-picker", VariantPicker);


class VariantPicker extends HTMLElement {
   constructor() {
     super();
     console.log("variant-picker");
   }
 
   get sectionId() {
     return this.getAttribute("data-section-id");
   }
 
   connectedCallback() {

       this.variantSelector = this.querySelectorAll('input[type="radio"]');
       this.handleChange = this.handleChange.bind(this);
 
       this.variantSelector.forEach((swatch)=>{
         swatch.addEventListener('change',this.handleChange.bind(this));
       })

   }

   disconnectedCallback() {
      this.variantSelector.forEach((swatch)=>{
         swatch.removeEventListener('change',this.handleChange.bind(this));
       })
   }
 
   handleChange(event) {
     const input = event.currentTarget;
     const url = `${window.location.pathname}?variant=${input.value}&section_id=${this.sectionId}`;
     console.log(url);
     fetch(url)
     .then(response => response.text())
     .then((html)=>{
       const tempDiv = document.createElement('div');
       tempDiv.innerHTML = html;
       document.querySelector('.swatches-product-section').innerHTML = tempDiv.querySelector('.swatches-product-section').innerHTML;

       const newUrl = new URL(url, window.location.origin);
       newUrl.searchParams.delete('section_id');
       window.history.pushState({}, "", newUrl.toString());
     })
   }
 }
 
 customElements.define("variant-picker", VariantPicker);
 
 