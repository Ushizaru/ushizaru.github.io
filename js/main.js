document.addEventListener('DOMContentLoaded', () => {
  // スマホ用ハンバーガーメニューの開閉処理
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // メニューのリンクをクリックしたらメニューを閉じる
    document.querySelectorAll('.nav-menu li a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // お問い合わせフォームのダミー送信処理（見た目だけ）
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('お問い合わせありがとうございます。このフォームは現在デモ版のため送信されません。');
      contactForm.reset();
    });
  }

  // --- YouTube Modal Feature ---
  const thumbnails = document.querySelectorAll('.youtube-thumbnail');
  
  if (thumbnails.length > 0) {
    // モーダルをbodyの最後に追加
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal-content">
        <button class="video-modal-close"><i class="fa-solid fa-xmark"></i></button>
        <div id="video-modal-container" style="width: 100%; height: 100%;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.video-modal-close');
    const container = modal.querySelector('#video-modal-container');

    // 閉じる処理 (iframeごと削除して再生を止める)
    const closeModal = () => {
      modal.classList.remove('active');
      container.innerHTML = '';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(); // 背景クリックで閉じる
    });

    // サムネイル画像のセットとクリックイベント
    thumbnails.forEach(thumb => {
      const videoId = thumb.getAttribute('data-video-id');
      if (!videoId) return;

      // 高画質サムネイルを設定
      const img = document.createElement('img');
      img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      img.alt = "Video Thumbnail";
      // 高画質が無い場合のフォールバック
      img.onerror = function() {
        if(this.src.includes('maxresdefault')) {
           this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      };
      thumb.appendChild(img);

      // クリックでモーダル表示＆iframe挿入（自動再生）
      thumb.addEventListener('click', () => {
        container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        modal.classList.add('active');
      });
    });
  }
});
