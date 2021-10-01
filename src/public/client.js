(() => {
    const socket = new WebSocket(`ws://${window.location.host}/ws`);
    const formEl = document.getElementById('form');
    const inputEl = document.getElementById('input');
    const chatsEl = document.getElementById('chats');

    if ( !formEl || !inputEl || !chatsEl ) throw new Error('Init failed');

    const chats = [];

    const adjectives = ['멋진', '훌륭한', '친절한', '새침한'];
    const animals = ['물범', '사자', '사슴', '돌고래', '독수리'];
    
    function pickRandom (array = []) {
        if(array.length === 0) return 'Undefined';

        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    const myNickName = `${pickRandom(adjectives)} ${pickRandom(animals)}`;

    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        socket.send(JSON.stringify({
            nickName: myNickName,
            message: inputEl.value,
        }));
        inputEl.value = '';
    });

    socket.addEventListener('message', (e) => {
        chatsEl.innerHTML = '';

        chats.push(JSON.parse(e.data))
        chats.forEach(({ message, nickName }) => {
            const div = document.createElement('div');
            div.innerText = `${nickName} : ${message}` 
            chatsEl.appendChild(div);
        });
    });
})();
