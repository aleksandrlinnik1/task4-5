class Receiver {
    constructor(domain) {
        this.domain = domain;
        window.addEventListener("message", this.listener.bind(this)); 
    }                
    listener(event) {  
        if (event.origin !== this.domain) 
            return;                     
        if (event.data) {
            let message = JSON.parse(event.data), // само сообщение
                state = Object.keys(message)[0], // состояние 'add', 'read' или 'delete'
                messageBody = message[state], // тело сообщения, {ключ : значение} или только ключ
                callback, // то, что передаем обратно
                key, // ключ
                value, // значение
                check; // проверка на наличие записи с ключом
                
            switch (state) {
                case 'add':
                    key = Object.keys(messageBody)[0];
                    value = messageBody[key];
                    localStorage[key] = JSON.stringify(value);
                    // результат для передачи обратно                            
                    callback = `written: ${key} : ${value}`; 
                    console.log(callback);
                    event.source.postMessage(JSON.stringify(callback), event.origin);                                  
                    break;

                case 'read':
                    check = localStorage[messageBody];                                                       
                    check ? value = JSON.parse(check) : value = undefined;
                    // результат для передачи обратно                            
                    value ?
                        callback = `read: ${messageBody} : ${value}` :                          
                        callback = `record "${messageBody}" not found`;
                    console.log(callback);                         
                    event.source.postMessage(JSON.stringify(callback), event.origin);
                    break;

                case 'delete':  
                    check = localStorage[messageBody];
                    if (check) {
                        localStorage.removeItem(messageBody);
                        // результат для передачи обратно
                        callback = `removed: "${messageBody}"`;
                    } else {
                        callback = `record "${messageBody}" not found`;
                    }
                    console.log(callback);
                    event.source.postMessage(JSON.stringify(callback), event.origin);
            }
        }    
    }
}