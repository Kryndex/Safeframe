import Messages from '../src/lib/messages';
import AES from 'crypto-js/aes';

export
function simulateHostMessage(type, data) {
    window.dispatchEvent(new MessageEvent('message', {data: JSON.stringify({
        namespace: 'dasf',
        type: type,
        data: data || {}
    })}));
}

export
function setMetadata(json, privateKey) {
    window.name = AES.encrypt(JSON.stringify(json || {}), privateKey).toString();
}

export 
function createIframe(content) {
    const api = {};
    const iframe = document.createElement('iframe');
    const html = '<body>'+(content || '')+'</body>';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    api.window = iframe.contentWindow;
    api.node = iframe;
    api.define = function(name, value) {
        if (api.window) {
            api.window[name] = value;
        }
    };
    api.send = function(type, data) {
        window.dispatchEvent(new window.MessageEvent('message', {
            data: JSON.stringify({
                namespace: 'dasf',
                id: 1337,
                ts: +(new Date()),
                type: type,
                data: data
            }),
            origin: '*',
            source: api.window}));
    };

    return api;
}

