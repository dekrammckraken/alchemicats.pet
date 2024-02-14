class Alchemicats {
  constructor() {
    this.pages = [];
    this.touchStartX = 0; 
    this.touchEndX = 0;

    document.querySelectorAll(".swipeable").forEach((swiper) => {
      swiper.addEventListener("touchstart", async (evt) => {
        this.touchStartX = evt.touches[0].clientX;
      });
      swiper.addEventListener("touchend", async (evt) => {
        this.touchEndX = evt.changedTouches[0].clientX
        const SWIPE_THRESHOLD = 150; // soglia per riconoscere uno swipe
        var swipeable = evt.target.closest(".swipeable");
        var index = parseInt(swipeable.dataset.pageIndex);
        if (this.touchEndX < this.touchStartX - SWIPE_THRESHOLD) {
          index++;
        } else {
          index--;
        }

       
        this.swipe(
          swipeable.dataset.page,
          index,
          swipeable.dataset.pageDescription
        );
      });
    });
  }
  defaultOrCachePages = async () => {
    let cache = sessionStorage.getItem("_cache");

    if (cache == null) {
      this.pages = [];
      document
        .querySelectorAll(`article[data-page]`)
        .forEach(async (section) => {
          let page = {
            name: section.dataset.page,
            index: 1,
            description: section.dataset.pageDescription,
          };
          this.pages.push(page);
        });
    } else {
      this.pages = JSON.parse(cache);
    }
    sessionStorage.setItem("_cache", JSON.stringify(this.pages));
  };
  get = async (name) => {
    const response = await fetch(`leaf/${name}.html`);
    const page = await response.text();
    return page;
  };
  swipe = async (name, index, description) => {
    var currentPage = this.pages.find((page) => {
      return page.name == name;
    });

    if (index == 0)
        return;
  
    if (currentPage) {
      currentPage.index = index;
    }
    document
      .querySelectorAll(`section[data-page=${name}]`)
      .forEach(async (section) => {
        if (parseInt(section.dataset.pageIndex) != index) {
          section.classList.add("hidden");
        } else {
          section.classList.remove("hidden");
        }

        document.querySelectorAll(`a[data-page="${name}"]`).forEach((nav) => {
          nav.classList.remove("active");
        });
        document
          .querySelectorAll(
            `a[data-page="${name}"][data-page-index="${index}"]`
          )
          .forEach((nav) => {
            nav.classList.add("active");
          });
        /*document.querySelector(
          `#${name} h2`
        ).innerHTML = `${description} (${index})`;*/
      });

    sessionStorage.setItem("_cache", JSON.stringify(this.pages));
  };
  init = async () => {
    this.find("main header").innerHTML = await this.get("header");
    this.find("#socialMedia").innerHTML = await this.get("socialMedia");
    this.pages = await this.defaultOrCachePages();
    await this.restore();
  };
  find = (search) => {
    return document.querySelector(search);
  };
  restore = async () => {
    this.pages = JSON.parse(sessionStorage.getItem("_cache"));

    this.pages.forEach((element) => {
      this.swipe(element.name, parseInt(element.index), element.description);
    });
  };
}

//Document ready
document.addEventListener("DOMContentLoaded", async () => {
  const alchemicats = new Alchemicats();
  await alchemicats.init();
});
