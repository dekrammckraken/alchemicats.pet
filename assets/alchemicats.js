
class Alchemicats {
    constructor() {
        document.querySelectorAll('nav[data-page="swiper"]').forEach(swiper => {
            swiper.addEventListener("click", async (evt) => {
                evt.preventDefault();
                this.swipe(evt.target.dataset.page, evt.target.dataset.pageIndex);
            });
        });
    }

    get = async (name) => {
        const response = await fetch(`leaf/${name}.html`);
        const page = await response.text();
        return page;
    }
    swipe = async (name, index) => {
        document.querySelectorAll(`section[data-page=${name}]`).forEach(async section => {

            //const html = await this.get("test");

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
    load = async () => {
       
        this.find("main header").innerHTML = await this.get("header");
        this.find("#socialMedia").innerHTML = await this.get("socialMedia");
    }
    find = (search) => {
        return document.querySelector(search);
    }
    restore = async () => {
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

//Document ready
document.addEventListener("DOMContentLoaded", async () => {

    const alchemicats = new Alchemicats();
    await alchemicats.load();
    await alchemicats.restore();

});