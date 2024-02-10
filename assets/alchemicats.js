
class Alchemicats {
    constructor() {
        
    }

    swipe = (name, index) => {
        document.querySelectorAll(`section[data-page=${name}]`).forEach(section => {

            if (parseInt(section.dataset.pageIndex) != index) {
                section.classList.add("hidden");
            }
            else {
                section.classList.remove("hidden");
            }
            
            sessionStorage.setItem(name, index);
            

      

            document.querySelectorAll(`a[data-page="${name}"]`).forEach(nav => {
                nav.classList.remove('active');
            });

            document.querySelectorAll(`a[data-page="${name}"][data-page-index="${index}"]`).forEach(nav => {
                nav.classList.add('active');
            });

            
           
        });
    };

    restore = ()=> {
        

        document.querySelectorAll(`section[data-page]`).forEach(section => {

            let index = sessionStorage.getItem(section.dataset.page);
            if (index) {
                this.swipe(section.dataset.page, parseInt(index));
            } else {
                this.swipe(section.dataset.page, 1);
            }
        });
    }

}




document.addEventListener("DOMContentLoaded", async () => {

    const alchemicats = new Alchemicats();


    document.querySelectorAll('nav[data-page="swiper"]').forEach(swiper => {
        swiper.addEventListener("click", async (evt) => {
            evt.preventDefault();
           
            let page = evt.target.dataset.page;
            let index = evt.target.dataset.pageIndex;
            alchemicats.swipe(page, index);

            
        });
    });


    alchemicats.restore();

});