document.addEventListener('DOMContentLoaded', () => {
  // スマホ用ハンバーガーメニューの開閉処理
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    const setMenuOpen = (isOpen) => {
      hamburger.classList.toggle('active', isOpen);
      navMenu.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
      document.body.classList.toggle('menu-open', isOpen);
    };

    hamburger.addEventListener('click', () => setMenuOpen(!navMenu.classList.contains('active')));
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMenuOpen(!navMenu.classList.contains('active'));
      }
    });

    // メニューのリンクをクリックしたらメニューを閉じる
    document.querySelectorAll('.nav-menu li a').forEach(link => {
      link.addEventListener('click', () => {
        setMenuOpen(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        setMenuOpen(false);
        hamburger.focus();
      }
    });
  }

  // --- YouTube Modal Feature ---
  const thumbnails = document.querySelectorAll('.youtube-thumbnail');
  
  if (thumbnails.length > 0) {
    // モーダルをbodyの最後に追加
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'YouTube動画プレーヤー');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="video-modal-content">
        <button class="video-modal-close" type="button" aria-label="動画を閉じる"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        <div id="video-modal-container" style="width: 100%; height: 100%;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.video-modal-close');
    const container = modal.querySelector('#video-modal-container');
    let lastFocusedElement = null;

    // 閉じる処理 (iframeごと削除して再生を止める)
    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      container.innerHTML = '';
      document.body.classList.remove('modal-open');
      if (lastFocusedElement) lastFocusedElement.focus();
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(); // 背景クリックで閉じる
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // サムネイル画像のセットとクリックイベント
    thumbnails.forEach(thumb => {
      const videoId = thumb.getAttribute('data-video-id');
      if (!videoId) return;

      // 高画質サムネイルを設定
      const img = document.createElement('img');
      img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      img.alt = '動画のサムネイル';
      img.loading = 'lazy';
      img.decoding = 'async';
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', 'YouTube動画を再生');
      // 高画質が無い場合のフォールバック
      img.onerror = function() {
        if(this.src.includes('maxresdefault')) {
           this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      };
      thumb.appendChild(img);

      // クリックでモーダル表示＆iframe挿入（自動再生）
      const openModal = () => {
        lastFocusedElement = thumb;
        container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        closeBtn.focus();
      };
      thumb.addEventListener('click', openModal);
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });
    });
  }

  // --- Works Tabs Feature ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('data-target');
        // もし data-target が無いボタン（リンク等）ならタブ切り替え処理を行わずに通常のページ遷移をさせる
        if (!targetId) return;

        // 全てのタブとコンテンツからactiveを外す
        tabBtns.forEach(b => {
            if (b.getAttribute('data-target')) {
              b.classList.remove('active');
              b.setAttribute('aria-selected', 'false');
            }
        });
        tabContents.forEach(c => {
          c.classList.remove('active');
          c.hidden = true;
        });

        // クリックされたタブと対象のコンテンツにactiveを付ける
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const target = document.getElementById(targetId);
        if (target) {
          target.hidden = false;
          target.classList.add('active');
        }
      });
    });
  }
});
