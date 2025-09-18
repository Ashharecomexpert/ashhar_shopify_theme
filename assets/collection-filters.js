class CollectionFilters extends HTMLElement {
    constructor() {
      super();
      console.log('CollectionFilters');
    }

    get sectionId() {
      return this.dataset.sectionId;
    }
  
    connectedCallback() {
      this.filterInputs = this.querySelectorAll('input');
      this.handleClick = this.handleClick.bind(this);
      this.minRange = this.querySelector('input[type="range"][data-min-value]');
      this.maxRange = this.querySelector('input[type="range"][data-max-value]')
  
      this.filterInputs.forEach((input) => {
        input.addEventListener('change', this.handleClick);
      });
    }
  
    handleClick(event) {
      const input = event.currentTarget; // now it's the <input>
      let url;
      if(input.dataset.addUrl || input.dataset.removeUrl){
         url = new URL(
            input.checked ? input.dataset.addUrl : input.dataset.removeUrl,
            window.location.origin
          );
      }else{
         
        url = new URL(window.location.href);
        url.searchParams.delete(this.minRange.dataset.param);
        url.searchParams.delete(this.maxRange.dataset.param);
        url.searchParams.set(this.minRange.dataset.param,this.minRange.value);
        url.searchParams.set(this.maxRange.dataset.param,this.maxRange.value);
      }
     
      console.log(url.toString());
      url.searchParams.set('section_id', this.sectionId);

      fetch(url.toString())
        .then((response)=>{
          return response.text();
        })
        .then((html)=>{
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          document.querySelector('.collections_inner').innerHTML = 
          tempDiv.querySelector('.collections_inner').innerHTML;

          url.searchParams.delete('section_id');
          window.history.pushState({}, '', url.toString());
        })
        .catch((error)=>{
          console.error('Error:', error);
        })
     
    }
  }
  
  customElements.define('collection-filters', CollectionFilters);
  