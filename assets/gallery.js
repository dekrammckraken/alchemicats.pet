class Gallery {
    constructor(idx) {
        this.thumb = document.querySelectorAll(".thumb")[0];
        this.thumb.addEventListener('click', function(event) { 

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
        this.canvas.imageSmoothingEnabled = true;
        this.canvas.font = '7px Arial';
        this.canvas.fillStyle = 'red';
        this.g = [
            {
                "src": "/public/gallery/1.png",
                "caption": "Soon, we will be adding a photo gallery of the best photos collected from our social media."
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
                "caption": "Ciri and Zelda are sisters, but with completely different personalities"
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
        let w =  (1080 / 50) * 100;
        let h = (1080 / 50) * 100;
        img.onload = function() {
           this.canvas.drawImage(img, 0, 0, w, h);
           this.canvas.fillText(this.g[this.idx].caption, 0, 0);
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

let gal = new Gallery(0);
gal.update();


