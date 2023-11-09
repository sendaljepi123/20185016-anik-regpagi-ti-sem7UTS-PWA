if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(function (error) {
            console.error('Service Worker registration failed:', error);
        });
}

// Handle IndexedDB operations here
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
const request = indexedDB.open('commentsDB', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
};

request.onsuccess = function (event) {
    const db = event.target.result;
    const commentForm = document.getElementById('comment-form');
    const commentText = document.getElementById('comment-text');
    const commentList = document.getElementById('comment-list');

    commentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const transaction = db.transaction(['comments'], 'readwrite');
        const store = transaction.objectStore('comments');
        store.add({ text: commentText.value });

        transaction.oncomplete = function () {
            commentText.value = '';
            displayComments();
        };
    });

    function displayComments() {
        while (commentList.firstChild) {
            commentList.removeChild(commentList.firstChild);
        }

        const transaction = db.transaction(['comments'], 'readonly');
        const store = transaction.objectStore('comments');
        const request = store.openCursor();

        request.onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                const commentItem = document.createElement('li');
                commentItem.textContent = cursor.value.text;
                commentList.appendChild(commentItem);
                cursor.continue();
            }
        };
    }

    displayComments();
};

request.onerror = function (event) {
    console.error('Error opening IndexedDB:', event.target.error);
};
   // Membuat tombol subscribe
   const subscribeButton = document.getElementById('subscribe');
  
   subscribeButton.addEventListener('click', function() {
     // Meminta izin notifikasi
     Notification.requestPermission()
       .then(function(permission) {
         if (permission === 'granted') {
           // Berlangganan push notifikasi
           registration.pushManager.subscribe({ userVisibleOnly: true })
             .then(function(subscription) {
               console.log('Berlangganan notifikasi:', subscription);
             })
             .catch(function(error) {
               console.error('Gagal berlangganan notifikasi:', error);
             });
         }
       });
   });
