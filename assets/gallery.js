class Gallery {
    constructor(idx) {
        this.thumb = document.querySelectorAll(".thumb")[0];
        this.thumb.addEventListener('click', function (event) {

            var t = event.target;
            var x = event.clientX - t.getBoundingClientRect().left;

            if (x < t.clientWidth / 2) {
                this.prev();
            } else {
                this.next();
            }
        }.bind(this));
        this.caption = document.querySelectorAll(".gallery > .caption")[0];
        this.idx = idx;

        this.canvas = this.thumb.getContext('2d');
        this.canvas.imageSmoothingEnabled = false;
      
        this.g = [
            {
                "src": "/public/gallery/1.png",
                "caption": "Soon, we will be adding a photo gallery\nof the best photos collected from our social media."
            },
            {
                "src": "/public/gallery/2.png",
                "caption": "Zelda is also called 'Orsetto'', did you know that?"
            },
            {
                "src": "/public/gallery/1.png",
                "caption": "Ciri is also called 'Topolina', did you know that?"
            },
            {
                "src": "/public/gallery/2.png",
                "caption": "Ciri and Zelda are sisters, \nbut with completely different personalities"
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
        var img = new Image();
        img.src = this.g[this.idx].src;

        var w = this.thumb.width;
        var h = this.thumb.height;

        this.canvas.font = '10px Roboto Bold';
     
        
        img.onload = function () {

            this.canvas.drawImage(img, 0, 0, 320, 320);
            const lines = this.g[this.idx].caption.split('\n');

            // Altezza del singolo rigo di testo (puoi regolare questo valore)
            const lineHeight = 12;

           
            for (let i = 0; i < lines.length; i++) {
               
                this.canvas.fillText(lines[i], 30, h-30 + (i * lineHeight) + 10);
            }
            
        }.bind(this);

        console.log(this.canvas.height);
    }
    cannot() {
        this.thumb.classList.add("cannot");
    }
    reset() {
        this.thumb.classList.remove("cannot");
    }
}

document.addEventListener('DOMContentLoaded', function () {
   // let gal = new Gallery(0);
   // gal.update();
});



