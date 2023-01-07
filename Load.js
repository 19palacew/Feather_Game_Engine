class Loader{
    constructor(){
        this.queue = new Map();
        this.loaded = 0;
    }

    queueFile(url){
        console.log("Queued: " + url);
        this.queue.set(url, url);
    }

    startDownloads(start) {
        for (let url of this.queue.keys()) {
            const ext = url.split(".").pop();
            switch (ext) {
                case "png":
                case "jpg":
                case "jpeg":
                    const img = new Image();

                    img.addEventListener("load", () => {
                        console.log("Loaded " + url);
                        this.loaded++;
                        if (this.done()) start();
                    });

                    img.src = url;
                    this.queue.set(url, img);
                    break;
                case "txt":
                case "fmr":
                    fetch(url)
                        .then((response) => response.text())
                        .then((data) => {
                            console.log("Loaded " + url);
                            this.queue.set(url, data);
                            this.loaded++;
                            if (this.done()) start();
                        });
                    break;
            }
        }
    }


    done() {
        return this.loaded==this.queue.size;
    }
}