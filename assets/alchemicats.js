class Alchemicats {
  constructor() {
    this.pages = [];
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
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
        if (clickX > paneCenterX) {
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
        const SWIPE_THRESHOLD = 60; // soglia per riconoscere uno swipe
        var swipeable = evt.target.closest(".swipeable");
        var index = parseInt(swipeable.dataset.pageIndex);

        var swipelen = this.touchEndX - this.touchStartX;

        if (swipelen > 0 && Math.abs(swipelen) > SWIPE_THRESHOLD) {
          index--;
          console.log("swipe detected right");
        } else if (Math.abs(swipelen) > SWIPE_THRESHOLD) {
          console.log("swipe detected left");
          index++;
        }

        this.swipe(
          swipeable.dataset.page,
          index,
          swipeable.dataset.pageDescription
        );
      });
    });
  };
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
            max: parseInt(section.dataset.pageMax),
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
  swipe = async (name, index) => {
    var currentPage = this.pages.find((page) => {
      return page.name == name;
    });

    if (index == 0 || index > currentPage.max) return;

    if (currentPage) {
      currentPage.index = index;
    }
    console.log(currentPage.index);
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

document.addEventListener("DOMContentLoaded", async () => {
  const alchemicats = new Alchemicats();
  await alchemicats.init();
});
