class Sender {
    constructor (iframe) {
        this.iframe = iframe;
        this.domain = window.location.href;
        window.addEventListener("message", this.listener.bind(this));
    }
    _postMessage(message) {
        this.iframe.postMessage(message, this.domain);
    }
    addData(data) {
        // предполагаем, что data имеет вид хэша {ключ : значение}
        if (data) {
            let message = JSON.stringify({'add' : data});
            this._postMessage(message);					
        }	
    }
    readData(key) {
        // данные в localStorage будем читать по ключу
        if (key) {
            let message = JSON.stringify({'read' : key});					
            this._postMessage(message); 
        }
    }
    deleteData(key) {
        // удаляем данные из localStorage по ключу
        if (key) {
            let message = JSON.stringify({'delete' : key});					
            this._postMessage(message); 
        }
    }
    listener(event) {				          	
        if (event.data){
            let p = document.createElement('p');
            p.innerText = JSON.parse(event.data);
            document.body.appendChild(p);	
        }                
    }
}		