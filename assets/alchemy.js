const DOMContentLoaded = "DOMContentLoaded";
const TIME_MINUTE = 60000;

const ANI_END = "animationend";
const TOUCH_START = "touchstart";
const TOUCH_MOVE = "touchmove";
const TOUCH_END = "touchend";

const MOUSE_LEAVE = "mouseleave";
const MOUSE_MOVE = "mousemove";
const EVT_CLICK = "click";

class Alchemy {

  constructor() {
    this.pages = [];
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
  }

  
  ghostsAppaerance = async () => {
    let response = await fetch(`/public/report.json`);
    const json = await response.json();

    for (const visitor of json.visitors.data) {
      return visitor.visitors.count;
    };
  };

  
  schedule = async (fun, runNow = true) => {
    if (runNow) fun();
    setInterval(fun, TIME_MINUTE);
  };

  ui = async () => {
    this.all(".swipeable").forEach(async (pane) => {
      await this.UIEvents(pane);
    });

    this.schedule( async ()=> {
        this.single("#highlitedItem").innerHTML = await this.ghostsAppaerance();
    });
  };

  UIEvents = async (item) => {

    item.addEventListener(
      MOUSE_LEAVE,
      async (evt) => {
        let article = item.closest("article");
        article.classList.remove("right");
        article.classList.remove("left");
      },
      { passive: true }
    );
    item.addEventListener(MOUSE_MOVE, async (evt) => {
      const clickX = evt.clientX - item.getBoundingClientRect().left;
      const paneWidth = item.offsetWidth;
      const paneCenterX = paneWidth / 2;

      let article = item.closest("article");

      article.classList.remove("right");
      article.classList.remove("left");

      if (clickX > paneCenterX) {
        article.classList.add("left");
      } else {
        article.classList.add("right");
      }
    });
    item.addEventListener(
      EVT_CLICK,
      (evt) => {
        const clickX = evt.clientX - item.getBoundingClientRect().left;
        const paneWidth = item.offsetWidth;
        const paneCenterX = paneWidth / 2;
        let swipeable = evt.target.closest(".swipeable");

        let index = parseInt(swipeable.dataset.pageIndex);
        let next = clickX > paneCenterX;

        this.swipe(
          swipeable.dataset.page,
          index,
          swipeable.dataset.pageDescription,
          next
        );
      },
      { passive: true }
    );
    item.addEventListener(
      TOUCH_START,
      async (evt) => {
        this.touchStartX = evt.touches[0].clientX;
        this.touchStartY = evt.touches[0].clientY;
        evt.target.classList.add("swiping");
      },
      { passive: true }
    );
    document.addEventListener(
      TOUCH_MOVE,
      async (evt) => {
        let currentY = evt.touches[0].clientY;

        if (currentY > this.touchStartY) evt.preventDefault();
      },
      { passive: true }
    );
    item.addEventListener(
      TOUCH_END,
      async (evt) => {
        evt.target.classList.remove("swiping");
        this.touchEndX = evt.changedTouches[0].clientX;
        const SWIPE_THRESHOLD = 70;
        let swipeable = evt.target.closest(".swipeable");
        let index = parseInt(swipeable.dataset.pageIndex);

        let swipelen = this.touchEndX - this.touchStartX;
        let next = true;

        if (Math.abs(swipelen) < SWIPE_THRESHOLD) return;

        if (swipelen > 0 && Math.abs(swipelen) > SWIPE_THRESHOLD) {
          next = false;
        }

        this.swipe(
          swipeable.dataset.page,
          index,
          swipeable.dataset.pageDescription,
          next
        );
      },
      { passive: true }
    );
  }
  
  defaultPages = async () => {
    let cache = null;
    if (cache == null) {
      this.pages = [];
      this.all(`article[data-page]`).forEach(async (section) => {
        let page = {
          name: section.dataset.page,
          index: 0,
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
  
  getFlake = async (name) => {
    const response = await fetch(`leaf/${name}.html`);
    const page = await response.text();
    return page;
  };
  
  swipe = async (name, index, description, next) => {
    let currentPage = this.pages.find((page) => {
      return page.name == name;
    });

    next ? index++ : index--;

    let pane = this.single(
      `section[data-page="${name}"][data-page-index="${index}"]`
    );

    if (pane === undefined || pane == null) return;

    if (next) pane.classList.add("page-flip");
    else pane.classList.add("page-flip-reverse");

    pane.addEventListener(
      ANI_END,
      (evt) => {
        evt.target.classList.remove("page-flip");
        evt.target.classList.remove("page-flip-reverse");
      },
      { passive: true }
    );

    if (currentPage) currentPage.index = index;

    this.all(`section[data-page=${name}]`).forEach(async (section) => {
      if (parseInt(section.dataset.pageIndex) != index) {
        section.classList.add("hidden");
      } else {
        section.classList.remove("hidden");
      }

      this.all(`span[data-page="${name}"]`).forEach((nav) => {
        nav.classList.remove("active");
      });
      this.all(`span[data-page="${name}"][data-page-index="${index}"]`).forEach(
        (nav) => {
          nav.classList.add("active");
        }
      );
      this.single(
        `article[data-page="${name}"] > h2`
      ).innerHTML = `${currentPage.description}`;
    });

    sessionStorage.setItem("_cache", JSON.stringify(this.pages));
  };

  init = async () => {
    this.single("main header").innerHTML = await this.getFlake("header");
    this.single("#socialMedia").innerHTML = await this.getFlake("socialMedia");
    this.pages = await this.defaultPages();
    await this.restore();
    await this.ui();
  };

  bday = () => {
    let d2 = new Date(new Date().getFullYear(), 3, 5);
    let d3 = new Date();
    d3.setHours(0, 0, 0, 0);

    if (d3 > d2) d2 = new Date(new Date().getFullYear() + 1, 3, 5);

    let days = Math.round((d2 - d3) / (1000 * 60 * 60 * 24));
    return {
      d: days,
    };
  };

  single = (search) => {
    return document.querySelector(search);
  };

  all = (search) => {
    return document.querySelectorAll(search);
  };

  restore = async () => {
    this.pages = JSON.parse(sessionStorage.getItem("_cache"));
    this.pages.forEach((element) => {
      this.swipe(
        element.name,
        parseInt(element.index),
        element.description,
        true
      );
    });
  };

}

document.addEventListener(
  DOMContentLoaded,
  async () => {
    const alchemy = new Alchemy();
    await alchemy.init();
  },
  { passive: true }
);
