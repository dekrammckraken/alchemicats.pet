class Gallery {
    constructor() {
        this.thumb = document.getElementsByClassName("thumb");
        this.idx = 0;
        this.g = [
            {
                "src": "/public/gallery/1.png",
                "caption": "",
                "hover": ""
            },
            {
                "src": "/public/gallery/2.png",
                "caption": "",
                "hover": ""
            },
        ];
    }
   
    next() {
        
        this.reset();

        if (this.idx == this.g.length - 1) {
            this.cannot();
            return;
        }
        this.idx++;
        this.update();
        
    }
    prev() {
        
        this.reset();

        if (this.idx == 0) {
            this.cannot();
            return;
        }

        this.idx--;
        this.update();
       
    }
    update() {
        this.thumb[0].src = this.g[this.idx].src;
    }
    cannot() {
        this.thumb[0].classList.add("cannot");
    }
    reset() {
        this.thumb[0].classList.remove("cannot");
    }
}

let gal = new Gallery();


