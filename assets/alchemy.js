class Alchemy {
  constructor() {
    this.pages = [];
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.breakingNews = [
      {
        news: `Look at our meme-rable contents in our socials!`,
      },
      { 
        news: `Days 'til the next birthday: ${this.bday().m} months and ${this.bday().d} days.`
      },
    ];
    this.__lastBreakingNewsIndex = 0;
  }

  ui = () => {
    document.querySelectorAll(".swipeable").forEach((pane) => {
      
      pane.addEventListener("mouseleave", async (evt) => {
        var article = pane.closest("article");
        article.classList.remove("right");
        article.classList.remove("left");
      });

      pane.addEventListener("mousemove", async (evt) => {
        const clickX = evt.clientX - pane.getBoundingClientRect().left;
        const paneWidth = pane.offsetWidth;
        const paneCenterX = paneWidth / 2;

        var article = pane.closest("article");

        article.classList.remove("right");
        article.classList.remove("left");

        if (clickX > paneCenterX) {
          article.classList.add("left");
        } else {
          article.classList.add("right");
        }
      });

      pane.addEventListener("click", (evt) => {
        const clickX = evt.clientX - pane.getBoundingClientRect().left;
        const paneWidth = pane.offsetWidth;
        const paneCenterX = paneWidth / 2;
        var swipeable = evt.target.closest(".swipeable");

        var index = parseInt(swipeable.dataset.pageIndex);
        var next = clickX > paneCenterX;

        
        this.swipe(
          swipeable.dataset.page,
          index,
          swipeable.dataset.pageDescription,
          next
        );
      });

      pane.addEventListener("touchstart", async (evt) => {
        this.touchStartX = evt.touches[0].clientX;
        this.touchStartY = evt.touches[0].clientY;

        evt.target.classList.add("swiping");
      });
      document.addEventListener("touchmove", async (evt) => {
        let currentY = evt.touches[0].clientY;

        if (currentY > this.touchStartY) evt.preventDefault();
      });
      pane.addEventListener("touchend", async (evt) => {
        evt.target.classList.remove("swiping");
        this.touchEndX = evt.changedTouches[0].clientX;
        const SWIPE_THRESHOLD = 60;
        var swipeable = evt.target.closest(".swipeable");
        var index = parseInt(swipeable.dataset.pageIndex);

        var swipelen = this.touchEndX - this.touchStartX;
        let next = true;


        if (swipelen == 0) return;
        
        if (swipelen > 0 && Math.abs(swipelen) > SWIPE_THRESHOLD) {
          next = false;
        } else if (Math.abs(swipelen) > SWIPE_THRESHOLD) {
          next = true;
        }
      

        this.swipe(
          swipeable.dataset.page,
          index,
          swipeable.dataset.pageDescription,
          next
        );
      });
    });
  };
  defaultOrCachePages = async () => {
    //let cache = sessionStorage.getItem("_cache");
    let cache = null;
    if (cache == null) {
      this.pages = [];
      document
        .querySelectorAll(`article[data-page]`)
        .forEach(async (section) => {
          let page = {
            name: section.dataset.page,
            index: 1,
            max: parseInt(section.dataset.pageMax),
            description: section.dataset.pageDescription,
          };
          this.pages.currentPage = 1;
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
  placeHolder = async (name, val, str) => {
    return str.replace(name, val);
  };
  swipe = async (name, index, description, next) => {

    var currentPage = this.pages.find((page) => {
      return page.name == name;
    });

    let pane = document.querySelectorAll(
      `article[data-page="${name}"]`
    )[0];

    
      if (next) {
        index++;

        if (index > currentPage.max) return;

        pane.classList.add("page-flip");
      } else {
        index--;
        if (index <= 0) return;
        pane.classList.add("page-flip-reverse");
       
      }

    pane.addEventListener("animationend", (evt)=> {
        evt.target.classList.remove("page-flip");
        evt.target.classList.remove("page-flip-reverse");
    });

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

        document
          .querySelectorAll(`span[data-page="${name}"]`)
          .forEach((nav) => {
            nav.classList.remove("active");
          });
        document
          .querySelectorAll(
            `span[data-page="${name}"][data-page-index="${index}"]`
          )
          .forEach((nav) => {
            nav.classList.add("active");
          });
        document.querySelector(
          `article[data-page="${name}"] > h2`
        ).innerHTML = `${currentPage.description}`;
      });

    sessionStorage.setItem("_cache", JSON.stringify(this.pages));
  };
  init = async () => {
    this.find("main header").innerHTML = await this.get("header");
    this.find("#socialMedia").innerHTML = await this.get("socialMedia");
    this.pages = await this.defaultOrCachePages();
    await this.restore();
    this.ui();
    this.startBreakingNews();
  };
  bday = () => {
    let d2 = new Date(new Date().getFullYear(), 3, 5);
    let d3 = new Date();
    let days = Math.round((d2 - d3) / (1000 * 60 * 60 * 24));
    return {d:days % 30, m: Math.floor(days / 30)};
  };
  find = (search) => {
    return document.querySelector(search);
  };
  startBreakingNews = async () => {
    
    setInterval(async () => {
      let news = document.getElementById("__breakingNews");
      news.innerText = await this.getBreakingNews();
    }, 5000);
  };
  getBreakingNews = async () => {
    let currentIndex = Math.floor(Math.random() * this.breakingNews.length);
    while (this.__lastBreakingNewsIndex == currentIndex) {
      currentIndex = Math.floor(Math.random() * this.breakingNews.length);
    }

    this.__lastBreakingNewsIndex = currentIndex;
    return this.breakingNews[currentIndex].news;
  };
  restore = async () => {
    this.pages = JSON.parse(sessionStorage.getItem("_cache"));
    this.pages.forEach((element) => {
      this.swipe(element.name, parseInt(element.index), element.description, true);
    });
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const alchemy = new Alchemy();
  await alchemy.init();
});
