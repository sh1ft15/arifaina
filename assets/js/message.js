import fire from './fire.js';

const ID = 'aina';

let msg_btn = document.getElementById("msg_btn"),
    msg_dialog = document.getElementById("msg_dialog"),
    msg_list = document.getElementById("msg_list"),
    msg_pages = document.getElementById("msg_pages"),
    msg_prev = document.getElementById("msg_prev"),
    msg_next = document.getElementById("msg_next"),
    msg_item_ref = msg_list.firstElementChild.cloneNode(true),
    icons = window.feather.icons,
    cur_page;

updateMessages();

// msg_list.addEventListener('click', () => {
//     let width = msg_list.firstElementChild.clientWidth,
//         new_page = parseInt((cur_page ?? 0) + 1);

//     msg_list.scrollLeft = width * new_page;
//     cur_page = new_page;
// });

msg_btn.addEventListener('click', () => { toggleDialog(true); });

msg_next.addEventListener('click', () => { iteratePage(cur_page + 1); });

msg_prev.addEventListener('click', () => { iteratePage(cur_page - 1); });

msg_dialog.querySelector('.cancel').addEventListener('click', () => { toggleDialog(false); });

msg_dialog.querySelector('.submit').addEventListener('click', () => {
    let author = msg_dialog.querySelector('input'),
        msg_area = msg_dialog.querySelector('textarea');

    if (author.value && msg_area.value) {
        submit({author: stripHtml(author.value), message: stripHtml(msg_area.value)});
        updateMessages();
        toggleDialog(false);
    }
});

msg_pages.addEventListener('click', (e) => {
    if (e.target.closest('div[data-page]')) {
        let page = e.target.closest('div[data-page]'),
            new_page = parseInt(page.dataset.page);

        iteratePage(new_page);
    }
});

function iteratePage(next_page) {
    let limit = msg_list.children.length - 1;

    if (cur_page != next_page && (next_page >= 0 && next_page <= limit)) {
        let width = msg_list.firstElementChild.clientWidth;

        updatePage(cur_page, false);
        updatePage(next_page, true);

        msg_list.scrollLeft = width * next_page;
        cur_page = next_page;
    }
}

function updateMessages() {
    fetch(10).then((docs) => {
        let index = 0;
    
        cur_page = index;
        msg_list.scrollLeft = 0;
        msg_list.innerHTML = '';

        if (docs.size > 0) {
            docs.forEach((doc) => {
                msg_list.append(createMessage(doc.data()));
                updatePage(index, index === 0);
                index += 1;
            });
        }
    });
}

function createMessage(data) {
    let dom = msg_item_ref.cloneNode(true);

    dom.querySelector('.message').innerText = data.message;   
    dom.querySelector('.author').innerText = data.author;  
    
    return dom;
}

function updatePage(index, active = false) {
    let page = msg_pages.querySelector('div[data-page="'+ index +'"]'),
        icon_attr = {width: 14, height: 14};

    if (!page) { 
        page = document.createElement('div');
        page.classList.add('px-1');
        page.classList.add('cursor-pointer');
        page.dataset.page = index;
        msg_pages.append(page);
    }

    if (active) { icon_attr.fill = 'currentColor'; }
    
    page.innerHTML = icons.circle.toSvg(icon_attr);
}

function toggleDialog(status) {
    let input = msg_dialog.querySelector('input'),
        area = msg_dialog.querySelector('textarea');

    input.value = '';
    area.value = '';
    document.body.style.overflow = status ? 'hidden' : 'auto';
    msg_dialog.style.display = status ? 'flex' : 'none';

    if (status) { input.focus(); }
}

function stripHtml(html)
{
   let tmp = document.createElement("div");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

async function submit (message) {
    fire.store(ID, null, message);
}

async function fetch (limit) {
    return fire.fetch(ID, limit);
}